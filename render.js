import _throw from "./throw.js"

/**
 * @typedef {HTMLCanvasElement | OffscreenCanvas} Canvas
 * @typedef {CanvasRenderingContext2D | OffscreenCanvasRenderingContext2D} RenderingContext2D */

const ALPHABET = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmopqrstuvwxyz"

/**
 * @param {ImageBitmap} img
 * @param {RenderingContext2D} ctx
 * @param {number} xmax
 * @param {number} ymax
 */
export const renderImg = (ctx, img, xmax, ymax) => {
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

/**
 * @param {RenderingContext2D} ctx
 * @param {string} text
 * @param {TextMetrics} mets
 * @param {number} xmid
 * @param {number} ymid
 */
export const renderText = (ctx, text, mets, xmid, ymid) => {
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

/**
 * @param {Canvas} canvas
 */
export const createRenderer = (canvas) => {
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

  let scaledImg

  return {
    loadStoredData(data) {
      scaledImg = data
    },
    /**
     * @param {ImageBitmap} img
     */
    loadImage(img) {
      renderImg(ctx, img, xmax, ymax)
      img.close()
      scaledImg = ctx.getImageData(0, 0, xmax, ymax)
      return scaledImg
    },
    /**
     * @param {string} text
     */
    render(text) {
      if (scaledImg) {
        ctx.putImageData(scaledImg, 0, 0)
      } else {
        ctx.clearRect(0, 0, xmax, ymax)
      }
      renderText(ctx, text, mets, xmid, ymid)
    },
  }
}
