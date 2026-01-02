// Gradient background presets
export interface GradientType {
  id: number
  name: string
  css: string
  isPro: boolean
}

export const gradients: GradientType[] = [
  // Free gradients
  { id: 1, name: "Purple Dream", css: "linear-gradient(135deg, #667eea 0%, #764ba2 100%)", isPro: false },
  { id: 2, name: "Pink Sunset", css: "linear-gradient(135deg, #f093fb 0%, #f5576c 100%)", isPro: false },
  { id: 3, name: "Ocean Blue", css: "linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)", isPro: false },
  { id: 4, name: "Fresh Mint", css: "linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)", isPro: false },
  { id: 5, name: "Warm Glow", css: "linear-gradient(135deg, #fa709a 0%, #fee140 100%)", isPro: false },
  // Premium gradients
  { id: 6, name: "Neon Purple", css: "linear-gradient(135deg, #7b2ff7 0%, #f107a3 100%)", isPro: true },
  { id: 7, name: "Aurora", css: "linear-gradient(135deg, #00c9ff 0%, #92fe9d 50%, #f0f 100%)", isPro: true },
  { id: 8, name: "Cyber", css: "linear-gradient(135deg, #0ff 0%, #f0f 50%, #ff0 100%)", isPro: true },
  { id: 9, name: "Deep Space", css: "linear-gradient(135deg, #0f0c29 0%, #302b63 50%, #24243e 100%)", isPro: true },
  { id: 10, name: "Sunset Vibes", css: "linear-gradient(135deg, #fc466b 0%, #3f5efb 100%)", isPro: true },
  { id: 11, name: "Peach Glow", css: "linear-gradient(135deg, #ffecd2 0%, #fcb69f 100%)", isPro: true },
  { id: 12, name: "Rose Gold", css: "linear-gradient(135deg, #f5af19 0%, #f12711 100%)", isPro: true },
  { id: 13, name: "Cool Sky", css: "linear-gradient(135deg, #2980b9 0%, #6dd5fa 50%, #fff 100%)", isPro: true },
  { id: 14, name: "Midnight", css: "linear-gradient(135deg, #232526 0%, #414345 100%)", isPro: true },
  { id: 15, name: "Candy", css: "linear-gradient(135deg, #d53369 0%, #daae51 100%)", isPro: true }
]

// Solid color presets
export interface SolidColorType {
  id: string
  name: string
  hex: string
  isPro: boolean
}

export const solidColors: SolidColorType[] = [
  // Free colors
  { id: "white", name: "White", hex: "#ffffff", isPro: false },
  { id: "black", name: "Black", hex: "#0a0a0a", isPro: false },
  { id: "gray", name: "Gray", hex: "#6b7280", isPro: false },
  { id: "blue", name: "Blue", hex: "#3b82f6", isPro: false },
  { id: "purple", name: "Purple", hex: "#a855f7", isPro: false },
  // Premium colors
  { id: "red", name: "Red", hex: "#ef4444", isPro: true },
  { id: "orange", name: "Orange", hex: "#f97316", isPro: true },
  { id: "yellow", name: "Yellow", hex: "#eab308", isPro: true },
  { id: "green", name: "Green", hex: "#22c55e", isPro: true },
  { id: "pink", name: "Pink", hex: "#ec4899", isPro: true }
]

// Shadow presets
export interface ShadowType {
  id: string
  name: string
  value: string
}

export const shadows: ShadowType[] = [
  { id: "none", name: "None", value: "none" },
  { id: "soft", name: "Soft", value: "0 10px 40px rgba(0, 0, 0, 0.1)" },
  { id: "medium", name: "Medium", value: "0 20px 60px rgba(0, 0, 0, 0.2)" },
  { id: "hard", name: "Hard", value: "0 30px 80px rgba(0, 0, 0, 0.35)" }
]

