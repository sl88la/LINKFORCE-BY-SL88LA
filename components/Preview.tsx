import React from 'react';
import { UserProfile, DEFAULT_THEMES, Theme } from '../types';
import { ExternalLink, Share2, MoreHorizontal, Zap } from 'lucide-react';

interface PreviewProps {
  profile: UserProfile;
}

export const Preview: React.FC<PreviewProps> = ({ profile }) => {
  // Determine styles based on background type
  let bgStyle = {};
  let bgClass = '';
  let textClass = '';
  
  // Base Defaults
  let buttonBaseClass = '';
  let descriptionClass = '';
  
  const presetTheme = DEFAULT_THEMES.find(t => t.id === profile.themeId) || DEFAULT_THEMES[0];

  // 1. Background Logic
  if (profile.backgroundType === 'preset') {
    bgClass = presetTheme.bgClass;
    textClass = presetTheme.textClass;
    descriptionClass = presetTheme.descriptionClass;
  } else {
    // Custom Modes
    if (profile.backgroundType === 'color') {
      bgStyle = { backgroundColor: profile.customBackgroundColor };
    } else if (profile.backgroundType === 'image') {
       bgStyle = { 
         backgroundImage: `url(${profile.customBackgroundImage})`,
         backgroundSize: 'cover',
         backgroundPosition: 'center'
       };
    }
    
    // Custom Text Coloring
    if (profile.customTextColor === 'white') {
       textClass = 'text-white';
       descriptionClass = 'text-white/70';
    } else {
       textClass = 'text-slate-900';
       descriptionClass = 'text-slate-600';
    }
  }

  // 2. Button Shape Logic
  const shapeClass = {
      'pill': 'rounded-full',
      'rounded': 'rounded-xl',
      'sharp': 'rounded-none'
  }[profile.buttonShape || 'pill'];

  // 3. Button Style Logic
  const isDarkText = textClass.includes('slate-900') || textClass.includes('gray-900') || textClass.includes('black');
  
  const styleClasses = {
      'solid': isDarkText 
          ? 'bg-slate-900 text-white border-transparent shadow-md' 
          : 'bg-white text-slate-900 border-transparent shadow-md',
      
      'outline': isDarkText 
          ? 'bg-transparent border-2 border-slate-900 text-slate-900' 
          : 'bg-transparent border-2 border-white text-white',
      
      'soft': isDarkText 
          ? 'bg-slate-200 text-slate-900 border-transparent' 
          : 'bg-white/10 text-white border-transparent backdrop-blur-sm',
      
      'glass': isDarkText
          ? 'bg-slate-900/5 backdrop-blur-md border border-slate-900/10 text-slate-900'
          : 'bg-white/10 backdrop-blur-md border border-white/20 text-white shadow-lg'
  };

  const hoverEffects = isDarkText 
     ? 'hover:bg-slate-800 hover:text-white hover:border-slate-800' 
     : 'hover:bg-white hover:text-slate-900 hover:border-white';

  const baseStyle = styleClasses[profile.buttonStyle || 'glass'] || styleClasses['glass'];
  
  // Combine for final class
  // NOTE: We manually construct hover logic for 'outline' to flip colors properly
  buttonBaseClass = profile.buttonStyle === 'outline' 
     ? `${baseStyle} ${hoverEffects}` 
     : `${baseStyle} hover:brightness-110`;


  // 4. Font Logic
  const fontClass = {
      'inter': 'font-sans',
      'dm-serif': 'font-serif',
      'mono': 'font-mono tracking-tight'
  }[profile.fontFamily || 'inter'];


  return (
    <div className="flex justify-center items-center h-full py-8 sticky top-0 perspective-1000">
      
      {/* PHONE FRAME: Titanium Style */}
      <div className="relative bg-slate-900 rounded-[3.5rem] h-[750px] w-[370px] shadow-[0_0_0_12px_#334155,0_20px_60px_-10px_rgba(0,0,0,0.8)] flex flex-col items-center overflow-hidden ring-1 ring-slate-700 transition-all duration-500">
        
        {/* Dynamic Island / Notch area */}
        <div className="absolute top-0 w-full h-8 z-30 flex justify-center pt-3 pointer-events-none">
            <div className="w-28 h-7 bg-black rounded-full flex items-center justify-center px-4">
                <div className="w-16 h-4 bg-slate-900/80 rounded-full"></div>
            </div>
        </div>
        
        {/* Power Button */}
        <div className="absolute top-40 -right-[16px] w-1 h-20 bg-slate-600 rounded-r-md"></div>
        {/* Volume Buttons */}
        <div className="absolute top-32 -left-[16px] w-1 h-12 bg-slate-600 rounded-l-md"></div>
        <div className="absolute top-48 -left-[16px] w-1 h-12 bg-slate-600 rounded-l-md"></div>

        {/* Screen Content */}
        <div className={`w-full h-full bg-white dark:bg-slate-800 relative ${fontClass} overflow-hidden rounded-[3rem]`}>
          
          {/* Background Layer */}
          <div 
            className={`w-full h-full absolute top-0 left-0 overflow-y-auto no-scrollbar ${bgClass} transition-all duration-700`}
            style={bgStyle}
          >
            {/* Optional Overlay for Image Readability */}
            {profile.backgroundType === 'image' && (
              <div className="absolute inset-0 bg-black/20 pointer-events-none"></div>
            )}
            
            {/* Share Button Mock */}
            <div className="absolute top-6 right-6 z-20 p-2.5 rounded-full bg-black/5 backdrop-blur-md border border-white/10 cursor-pointer hover:scale-110 transition active:scale-95">
               <MoreHorizontal size={20} className={textClass} />
            </div>

            <div className="flex flex-col items-center pt-24 px-6 pb-12 min-h-full relative z-10">
              
              {/* Avatar */}
              <div className="mb-6 relative group">
                <div className="w-24 h-24 rounded-full overflow-hidden shadow-2xl ring-4 ring-white/10 transition-transform duration-500 hover:scale-105">
                  <img 
                    src={profile.avatarUrl} 
                    alt={profile.name} 
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      (e.target as HTMLImageElement).src = 'https://via.placeholder.com/150';
                    }}
                  />
                </div>
              </div>

              {/* Profile Info */}
              <h1 className={`text-2xl font-black mb-2 text-center break-words w-full tracking-tight ${textClass} drop-shadow-sm`}>
                {profile.name || '@username'}
              </h1>
              <p className={`text-sm text-center mb-10 px-2 leading-relaxed whitespace-pre-wrap max-w-[90%] font-medium ${descriptionClass}`}>
                {profile.bio || 'Add a bio to tell people who you are.'}
              </p>

              {/* Links List */}
              <div className="w-full space-y-4 flex-grow px-2">
                {profile.links.filter(l => l.isActive).map((link) => (
                  <a
                    key={link.id}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`
                        block w-full p-4 text-center font-bold transition-all duration-300 transform 
                        flex items-center justify-between group relative overflow-hidden
                        ${buttonBaseClass} ${shapeClass}
                        hover:scale-[1.05] hover:shadow-2xl hover:-translate-y-1 active:scale-[0.98]
                    `}
                  >
                    {/* Gloss Shine Effect */}
                    <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent translate-x-[-150%] group-hover:translate-x-[150%] transition-transform duration-700 pointer-events-none skew-x-12 ease-in-out"></div>
                    
                    <span className="w-6" /> 
                    <span className="truncate mx-2 relative z-10">{link.title}</span>
                    <ExternalLink size={18} className="opacity-0 group-hover:opacity-100 transition-all duration-300 -translate-x-3 group-hover:translate-x-0" />
                  </a>
                ))}
                
                {profile.links.filter(l => l.isActive).length === 0 && (
                  <div className={`text-center py-10 opacity-40 border-2 border-dashed rounded-2xl ${textClass} border-current`}>
                    <p className="text-sm font-medium">Links will appear here</p>
                  </div>
                )}
              </div>

              {/* Branding Footer */}
              <div className="mt-12 opacity-60 hover:opacity-100 transition-opacity">
                 <p className={`text-[10px] font-bold uppercase tracking-[0.2em] ${textClass} flex items-center gap-1.5`}>
                    <Zap size={10} fill="currentColor" /> LINKFORCE
                 </p>
              </div>

            </div>
          </div>
        </div>
      </div>
    </div>
  );
};