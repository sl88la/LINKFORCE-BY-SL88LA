import React, { useRef, useState } from 'react';
import { UserProfile, DEFAULT_THEMES } from '../types';
import { X, Copy, Check, ExternalLink, QrCode, Zap, Download, Loader2, Palette, RefreshCcw, Image as ImageIcon, Sun, Moon } from 'lucide-react';
import { toPng } from 'html-to-image';

interface ShareModalProps {
  profile: UserProfile;
  isOpen: boolean;
  onClose: () => void;
  onChange: (profile: UserProfile) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ profile, isOpen, onClose, onChange }) => {
  const [copied, setCopied] = useState(false);
  const [isDownloading, setIsDownloading] = useState(false);
  const cardRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  if (!isOpen) return null;

  const shareUrl = `https://linkforce.app/${profile.name.replace(/\s+/g, '').toLowerCase()}`;

  const handleCopy = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleDownload = async () => {
      if (cardRef.current) {
          setIsDownloading(true);
          try {
              // Wait a bit to ensure fonts/images are ready
              const dataUrl = await toPng(cardRef.current, { 
                  cacheBust: true, 
                  pixelRatio: 3,
                  style: { transform: 'none' } // Reset transforms for clean capture
              });
              const link = document.createElement('a');
              link.download = `${profile.name.replace(/\s+/g, '-')}-card.png`;
              link.href = dataUrl;
              link.click();
          } catch (err) {
              console.error('Failed to download image', err);
              alert("Could not download the card. Please try again.");
          } finally {
              setIsDownloading(false);
          }
      }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ 
          ...profile, 
          cardBackgroundImage: reader.result as string,
          cardBackgroundType: 'image',
          cardTextColor: 'white' // Default to white for new images, user can toggle
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileUpload = () => {
    fileInputRef.current?.click();
  };

  // Helper: Calculate contrast for solid colors
  const getContrastYIQ = (hexcolor: string) => {
    hexcolor = hexcolor.replace("#", "");
    var r = parseInt(hexcolor.substr(0,2),16);
    var g = parseInt(hexcolor.substr(2,2),16);
    var b = parseInt(hexcolor.substr(4,2),16);
    var yiq = ((r*299)+(g*587)+(b*114))/1000;
    return (yiq >= 128) ? 'black' : 'white';
  };

  // --- Background Logic for Card ---
  let containerStyle = {};
  let containerClass = '';

  // 1. If "Match Profile", use profile logic
  if (profile.cardBackgroundType === 'match' || !profile.cardBackgroundType) {
    const presetTheme = DEFAULT_THEMES.find(t => t.id === profile.themeId) || DEFAULT_THEMES[0];
    if (profile.backgroundType === 'preset') {
      containerClass = presetTheme.bgClass;
    } else if (profile.backgroundType === 'color') {
      containerStyle = { backgroundColor: profile.customBackgroundColor };
    } else if (profile.backgroundType === 'image') {
      containerStyle = { 
         backgroundImage: `url(${profile.customBackgroundImage})`,
         backgroundSize: 'cover',
         backgroundPosition: 'center'
      };
    }
  } 
  // 2. Custom Color for Card
  else if (profile.cardBackgroundType === 'color') {
     containerStyle = { backgroundColor: profile.cardBackgroundColor };
  }
  // 3. Custom Image for Card
  else if (profile.cardBackgroundType === 'image') {
     containerStyle = { 
         backgroundImage: `url(${profile.cardBackgroundImage})`,
         backgroundSize: 'cover',
         backgroundPosition: 'center'
     };
  }

  // --- Liquid Glass & Text Theme Logic ---
  const textColorMode = profile.cardTextColor || 'white';
  const isDarkText = textColorMode === 'black';

  // "Liquid Glass" = High Blur + Semi-Opaque Background to mimic thickness
  // "Little Transparency" (قليل الشفافية) -> higher opacity values (0.6 - 0.7)
  const liquidGlassClass = isDarkText 
    ? 'bg-white/60 border-white/50 shadow-[0_8px_32px_0_rgba(255,255,255,0.2)]' 
    : 'bg-black/50 border-white/10 shadow-[0_8px_32px_0_rgba(0,0,0,0.5)]';

  const textClass = isDarkText ? 'text-slate-900' : 'text-white';
  const subTextClass = isDarkText ? 'text-slate-800' : 'text-white/90';
  
  // Quick Colors
  const quickColors = [
    '#000000', 
    '#ffffff', 
    '#3b82f6', 
    '#8b5cf6', 
    '#ec4899', 
    '#10b981',
    '#f59e0b',
    '#ef4444',
    '#6366f1'
  ];

  return (
    <div className="fixed inset-0 z-[100] flex flex-col items-center justify-center p-4">
      {/* Hidden File Input */}
      <input 
        type="file" 
        ref={fileInputRef} 
        onChange={handleImageUpload} 
        accept="image/*" 
        className="hidden" 
      />

      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-black/95 backdrop-blur-lg transition-opacity animate-fade-in" 
        onClick={onClose}
      ></div>
      
      <div className="relative z-10 w-full max-w-[340px] flex flex-col gap-5 h-[90vh] md:h-auto justify-center">
         
         {/* --- FUTURISTIC ID CARD --- */}
         {/* Aspect Ratio 9/16 is ideal for mobile stories */}
         <div 
            ref={cardRef}
            className={`
                relative overflow-hidden rounded-[2rem] shadow-2xl
                transition-all duration-500 aspect-[9/16] shrink-0
                ${containerClass} ring-1 ring-white/10
                animate-zoom-in origin-center
            `}
            style={containerStyle}
         >
            {/* Base Overlay for consistency */}
            <div className="absolute inset-0 bg-black/10 pointer-events-none z-0"></div>

            {/* --- LIQUID GLASS LAYER --- */}
            {/* Reduced inset (margin) to 3 (0.75rem) to fix sizing issues */}
            <div className={`
                absolute inset-3 rounded-[1.5rem] z-10 
                backdrop-blur-[24px] backdrop-saturate-[180%]
                border ${liquidGlassClass}
                flex flex-col p-5 overflow-hidden
            `}>
                
                {/* Header */}
                <div className="flex justify-between items-center mb-6 shrink-0">
                    <div className={`px-2.5 py-1 rounded-full flex items-center gap-2 border shadow-sm ${isDarkText ? 'bg-white/40 border-slate-900/10' : 'bg-black/30 border-white/10'}`}>
                        <span className="relative flex h-1.5 w-1.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
                          <span className="relative inline-flex rounded-full h-1.5 w-1.5 bg-green-500"></span>
                        </span>
                        <span className={`text-[8px] font-black tracking-[0.2em] uppercase ${textClass}`}>LINKFORCE</span>
                    </div>
                    <Zap size={18} className={textClass} fill="currentColor" />
                </div>

                {/* Identity Section (Centered) */}
                <div className="flex flex-col items-center justify-center flex-1 text-center relative -top-4">
                    
                    {/* Avatar with Ring */}
                    <div className="relative mb-5 group">
                         {/* Dynamic Glow behind avatar based on theme */}
                         <div className={`absolute inset-0 rounded-full blur-xl opacity-60 transition duration-700 ${isDarkText ? 'bg-slate-400/60' : 'bg-white/40'}`}></div>
                         
                         <div className={`w-28 h-28 rounded-full p-1 bg-gradient-to-b relative z-10 shadow-xl ${isDarkText ? 'from-slate-200 to-slate-50' : 'from-white/80 to-white/10'}`}>
                            <div className="w-full h-full rounded-full overflow-hidden border-[3px] border-transparent bg-slate-900">
                                <img src={profile.avatarUrl} className="w-full h-full object-cover" alt="Profile" />
                            </div>
                         </div>
                         <div className="absolute bottom-1 right-1 bg-blue-600 p-1.5 rounded-full border-[3px] border-white text-white shadow-lg z-20">
                             <Check size={12} strokeWidth={4} />
                         </div>
                    </div>

                    {/* Name & Handle */}
                    <h2 className={`text-2xl font-black tracking-tight mb-1 leading-tight ${textClass} drop-shadow-sm`}>
                        {profile.name}
                    </h2>
                    <p className={`text-[10px] font-bold tracking-[0.1em] uppercase px-2.5 py-0.5 rounded-md border mb-3 inline-block ${isDarkText ? 'bg-slate-900/10 border-slate-900/10 text-slate-700' : 'bg-white/10 border-white/10 text-white/80'}`}>
                        @{profile.name.replace(/\s+/g, '').toLowerCase()}
                    </p>
                    
                    <p className={`text-xs font-bold leading-relaxed max-w-[90%] ${subTextClass}`}>
                        {profile.bio || "Digital Creator"}
                    </p>
                </div>

                {/* Footer Section */}
                <div className="mt-auto shrink-0">
                    <div className={`rounded-xl p-3 flex flex-col gap-2.5 ${isDarkText ? 'bg-white/40 border-white/50' : 'bg-black/30 border-white/10'} border backdrop-blur-md`}>
                        
                        {/* URL Box */}
                        <div className="flex items-center gap-2.5">
                             <div className={`p-2 rounded-lg shadow-sm shrink-0 ${isDarkText ? 'bg-slate-900 text-white' : 'bg-white text-black'}`}>
                                 <QrCode size={20} />
                             </div>
                             <div className="flex-1 min-w-0">
                                 <button 
                                    onClick={handleCopy}
                                    className={`w-full flex items-center justify-between gap-2 font-mono text-[9px] font-bold p-2 rounded-lg border transition group ${isDarkText ? 'bg-white/60 hover:bg-white border-slate-200 text-slate-800' : 'bg-white/5 hover:bg-white/10 border-white/10 text-white'}`}
                                 >
                                     <span className="truncate">{shareUrl}</span>
                                     {copied ? <Check size={12} className="text-green-500" /> : <Copy size={12} className={isDarkText ? 'text-slate-400' : 'text-white/50'} />}
                                 </button>
                             </div>
                        </div>
                    </div>
                </div>

            </div>
         </div>

         {/* --- CONTROLS SECTION --- */}
         <div className="animate-fade-in space-y-3 w-full" style={{ animationDelay: '200ms', animationFillMode: 'both' }}>
             
             {/* Main Controls Row */}
             <div className="flex flex-col gap-3 bg-black/60 backdrop-blur-xl p-3 rounded-2xl border border-white/10">
                 
                 <div className="flex items-center justify-between gap-2">
                    <div className="flex items-center gap-2">
                        {/* Match Profile Button */}
                        <button 
                            onClick={() => onChange({ ...profile, cardBackgroundType: 'match', cardTextColor: 'white' })}
                            title="Match Profile"
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${profile.cardBackgroundType === 'match' ? 'bg-white text-black shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                            <RefreshCcw size={18} />
                        </button>

                        {/* Upload Image Button */}
                        <button 
                            onClick={triggerFileUpload}
                            title="Upload Background"
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${profile.cardBackgroundType === 'image' ? 'bg-indigo-600 text-white shadow-lg' : 'bg-white/10 text-white hover:bg-white/20'}`}
                        >
                            <ImageIcon size={18} />
                        </button>

                         {/* Text/Theme Toggle (Sun/Moon) */}
                        <button 
                            onClick={() => onChange({ ...profile, cardTextColor: isDarkText ? 'white' : 'black' })}
                            title="Toggle Text Color"
                            className={`w-10 h-10 rounded-xl flex items-center justify-center transition ${isDarkText ? 'bg-amber-400 text-black shadow-lg shadow-amber-400/20' : 'bg-slate-700 text-white'}`}
                        >
                            {isDarkText ? <Sun size={18} fill="currentColor" /> : <Moon size={18} fill="currentColor" />}
                        </button>
                    </div>

                    {/* Action Buttons (Mini) */}
                    <div className="flex items-center gap-2">
                         <button 
                            onClick={onClose}
                            className="w-10 h-10 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-white flex items-center justify-center"
                        >
                            <X size={18} />
                        </button>
                        <button 
                            onClick={handleDownload}
                            disabled={isDownloading}
                            className="px-4 h-10 rounded-xl bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/50 text-white font-bold flex items-center gap-2 shadow-lg shadow-indigo-600/30 text-xs"
                        >
                            {isDownloading ? <Loader2 size={16} className="animate-spin" /> : <Download size={16} />}
                            SAVE
                        </button>
                    </div>
                 </div>
                 
                 {/* Full Color Swatches - Scrollable */}
                 <div className="flex gap-2 overflow-x-auto pb-1 no-scrollbar">
                    {quickColors.map(color => (
                        <button
                            key={color}
                            onClick={() => {
                                const newTextColor = getContrastYIQ(color);
                                onChange({ 
                                    ...profile, 
                                    cardBackgroundType: 'color', 
                                    cardBackgroundColor: color,
                                    cardTextColor: newTextColor
                                });
                            }}
                            className={`w-8 h-8 rounded-full border border-white/10 transition shrink-0 hover:scale-110 ${profile.cardBackgroundType === 'color' && profile.cardBackgroundColor === color ? 'ring-2 ring-white scale-110' : ''}`}
                            style={{ backgroundColor: color }}
                        />
                    ))}
                 </div>
             </div>
         </div>

      </div>
    </div>
  );
};