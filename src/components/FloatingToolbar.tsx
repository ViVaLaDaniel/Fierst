import { FC, useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { GradientType, SolidColorType, ShadowType, gradients, solidColors, shadows } from "../lib/backgrounds"
import { meshGradients, MeshGradientType } from "../lib/backgrounds_v2"
import { ExportFormat, exportFormats, AnnotationType } from "../lib/canvas"
import { MockupType, mockups } from "../lib/mockups"

interface FloatingToolbarProps {
  backgroundType: "gradient" | "solid" | "mesh"
  setBackgroundType: (type: "gradient" | "solid" | "mesh") => void
  selectedGradient: GradientType
  setSelectedGradient: (g: GradientType) => void
  selectedColor: SolidColorType
  setSelectedColor: (c: SolidColorType) => void
  selectedMesh?: MeshGradientType
  setSelectedMesh?: (m: MeshGradientType) => void
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
  activeTool: AnnotationType | null
  setActiveTool: (t: AnnotationType | null) => void
  isPro: boolean
  handleProFeature: (callback: () => void) => void
  onClearAnnotations: () => void
  onUndoAnnotation: () => void
  hasAnnotations: boolean
  isFullTab?: boolean
}

export const FloatingToolbar: FC<FloatingToolbarProps> = ({
  backgroundType,
  setBackgroundType,
  selectedGradient,
  setSelectedGradient,
  selectedColor,
  setSelectedColor,
  selectedMesh,
  setSelectedMesh,
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
  activeTool,
  setActiveTool,
  isPro,
  handleProFeature,
  onClearAnnotations,
  onUndoAnnotation,
  hasAnnotations,
  isFullTab
}) => {
  const [isExpanded, setIsExpanded] = useState(true)
  const [activeTab, setActiveTab] = useState<"style" | "frame" | "draw">("style")

  return (
    <motion.div
      initial={{ x: 100, opacity: 0 }}
      animate={{ x: 0, opacity: 1 }}
      className={`fixed z-50 flex flex-col items-end gap-2 transition-all duration-500 ${isFullTab ? "top-32 right-10" : "top-24 right-6"}`}
    >
      {/* Toggle Button */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="p-3 bg-black/60 backdrop-blur-xl border border-white/10 rounded-2xl shadow-xl hover:bg-black/80 transition-all text-white/50 hover:text-white"
      >
        {isExpanded ? "➡️" : "⬅️"}
      </button>

      <AnimatePresence>
        {isExpanded && (
            <motion.div
              initial={{ scale: 0.9, opacity: 0, x: 20 }}
              animate={{ scale: 1, opacity: 1, x: 0 }}
              exit={{ scale: 0.9, opacity: 0, x: 20 }}
              className={`${isFullTab ? "w-[320px]" : "w-[280px]"} bg-black/60 backdrop-blur-3xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden flex flex-col`}
            >
            {/* Tabs */}
            <div className="flex p-2 gap-1 bg-white/5">
              {[
                { id: "style", label: "Style", icon: "🎨" },
                { id: "frame", label: "Frame", icon: "🖼️" },
                { id: "draw", label: "Draft", icon: "✍️" }
              ].map((tab) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as "style" | "frame" | "draw")}
                  className={`flex-1 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                    activeTab === tab.id
                      ? "bg-purple-600 text-white shadow-lg"
                      : "text-white/40 hover:text-white hover:bg-white/5"
                  }`}
                >
                  <span className="mr-1">{tab.icon}</span> {tab.label}
                </button>
              ))}
            </div>

            <div className="p-5 space-y-6 max-h-[480px] overflow-y-auto custom-scrollbar">
              {activeTab === "style" && (
                <>
                  {/* Background Type */}
                  <section>
                    <div className="flex bg-white/5 rounded-xl p-1 border border-white/5 gap-1">
                      {["gradient", "mesh", "solid"].map((type) => (
                        <button
                          key={type}
                          onClick={() => {
                            if (type === "mesh") {
                              handleProFeature(() => setBackgroundType("mesh"))
                            } else {
                              setBackgroundType(type as "gradient" | "solid" | "mesh")
                            }
                          }}
                          className={`flex-1 py-1.5 text-[9px] font-black uppercase tracking-tighter rounded-lg transition-all ${
                            backgroundType === type
                              ? "bg-white/10 text-white"
                              : "text-white/30 hover:text-white"
                          }`}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </section>

                  {/* Preset Grid */}
                  <section>
                    <div className="grid grid-cols-6 gap-2">
                       {(backgroundType === "gradient" ? gradients : backgroundType === "mesh" ? meshGradients : solidColors).map((item) => {
                          const isSelected = backgroundType === "gradient" 
                            ? selectedGradient.id === item.id 
                            : backgroundType === "mesh" 
                              ? selectedMesh?.id === item.id 
                              : selectedColor.id === (item as { id: number | string }).id

                          return (
                            <button
                              key={item.id}
                              onClick={() => {
                                if (backgroundType === "gradient") setSelectedGradient(item as GradientType)
                                else if (backgroundType === "mesh") setSelectedMesh?.(item as MeshGradientType)
                                else setSelectedColor(item as SolidColorType)
                              }}
                              className={`aspect-square rounded-lg transition-all border ${
                                isSelected ? "border-white ring-2 ring-purple-500/50 scale-110" : "border-white/10 hover:border-white/30"
                              }`}
                              style={{ background: (item as { css?: string }).css || (item as { hex?: string }).hex || (item as unknown as { colorPoints: { color: string }[] }).colorPoints?.[0]?.color }}
                            />
                          )
                       })}
                    </div>
                  </section>

                  {/* Sliders */}
                  <section className="space-y-4">
                    <div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                        <span>Padding</span>
                        <span className="text-purple-400">{padding}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="128"
                        value={padding}
                        onChange={(e) => setPadding(Number(e.target.value))}
                        className="w-full accent-purple-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                      />
                    </div>
                    <div>
                      <div className="flex justify-between text-[10px] font-black uppercase tracking-widest text-white/40 mb-2">
                        <span>Corners</span>
                        <span className="text-purple-400">{borderRadius}px</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="64"
                        value={borderRadius}
                        onChange={(e) => setBorderRadius(Number(e.target.value))}
                        className="w-full accent-purple-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                      />
                    </div>
                  </section>

                  {/* Shadow */}
                  <section>
                    <div className="grid grid-cols-4 gap-2">
                      {shadows.map((s) => (
                        <button
                          key={s.id}
                          onClick={() => setSelectedShadow(s)}
                          className={`py-2 text-[10px] font-bold rounded-xl transition-all border ${
                            selectedShadow.id === s.id ? "bg-white/10 border-white text-white" : "border-white/10 text-white/30 hover:border-white/30"
                          }`}
                        >
                          {s.name.charAt(0)}
                        </button>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {activeTab === "frame" && (
                <>
                  <section className="grid grid-cols-3 gap-2">
                    {mockups.map((m) => (
                      <button
                        key={m.id}
                        onClick={() => {
                          if (m.id === "macos-sequoia" || m.id === "win11" || m.id === "iphone" || m.id === "android") {
                            handleProFeature(() => setSelectedMockup(m))
                          } else {
                            setSelectedMockup(m)
                          }
                        }}
                        className={`py-4 rounded-2xl flex flex-col items-center gap-2 transition-all border relative ${
                          selectedMockup.id === m.id ? "bg-purple-600/20 border-purple-500 text-white" : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                        }`}
                      >
                         <span className="text-xl">{m.id === "none" ? "✕" : m.id === "macbook" ? "💻" : m.id === "iphone" ? "📱" : m.id === "win11" ? "🪟" : "🌐"}</span>
                         <span className="text-[9px] font-bold">{m.name}</span>
                         {(!isPro && (m.id === "macos-sequoia" || m.id === "win11" || m.id === "iphone" || m.id === "android")) && (
                           <span className="absolute top-1 right-1 text-[8px]">⭐</span>
                         )}
                      </button>
                    ))}
                  </section>

                  {/* 3D Perspective */}
                  <section className="pt-4 border-t border-white/10 space-y-4">
                    <span className="text-[10px] font-black uppercase tracking-widest text-white/40">3D Perspective</span>
                    <div className="space-y-4">
                      {["rotateX", "rotateY"].map((axis) => (
                        <div key={axis}>
                          <div className="flex justify-between text-[9px] font-bold text-white/30 mb-1">
                            <span>{axis.toUpperCase()}</span>
                            <span>{(tilt as Record<string, number>)[axis]}°</span>
                          </div>
                          <input
                            type="range"
                            min="-15"
                            max="15"
                            value={(tilt as Record<string, number>)[axis]}
                            onChange={(e) => setTilt({ ...tilt, [axis]: Number(e.target.value) })}
                            className="w-full accent-amber-500 h-1 bg-white/10 rounded-full appearance-none cursor-pointer"
                          />
                        </div>
                      ))}
                    </div>
                  </section>
                </>
              )}

              {activeTab === "draw" && (
                <div className="space-y-6">
                   <div className="grid grid-cols-2 gap-3">
                      {[
                        { id: "blur", icon: "🌫️", name: "Blur" },
                        { id: "arrow", icon: "↗️", name: "Arrow" },
                        { id: "rect", icon: "⬜", name: "Rect" },
                        { id: "text", icon: "T", name: "Text" }
                      ].map((tool) => (
                        <button
                          key={tool.id}
                          onClick={() => setActiveTool(activeTool === (tool.id as AnnotationType) ? null : tool.id as AnnotationType)}
                          className={`p-4 rounded-2xl flex flex-col items-center gap-2 transition-all border ${
                            activeTool === tool.id ? "bg-amber-500/20 border-amber-500 text-white" : "bg-white/5 border-white/5 text-white/40 hover:border-white/20"
                          }`}
                        >
                          <span className="text-2xl">{tool.icon}</span>
                          <span className="text-[10px] font-black uppercase">{tool.name}</span>
                        </button>
                      ))}
                   </div>

                   {hasAnnotations && (
                     <div className="flex gap-2">
                       <button onClick={onUndoAnnotation} className="flex-1 py-3 bg-white/5 hover:bg-white/10 rounded-xl text-[10px] font-black uppercase text-white/60">Undo</button>
                       <button onClick={onClearAnnotations} className="flex-1 py-3 bg-red-500/10 hover:bg-red-500/20 text-red-400 rounded-xl text-[10px] font-black uppercase">Clear All</button>
                     </div>
                   )}
                </div>
              )}
            </div>

            {/* Export Format (Footer) */}
            <div className="p-4 bg-white/5 border-t border-white/10">
               <div className="flex gap-1">
                  {exportFormats.map(f => (
                    <button
                      key={f.id}
                      onClick={() => setExportFormat(f.id)}
                      className={`flex-1 py-1.5 rounded-lg text-[9px] font-black transition-all ${
                        exportFormat === f.id ? "bg-white/20 text-white" : "text-white/30 hover:text-white"
                      }`}
                    >
                      {f.name}
                    </button>
                  ))}
               </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
