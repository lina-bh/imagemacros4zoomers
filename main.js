import _throw from "./throw.js"
import { createClient } from "./messaging.js"
import { load, store } from "./store.js"

/** @type {HTMLImageElement} */
const renderTarget = document.getElementById("render-target")

/**
 * @param {Blob} blob
 */
const setTargetSrc = (blob) => {
  const oldSrc = renderTarget.src
  renderTarget.src = URL.createObjectURL(blob)
  if (oldSrc.startsWith("blob:")) {
    URL.revokeObjectURL(oldSrc)
  }
}

const call = await createClient("./worker.js")

const loadImage = (image) => call("loadImage", image)

const render = async (text) => {
  const blob = await call("render", text)
  setTargetSrc(blob)
}

/** @type {ReturnType<typeof setTimeout>} */
let timer
/** @type {HTMLTextAreaElement} */
const textarea = document.getElementById("text")
textarea.addEventListener("input", async () => {
  if (timer) {
    clearTimeout(timer)
    timer = null
  }
  const text = textarea.value
  timer = setTimeout(() => render(text), 3)
  await store("text", text)
})

/** @type {HTMLInputElement} */
const input = document.getElementById("image-input")
input.addEventListener("change", async () => {
  let file = input.files[0]
  if (!file) {
    return
  }
  const newImage = await createImageBitmap(file)
  await loadImage(newImage)
  await render(textarea.value)
})

textarea.value = (await load("text")) ?? "middle text"
await render(textarea.value)
