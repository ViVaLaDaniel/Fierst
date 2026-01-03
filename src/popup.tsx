import { useState, useCallback, useEffect } from "react"
import "./style.css"
import { gradients, solidColors, shadows } from "./lib/backgrounds"
import { meshGradients, MeshGradientType } from "./lib/backgrounds_v2"
import {
  beautifyImage,
  copyToClipboard,
  downloadImage,
  readFromClipboard,
  readFromFile,
  ExportFormat,
  Annotation,
  AnnotationType
} from "./lib/canvas"
import { mockups, MockupType } from "./lib/mockups"
import { isProUser } from "./lib/license"
import { captureTab } from "./lib/capture"

import { Header } from "./components/Header"
import { PreviewArea } from "./components/PreviewArea"
import { FloatingToolbar } from "./components/FloatingToolbar"
import { MagicBar } from "./components/MagicBar"
import { Modals } from "./components/Modals"
import { Preset } from "./lib/presets"

function IndexPopup() {
  // Image state
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [beautifiedImage, setBeautifiedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Settings state
  const [backgroundType, setBackgroundType] = useState<"gradient" | "solid" | "mesh">("gradient")
  const [selectedGradient, setSelectedGradient] = useState(gradients[0])
  const [selectedMesh, setSelectedMesh] = useState<MeshGradientType>(meshGradients[0])
  const [selectedColor, setSelectedColor] = useState(solidColors[0])
  const [selectedShadow, setSelectedShadow] = useState(shadows[2])
  const [padding, setPadding] = useState(64)
  const [borderRadius, setBorderRadius] = useState(12)
  const [selectedMockup, setSelectedMockup] = useState<MockupType>(mockups[0])
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png")
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, perspective: 1000 })

  const [annotations, setAnnotations] = useState<Annotation[]>([])
  const [activeTool, setActiveTool] = useState<AnnotationType | null>(null)
  const [isDraggingFile, setIsDraggingFile] = useState(false)
  const [isFullTab] = useState(() => {
    if (typeof window !== "undefined") {
      return window.location.search.includes("full=true") || window.innerWidth > 900
    }
    return false
  })

  // Pro state
  const [isPro, setIsPro] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showLicenseModal, setShowLicenseModal] = useState(false)

  // Check Pro status on mount
  useEffect(() => {
    isProUser().then(setIsPro)
  }, [])

  // Get current background
  const currentBackground = 
    backgroundType === "gradient" ? selectedGradient.css : 
    backgroundType === "mesh" ? `mesh:${selectedMesh.id}` : 
    selectedColor.hex

  // Process image when settings change (with debounce)
  useEffect(() => {
    if (!originalImage) return

    const timeoutId = setTimeout(async () => {
      setIsProcessing(true)
      try {
        const result = await beautifyImage(originalImage, {
          padding,
          borderRadius,
          shadow: selectedShadow.value,
          background: currentBackground,
          showWatermark: !isPro,
          mockupType: selectedMockup.id as "browser" | "macbook" | "iphone" | "android" | "macos-sequoia" | "win11" | "none",
          tilt,
          annotations
        })
        setBeautifiedImage(result as string)
      } catch (error) {
        console.error("Failed to process image:", error)
      }
      setIsProcessing(false)
    }, 150)

    return () => clearTimeout(timeoutId)
  }, [
    originalImage,
    padding,
    borderRadius,
    selectedShadow,
    currentBackground,
    isPro,
    selectedMockup,
    tilt,
    annotations
  ])

  // Action Handlers
  const handleCapture = useCallback(async () => {
    setIsProcessing(true)
    const image = await captureTab()
    if (image) {
      setOriginalImage(image)
    }
    setIsProcessing(false)
  }, [])

  const handlePaste = useCallback(async () => {
    const image = await readFromClipboard()
    if (image) setOriginalImage(image)
  }, [])

  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      readFromFile(file).then(setOriginalImage)
    }
  }, [])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      readFromFile(file).then(setOriginalImage)
    }
  }, [])

  const handleProFeature = useCallback(
    (callback: () => void) => {
      if (isPro) callback()
      else setShowUpgradeModal(true)
    },
    [isPro]
  )

  const handleOpenFullEditor = useCallback(() => {
    if (typeof chrome !== "undefined" && chrome.tabs) {
      chrome.tabs.create({ url: chrome.runtime.getURL("popup.html?full=true") })
    } else {
      window.open(window.location.href + "?full=true", "_blank")
    }
  }, [])

  const handleApplyPreset = useCallback((preset: Preset) => {
    setBackgroundType(preset.settings.backgroundType)
    if (preset.settings.backgroundType === "mesh") {
      const mesh = meshGradients.find(m => m.id === preset.settings.backgroundId)
      if (mesh) setSelectedMesh(mesh)
    } else if (preset.settings.backgroundType === "gradient") {
      const grad = gradients.find(g => g.id === preset.settings.backgroundId)
      if (grad) setSelectedGradient(grad)
    } else {
      const color = solidColors.find(c => c.id === preset.settings.backgroundId)
      if (color) setSelectedColor(color)
    }
    
    setPadding(preset.settings.padding)
    setBorderRadius(preset.settings.borderRadius)
    const m = mockups.find(mock => mock.id === preset.settings.mockupId)
    if (m) setSelectedMockup(m)
    setTilt(preset.settings.tilt)
  }, [])

  const handleCopy = useCallback(async () => {
    if (originalImage) {
      const settings = {
        padding,
        borderRadius,
        shadow: selectedShadow.value,
        background: currentBackground,
        showWatermark: !isPro,
        mockupType: selectedMockup.id as "browser" | "macbook" | "iphone" | "android" | "macos-sequoia" | "win11" | "none",
        format: exportFormat,
        tilt,
        annotations,
        quality: 0.95
      }

      const result = await (exportFormat !== "png" && isPro
        ? (beautifyImage(originalImage, settings, "blob") as Promise<Blob>)
        : (beautifyImage(originalImage, settings, "dataUrl") as Promise<string>))

      await copyToClipboard(result)
    }
  }, [
    originalImage,
    padding,
    borderRadius,
    selectedShadow,
    currentBackground,
    isPro,
    selectedMockup,
    exportFormat,
    tilt,
    annotations
  ])

  const handleDownload = useCallback(async () => {
    if (!originalImage) return
    const ext = exportFormat === "jpg" ? "jpg" : exportFormat === "webp" ? "webp" : "png"

    const settings = {
      padding,
      borderRadius,
      shadow: selectedShadow.value,
      background: currentBackground,
      showWatermark: !isPro,
      mockupType: selectedMockup.id as "browser" | "macbook" | "iphone" | "android" | "macos-sequoia" | "win11" | "none",
      format: exportFormat,
      tilt,
      annotations,
      quality: 0.95
    }

    const result = await (exportFormat !== "png" && isPro
      ? (beautifyImage(originalImage, settings, "blob") as Promise<Blob>)
      : (beautifyImage(originalImage, settings, "dataUrl") as Promise<string>))

    await downloadImage(result, `screenshot-${Date.now()}.${ext}`)
  }, [
    originalImage,
    padding,
    borderRadius,
    selectedShadow,
    currentBackground,
    isPro,
    selectedMockup,
    exportFormat,
    tilt,
    annotations
  ])

  // Keyboard Shortcuts (Zen UX Enhancement)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in an input
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return

      if (e.ctrlKey && e.key === "v") handlePaste()
      if (e.ctrlKey && e.key === "c") handleCopy()
      if (e.ctrlKey && e.key === "s") handleDownload()
      if (e.key === "Escape") {
        setActiveTool(null)
      }
    }
    window.addEventListener("keydown", handleKeyDown)
    return () => window.removeEventListener("keydown", handleKeyDown)
  }, [handlePaste, handleCopy, handleDownload])

  return (
    <div className={`flex flex-col bg-[#050505] text-white selection:bg-purple-500/30 overflow-hidden relative font-sans transition-all duration-500 ${isFullTab ? "w-screen h-screen" : "w-[800px] h-[600px] shadow-2xl rounded-2xl border border-white/10"}`} style={!isFullTab ? { minWidth: '800px', minHeight: '600px' } : {}}>
      {/* Premium Zen Background: Refined Depth Glows */}
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(168,85,247,0.02)_0%,transparent_100%)] pointer-events-none" />
      <div className="absolute top-0 left-1/4 w-[500px] h-[500px] bg-purple-600/5 blur-[120px] rounded-full pointer-events-none animate-pulse" />
      <div className="absolute bottom-0 right-1/4 w-[500px] h-[500px] bg-blue-600/5 blur-[120px] rounded-full pointer-events-none" />
      <Header 
        isPro={isPro} 
        onUpgrade={() => setShowUpgradeModal(true)} 
        onLicenseClick={() => setShowLicenseModal(true)}
        onOpenFullEditor={handleOpenFullEditor}
        isFullTab={isFullTab}
      />

      <main 
        className="flex-1 flex flex-col relative"
        onDragEnter={() => setIsDraggingFile(true)}
        onDragLeave={() => setIsDraggingFile(false)}
        onDrop={(e) => {
          setIsDraggingFile(false)
          handleDrop(e)
        }}
      >
        <PreviewArea
          beautifiedImage={beautifiedImage}
          isProcessing={isProcessing}
          onCapture={handleCapture}
          onPaste={handlePaste}
          onFileSelect={handleFileSelect}
          onDrop={handleDrop}
          tilt={tilt}
          annotations={annotations}
          setAnnotations={setAnnotations}
          activeTool={activeTool}
          isDraggingFile={isDraggingFile}
          isFullTab={isFullTab}
        />

        {originalImage && (
          <>
            <FloatingToolbar
              backgroundType={backgroundType}
              setBackgroundType={setBackgroundType}
              selectedGradient={selectedGradient}
              setSelectedGradient={setSelectedGradient}
              selectedColor={selectedColor}
              setSelectedColor={setSelectedColor}
              selectedMesh={selectedMesh}
              setSelectedMesh={setSelectedMesh}
              selectedShadow={selectedShadow}
              setSelectedShadow={setSelectedShadow}
              padding={padding}
              setPadding={setPadding}
              borderRadius={borderRadius}
              setBorderRadius={setBorderRadius}
              selectedMockup={selectedMockup}
              setSelectedMockup={setSelectedMockup}
              exportFormat={exportFormat}
              setExportFormat={setExportFormat}
              tilt={tilt}
              setTilt={setTilt}
              activeTool={activeTool}
              setActiveTool={setActiveTool}
              isPro={isPro}
              handleProFeature={handleProFeature}
              onClearAnnotations={() => setAnnotations([])}
              onUndoAnnotation={() => setAnnotations(a => a.slice(0, -1))}
              hasAnnotations={annotations.length > 0}
              isFullTab={isFullTab}
            />

            <MagicBar
              onApplyPreset={handleApplyPreset}
              onCopy={handleCopy}
              onDownload={handleDownload}
              isProcessing={isProcessing}
              isPro={isPro}
              isFullTab={isFullTab}
            />
          </>
        )}
      </main>

      <Modals
        showUpgradeModal={showUpgradeModal}
        setShowUpgradeModal={setShowUpgradeModal}
        showLicenseModal={showLicenseModal}
        setShowLicenseModal={setShowLicenseModal}
        setIsPro={setIsPro}
      />
    </div>
  )
}

export default IndexPopup
