import React from 'react';
import { UserProfile, DEFAULT_THEMES, ButtonShape, ButtonStyle, FontFamily } from '../types';
import { Palette, Image as ImageIcon, LayoutGrid, Type, MousePointerClick, PaintBucket, Upload, Check, IdCard, RefreshCcw } from 'lucide-react';

interface ThemeSelectorProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
}

export const ThemeSelector: React.FC<ThemeSelectorProps> = ({ profile, onChange }) => {
  
  // Handlers for Main Profile Image
  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ 
          ...profile, 
          customBackgroundImage: reader.result as string,
          backgroundType: 'image'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  // Handlers for ID Card Image
  const handleCardImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ 
          ...profile, 
          cardBackgroundImage: reader.result as string,
          cardBackgroundType: 'image'
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const shapes: { id: ButtonShape; label: string; class: string }[] = [
      { id: 'pill', label: 'Pill', class: 'rounded-full' },
      { id: 'rounded', label: 'Rounded', class: 'rounded-2xl' },
      { id: 'sharp', label: 'Sharp', class: 'rounded-none' }
  ];

  const styles: { id: ButtonStyle; label: string; class: string }[] = [
      { id: 'glass', label: 'Glass', class: 'bg-white/10 backdrop-blur border border-white/10 text-white' },
      { id: 'solid', label: 'Solid', class: 'bg-indigo-600 text-white border-transparent' },
      { id: 'outline', label: 'Outline', class: 'bg-transparent border-indigo-500 text-indigo-200 border-2' },
      { id: 'soft', label: 'Soft', class: 'bg-indigo-500/20 text-indigo-200 border-transparent' },
  ];

  const fonts: { id: FontFamily; label: string; family: string }[] = [
      { id: 'inter', label: 'Modern Sans', family: 'font-sans' },
      { id: 'dm-serif', label: 'Editorial Serif', family: 'font-serif' },
      { id: 'mono', label: 'Developer Mono', family: 'font-mono' }
  ];

  return (
    <div className="space-y-8 animate-fade-in pb-10">
      
      {/* --- ID CARD SPECIFIC CUSTOMIZATION --- */}
      <section className="bg-gradient-to-br from-indigo-900/40 to-slate-900/40 border border-indigo-500/30 rounded-3xl p-6 md:p-8 relative overflow-hidden">
          <div className="absolute top-0 right-0 p-8 opacity-10">
              <IdCard size={120} className="text-white" />
          </div>
          
          <div className="flex items-center gap-3 mb-6 relative z-10">
              <div className="w-10 h-10 rounded-full bg-indigo-500 flex items-center justify-center text-white shadow-lg shadow-indigo-500/40">
                  <IdCard size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">ID Card Style</h2>
          </div>
          
          <p className="text-indigo-200 text-sm mb-6 relative z-10">
              Customize how your "Share Card" looks. You can match your profile or make it unique.
          </p>

          <div className="grid grid-cols-3 gap-2 p-1.5 bg-black/40 rounded-2xl mb-6 border border-white/5 relative z-10">
            {[
                { id: 'match', label: 'Match Profile', icon: RefreshCcw },
                { id: 'color', label: 'Card Color', icon: Palette },
                { id: 'image', label: 'Card Image', icon: ImageIcon }
            ].map((type) => (
                <button
                    key={type.id}
                    onClick={() => onChange({ ...profile, cardBackgroundType: type.id as any })}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 rounded-xl text-xs sm:text-sm font-bold transition-all
                        ${profile.cardBackgroundType === type.id || (!profile.cardBackgroundType && type.id === 'match') 
                            ? 'bg-indigo-600 text-white shadow-lg' 
                            : 'text-slate-500 hover:text-white hover:bg-white/5'}
                    `}
                >
                    <type.icon size={14} /> <span>{type.label}</span>
                </button>
            ))}
          </div>

          {/* Card: Custom Color Picker */}
          {profile.cardBackgroundType === 'color' && (
             <div className="relative z-10 animate-fade-in">
                  <div className="flex items-center gap-4 bg-black/30 p-3 rounded-2xl border border-white/5">
                      <input 
                          type="color" 
                          value={profile.cardBackgroundColor}
                          onChange={(e) => onChange({ ...profile, cardBackgroundColor: e.target.value })}
                          className="w-12 h-12 rounded-xl cursor-pointer border-0 bg-transparent p-0"
                      />
                      <div className="flex-1">
                          <label className="text-xs font-bold text-slate-400 uppercase">Card Color</label>
                          <div className="text-white font-mono">{profile.cardBackgroundColor}</div>
                      </div>
                  </div>
             </div>
          )}

           {/* Card: Custom Image */}
           {profile.cardBackgroundType === 'image' && (
             <div className="relative z-10 animate-fade-in">
                  <div className="border-2 border-dashed border-indigo-500/30 rounded-2xl p-6 text-center hover:bg-indigo-500/10 transition relative group cursor-pointer bg-black/20">
                      <input type="file" accept="image/*" onChange={handleCardImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                      <Upload className="mx-auto text-indigo-400 mb-2" size={24} />
                      <p className="text-sm font-bold text-white">Upload Card Background</p>
                  </div>
                  {profile.cardBackgroundImage && (
                      <div className="mt-4 h-32 rounded-xl overflow-hidden border border-white/10 relative">
                          <img src={profile.cardBackgroundImage} className="w-full h-full object-cover" />
                      </div>
                  )}
             </div>
          )}
      </section>

      {/* --- MAIN PROFILE BACKGROUND --- */}
      <section className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 md:p-8">
          <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center text-blue-400">
                  <PaintBucket size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Profile Background</h2>
          </div>

          <div className="grid grid-cols-3 gap-2 p-1.5 bg-black/40 rounded-2xl mb-8 border border-white/5">
            {[
                { id: 'preset', label: 'Themes', icon: LayoutGrid },
                { id: 'color', label: 'Custom Color', icon: Palette },
                { id: 'image', label: 'Upload Image', icon: ImageIcon }
            ].map((type) => (
                <button
                    key={type.id}
                    onClick={() => onChange({ ...profile, backgroundType: type.id as any })}
                    className={`flex flex-col sm:flex-row items-center justify-center gap-2 py-3 rounded-xl text-sm font-bold transition-all
                        ${profile.backgroundType === type.id ? 'bg-white/10 text-white shadow-lg ring-1 ring-white/10' : 'text-slate-500 hover:text-white hover:bg-white/5'}
                    `}
                >
                    <type.icon size={16} /> <span>{type.label}</span>
                </button>
            ))}
          </div>
          
          {/* Presets */}
          {profile.backgroundType === 'preset' && (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 animate-fade-in">
            {DEFAULT_THEMES.map((theme) => (
                <button
                key={theme.id}
                onClick={() => onChange({ ...profile, themeId: theme.id })}
                className={`
                    relative group rounded-2xl overflow-hidden transition-all aspect-[4/5] text-left border-2
                    ${profile.themeId === theme.id ? 'border-blue-500 scale-[1.02] shadow-xl shadow-blue-500/20' : 'border-transparent opacity-70 hover:opacity-100'}
                `}
                >
                <div className={`absolute inset-0 ${theme.bgClass}`}></div>
                <div className="absolute inset-0 p-4 flex flex-col items-center justify-center gap-3">
                    <div className="w-full h-8 rounded-lg bg-white/20 backdrop-blur-md shadow-sm"></div>
                    <div className="w-full h-8 rounded-lg bg-white/20 backdrop-blur-md shadow-sm"></div>
                </div>
                <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-black/90 to-transparent">
                    <p className="text-xs font-bold text-white text-center">{theme.name}</p>
                </div>
                </button>
            ))}
            </div>
          )}

          {/* Custom Color */}
          {profile.backgroundType === 'color' && (
             <div className="space-y-6 animate-fade-in">
                <div className="flex flex-col md:flex-row gap-6 bg-black/20 p-4 rounded-3xl border border-white/5">
                    <div className="relative w-full md:w-32 h-32 rounded-2xl overflow-hidden shadow-inner ring-2 ring-white/10 shrink-0 group">
                        <input 
                            type="color" 
                            value={profile.customBackgroundColor}
                            onChange={(e) => onChange({ ...profile, customBackgroundColor: e.target.value })}
                            className="absolute inset-0 w-[150%] h-[150%] -top-1/4 -left-1/4 cursor-pointer p-0 border-0"
                        />
                        <div className="absolute inset-0 pointer-events-none flex items-center justify-center opacity-0 group-hover:opacity-100 transition bg-black/20 backdrop-blur-sm">
                            <Palette className="text-white" size={24} />
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col justify-center">
                            <div className="text-sm text-slate-400 font-medium mb-2">Hex Code</div>
                            <input 
                            type="text" 
                            value={profile.customBackgroundColor}
                            onChange={(e) => onChange({ ...profile, customBackgroundColor: e.target.value })}
                            className="w-full bg-black/30 text-2xl font-mono text-white font-bold outline-none placeholder-white/20 uppercase px-4 py-3 rounded-xl border border-white/10 focus:border-blue-500 transition"
                            placeholder="#000000"
                        />
                    </div>
                </div>
                <div className="pt-4 border-t border-white/5 flex gap-4">
                    <button 
                        onClick={() => onChange({...profile, customTextColor: 'white'})}
                        className={`flex-1 py-3 rounded-xl border font-bold transition-all ${profile.customTextColor === 'white' ? 'bg-slate-800 border-blue-500 text-white' : 'bg-slate-900 border-white/10 text-slate-400'}`}
                    >
                        White Text
                    </button>
                    <button 
                        onClick={() => onChange({...profile, customTextColor: 'black'})}
                        className={`flex-1 py-3 rounded-xl border font-bold transition-all ${profile.customTextColor === 'black' ? 'bg-slate-100 border-blue-500 text-black' : 'bg-slate-900 border-white/10 text-slate-400'}`}
                    >
                        Black Text
                    </button>
                </div>
             </div>
          )}

          {/* Main Image Upload */}
          {profile.backgroundType === 'image' && (
             <div className="space-y-6 animate-fade-in">
                 <div className="border-2 border-dashed border-white/20 rounded-3xl p-10 text-center hover:border-blue-500 hover:bg-blue-500/5 transition cursor-pointer relative group bg-black/20">
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="absolute inset-0 opacity-0 cursor-pointer w-full h-full z-10" />
                    <Upload className="mx-auto text-blue-400 mb-2" size={28} />
                    <p className="text-lg font-bold text-white">Upload Profile Background</p>
                 </div>
                 {profile.customBackgroundImage && (
                     <div className="relative h-48 rounded-2xl overflow-hidden border border-white/10 shadow-lg">
                         <img src={profile.customBackgroundImage} className="w-full h-full object-cover" />
                     </div>
                 )}
             </div>
          )}
      </section>

      {/* --- BUTTONS SECTION --- */}
      <section className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 md:p-8">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center text-purple-400">
                  <MousePointerClick size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Buttons</h2>
          </div>
          <div className="grid grid-cols-2 gap-4">
              {styles.map(style => (
                  <button
                    key={style.id}
                    onClick={() => onChange({ ...profile, buttonStyle: style.id })}
                    className={`h-16 rounded-2xl border text-sm font-bold transition-all ${profile.buttonStyle === style.id ? 'bg-indigo-600 border-indigo-600 text-white shadow-lg' : 'bg-white/5 border-white/5 text-slate-400 hover:border-white/20'}`}
                  >
                      {style.label}
                  </button>
              ))}
          </div>
          <div className="mt-6">
              <label className="text-xs uppercase tracking-wider text-slate-400 font-bold mb-3 block">Shape</label>
              <div className="flex gap-4 p-2 bg-black/20 rounded-2xl border border-white/5">
                  {shapes.map(shape => (
                      <button
                        key={shape.id}
                        onClick={() => onChange({ ...profile, buttonShape: shape.id })}
                        className={`flex-1 h-12 transition-all ${shape.class} ${profile.buttonShape === shape.id ? 'bg-white text-black shadow-md' : 'bg-white/5 text-slate-500 hover:bg-white/10'}`}
                      >
                      </button>
                  ))}
              </div>
          </div>
      </section>

      {/* --- TYPOGRAPHY SECTION --- */}
      <section className="bg-white/[0.03] border border-white/5 rounded-3xl p-6 md:p-8">
           <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-full bg-pink-500/10 flex items-center justify-center text-pink-400">
                  <Type size={20} />
              </div>
              <h2 className="text-xl font-bold text-white">Typography</h2>
          </div>
          <div className="space-y-3">
              {fonts.map(font => (
                  <button
                    key={font.id}
                    onClick={() => onChange({ ...profile, fontFamily: font.id })}
                    className={`w-full p-4 rounded-xl border text-left flex justify-between items-center transition-all ${profile.fontFamily === font.id ? 'bg-indigo-600/10 border-indigo-500 text-white ring-1 ring-indigo-500/50' : 'bg-black/20 border-white/5 text-slate-400 hover:bg-white/5'}`}
                  >
                      <span className={`text-lg ${font.family}`}>The quick brown fox</span>
                      <span className="text-xs uppercase font-bold opacity-60 font-sans tracking-wider">{font.label}</span>
                  </button>
              ))}
          </div>
      </section>

    </div>
  );
};
