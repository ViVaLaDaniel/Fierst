import { FC } from "react"
import { motion } from "framer-motion"
import { Preset, presets } from "../lib/presets"

interface MagicBarProps {
  onApplyPreset: (preset: Preset) => void
  onCopy: () => void
  onDownload: () => void
  isProcessing: boolean
  isPro: boolean
  isFullTab?: boolean
}

export const MagicBar: FC<MagicBarProps> = ({
  onApplyPreset,
  onCopy,
  onDownload,
  isProcessing,
  isPro,
  isFullTab
}) => {
  return (
    <motion.div 
      initial={{ y: 100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      className={`fixed ${isFullTab ? "bottom-10 w-[700px]" : "bottom-6 w-[95%] max-w-[500px]"} left-1/2 -translate-x-1/2 flex items-center gap-4 px-6 py-3 bg-black/40 backdrop-blur-2xl border border-white/10 rounded-2xl shadow-2xl z-50 transition-all duration-500`}
    >
      {/* Presets Gallery */}
      <div className="flex items-center gap-2 pr-4 border-r border-white/10">
        <span className="text-[10px] uppercase tracking-widest text-gray-500 font-black mr-2">Presets</span>
        {presets.map((preset) => (
          <button
            key={preset.id}
            onClick={() => onApplyPreset(preset)}
            className="flex flex-col items-center gap-1 group relative"
          >
            <div className="w-10 h-10 rounded-xl bg-white/5 border border-white/10 flex items-center justify-center text-lg hover:bg-white/10 hover:scale-110 active:scale-95 transition-all group-hover:border-purple-500/50">
              {preset.icon}
            </div>
            <span className="text-[8px] text-gray-400 font-bold opacity-0 group-hover:opacity-100 transition-opacity absolute -top-6 whitespace-nowrap bg-black/80 px-2 py-1 rounded">
              {preset.name}
            </span>
          </button>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="flex items-center gap-3 pl-2">
        <button
          onClick={onCopy}
          disabled={isProcessing}
          className="px-5 py-2.5 bg-purple-600 hover:bg-purple-500 text-white rounded-xl text-sm font-black transition-all shadow-lg shadow-purple-900/40 active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          📋 Copy
        </button>
        <button
          onClick={onDownload}
          disabled={isProcessing}
          className="px-5 py-2.5 bg-white hover:bg-gray-100 text-black rounded-xl text-sm font-black transition-all active:scale-95 disabled:opacity-50 flex items-center gap-2"
        >
          ⬇️ Download
        </button>
      </div>

      {!isPro && (
        <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full animate-bounce shadow-lg">
          ⚡ PRO FEATURES UNLOCKED
        </div>
      )}
    </motion.div>
  )
}
