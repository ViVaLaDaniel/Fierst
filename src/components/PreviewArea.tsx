import { FC, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface PreviewAreaProps {
  beautifiedImage: string | null
  isProcessing: boolean
  onCapture: () => void
  onPaste: () => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDrop: (e: React.DragEvent) => void
}

export const PreviewArea: FC<PreviewAreaProps> = ({
  beautifiedImage,
  isProcessing,
  onCapture,
  onPaste,
  onFileSelect,
  onDrop
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)

  return (
    <div
      className="flex-1 min-h-[380px] rounded-2xl border-2 border-dashed border-gray-700/50 flex items-center justify-center overflow-hidden bg-gray-800/30 relative backdrop-blur-sm"
      onDrop={onDrop}
      onDragOver={(e) => e.preventDefault()}
    >
      <AnimatePresence mode="wait">
        {beautifiedImage ? (
          <motion.img
            key="preview"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            src={beautifiedImage}
            alt="Preview"
            className="max-w-full max-h-[380px] object-contain shadow-2xl"
          />
        ) : (
          <motion.div
            key="empty"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="text-center p-8"
          >
            <div className="text-5xl mb-4 grayscale opacity-50">📸</div>
            <p className="text-gray-400 mb-3 text-sm">Drop image here or</p>
            <div className="flex flex-col gap-3 justify-center">
              <button
                onClick={onCapture}
                className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
              >
                📸 Capture Current Tab
              </button>
              <div className="flex gap-2 justify-center">
                <button
                  onClick={onPaste}
                  className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/30 rounded-lg text-xs font-medium transition-all"
                >
                  📋 Paste
                </button>
                <button
                  onClick={() => fileInputRef.current?.click()}
                  className="px-4 py-2 bg-gray-700/50 hover:bg-gray-600/50 border border-gray-600/30 rounded-lg text-xs font-medium transition-all"
                >
                  📁 Browse
                </button>
              </div>
            </div>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={onFileSelect}
              className="hidden"
            />
          </motion.div>
        )}
      </AnimatePresence>

      {isProcessing && (
        <div className="absolute inset-0 bg-black/40 backdrop-blur-[2px] flex items-center justify-center z-10">
          <motion.div
            animate={{ rotate: 360 }}
            transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
            className="text-3xl"
          >
            ⚡
          </motion.div>
        </div>
      )}
    </div>
  )
}
