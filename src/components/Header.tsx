import { FC } from "react"

interface HeaderProps {
  isPro: boolean
  onShowLicenseModal: () => void
}

export const Header: FC<HeaderProps> = ({ isPro, onShowLicenseModal }) => {
  return (
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
            onClick={onShowLicenseModal}
            className="text-xs text-purple-400 hover:text-purple-300 transition"
          >
            Have a license?
          </button>
        )}
        <span className="text-xs text-gray-500">v1.0</span>
      </div>
    </div>
  )
}
