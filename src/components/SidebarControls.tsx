import { FC } from "react"
import { motion } from "framer-motion"
import {
  GradientType,
  SolidColorType,
  ShadowType,
  gradients,
  solidColors,
  shadows
} from "../lib/backgrounds"
import { ExportFormat, exportFormats } from "../lib/canvas"
import { MockupType, mockups } from "../lib/mockups"

interface SidebarControlsProps {
  backgroundType: "gradient" | "solid"
  setBackgroundType: (type: "gradient" | "solid") => void
  selectedGradient: GradientType
  setSelectedGradient: (g: GradientType) => void
  selectedColor: SolidColorType
  setSelectedColor: (c: SolidColorType) => void
  selectedShadow: ShadowType
  setSelectedShadow: (s: ShadowType) => void
  padding: number
  setPadding: (p: number) => void
  borderRadius: number
  setBorderRadius: (r: number) => void
  selectedMockup: MockupType
  setSelectedMockup: (m: MockupType) => void
  exportFormat: ExportFormat
  setExportFormat: (f: ExportFormat) => void
  isPro: boolean
  handleProFeature: (callback: () => void) => void
  onCopy: () => void
  onDownload: () => void
  onClear: () => void
  showExportButtons: boolean
  onUpgrade: () => void
}

export const SidebarControls: FC<SidebarControlsProps> = ({
  backgroundType,
  setBackgroundType,
  selectedGradient,
  setSelectedGradient,
  selectedColor,
  setSelectedColor,
  selectedShadow,
  setSelectedShadow,
  padding,
  setPadding,
  borderRadius,
  setBorderRadius,
  selectedMockup,
  setSelectedMockup,
  exportFormat,
  setExportFormat,
  isPro,
  handleProFeature,
  onCopy,
  onDownload,
  onClear,
  showExportButtons,
  onUpgrade
}) => {
  return (
    <div className="w-[200px] space-y-4 overflow-y-auto max-h-[460px] pr-2 custom-scrollbar">
      {/* Background type toggle */}
      <section>
        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 block">
          Background
        </label>
        <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-700/30">
          <button
            onClick={() => setBackgroundType("gradient")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
              backgroundType === "gradient"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Gradient
          </button>
          <button
            onClick={() => setBackgroundType("solid")}
            className={`flex-1 py-1.5 text-xs font-bold rounded-md transition-all ${
              backgroundType === "solid"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Solid
          </button>
        </div>
      </section>

      {/* Gradient/Color grid */}
      <section>
        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 block">
          {backgroundType === "gradient" ? "Presets" : "Colors"}
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {(backgroundType === "gradient" ? gradients : solidColors).map((item) => {
            const isGradient = backgroundType === "gradient"
            const itemAsGradient = item as GradientType
            const itemAsSolid = item as SolidColorType

            return (
              <button
                key={isGradient ? itemAsGradient.id : itemAsSolid.id}
                onClick={() =>
                  item.isPro
                    ? handleProFeature(() =>
                        isGradient
                          ? setSelectedGradient(itemAsGradient)
                          : setSelectedColor(itemAsSolid)
                      )
                    : isGradient
                      ? setSelectedGradient(itemAsGradient)
                      : setSelectedColor(itemAsSolid)
                }
                className={`w-7 h-7 rounded-lg transition-all relative hover:scale-110 active:scale-90 ${
                  (isGradient
                    ? selectedGradient.id === itemAsGradient.id
                    : selectedColor.id === itemAsSolid.id)
                    ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900 z-10"
                    : "border border-gray-700/50"
                }`}
                style={{ background: isGradient ? itemAsGradient.css : itemAsSolid.hex }}
                title={item.name}
              >
                {item.isPro && !isPro && (
                  <span className="absolute -top-1.5 -right-1.5 text-[10px] drop-shadow-md">
                    🔒
                  </span>
                )}
              </button>
            )
          })}
        </div>
      </section>

      {/* Mockups */}
      <section>
        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 flex items-center gap-1">
          Frame
          {!isPro && <span className="text-amber-500 font-black">PRO</span>}
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {mockups.map((m) => (
            <button
              key={m.id}
              onClick={() =>
                m.isPro ? handleProFeature(() => setSelectedMockup(m)) : setSelectedMockup(m)
              }
              className={`py-2 text-xs rounded-lg transition-all relative border ${
                selectedMockup.id === m.id
                  ? "bg-purple-600/20 border-purple-500 text-white"
                  : "bg-gray-800/30 border-gray-700/30 text-gray-400 hover:border-gray-600"
              }`}
              title={m.name}
            >
              {m.id === "none"
                ? "✕"
                : m.id === "browser"
                  ? "🌐"
                  : m.id === "macbook"
                    ? "💻"
                    : m.id === "iphone"
                      ? "📱"
                      : "📲"}
              {m.isPro && !isPro && (
                <span className="absolute -top-1.5 -right-1.5 text-[10px]">🔒</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Shadows */}
      <section>
        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 block">
          Shadow
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {shadows.map((s) => (
            <button
              key={s.id}
              onClick={() => setSelectedShadow(s)}
              className={`py-1.5 text-xs font-medium rounded-lg transition-all border ${
                selectedShadow.id === s.id
                  ? "bg-purple-600/20 border-purple-500 text-white"
                  : "bg-gray-800/30 border-gray-700/30 text-gray-400 hover:border-gray-600"
              }`}
            >
              {s.name.charAt(0)}
            </button>
          ))}
        </div>
      </section>

      {/* Sliders */}
      <section className="space-y-4">
        <div>
          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 flex justify-between">
            <span>Padding</span>
            <span className="text-purple-400 font-bold">{padding}px</span>
          </label>
          <input
            type="range"
            min="16"
            max="128"
            value={padding}
            onChange={(e) => setPadding(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>

        <div>
          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 flex justify-between">
            <span>Corners</span>
            <span className="text-purple-400 font-bold">{borderRadius}px</span>
          </label>
          <input
            type="range"
            min="0"
            max="32"
            value={borderRadius}
            onChange={(e) => setBorderRadius(Number(e.target.value))}
            className="w-full h-1.5 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-purple-500"
          />
        </div>
      </section>

      {/* Export Format */}
      <section>
        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 flex items-center gap-1">
          Export
          {!isPro && <span className="text-amber-500 font-black">PRO</span>}
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {exportFormats.map((f) => (
            <button
              key={f.id}
              onClick={() =>
                f.isPro ? handleProFeature(() => setExportFormat(f.id)) : setExportFormat(f.id)
              }
              className={`py-1.5 text-[10px] font-bold rounded-lg transition-all relative border ${
                exportFormat === f.id
                  ? "bg-purple-600/20 border-purple-500 text-white"
                  : "bg-gray-800/30 border-gray-700/30 text-gray-400 hover:border-gray-600"
              }`}
            >
              {f.name}
              {f.isPro && !isPro && (
                <span className="absolute -top-1.5 -right-1.5 text-[10px]">🔒</span>
              )}
            </button>
          ))}
        </div>
      </section>

      {/* Export buttons */}
      {showExportButtons && (
        <div className="space-y-2 pt-4 border-t border-gray-800">
          <button
            onClick={onCopy}
            className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-sm font-bold transition-all shadow-lg shadow-purple-900/20 active:scale-[0.98] flex items-center justify-center gap-2 group"
          >
            📋 <span className="group-hover:translate-x-0.5 transition-transform">Copy Image</span>
          </button>
          <button
            onClick={onDownload}
            className="w-full py-2.5 bg-gray-100 hover:bg-white text-gray-900 rounded-xl text-sm font-bold transition-all active:scale-[0.98] flex items-center justify-center gap-2"
          >
            ⬇️ Download
          </button>
          <button
            onClick={onClear}
            className="w-full py-2 text-gray-500 hover:text-red-400 text-xs font-bold transition-all"
          >
            🗑️ Clear Canvas
          </button>
        </div>
      )}

      {/* Upgrade button for free users */}
      {!isPro && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ scale: 1.02, boxShadow: "0 0 20px rgba(245, 158, 11, 0.4)" }}
          whileTap={{ scale: 0.98 }}
          onClick={onUpgrade}
          className="w-full mt-2 py-3 bg-gradient-to-r from-amber-500 via-orange-500 to-amber-500 bg-[length:200%_auto] hover:bg-right text-white rounded-xl text-xs font-black transition-all shadow-lg shadow-amber-900/20 relative overflow-hidden group"
        >
          <span className="relative z-10 flex items-center justify-center gap-2">
            ⚡ UNLOCK PRO — $9.99
          </span>
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-shimmer" />
        </motion.button>
      )}
    </div>
  )
}
