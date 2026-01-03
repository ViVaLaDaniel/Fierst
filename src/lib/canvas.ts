import { 
  drawBrowserFrame, 
  drawMacBookFrame, 
  drawIPhoneFrame, 
  drawAndroidFrame,
  drawMacOSSequoiaFrame,
  drawWindows11Frame
} from "./mockups"
import { meshGradients, drawMeshGradient } from "./backgrounds_v2"

export type AnnotationType = "blur" | "arrow" | "text" | "rect"

export interface Annotation {
  id: string
  type: AnnotationType
  x: number
  y: number
  width?: number
  height?: number
  color?: string
  text?: string
  fontSize?: number
  opacity?: number
  points?: { x: number; y: number }[] // For arrows/paths
}

export interface CanvasSettings {
  padding: number
  borderRadius: number
  shadow: string
  background: string
  showWatermark?: boolean
  mockupType?: "none" | "browser" | "macbook" | "iphone" | "android" | "macos-sequoia" | "win11"
  format?: ExportFormat
  quality?: number
  // V2 Premium Features
  tilt?: {
    rotateX: number // degrees (-15 to 15)
    rotateY: number // degrees (-15 to 15)
    perspective: number // 1000 default
  }
  annotations?: Annotation[]
}

export type ExportFormat = "png" | "jpg" | "webp"

export const exportFormats: { id: ExportFormat; name: string; isPro: boolean }[] = [
  { id: "png", name: "PNG", isPro: false },
  { id: "jpg", name: "JPG", isPro: true },
  { id: "webp", name: "WebP", isPro: true }
]

/**
 * Draw watermark on canvas
 */
function drawWatermark(
  ctx: CanvasRenderingContext2D,
  canvasWidth: number,
  canvasHeight: number
): void {
  const text = "Made with Screenshot Beautifier"
  const fontSize = Math.max(12, Math.min(16, canvasWidth / 40))

  ctx.save()
  ctx.font = `${fontSize}px system-ui, -apple-system, sans-serif`
  ctx.fillStyle = "rgba(255, 255, 255, 0.5)"
  ctx.textAlign = "right"
  ctx.textBaseline = "bottom"

  // Add subtle shadow for visibility on any background
  ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
  ctx.shadowBlur = 4
  ctx.shadowOffsetX = 1
  ctx.shadowOffsetY = 1

  ctx.fillText(text, canvasWidth - 12, canvasHeight - 10)
  ctx.restore()
}

/**
 * Apply beautification effects to an image
 */
export async function beautifyImage(
  imageDataUrl: string,
  settings: CanvasSettings,
  returnType: "blob"
): Promise<Blob>
export async function beautifyImage(
  imageDataUrl: string,
  settings: CanvasSettings,
  returnType?: "dataUrl"
): Promise<string>
export async function beautifyImage(
  imageDataUrl: string,
  settings: CanvasSettings,
  returnType: "dataUrl" | "blob" = "dataUrl"
): Promise<string | Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.crossOrigin = "anonymous"

    img.onload = () => {
      const canvas = document.createElement("canvas")
      const ctx = canvas.getContext("2d")

      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }

      // Calculate canvas size with padding
      const mockupH = settings.mockupType === "browser" ? 32 : 0
      let imageX = settings.padding
      let imageY = settings.padding + mockupH
      let totalWidth = img.width + settings.padding * 2
      let totalHeight = img.height + settings.padding * 2 + mockupH

      // Apply mockup frame if selected
      if (settings.mockupType && settings.mockupType !== "none" && settings.mockupType !== "browser") {
        const mockupPadding = 40
        switch (settings.mockupType) {
          case "macbook":
            totalWidth += 24; totalHeight += 40; imageX += 12; imageY += 24
            break
          case "iphone":
          case "android":
            totalWidth += 24; totalHeight += 24; imageX += 12; imageY += 12
            break
        }
        totalWidth += mockupPadding * 2
        totalHeight += mockupPadding * 2
        imageX += mockupPadding
        imageY += mockupPadding
      }

      canvas.width = totalWidth
      canvas.height = totalHeight

      // 1. Draw background
      if (settings.background.startsWith("linear-gradient")) {
        drawGradientBackground(ctx, totalWidth, totalHeight, settings.background)
      } else if (settings.background.startsWith("mesh:")) {
        const meshId = parseInt(settings.background.split(":")[1])
        const mesh = meshGradients.find(m => m.id === meshId) || meshGradients[0]
        drawMeshGradient(ctx, totalWidth, totalHeight, mesh)
      } else {
        ctx.fillStyle = settings.background
        ctx.fillRect(0, 0, totalWidth, totalHeight)
      }

      // 2. Initial 3D Tilt (if any)
      ctx.save()
      if (settings.tilt) {
        const { rotateX, rotateY } = settings.tilt
        if (rotateX !== 0 || rotateY !== 0) {
          ctx.translate(totalWidth / 2, totalHeight / 2)
          const radX = (rotateX * Math.PI) / 180
          const radY = (rotateY * Math.PI) / 180
          ctx.transform(1, radY * 0.2, radX * 0.2, 1, 0, 0)
          ctx.translate(-totalWidth / 2, -totalHeight / 2)
        }
      }

      // 3. Draw Shadow
      if (settings.shadow !== "none") {
        ctx.save()
        ctx.shadowColor = "rgba(0, 0, 0, 0.3)"
        const shadowMatch = settings.shadow.match(/(\d+)px\s+(\d+)px/)
        if (shadowMatch) {
          ctx.shadowOffsetY = parseInt(shadowMatch[2]) / 2
          ctx.shadowBlur = parseInt(shadowMatch[2])
        } else {
          ctx.shadowOffsetY = 20
          ctx.shadowBlur = 40
        }
        ctx.fillStyle = "#fff"
        roundRect(ctx, imageX, imageY, img.width, img.height, settings.borderRadius)
        ctx.fill()
        ctx.restore()
      }

      // 4. Draw Image with Rounded Corners
      ctx.save()
      roundRect(ctx, imageX, imageY, img.width, img.height, settings.borderRadius)
      ctx.clip()
      ctx.drawImage(img, imageX, imageY)
      
      // 5. Glass Glare (V2 Premium)
      if (settings.tilt && (settings.tilt.rotateX !== 0 || settings.tilt.rotateY !== 0)) {
        drawGlassGlare(ctx, imageX, imageY, img.width, img.height)
      }
      ctx.restore()

      // 6. Draw device mockup frame if selected
      if (settings.mockupType && settings.mockupType !== "none") {
        ctx.save()
        ctx.shadowColor = "transparent"
        switch (settings.mockupType) {
          case "browser":
            drawBrowserFrame(ctx, imageX, imageY - 32, img.width, 32, settings.borderRadius)
            break
          case "macos-sequoia":
            drawMacOSSequoiaFrame(ctx, imageX, imageY - 38, img.width, 38, settings.borderRadius)
            break
          case "win11":
            drawWindows11Frame(ctx, imageX, imageY - 40, img.width, 40, settings.borderRadius)
            break
          case "macbook":
            drawMacBookFrame(ctx, imageX - 12, imageY - 24, img.width, img.height, settings.borderRadius)
            break
          case "iphone":
            drawIPhoneFrame(ctx, imageX - 12, imageY - 12, img.width, img.height)
            break
          case "android":
            drawAndroidFrame(ctx, imageX - 8, imageY - 8, img.width, img.height)
            break
        }
        ctx.restore()
      }

      // 7. Draw Annotations Layer
      if (settings.annotations && settings.annotations.length > 0) {
        drawAnnotations(ctx, settings.annotations, imageX, imageY)
      }

      ctx.restore() // End of 3D Tilt

      // 8. Watermark for free users
      if (settings.showWatermark) {
        drawWatermark(ctx, totalWidth, totalHeight)
      }

      const format = settings.format || "png"
      const quality = settings.quality || 0.92
      const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`

      if (returnType === "blob") {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob)
          else reject(new Error("Blob creation failed"))
        }, mimeType, quality)
      } else {
        resolve(canvas.toDataURL(mimeType, quality))
      }
    }

    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = imageDataUrl
  })
}

/**
 * Export image in specified format
 */
export async function exportImage(
  dataUrl: string,
  format: ExportFormat,
  quality: number = 0.92
): Promise<Blob> {
  return new Promise((resolve, reject) => {
    const img = new Image()
    img.onload = () => {
      const canvas = document.createElement("canvas")
      canvas.width = img.width
      canvas.height = img.height
      const ctx = canvas.getContext("2d")
      if (!ctx) {
        reject(new Error("Could not get canvas context"))
        return
      }
      ctx.drawImage(img, 0, 0)

      const mimeType = format === "jpg" ? "image/jpeg" : `image/${format}`
      canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob)
          } else {
            reject(new Error("Failed to create blob"))
          }
        },
        mimeType,
        quality
      )
    }
    img.onerror = () => reject(new Error("Failed to load image"))
    img.src = dataUrl
  })
}

/**
 * Draw gradient background on canvas
 */
function drawGradientBackground(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  gradientCss: string
) {
  // Parse gradient CSS
  const colorMatch = gradientCss.match(/#[a-fA-F0-9]{6}/g)
  const angleMatch = gradientCss.match(/(\d+)deg/)

  if (!colorMatch || colorMatch.length < 2) {
    ctx.fillStyle = "#667eea"
    ctx.fillRect(0, 0, width, height)
    return
  }

  const angle = angleMatch ? parseInt(angleMatch[1]) : 135
  const radians = ((angle - 90) * Math.PI) / 180

  const x1 = width / 2 - (Math.cos(radians) * width) / 2
  const y1 = height / 2 - (Math.sin(radians) * height) / 2
  const x2 = width / 2 + (Math.cos(radians) * width) / 2
  const y2 = height / 2 + (Math.sin(radians) * height) / 2

  const gradient = ctx.createLinearGradient(x1, y1, x2, y2)

  colorMatch.forEach((color, index) => {
    gradient.addColorStop(index / (colorMatch.length - 1), color)
  })

  ctx.fillStyle = gradient
  ctx.fillRect(0, 0, width, height)
}

/**
 * Draw annotations on top of the image
 */
function drawAnnotations(
  ctx: CanvasRenderingContext2D,
  annotations: Annotation[],
  offsetX: number,
  offsetY: number
) {
  annotations.forEach((ann) => {
    ctx.save()
    ctx.translate(offsetX, offsetY) // Translate to image origin

    switch (ann.type) {
      case "blur":
        if (ann.width && ann.height) {
          ctx.save()
          ctx.beginPath()
          ctx.rect(ann.x, ann.y, ann.width, ann.height)
          ctx.clip()
          ctx.filter = "blur(15px)"
          // Draw the canvas back onto itself with blur but only the relevant part
          ctx.drawImage(ctx.canvas, -offsetX, -offsetY)
          ctx.restore()
          
          // Slight tint for the blurred area
          ctx.fillStyle = "rgba(0, 0, 0, 0.1)"
          ctx.fillRect(ann.x, ann.y, ann.width, ann.height)
        }
        break

      case "rect":
        if (ann.width && ann.height) {
          ctx.strokeStyle = ann.color || "#ff0000"
          ctx.lineWidth = 3
          ctx.setLineDash([])
          ctx.strokeRect(ann.x, ann.y, ann.width, ann.height)
        }
        break

      case "text":
        if (ann.text) {
          ctx.fillStyle = ann.color || "#ffffff"
          ctx.font = `bold ${ann.fontSize || 24}px system-ui, sans-serif`
          ctx.shadowColor = "rgba(0,0,0,0.5)"
          ctx.shadowBlur = 4
          ctx.fillText(ann.text, ann.x, ann.y)
        }
        break

      case "arrow":
        if (ann.points && ann.points.length >= 2) {
          const toX = ann.x + ann.points[1].x
          const toY = ann.y + ann.points[1].y
          drawArrow(ctx, ann.x, ann.y, toX, toY, ann.color || "#ff0000")
        }
        break
    }

    ctx.restore()
  })
}

/**
 * Draw simple arrow
 */
function drawArrow(
  ctx: CanvasRenderingContext2D,
  fromX: number,
  fromY: number,
  toX: number,
  toY: number,
  color: string
) {
  const headLength = 15
  const angle = Math.atan2(toY - fromY, toX - fromX)

  ctx.save()
  ctx.strokeStyle = color
  ctx.lineWidth = 4
  ctx.lineCap = "round"
  ctx.lineJoin = "round"

  // Curved paths look more "smart" and professional
  ctx.beginPath()
  ctx.moveTo(fromX, fromY)
  // Control point for curve
  const midX = (fromX + toX) / 2 + Math.sin(angle) * 30
  const midY = (fromY + toY) / 2 - Math.cos(angle) * 30
  ctx.quadraticCurveTo(midX, midY, toX, toY)
  ctx.stroke()

  // Arrow Head
  ctx.beginPath()
  ctx.moveTo(toX, toY)
  ctx.lineTo(
    toX - headLength * Math.cos(angle - Math.PI / 6),
    toY - headLength * Math.sin(angle - Math.PI / 6)
  )
  ctx.moveTo(toX, toY)
  ctx.lineTo(
    toX - headLength * Math.cos(angle + Math.PI / 6),
    toY - headLength * Math.sin(angle + Math.PI / 6)
  )
  ctx.stroke()
  ctx.restore()
}

/**
 * Draw Glass Glare reflection (V2 Premium)
 */
function drawGlassGlare(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number) {
  ctx.save()
  const glare = ctx.createLinearGradient(x, y, x + w, y + h)
  glare.addColorStop(0, "rgba(255, 255, 255, 0)")
  glare.addColorStop(0.45, "rgba(255, 255, 255, 0)")
  glare.addColorStop(0.5, "rgba(255, 255, 255, 0.2)")
  glare.addColorStop(0.55, "rgba(255, 255, 255, 0.1)")
  glare.addColorStop(0.6, "rgba(255, 255, 255, 0)")
  glare.addColorStop(1, "rgba(255, 255, 255, 0)")
  
  ctx.fillStyle = glare
  ctx.fillRect(x, y, w, h)
  ctx.restore()
}

/**
 * Draw rounded rectangle path
 */
function roundRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number
) {
  ctx.beginPath()
  ctx.moveTo(x + radius, y)
  ctx.lineTo(x + width - radius, y)
  ctx.quadraticCurveTo(x + width, y, x + width, y + radius)
  ctx.lineTo(x + width, y + height - radius)
  ctx.quadraticCurveTo(x + width, y + height, x + width - radius, y + height)
  ctx.lineTo(x + radius, y + height)
  ctx.quadraticCurveTo(x, y + height, x, y + height - radius)
  ctx.lineTo(x, y + radius)
  ctx.quadraticCurveTo(x, y, x + radius, y)
  ctx.closePath()
}

/**
 * Copy image to clipboard
 */
export async function copyToClipboard(source: string | Blob): Promise<void> {
  const blob = source instanceof Blob ? source : await (await fetch(source)).blob()

  await navigator.clipboard.write([
    new ClipboardItem({
      [blob.type]: blob
    })
  ])
}

/**
 * Download image
 */
export async function downloadImage(source: string | Blob, filename: string): Promise<void> {
  const isBlob = source instanceof Blob
  const dataUrl = isBlob ? await blobToDataUrl(source as Blob) : (source as string)

  // Clean filename for Chrome
  const cleanFilename = filename.replace(/[^a-z0-9.]/gi, "_").toLowerCase()

  // Try to send to background script for more reliable download
  if (typeof chrome !== "undefined" && chrome.runtime && chrome.runtime.sendMessage) {
    try {
      const response = await chrome.runtime.sendMessage({
        type: "DOWNLOAD_IMAGE",
        payload: {
          url: dataUrl,
          filename: cleanFilename
        }
      })

      if (response?.success) return
    } catch (e) {
      console.error("Failed to send download message to background:", e)
    }
  }

  // Fallback if background script is not available
  triggerLegacyDownload(dataUrl, cleanFilename)
}

/**
 * Legacy download fallback
 */
function triggerLegacyDownload(url: string, filename: string) {
  const link = document.createElement("a")
  link.style.display = "none"
  link.href = url
  link.download = filename
  document.body.appendChild(link)
  link.click()
  setTimeout(() => document.body.removeChild(link), 1000)
}

/**
 * Read image from clipboard
 */
export async function readFromClipboard(): Promise<string | null> {
  try {
    const clipboardItems = await navigator.clipboard.read()

    for (const item of clipboardItems) {
      for (const type of item.types) {
        if (type.startsWith("image/")) {
          const blob = await item.getType(type)
          return blobToDataUrl(blob)
        }
      }
    }

    return null
  } catch (error) {
    console.error("Failed to read clipboard:", error)
    return null
  }
}

/**
 * Convert blob to data URL
 */
function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(reader.result as string)
    reader.onerror = reject
    reader.readAsDataURL(blob)
  })
}

/**
 * Read image from file input
 */
export function readFromFile(file: File): Promise<string> {
  return blobToDataUrl(file)
}
