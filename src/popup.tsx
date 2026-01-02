import { useState, useCallback, useEffect, useRef } from "react"
import "./style.css"
import { gradients, solidColors, shadows } from "./lib/backgrounds"
import { beautifyImage, copyToClipboard, downloadImage, readFromClipboard, readFromFile, exportImage, exportFormats, ExportFormat } from "./lib/canvas"
import { mockups } from "./lib/mockups"
import { isProUser, activateLicense, deactivateLicense } from "./lib/license"
import { captureTab } from "./lib/capture"

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
  
  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null)
  
  // Check Pro status on mount
  useEffect(() => {
    isProUser().then(setIsPro)
  }, [])
  
  // Get current background
  const currentBackground = backgroundType === "gradient" 
    ? selectedGradient.css 
    : selectedColor.hex
  
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
          mockupType: selectedMockup.id as any
        })
        setBeautifiedImage(result as string)
      } catch (error) {
        console.error("Failed to process image:", error)
      }
      setIsProcessing(false)
    }, 150)
    
    return () => clearTimeout(timeoutId)
  }, [originalImage, padding, borderRadius, selectedShadow, currentBackground, isPro, selectedMockup])
  
  // Handle capture
  const handleCapture = useCallback(async () => {
    setIsProcessing(true)
    const image = await captureTab()
    if (image) {
      setOriginalImage(image)
    } else {
      alert("Failed to capture tab. Make sure the extension has permission and you are on a compatible page.")
    }
    setIsProcessing(false)
  }, [])

  // Handle paste from clipboard
  const handlePaste = useCallback(async () => {
    const image = await readFromClipboard()
    if (image) {
      setOriginalImage(image)
    }
  }, [])
  
  // Handle file select
  const handleFileSelect = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file && file.type.startsWith("image/")) {
      readFromFile(file).then(setOriginalImage)
    }
  }, [])
  
  // Handle drag and drop
  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    const file = e.dataTransfer.files[0]
    if (file && file.type.startsWith("image/")) {
      readFromFile(file).then(setOriginalImage)
    }
  }, [])
  
  // Handle pro feature click
  const handleProFeature = useCallback((callback: () => void) => {
    if (isPro) {
      callback()
    } else {
      setShowUpgradeModal(true)
    }
  }, [isPro])
  
  // Export functions
  const handleCopy = useCallback(async () => {
    if (originalImage) {
      const isCustomFormat = exportFormat !== "png" && isPro
      const returnType = isCustomFormat ? "blob" : "dataUrl"
      const finalSource = await beautifyImage(originalImage, {
        padding,
        borderRadius,
        shadow: selectedShadow.value,
        background: currentBackground,
        showWatermark: !isPro,
        mockupType: selectedMockup.id as any,
        format: exportFormat,
        quality: 0.95
      }, returnType as any)
      
      await copyToClipboard(finalSource as any)
    }
  }, [originalImage, padding, borderRadius, selectedShadow, currentBackground, isPro, selectedMockup, exportFormat])
  
  const handleDownload = useCallback(async () => {
    if (originalImage) {
      const ext = exportFormat === "jpg" ? "jpg" : exportFormat === "webp" ? "webp" : "png"
      
      // Use specific returnType to help TypeScript overloads
      if (exportFormat !== "png" && isPro) {
        const blob = await beautifyImage(originalImage, {
          padding,
          borderRadius,
          shadow: selectedShadow.value,
          background: currentBackground,
          showWatermark: !isPro,
          mockupType: selectedMockup.id as any,
          format: exportFormat,
          quality: 0.95
        }, "blob")
        await downloadImage(blob, `screenshot-beautified.${ext}`)
      } else {
        const dataUrl = await beautifyImage(originalImage, {
          padding,
          borderRadius,
          shadow: selectedShadow.value,
          background: currentBackground,
          showWatermark: !isPro,
          mockupType: selectedMockup.id as any,
          format: exportFormat,
          quality: 0.95
        }, "dataUrl")
        await downloadImage(dataUrl, `screenshot-beautified.${ext}`)
      }
    }
  }, [originalImage, padding, borderRadius, selectedShadow, currentBackground, isPro, selectedMockup, exportFormat])
  
  // License activation
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
    <div className="w-[640px] min-h-[520px] bg-gray-900 text-white p-4">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h1 className="text-xl font-bold bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
            ✨ Screenshot Beautifier
          </h1>
          {isPro && (
            <span className="px-2 py-0.5 bg-gradient-to-r from-amber-500 to-orange-500 rounded text-xs font-bold">
              PRO
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {!isPro && (
            <button
              onClick={() => setShowLicenseModal(true)}
              className="text-xs text-purple-400 hover:text-purple-300 transition"
            >
              Have a license?
            </button>
          )}
          <span className="text-xs text-gray-500">v1.0</span>
        </div>
      </div>
      
      {/* Main content */}
      <div className="flex gap-4">
        {/* Preview area */}
        <div 
          className="flex-1 min-h-[380px] rounded-xl border-2 border-dashed border-gray-700 flex items-center justify-center overflow-hidden bg-gray-800/50 relative"
          onDrop={handleDrop}
          onDragOver={(e) => e.preventDefault()}
        >
          {beautifiedImage ? (
            <img 
              src={beautifiedImage} 
              alt="Preview" 
              className="max-w-full max-h-[380px] object-contain"
            />
          ) : (
            <div className="text-center p-8">
              <div className="text-4xl mb-3">📸</div>
              <p className="text-gray-400 mb-2">Drop image here or</p>
              <div className="flex flex-col gap-2 justify-center">
                <button 
                  onClick={handleCapture}
                  className="px-6 py-3 bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600 rounded-xl text-sm font-bold shadow-lg shadow-purple-500/20 transition flex items-center justify-center gap-2"
                >
                  📸 Capture Current Tab
                </button>
                <div className="flex gap-2 justify-center">
                  <button 
                    onClick={handlePaste}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium transition"
                  >
                    📋 Paste
                  </button>
                  <button 
                    onClick={() => fileInputRef.current?.click()}
                    className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-xs font-medium transition"
                  >
                    📁 Browse
                  </button>
                </div>
              </div>
              <input 
                ref={fileInputRef}
                type="file" 
                accept="image/*" 
                onChange={handleFileSelect}
                className="hidden"
              />
            </div>
          )}
          
          {isProcessing && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <div className="animate-spin text-2xl">⚡</div>
            </div>
          )}
        </div>
        
        {/* Controls */}
        <div className="w-[200px] space-y-3 overflow-y-auto max-h-[450px] pr-1">
          {/* Background type toggle */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Background</label>
            <div className="flex rounded-lg overflow-hidden">
              <button 
                onClick={() => setBackgroundType("gradient")}
                className={`flex-1 py-1.5 text-xs font-medium transition ${
                  backgroundType === "gradient" 
                    ? "bg-purple-600" 
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                Gradient
              </button>
              <button 
                onClick={() => setBackgroundType("solid")}
                className={`flex-1 py-1.5 text-xs font-medium transition ${
                  backgroundType === "solid" 
                    ? "bg-purple-600" 
                    : "bg-gray-700 hover:bg-gray-600"
                }`}
              >
                Solid
              </button>
            </div>
          </div>
          
          {/* Gradient/Color picker */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">
              {backgroundType === "gradient" ? "Gradient" : "Color"}
            </label>
            <div className="grid grid-cols-5 gap-1">
              {backgroundType === "gradient" 
                ? gradients.map(g => (
                    <button
                      key={g.id}
                      onClick={() => g.isPro ? handleProFeature(() => setSelectedGradient(g)) : setSelectedGradient(g)}
                      className={`w-7 h-7 rounded-md transition relative ${
                        selectedGradient.id === g.id ? "ring-2 ring-white ring-offset-1 ring-offset-gray-900" : ""
                      }`}
                      style={{ background: g.css }}
                      title={g.name}
                    >
                      {g.isPro && !isPro && (
                        <span className="absolute -top-1 -right-1 text-[8px]">🔒</span>
                      )}
                    </button>
                  ))
                : solidColors.map(c => (
                    <button
                      key={c.id}
                      onClick={() => c.isPro ? handleProFeature(() => setSelectedColor(c)) : setSelectedColor(c)}
                      className={`w-7 h-7 rounded-md border border-gray-600 transition relative ${
                        selectedColor.id === c.id ? "ring-2 ring-white ring-offset-1 ring-offset-gray-900" : ""
                      }`}
                      style={{ backgroundColor: c.hex }}
                      title={c.name}
                    >
                      {c.isPro && !isPro && (
                        <span className="absolute -top-1 -right-1 text-[8px]">🔒</span>
                      )}
                    </button>
                  ))
              }
            </div>
          </div>
          
          {/* Device Mockups */}
          <div>
            <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              Device Frame
              {!isPro && <span className="text-amber-400 text-[10px]">PRO</span>}
            </label>
            <div className="grid grid-cols-5 gap-1">
              {mockups.map(m => (
                <button
                  key={m.id}
                  onClick={() => m.isPro ? handleProFeature(() => setSelectedMockup(m)) : setSelectedMockup(m)}
                  className={`py-1.5 text-[10px] rounded transition relative ${
                    selectedMockup.id === m.id 
                      ? "bg-purple-600" 
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                  title={m.name}
                >
                  {m.id === "none" ? "✕" : m.id === "browser" ? "🌐" : m.id === "macbook" ? "💻" : m.id === "iphone" ? "📱" : "📲"}
                  {m.isPro && !isPro && (
                    <span className="absolute -top-1 -right-1 text-[8px]">🔒</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Shadow */}
          <div>
            <label className="text-xs text-gray-400 mb-1 block">Shadow</label>
            <div className="grid grid-cols-4 gap-1">
              {shadows.map(s => (
                <button
                  key={s.id}
                  onClick={() => setSelectedShadow(s)}
                  className={`py-1.5 text-xs rounded transition ${
                    selectedShadow.id === s.id 
                      ? "bg-purple-600" 
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {s.name.charAt(0)}
                </button>
              ))}
            </div>
          </div>
          
          {/* Padding */}
          <div>
            <label className="text-xs text-gray-400 mb-1 flex justify-between">
              <span>Padding</span>
              <span>{padding}px</span>
            </label>
            <input 
              type="range" 
              min="16" 
              max="128" 
              value={padding}
              onChange={(e) => setPadding(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
          
          {/* Border Radius */}
          <div>
            <label className="text-xs text-gray-400 mb-1 flex justify-between">
              <span>Corners</span>
              <span>{borderRadius}px</span>
            </label>
            <input 
              type="range" 
              min="0" 
              max="32" 
              value={borderRadius}
              onChange={(e) => setBorderRadius(Number(e.target.value))}
              className="w-full accent-purple-500"
            />
          </div>
          
          {/* Export Format */}
          <div>
            <label className="text-xs text-gray-400 mb-1 flex items-center gap-1">
              Format
              {!isPro && <span className="text-amber-400 text-[10px]">PRO = more</span>}
            </label>
            <div className="grid grid-cols-3 gap-1">
              {exportFormats.map(f => (
                <button
                  key={f.id}
                  onClick={() => f.isPro ? handleProFeature(() => setExportFormat(f.id)) : setExportFormat(f.id)}
                  className={`py-1.5 text-xs rounded transition relative ${
                    exportFormat === f.id 
                      ? "bg-purple-600" 
                      : "bg-gray-700 hover:bg-gray-600"
                  }`}
                >
                  {f.name}
                  {f.isPro && !isPro && (
                    <span className="absolute -top-1 -right-1 text-[8px]">🔒</span>
                  )}
                </button>
              ))}
            </div>
          </div>
          
          {/* Export buttons */}
          {beautifiedImage && (
            <div className="space-y-2 pt-2 border-t border-gray-700">
              <button 
                onClick={handleCopy}
                className="w-full py-2 bg-purple-600 hover:bg-purple-700 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
              >
                📋 Copy
              </button>
              <button 
                onClick={handleDownload}
                className="w-full py-2 bg-green-600 hover:bg-green-700 rounded-lg text-sm font-medium transition flex items-center justify-center gap-2"
              >
                ⬇️ Download
              </button>
              <button 
                onClick={() => {
                  setOriginalImage(null)
                  setBeautifiedImage(null)
                }}
                className="w-full py-2 bg-gray-700 hover:bg-gray-600 rounded-lg text-sm font-medium transition"
              >
                🗑️ Clear
              </button>
            </div>
          )}
          
          {/* Upgrade button for free users */}
          {!isPro && (
            <button
              onClick={() => setShowUpgradeModal(true)}
              className="w-full py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg text-sm font-bold transition"
            >
              ⚡ Upgrade to PRO — $9.99
            </button>
          )}
        </div>
      </div>
      
      {/* Upgrade Modal */}
      {showUpgradeModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-sm mx-4 relative">
            <button
              onClick={() => setShowUpgradeModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">✨</div>
              <h2 className="text-xl font-bold">Upgrade to PRO</h2>
              <p className="text-gray-400 text-sm mt-1">Unlock all premium features</p>
            </div>
            
            <ul className="space-y-2 mb-6 text-sm">
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Device mockups (iPhone, MacBook, etc.)
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                20+ premium gradients & colors
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                Export to JPG, WebP formats
              </li>
              <li className="flex items-center gap-2">
                <span className="text-green-400">✓</span>
                No watermark
              </li>
            </ul>
            
            <a
              href="https://buy.stripe.com/28E4gz1lv1PWblI5GweQM02"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 rounded-lg text-center font-bold transition"
            >
              Get PRO — $9.99 (one-time)
            </a>
            
            <button
              onClick={() => {
                setShowUpgradeModal(false)
                setShowLicenseModal(true)
              }}
              className="w-full mt-2 py-2 text-sm text-gray-400 hover:text-white transition"
            >
              I already paid / Activate Pro
            </button>
          </div>
        </div>
      )}
      
      {/* License Activation Modal */}
      {showLicenseModal && (
        <div className="fixed inset-0 bg-black/70 flex items-center justify-center z-50">
          <div className="bg-gray-800 rounded-2xl p-6 max-w-sm mx-4 relative">
            <button
              onClick={() => setShowLicenseModal(false)}
              className="absolute top-3 right-3 text-gray-400 hover:text-white"
            >
              ✕
            </button>
            
            <h2 className="text-xl font-bold mb-4">Activate Pro</h2>
            <p className="text-gray-400 text-sm mb-4">Enter the email you used for payment in Stripe.</p>
            
            <input
              type="email"
              placeholder="Enter your email"
              value={licenseKey}
              onChange={(e) => setLicenseKey(e.target.value)}
              className="w-full px-4 py-3 bg-gray-700 rounded-lg border border-gray-600 focus:border-purple-500 focus:outline-none mb-3"
            />
            
            {licenseError && (
              <p className="text-red-400 text-sm mb-3">{licenseError}</p>
            )}
            
            <button
              onClick={handleActivateLicense}
              disabled={!licenseKey || isActivating}
              className="w-full py-3 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-600 disabled:cursor-not-allowed rounded-lg font-medium transition"
            >
              {isActivating ? "Verifying..." : "Verify Activation"}
            </button>
            
            {/* Dev test email info */}
            <p className="text-xs text-gray-500 mt-3 text-center">
              Test email: test@example.com
            </p>
          </div>
        </div>
      )}
    </div>
  )
}

export default IndexPopup
