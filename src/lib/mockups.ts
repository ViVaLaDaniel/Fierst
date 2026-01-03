// Device mockup SVG frames for Pro users
// Each mockup returns an SVG string that wraps the screenshot

export interface MockupType {
  id: string
  name: string
  isPro: boolean
  aspectHint: string
}

export const mockups: MockupType[] = [
  { id: "none", name: "None", isPro: false, aspectHint: "any" },
  { id: "browser", name: "Browser", isPro: true, aspectHint: "landscape" },
  { id: "macbook", name: "MacBook", isPro: true, aspectHint: "landscape" },
  { id: "iphone", name: "iPhone", isPro: true, aspectHint: "portrait" },
  { id: "android", name: "Android", isPro: true, aspectHint: "portrait" }
]

// Generate browser mockup frame
export function renderBrowserMockup(
  imageWidth: number,
  imageHeight: number
): { width: number; height: number; header: number } {
  const headerHeight = 32
  return {
    width: imageWidth,
    height: imageHeight + headerHeight,
    header: headerHeight
  }
}

// Draw browser frame on canvas
export function drawBrowserFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  borderRadius: number
): void {
  const headerHeight = 32
  const buttonRadius = 6
  const buttonSpacing = 8
  const buttonY = y + headerHeight / 2

  // Draw window background
  ctx.fillStyle = "#1f1f1f"
  ctx.beginPath()
  ctx.roundRect(x, y, width, height + headerHeight, borderRadius)
  ctx.fill()

  // Draw header bar
  ctx.fillStyle = "#2d2d2d"
  ctx.beginPath()
  ctx.roundRect(x, y, width, headerHeight, [borderRadius, borderRadius, 0, 0])
  ctx.fill()

  // Draw traffic light buttons
  const buttons = [
    { color: "#ff5f57", x: x + 16 },
    { color: "#febc2e", x: x + 16 + buttonRadius * 2 + buttonSpacing },
    { color: "#28c840", x: x + 16 + (buttonRadius * 2 + buttonSpacing) * 2 }
  ]

  buttons.forEach((btn) => {
    ctx.fillStyle = btn.color
    ctx.beginPath()
    ctx.arc(btn.x + buttonRadius, buttonY, buttonRadius, 0, Math.PI * 2)
    ctx.fill()
  })

  // Draw URL bar
  ctx.fillStyle = "#3d3d3d"
  const urlBarX = x + 80
  const urlBarWidth = width - 100
  const urlBarHeight = 20
  const urlBarY = y + (headerHeight - urlBarHeight) / 2
  ctx.beginPath()
  ctx.roundRect(urlBarX, urlBarY, urlBarWidth, urlBarHeight, 4)
  ctx.fill()
}

// Draw MacBook frame on canvas
export function drawMacBookFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  borderRadius: number
): { offsetY: number; offsetX: number; totalHeight: number } {
  const bezelTop = 24
  const bezelSide = 12
  const bezelBottom = 12
  const baseHeight = 16
  const totalWidth = width + bezelSide * 2
  const totalHeight = height + bezelTop + bezelBottom + baseHeight

  // Screen bezel
  ctx.fillStyle = "#1a1a1a"
  ctx.beginPath()
  ctx.roundRect(x, y, totalWidth, height + bezelTop + bezelBottom, [
    borderRadius + 4,
    borderRadius + 4,
    0,
    0
  ])
  ctx.fill()

  // Camera notch
  ctx.fillStyle = "#0a0a0a"
  ctx.beginPath()
  ctx.arc(x + totalWidth / 2, y + 12, 3, 0, Math.PI * 2)
  ctx.fill()

  // Base/hinge
  ctx.fillStyle = "#2d2d2d"
  ctx.beginPath()
  const baseY = y + height + bezelTop + bezelBottom
  ctx.roundRect(x - 20, baseY, totalWidth + 40, baseHeight, [0, 0, 4, 4])
  ctx.fill()

  // Notch in base
  ctx.fillStyle = "#1a1a1a"
  ctx.beginPath()
  const notchWidth = 80
  ctx.roundRect(x + totalWidth / 2 - notchWidth / 2, baseY, notchWidth, 4, [0, 0, 2, 2])
  ctx.fill()

  return {
    offsetX: bezelSide,
    offsetY: bezelTop,
    totalHeight
  }
}

// Draw iPhone frame on canvas
export function drawIPhoneFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): { offsetX: number; offsetY: number; totalWidth: number; totalHeight: number } {
  const bezel = 12
  const cornerRadius = 44
  const totalWidth = width + bezel * 2
  const totalHeight = height + bezel * 2

  // Phone body
  ctx.fillStyle = "#1a1a1a"
  ctx.beginPath()
  ctx.roundRect(x, y, totalWidth, totalHeight, cornerRadius)
  ctx.fill()

  // Screen area (slightly inset)
  ctx.fillStyle = "#000000"
  ctx.beginPath()
  ctx.roundRect(x + bezel, y + bezel, width, height, cornerRadius - bezel)
  ctx.fill()

  // Dynamic Island
  const islandWidth = 90
  const islandHeight = 28
  ctx.fillStyle = "#000000"
  ctx.beginPath()
  ctx.roundRect(
    x + totalWidth / 2 - islandWidth / 2,
    y + bezel + 8,
    islandWidth,
    islandHeight,
    islandHeight / 2
  )
  ctx.fill()

  return {
    offsetX: bezel,
    offsetY: bezel,
    totalWidth,
    totalHeight
  }
}

// Draw Android frame on canvas
export function drawAndroidFrame(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number
): { offsetX: number; offsetY: number; totalWidth: number; totalHeight: number } {
  const bezel = 8
  const cornerRadius = 24
  const totalWidth = width + bezel * 2
  const totalHeight = height + bezel * 2

  // Phone body
  ctx.fillStyle = "#1a1a1a"
  ctx.beginPath()
  ctx.roundRect(x, y, totalWidth, totalHeight, cornerRadius)
  ctx.fill()

  // Camera punch-hole
  ctx.fillStyle = "#0a0a0a"
  ctx.beginPath()
  ctx.arc(x + totalWidth / 2, y + bezel + 16, 6, 0, Math.PI * 2)
  ctx.fill()

  return {
    offsetX: bezel,
    offsetY: bezel,
    totalWidth,
    totalHeight
  }
}
