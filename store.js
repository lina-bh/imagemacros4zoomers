/*
based off https://github.com/jakearchibald/idb-keyval

Copyright 2016, Jake Archibald

Licensed under the Apache License, Version 2.0 (the "License");
you may not use this file except in compliance with the License.
You may obtain a copy of the License at

    http://www.apache.org/licenses/LICENSE-2.0

Unless required by applicable law or agreed to in writing, software
distributed under the License is distributed on an "AS IS" BASIS,
WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
See the License for the specific language governing permissions and
limitations under the License.
*/
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
