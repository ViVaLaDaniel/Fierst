import { useState, useCallback, useEffect } from "react"
import "./style.css"
import { gradients, solidColors, shadows } from "./lib/backgrounds"
import {
  beautifyImage,
  copyToClipboard,
  downloadImage,
  readFromClipboard,
  readFromFile,
  ExportFormat
} from "./lib/canvas"
import { mockups } from "./lib/mockups"
import { isProUser, activateLicense } from "./lib/license"
import { captureTab } from "./lib/capture"

// Modular Components
import { Header } from "./components/Header"
import { PreviewArea } from "./components/PreviewArea"
import { SidebarControls } from "./components/SidebarControls"
import { UpgradeModal, LicenseModal } from "./components/Modals"

function IndexPopup() {
  // Image state
  const [originalImage, setOriginalImage] = useState<string | null>(null)
  const [beautifiedImage, setBeautifiedImage] = useState<string | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)

  // Settings state
  const [backgroundType, setBackgroundType] = useState<"gradient" | "solid">("gradient")
  const [selectedGradient, setSelectedGradient] = useState(gradients[0])
  const [selectedColor, setSelectedColor] = useState(solidColors[0])
  const [selectedShadow, setSelectedShadow] = useState(shadows[2])
  const [padding, setPadding] = useState(64)
  const [borderRadius, setBorderRadius] = useState(12)
  const [selectedMockup, setSelectedMockup] = useState(mockups[0])
  const [exportFormat, setExportFormat] = useState<ExportFormat>("png")

  // Pro state
  const [isPro, setIsPro] = useState(false)
  const [showUpgradeModal, setShowUpgradeModal] = useState(false)
  const [showLicenseModal, setShowLicenseModal] = useState(false)
  const [licenseKey, setLicenseKey] = useState("")
  const [licenseError, setLicenseError] = useState("")
  const [isActivating, setIsActivating] = useState(false)

  // Check Pro status on mount
  useEffect(() => {
    isProUser().then(setIsPro)
  }, [])

  // Get current background
  const currentBackground = backgroundType === "gradient" ? selectedGradient.css : selectedColor.hex

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
          mockupType: selectedMockup.id as "browser" | "macbook" | "iphone" | "android" | "none"
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
    selectedMockup
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

  const handleCopy = useCallback(async () => {
    if (originalImage) {
      const finalSource = await beautifyImage(
        originalImage,
        {
          padding,
          borderRadius,
          shadow: selectedShadow.value,
          background: currentBackground,
          showWatermark: !isPro,
          mockupType: selectedMockup.id as "browser" | "macbook" | "iphone" | "android" | "none",
          format: exportFormat,
          quality: 0.95
        },
        (exportFormat !== "png" && isPro ? "blob" : "dataUrl") as "blob" | "dataUrl"
      )

      await copyToClipboard(finalSource)
    }
  }, [
    originalImage,
    padding,
    borderRadius,
    selectedShadow,
    currentBackground,
    isPro,
    selectedMockup,
    exportFormat
  ])

  const handleDownload = useCallback(async () => {
    if (!originalImage) return
    const ext = exportFormat === "jpg" ? "jpg" : exportFormat === "webp" ? "webp" : "png"
    const returnType = exportFormat !== "png" && isPro ? "blob" : "dataUrl"

    const result = await beautifyImage(
      originalImage,
      {
        padding,
        borderRadius,
        shadow: selectedShadow.value,
        background: currentBackground,
        showWatermark: !isPro,
        mockupType: selectedMockup.id as "browser" | "macbook" | "iphone" | "android" | "none",
        format: exportFormat,
        quality: 0.95
      },
      returnType as "blob" | "dataUrl"
    )

    await downloadImage(result, `screenshot-${Date.now()}.${ext}`)
  }, [
    originalImage,
    padding,
    borderRadius,
    selectedShadow,
    currentBackground,
    isPro,
    selectedMockup,
    exportFormat
  ])

  const handleActivateLicense = async () => {
    setLicenseError("")
    setIsActivating(true)
    const result = await activateLicense(licenseKey)
    if (result.success) {
      setIsPro(true)
      setShowLicenseModal(false)
      setLicenseKey("")
    } else {
      setLicenseError(result.error || "Activation failed")
    }
    setIsActivating(false)
  }

  return (
    <div className="w-[680px] min-h-[540px] bg-[#0c0c0c] text-white p-6 font-sans selection:bg-purple-500/30">
      <Header isPro={isPro} onShowLicenseModal={() => setShowLicenseModal(true)} />

      <div className="flex gap-6 mt-2">
        <PreviewArea
          beautifiedImage={beautifiedImage}
          isProcessing={isProcessing}
          onCapture={handleCapture}
          onPaste={handlePaste}
          onFileSelect={handleFileSelect}
          onDrop={handleDrop}
        />

        <SidebarControls
          backgroundType={backgroundType}
          setBackgroundType={setBackgroundType}
          selectedGradient={selectedGradient}
          setSelectedGradient={setSelectedGradient}
          selectedColor={selectedColor}
          setSelectedColor={setSelectedColor}
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
          isPro={isPro}
          handleProFeature={handleProFeature}
          onCopy={handleCopy}
          onDownload={handleDownload}
          onClear={() => {
            setOriginalImage(null)
            setBeautifiedImage(null)
          }}
          showExportButtons={!!beautifiedImage}
          onUpgrade={() => setShowUpgradeModal(true)}
        />
      </div>

      <UpgradeModal
        show={showUpgradeModal}
        onClose={() => setShowUpgradeModal(false)}
        onActivate={() => {
          setShowUpgradeModal(false)
          setShowLicenseModal(true)
        }}
      />

      <LicenseModal
        show={showLicenseModal}
        onClose={() => setShowLicenseModal(false)}
        licenseKey={licenseKey}
        setLicenseKey={setLicenseKey}
        onActivate={handleActivateLicense}
        isActivating={isActivating}
        error={licenseError}
      />
    </div>
  )
}

export default IndexPopup
