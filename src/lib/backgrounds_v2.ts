import { GradientType } from "./backgrounds"

export interface MeshGradientType extends GradientType {
  colorPoints: { color: string; x: number; y: number }[]
  noise?: number
}

export const meshGradients: MeshGradientType[] = [
  {
    id: 101,
    name: "Aurora Mesh",
    css: "mesh",
    isPro: true,
    colorPoints: [
      { color: "#00d2ff", x: 0.2, y: 0.2 },
      { color: "#3a7bd5", x: 0.8, y: 0.3 },
      { color: "#00f2fe", x: 0.4, y: 0.7 },
      { color: "#4facfe", x: 0.9, y: 0.9 }
    ],
    noise: 0.05
  },
  {
    id: 102,
    name: "Sunset Glow",
    css: "mesh",
    isPro: true,
    colorPoints: [
      { color: "#ff9a9e", x: 0.1, y: 0.1 },
      { color: "#fad0c4", x: 0.9, y: 0.2 },
      { color: "#ffecd2", x: 0.5, y: 0.5 },
      { color: "#fcb69f", x: 0.2, y: 0.8 }
    ],
    noise: 0.03
  },
  {
    id: 103,
    name: "Deep Space",
    css: "mesh",
    isPro: true,
    colorPoints: [
      { color: "#0f0c29", x: 0.1, y: 0.1 },
      { color: "#302b63", x: 0.9, y: 0.3 },
      { color: "#24243e", x: 0.4, y: 0.6 },
      { color: "#141e30", x: 0.7, y: 0.9 }
    ],
    noise: 0.08
  }
]

/**
 * Draw a mesh gradient by blending multiple radial gradients
 */
export function drawMeshGradient(
  ctx: CanvasRenderingContext2D,
  width: number,
  height: number,
  mesh: MeshGradientType
) {
  // Clear with primary color
  ctx.fillStyle = mesh.colorPoints[0].color
  ctx.fillRect(0, 0, width, height)

  // Overlay radial gradients
  mesh.colorPoints.forEach((point) => {
    const radial = ctx.createRadialGradient(
      point.x * width,
      point.y * height,
      0,
      point.x * width,
      point.y * height,
      Math.max(width, height) * 0.8
    )
    radial.addColorStop(0, point.color)
    radial.addColorStop(1, "rgba(0,0,0,0)")
    
    ctx.globalCompositeOperation = "screen"
    ctx.fillStyle = radial
    ctx.fillRect(0, 0, width, height)
  })

  // Reset composite op
  ctx.globalCompositeOperation = "source-over"

  // Add Noise texture for premium look
  if (mesh.noise) {
    addNoise(ctx, width, height, mesh.noise)
  }
}

function addNoise(ctx: CanvasRenderingContext2D, width: number, height: number, amount: number) {
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  
  for (let i = 0; i < data.length; i += 4) {
    const noise = (Math.random() - 0.5) * amount * 255
    data[i] = Math.min(255, Math.max(0, data[i] + noise))
    data[i+1] = Math.min(255, Math.max(0, data[i+1] + noise))
    data[i+2] = Math.min(255, Math.max(0, data[i+2] + noise))
  }
  
  ctx.putImageData(imageData, 0, 0)
}
