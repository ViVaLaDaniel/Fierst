import { FC } from "react"

interface HeaderProps {
  isPro: boolean
  onUpgrade: () => void
  onLicenseClick: () => void
  onOpenFullEditor: () => void
  isFullTab: boolean
}

export const Header: FC<HeaderProps> = ({ isPro, onUpgrade, onLicenseClick, onOpenFullEditor, isFullTab }) => {
  return (
    <div className="flex items-center justify-between px-8 py-4 bg-black/20 backdrop-blur-lg border-b border-white/5 z-50">
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/20">
          <span className="text-lg">✨</span>
        </div>
        <h1 className="text-lg font-black tracking-tighter text-white">
          SCREENSHOT <span className="text-purple-500">BEAUTIFIER</span>
          <span className="ml-2 text-[8px] opacity-30 font-bold align-top">V3.0 ZEN</span>
        </h1>
        {isPro && (
          <span className="px-2 py-0.5 bg-gradient-to-r from-amber-400 to-orange-500 rounded-md text-[9px] font-black text-black">
            PRO
          </span>
        )}
      </div>
      <div className="flex items-center gap-4">
        {!isPro ? (
          <button
            onClick={onUpgrade}
            className="px-4 py-1.5 bg-white/5 hover:bg-white/10 border border-white/10 rounded-full text-[10px] font-black uppercase tracking-widest transition-all"
          >
            Unlock Pro
          </button>
        ) : (
          <span className="text-[10px] font-black text-gray-500 uppercase tracking-widest">Premium Member</span>
        )}
        {!isFullTab && (
          <button
            onClick={onOpenFullEditor}
            className="px-3 py-1.5 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-full text-[10px] font-black uppercase tracking-widest text-purple-400 transition-all flex items-center gap-2"
          >
            <span>🚀</span> FULL EDITOR
          </button>
        )}
        <button
          onClick={onLicenseClick}
          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-white/5 transition-all grayscale opacity-50 hover:grayscale-0 hover:opacity-100"
          title="Account / License"
        >
          👤
        </button>
      </div>
    </div>
  )
}
