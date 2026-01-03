import { FC } from "react"
import { motion, AnimatePresence } from "framer-motion"

interface UpgradeModalProps {
  show: boolean
  onClose: () => void
  onActivate: () => void
}

export const UpgradeModal: FC<UpgradeModalProps> = ({ show, onClose, onActivate }) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-sm w-full relative overflow-hidden"
          >
            {/* Background decoration */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-purple-600/20 blur-[100px] rounded-full" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-amber-600/10 blur-[100px] rounded-full" />

            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-800/50 hover:bg-gray-700/50 rounded-full text-gray-400 hover:text-white transition-all z-10"
            >
              ✕
            </button>

            <div className="text-center mb-8 relative">
              <div className="text-6xl mb-4 drop-shadow-2xl">✨</div>
              <h2 className="text-2xl font-black bg-gradient-to-br from-white to-gray-400 bg-clip-text text-transparent">
                Upgrade to PRO
              </h2>
              <p className="text-gray-500 text-sm mt-2">Unlock the full creative power</p>
            </div>

            <ul className="space-y-4 mb-8 text-sm">
              {[
                { icon: "🎨", text: "Device mockups (iPhone, MacBook, etc.)" },
                { icon: "🌈", text: "20+ premium gradients & colors" },
                { icon: "🖼️", text: "Export to JPG, WebP formats" },
                { icon: "🚀", text: "No watermark & faster processing" }
              ].map((item, i) => (
                <li key={i} className="flex items-center gap-3 text-gray-300">
                  <span className="w-8 h-8 flex items-center justify-center bg-gray-800/50 rounded-lg text-lg">
                    {item.icon}
                  </span>
                  {item.text}
                </li>
              ))}
            </ul>

            <a
              href="https://buy.stripe.com/28E4gz1lv1PWblI5GweQM02"
              target="_blank"
              rel="noopener noreferrer"
              className="block w-full py-4 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-2xl text-center font-black transition-all shadow-xl shadow-amber-900/20 active:scale-[0.98] mb-4"
            >
              Get PRO — $9.99 (one-time)
            </a>

            <button
              onClick={onActivate}
              className="w-full py-2 text-xs font-bold text-gray-500 hover:text-purple-400 transition-all"
            >
              I already paid / Activate Pro
            </button>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}

interface LicenseModalProps {
  show: boolean
  onClose: () => void
  licenseKey: string
  setLicenseKey: (k: string) => void
  onActivate: () => void
  isActivating: boolean
  error: string
}

export const LicenseModal: FC<LicenseModalProps> = ({
  show,
  onClose,
  licenseKey,
  setLicenseKey,
  onActivate,
  isActivating,
  error
}) => {
  return (
    <AnimatePresence>
      {show && (
        <div className="fixed inset-0 bg-black/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="bg-gray-900 border border-gray-800 rounded-3xl p-8 max-w-sm w-full relative"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 w-8 h-8 flex items-center justify-center bg-gray-800/50 hover:bg-gray-700/50 rounded-full text-gray-400 hover:text-white transition-all"
            >
              ✕
            </button>

            <h2 className="text-xl font-black mb-2">Activate Pro</h2>
            <p className="text-gray-500 text-sm mb-6">
              Enter the email you used for payment in Stripe.
            </p>

            <div className="relative mb-6">
              <input
                type="email"
                placeholder="Enter your email"
                value={licenseKey}
                onChange={(e) => setLicenseKey(e.target.value)}
                className="w-full px-5 py-4 bg-gray-800/50 rounded-2xl border border-gray-700/50 focus:border-purple-500 focus:outline-none transition-all text-white placeholder:text-gray-600"
              />
              {isActivating && (
                <div className="absolute right-4 top-4">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
                    className="text-purple-500"
                  >
                    ⚡
                  </motion.div>
                </div>
              )}
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-red-400 text-xs font-bold mb-6 flex items-center gap-2"
              >
                <span>⚠️</span> {error}
              </motion.p>
            )}

            <button
              onClick={onActivate}
              disabled={!licenseKey || isActivating}
              className="w-full py-4 bg-purple-600 hover:bg-purple-700 disabled:bg-gray-800 disabled:text-gray-600 text-white rounded-2xl font-black transition-all shadow-xl shadow-purple-900/20 active:scale-[0.98]"
            >
              {isActivating ? "Verifying..." : "Verify Activation"}
            </button>

            <p className="text-[10px] text-gray-600 mt-6 text-center uppercase tracking-widest font-black">
              Standard format: test@example.com
            </p>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  )
}
