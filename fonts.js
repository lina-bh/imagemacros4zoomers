export const loadOutward = async () => {
  const outward = new FontFace(
    "Outward",
    `url('./outward/fonts/webfonts/outward-block-webfont.eot'),
url('./outward/fonts/webfonts/outward-block-webfont.eot?#iefix') format('embedded-opentype'),
url('./outward/fonts/webfonts/outward-block-webfont.woff2') format('woff2'),
url('./outward/fonts/webfonts/outward-block-webfont.woff') format('woff'),
url('./outward/fonts/webfonts/outward-block-webfont.ttf') format('truetype'),
url('./outward/fonts/webfonts/outward-block-webfont.svg#outwardblock') format('svg')`,
    { weight: "normal", style: "normal" },
  )
  self.fonts.add(outward)
  await outward.load()
}
export const loadAltinn = async () => {
  const altinn = new FontFace(
    "Altinn-DIN",
    "url('./altinn-din/generated/woff2/Altinn-DIN.woff2')",
    { weight: "normal", style: "normal" },
  )
  const altinnCondensed = new FontFace(
    "Altinn-DIN",
    "url('./altinn-din/generated/woff2/Altinn-DINCondensed.woff2')",
    { stretch: "condensed" },
  )
  self.fonts.add(altinn)
  self.fonts.add(altinnCondensed)
  await Promise.all([altinn.load(), altinnCondensed.load()])
}
export const loadDinish = async () => {
  const dinishCondensed = new FontFace(
    "Dinish",
    "url('./dinish/fonts/woff2/DinishCondensed/DinishCondensed-Regular.woff2')",
    { stretch: "condensed" }
  )
  await Promise.all([dinishCondensed].map(font => {
    self.fonts.add(font)
    return font.load()
  }))
}
export const loadLeague = async () => {
  const league = new FontFace("League Gothic", "url('./LeagueGothic-1.601/static/WOFF2/LeagueGothic-Regular.woff2')")
  const condensed = new FontFace("League Gothic", "url('./LeagueGothic-1.601/static/WOFF2/LeagueGothic-Condensed.woff2')", {stretch:"condensed"})
  await Promise.all([league, condensed].map(font => {
    self.fonts.add(font)
    return font.load()
  }))
}
