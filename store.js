const STORE = "2"

/**
 * @template T
 * @param {IDBRequest<T>} req
 * @returns {Promise<T>}
 */
const promisify = (req) =>
  new Promise((r, x) => {
    req.addEventListener("success", () => r(req.result))
    req.addEventListener("error", () => x(req.error))
  })

const IDB = await (() => {
  const req = indexedDB.open("1")
  req.addEventListener("upgradeneeded", () => {
    req.result.createObjectStore(STORE)
  })
  req.addEventListener("blocked", () => x(req.error))
  return promisify(req)
})()

/** @param {IDBValidKey} key */
export const load = (key) =>
  promisify(IDB.transaction(STORE).objectStore(STORE).get(key))
/** @param {IDBValidKey} key */
export const store = (key, val) =>
  promisify(
    IDB.transaction(STORE, "readwrite").objectStore(STORE).put(val, key),
  )
