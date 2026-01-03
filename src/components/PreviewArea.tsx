import { FC, useRef } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Annotation, AnnotationType } from "../lib/canvas"

interface PreviewAreaProps {
  beautifiedImage: string | null
  isProcessing: boolean
  onCapture: () => void
  onPaste: () => void
  onFileSelect: (e: React.ChangeEvent<HTMLInputElement>) => void
  onDrop: (e: React.DragEvent) => void
  tilt?: { rotateX: number; rotateY: number; perspective: number }
  annotations: Annotation[]
  setAnnotations: (a: Annotation[]) => void
  activeTool: AnnotationType | null
  isDraggingFile?: boolean
  isFullTab?: boolean
}

export const PreviewArea: FC<PreviewAreaProps> = ({
  beautifiedImage,
  isProcessing,
  onCapture,
  onPaste,
  onFileSelect,
  onDrop,
  tilt,
  annotations,
  setAnnotations,
  activeTool,
  isDraggingFile,
  isFullTab
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null)
  const isDrawing = useRef(false)
  const startPos = useRef({ x: 0, y: 0 })
  const currentAnnId = useRef<string | null>(null)

  const handleMouseDown = (e: React.MouseEvent) => {
    if (!activeTool || !beautifiedImage) return
    isDrawing.current = true
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    startPos.current = { x, y }

    const id = Math.random().toString(36).substr(2, 9)
    currentAnnId.current = id

    const newAnn: Annotation = {
      id,
      type: activeTool,
      x,
      y,
      width: 0,
      height: 0,
      color: activeTool === "blur" ? undefined : "#ff0000",
      points: activeTool === "arrow" ? [{ x: 0, y: 0 }, { x: 0, y: 0 }] : undefined
    }

    setAnnotations([...annotations, newAnn])
  }

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing.current || !currentAnnId.current) return
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    setAnnotations(
      annotations.map((ann) => {
        if (ann.id !== currentAnnId.current) return ann
        if (ann.type === "arrow") {
          return {
            ...ann,
            points: [
              { x: 0, y: 0 },
              { x: x - startPos.current.x, y: y - startPos.current.y }
            ]
          }
        }
        return {
          ...ann,
          width: x - startPos.current.x,
          height: y - startPos.current.y
        }
      })
    )
  }

  const handleMouseUp = () => {
    isDrawing.current = false
    currentAnnId.current = null
  }

  return (
    <div
      className={`flex-1 flex items-center justify-center overflow-hidden relative backdrop-blur-sm transition-all duration-500 ${
        activeTool ? "cursor-crosshair" : "cursor-default"
      } ${isDraggingFile ? "ring-4 ring-purple-500/50 bg-purple-500/5" : ""} ${isFullTab ? "p-10 lg:p-24" : "p-8"}`}
      onDrop={onDrop}
      onDragOver={(e) => {
        e.preventDefault()
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    >
      {/* Background Grid Pattern (Zen UI Style) */}
      {!beautifiedImage && (
        <div className="absolute inset-0 opacity-10 pointer-events-none" 
             style={{ backgroundImage: 'radial-gradient(#ffffff 1px, transparent 0)', backgroundSize: '24px 24px' }} />
      )}
      <AnimatePresence mode="wait">
        {beautifiedImage ? (
          <motion.div
            key="preview-container"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            whileHover={!activeTool ? { scale: 1.02 } : {}}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="p-12 relative"
          >
            <motion.img
              src={beautifiedImage}
              alt="Preview"
              className={`max-w-full object-contain shadow-[0_50px_100px_-20px_rgba(0,0,0,0.5)] rounded-lg transition-all ${isFullTab ? "max-h-[90vh]" : "max-h-[85vh]"}`}
              style={
                tilt
                  ? {
                      perspective: `${tilt.perspective}px`,
                      rotateX: `${tilt.rotateX}deg`,
                      rotateY: `${tilt.rotateY}deg`,
                      transformStyle: "preserve-3d"
                    }
                  : {}
              }
            />
            {/* Contextual Annotation Hints */}
            {activeTool && (
              <div className="absolute -top-10 left-1/2 -translate-x-1/2 bg-amber-500 text-black text-[10px] font-black px-3 py-1 rounded-full shadow-lg whitespace-nowrap">
                DRAG TO DRAW {activeTool.toUpperCase()}
              </div>
            )}
          </motion.div>
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
