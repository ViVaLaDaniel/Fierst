export interface Preset {
  id: string
  name: string
  icon: string
  settings: {
    backgroundType: "gradient" | "solid" | "mesh"
    backgroundId: number | string
    padding: number
    borderRadius: number
    mockupId: string
    tilt: { rotateX: number; rotateY: number; perspective: number }
  }
}

export const presets: Preset[] = [
  {
    id: "macbook-stealth",
    name: "Mac Stealth",
    icon: "💻",
    settings: {
      backgroundType: "mesh",
      backgroundId: 1, // Cyber Mesh
      padding: 80,
      borderRadius: 16,
      mockupId: "macbook",
      tilt: { rotateX: 5, rotateY: -10, perspective: 1200 }
    }
  },
  {
    id: "iphone-glass",
    name: "iPhone Glass",
    icon: "📱",
    settings: {
      backgroundType: "gradient",
      backgroundId: 1, // Ocean
      padding: 64,
      borderRadius: 40,
      mockupId: "iphone",
      tilt: { rotateX: 0, rotateY: 0, perspective: 1000 }
    }
  },
  {
    id: "win-mica",
    name: "Win 11 Mica",
    icon: "🪟",
    settings: {
      backgroundType: "mesh",
      backgroundId: 2, // Aurora Mesh
      padding: 50,
      borderRadius: 12,
      mockupId: "win11",
      tilt: { rotateX: -5, rotateY: 8, perspective: 1500 }
    }
  },
  {
    id: "social-prime",
    name: "Social Prime",
    icon: "✨",
    settings: {
      backgroundType: "solid",
      backgroundId: 1, // Pure Black
      padding: 100,
      borderRadius: 24,
      mockupId: "none",
      tilt: { rotateX: 0, rotateY: 0, perspective: 1000 }
    }
  }
]
