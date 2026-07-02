(function (global) {
  const STORE_KEY = "ai-glossary-kit-terms";
  const DB_NAME = "ai-glossary-kit";
  const DB_VERSION = 1;
  const DB_STORE = "terms";

  function hasChromeStorage() {
    return Boolean(global.chrome && global.chrome.storage && global.chrome.storage.local);
  }

  async function getAll() {
    if (hasChromeStorage()) {
      const result = await global.chrome.storage.local.get(STORE_KEY);
      return Array.isArray(result[STORE_KEY]) ? result[STORE_KEY] : [];
    }

    if ("indexedDB" in global) {
      try {
        return await idbGetAll();
      } catch (error) {
        console.warn("IndexedDB read failed. Falling back to localStorage.", error);
      }
    }

    return JSON.parse(global.localStorage.getItem(STORE_KEY) || "[]");
  }

  async function setAll(terms) {
    const clean = Array.isArray(terms) ? terms : [];

    if (hasChromeStorage()) {
      await global.chrome.storage.local.set({ [STORE_KEY]: clean });
      return clean;
    }

    if ("indexedDB" in global) {
      try {
        await idbSetAll(clean);
        return clean;
      } catch (error) {
        console.warn("IndexedDB write failed. Falling back to localStorage.", error);
      }
    }

    global.localStorage.setItem(STORE_KEY, JSON.stringify(clean));
    return clean;
  }

  async function seedIfEmpty(seedTerms) {
    const current = await getAll();
    if (current.length) return current;
    const created = (seedTerms || []).map((item) => global.AIGlossarySchema.createTerm(item));
    await setAll(created);
    return created;
  }

  async function saveTerm(input) {
    const terms = await getAll();
    const incoming = global.AIGlossarySchema.createTerm(input);
    const duplicate = input.id
      ? terms.find((term) => term.id === input.id)
      : global.AIGlossarySchema.findDuplicate(terms, incoming);

    let next;
    let saved;

    if (duplicate) {
      saved = global.AIGlossarySchema.mergeTerm(duplicate, incoming);
      next = terms.map((term) => (term.id === duplicate.id ? saved : term));
    } else {
      saved = incoming;
      next = [saved, ...terms];
    }

    await setAll(next);
    return saved;
  }

  async function importTerms(items) {
    const imported = [];
    for (const item of items || []) {
      imported.push(await saveTerm(item));
    }
    return imported;
  }

  async function removeTerm(id) {
    const terms = await getAll();
    const next = terms.filter((term) => term.id !== id);
    await setAll(next);
    return next;
  }

  async function idbOpen() {
    return new Promise((resolve, reject) => {
      const request = global.indexedDB.open(DB_NAME, DB_VERSION);
      request.onupgradeneeded = () => {
        const db = request.result;
        if (!db.objectStoreNames.contains(DB_STORE)) {
          db.createObjectStore(DB_STORE, { keyPath: "id" });
        }
      };
      request.onsuccess = () => resolve(request.result);
      request.onerror = () => reject(request.error);
    });
  }

  async function idbGetAll() {
    const db = await idbOpen();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, "readonly");
      const store = tx.objectStore(DB_STORE);
      const request = store.getAll();
      request.onsuccess = () => resolve(request.result || []);
      request.onerror = () => reject(request.error);
      tx.oncomplete = () => db.close();
    });
  }

  async function idbSetAll(terms) {
    const db = await idbOpen();
    return new Promise((resolve, reject) => {
      const tx = db.transaction(DB_STORE, "readwrite");
      const store = tx.objectStore(DB_STORE);
      store.clear();
      terms.forEach((term) => store.put(term));
      tx.oncomplete = () => {
        db.close();
        resolve();
      };
      tx.onerror = () => reject(tx.error);
    });
  }

  global.AIGlossaryStorage = {
    getAll,
    setAll,
    saveTerm,
    importTerms,
    removeTerm,
    seedIfEmpty,
    hasChromeStorage
  };
})(globalThis);
