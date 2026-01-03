import { FC } from "react"
import { motion } from "framer-motion"
import { GradientType, SolidColorType, ShadowType, gradients, solidColors, shadows } from "../lib/backgrounds"
import { meshGradients, MeshGradientType } from "../lib/backgrounds_v2"
import { ExportFormat, exportFormats, Annotation, AnnotationType } from "../lib/canvas"
import { MockupType, mockups } from "../lib/mockups"

interface SidebarControlsProps {
  backgroundType: "gradient" | "solid" | "mesh"
  setBackgroundType: (type: "gradient" | "solid" | "mesh") => void
  selectedGradient: GradientType
  setSelectedGradient: (g: GradientType) => void
  selectedColor: SolidColorType
  setSelectedColor: (c: SolidColorType) => void
  selectedMesh?: MeshGradientType
  setSelectedMesh?: (m: MeshGradientType) => void
  onUnsplashClick?: () => void
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
  tilt: { rotateX: number; rotateY: number; perspective: number }
  setTilt: (t: { rotateX: number; rotateY: number; perspective: number }) => void
  annotations: Annotation[]
  setAnnotations: (a: Annotation[]) => void
  activeTool: AnnotationType | null
  setActiveTool: (t: AnnotationType | null) => void
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
  selectedMesh,
  setSelectedMesh,
  onUnsplashClick,
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
  tilt,
  setTilt,
  annotations,
  setAnnotations,
  activeTool,
  setActiveTool,
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
        <div className="flex bg-gray-800/50 rounded-lg p-1 border border-gray-700/30 gap-1">
          <button
            onClick={() => setBackgroundType("gradient")}
            className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
              backgroundType === "gradient"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Grad
          </button>
          <button
            onClick={() => setBackgroundType("mesh")}
            className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all relative ${
              backgroundType === "mesh"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Mesh {!isPro && "🔒"}
          </button>
          <button
            onClick={() => setBackgroundType("solid")}
            className={`flex-1 py-1.5 text-[10px] font-bold rounded-md transition-all ${
              backgroundType === "solid"
                ? "bg-purple-600 text-white shadow-lg"
                : "text-gray-400 hover:text-white"
            }`}
          >
            Solid
          </button>
        </div>
        <button
          onClick={() => handleProFeature(onUnsplashClick || (() => {}))}
          className="w-full mt-2 py-1.5 text-[10px] font-bold rounded-md bg-gray-800/50 border border-gray-700/30 text-gray-400 hover:text-white hover:border-gray-500 transition-all flex items-center justify-center gap-1.5 group"
        >
          📷 Unsplash {!isPro && "🔒"}
        </button>
      </section>

      {/* Gradient/Color grid */}
      <section>
        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 block">
          {backgroundType === "gradient" ? "Presets" : backgroundType === "mesh" ? "Premium Mesh" : "Colors"}
        </label>
        <div className="grid grid-cols-5 gap-1.5">
          {(backgroundType === "gradient" ? gradients : backgroundType === "mesh" ? meshGradients : solidColors).map((item) => {
            const isGradient = backgroundType === "gradient"
            const isMesh = backgroundType === "mesh"
            
            let isSelected = false
            if (isGradient) isSelected = selectedGradient.id === item.id
            else if (isMesh) isSelected = selectedMesh?.id === item.id
            else isSelected = selectedColor.id === (item as SolidColorType).id

            return (
              <button
                key={item.id}
                onClick={() =>
                  item.isPro && !isPro
                    ? handleProFeature(() => {
                        if (isGradient) setSelectedGradient(item as GradientType)
                        else if (isMesh) setSelectedMesh?.(item as MeshGradientType)
                        else setSelectedColor(item as SolidColorType)
                      })
                    : isGradient
                      ? setSelectedGradient(item as GradientType)
                      : isMesh
                        ? setSelectedMesh?.(item as MeshGradientType)
                        : setSelectedColor(item as SolidColorType)
                }
                className={`w-7 h-7 rounded-lg transition-all relative hover:scale-110 active:scale-90 ${
                  isSelected
                    ? "ring-2 ring-white ring-offset-2 ring-offset-gray-900 z-10"
                    : "border border-gray-700/50"
                }`}
                style={{ background: isGradient ? (item as GradientType).css : isMesh ? (item as MeshGradientType).colorPoints[0].color : (item as SolidColorType).hex }}
                title={item.name}
              >
                {isMesh && (
                  <div className="absolute inset-0 overflow-hidden rounded-lg">
                    <div className="w-full h-full opacity-50 blur-[2px]" style={{
                      background: `radial-gradient(at 0% 0%, ${(item as MeshGradientType).colorPoints[0].color}, transparent), 
                                  radial-gradient(at 100% 100%, ${(item as MeshGradientType).colorPoints[1].color}, transparent)`
                    }} />
                  </div>
                )}
                {item.isPro && !isPro && (
                  <span className="absolute -top-1.5 -right-1.5 text-[10px] drop-shadow-md z-20">
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
                  : m.id === "macos-sequoia"
                    ? "🍎"
                    : m.id === "win11"
                      ? "🪟"
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

      {/* Annotations - PRO Feature */}
      <section>
        <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 flex justify-between items-center">
          <span>Annotations</span>
          {!isPro && <span className="text-amber-500 font-black">PRO</span>}
        </label>
        <div className="grid grid-cols-4 gap-1.5">
          {[
            { id: "blur", icon: "🌫️", name: "Blur" },
            { id: "arrow", icon: "↗️", name: "Arrow" },
            { id: "rect", icon: "⬜", name: "Rect" },
            { id: "text", icon: "T", name: "Text" }
          ].map((tool) => (
            <button
              key={tool.id}
              onClick={() =>
                handleProFeature(() =>
                  setActiveTool(activeTool === (tool.id as AnnotationType) ? null : (tool.id as AnnotationType))
                )
              }
              className={`py-2 text-xs rounded-lg transition-all border ${
                activeTool === tool.id
                  ? "bg-amber-500/20 border-amber-500 text-white"
                  : "bg-gray-800/30 border-gray-700/30 text-gray-400 hover:border-gray-600"
              }`}
              title={tool.name}
            >
              <div className="flex flex-col items-center gap-0.5">
                <span className="text-sm">{tool.icon}</span>
              </div>
            </button>
          ))}
        </div>
        {activeTool && (
          <p className="text-[9px] text-amber-400 mt-2 text-center animate-pulse">
            Click and drag on image to add {activeTool}
          </p>
        )}
        {annotations.length > 0 && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setAnnotations(annotations.slice(0, -1))}
              className="flex-1 py-1 text-[10px] bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 rounded border border-gray-700/30 transition-all font-bold"
            >
              ↩️ Undo
            </button>
            <button
              onClick={() => setAnnotations([])}
              className="flex-1 py-1 text-[10px] bg-gray-800/50 hover:bg-gray-700/50 text-gray-400 rounded border border-gray-700/30 transition-all font-bold"
            >
              🗑️ Clear all
            </button>
          </div>
        )}
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

        {/* 3D Tilt - PRO Feature */}
        <section className="pt-2 border-t border-gray-800/50">
          <label className="text-[10px] uppercase tracking-wider text-gray-500 font-bold mb-2 flex justify-between items-center">
            <span>3D Tilt</span>
            {!isPro && <span className="text-amber-500 font-black">PRO</span>}
          </label>
          <div className="space-y-3">
            <div>
              <label className="text-[9px] text-gray-400 flex justify-between mb-1">
                <span>Rotate X</span>
                <span>{tilt.rotateX}°</span>
              </label>
              <input
                type="range"
                min="-15"
                max="15"
                value={tilt.rotateX}
                onChange={(e) =>
                  handleProFeature(() => setTilt({ ...tilt, rotateX: Number(e.target.value) }))
                }
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500 h-[3px]"
              />
            </div>
            <div>
              <label className="text-[9px] text-gray-400 flex justify-between mb-1">
                <span>Rotate Y</span>
                <span>{tilt.rotateY}°</span>
              </label>
              <input
                type="range"
                min="-15"
                max="15"
                value={tilt.rotateY}
                onChange={(e) =>
                  handleProFeature(() => setTilt({ ...tilt, rotateY: Number(e.target.value) }))
                }
                className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500 h-[3px]"
              />
            </div>
          </div>
        </section>
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
