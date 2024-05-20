import { createServer } from "./messaging.js"
import { loadLeague } from "./fonts.js"
import { load, store } from "./store.js"

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmopqrstuvwxyz"

const league = new FontFace(
  "League Gothic",
  "url('./LeagueGothic-1.601/static/WOFF2/LeagueGothic-Regular.woff2')",
)
fonts.add(league)
await league.load()
console.debug([...self.fonts.keys()])

const canvas = new OffscreenCanvas(1080, 1080)
const xmax = canvas.width
const ymax = canvas.height
const xmid = Math.floor(xmax / 2)
const ymid = Math.floor(ymax / 2)
const ctx =
  canvas.getContext("2d", {
    alpha: false,
    desynchronized: true,
    willReadFrequently: true,
  }) ?? _throw("null context")
ctx.font = "normal 110pt 'League Gothic'"
ctx.textAlign = "center"
ctx.lineWidth = 16
ctx.textBaseline = "top"
ctx.fillStyle = "white"
ctx.letterSpacing = "-2px"
// ctx.fontStretch = "condensed"
const mets = ctx.measureText(ALPHABET)

const scaleImg = (img) => {
  let x = 0
  let y = 0
  let w = img.width
  let h = img.height
  let off
  if (img.width > img.height) {
    off = w - h
    x = Math.floor(off / 2)
    w -= off
  }
  if (img.height > img.width) {
    off = h - w
    y = Math.floor(off / 2)
    h -= off
  }
  ctx.drawImage(
    img,
    x,
    y,
    w,
    h,
    /* dx */ 0,
    /* dy */ 0,
    /* dWidth */ xmax,
    /* dHeight */ ymax,
  )
}

const writeText = (text) => {
  const lines = text.split("\n").map((s) => s.trim())
  const midLine = -lines.length / 2
  let line
  let i = lines.length
  while ((line = lines[--i]) !== undefined) {
    const y = ymid + Math.floor((midLine + i) * mets.fontBoundingBoxDescent)
    ctx.strokeText(line, xmid, y)
    ctx.fillText(line, xmid, y)
  }
}

let storedImg = await load("image")

const loadImage = async (img) => {
  scaleImg(img)
  img.close()
  storedImg = ctx.getImageData(0, 0, xmax, ymax)
  await store("image", storedImg)
}

const render = (text) => {
  if (storedImg) {
    ctx.putImageData(storedImg, 0, 0)
  } else {
    ctx.clearRect(0, 0, xmax, ymax)
  }
  writeText(text)
}

const clientPort = createServer({
  /**
   * @param {string} text
   */
  render: async (text) => {
    render(text)
    const blob = await canvas.convertToBlob({
      type: "image/jpeg",
      quality: 0.9,
    })
    return blob
  },
  loadImage,
})
postMessage(clientPort, { transfer: [clientPort] })
