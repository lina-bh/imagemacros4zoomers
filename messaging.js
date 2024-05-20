import _throw from "./throw.js"

/**
 * @param {string} script
 */
export const createClient = async (script) => {
  let id = 0
  /** @type {Map<number, [(value: any) => void, (reason: any?) => void]} */
  const requests = new Map()

  const worker = new Worker(script, { type: "module" })
  /** @type {MessagePort} */
  const port = await new Promise((r) => {
    /** @param {MessageEvent<MessagePort>} ev */
    worker.onmessage = (ev) => {
      r(ev.data)
    }
  })

  /**
   * @param {MessageEvent<import("./index.js").JSONResponse} ev
   */
  port.onmessage = (ev) => {
    const { data } = ev
    const [res, rej] = requests.get(data.id) ?? _throw(`no such id ${data.id}`)
    if (data.error) {
      rej(data.error.message)
    } else {
      res(data.result)
    }
  }

  /**
   * @param {string} method
   */
  return (method, ...params) => {
    const transfer = []
    if (method === "loadImage" && params[0] instanceof ImageBitmap) {
      transfer.push(params[0])
    }
    /** @type {import("./index.js").JSONRequest} */
    const req = {
      id: id++,
      method,
      params,
    }
    port.postMessage(req, {transfer})
    return new Promise((r, x) => {
      requests.set(req.id, [r, x])
    })
  }
}

/**
 * @param {Record<string, (...unknown) => Promise<unknown>>} methods
 */
export const createServer = (methods) => {
  const { port1, port2 } = new MessageChannel()
  /** @param {MessageEvent<import("./index.js").JSONRequest>} ev */
  port1.onmessage = async (ev) => {
    const { data } = ev
    /** @type {import("./index.js").JSONResponse} */
    const resp = { id: data.id }
    try {
      resp.result = await methods[data.method](...data.params)
    } catch (e) {
      resp.error = { message: e.message, data: e }
    }
    port1.postMessage(resp)
  }
  return port2
}
