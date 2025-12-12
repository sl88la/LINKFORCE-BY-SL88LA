import React, { useState, useEffect } from 'react';
import { UserProfile, INITIAL_PROFILE } from './types';
import { ProfileEditor } from './components/ProfileEditor';
import { LinkEditor } from './components/LinkEditor';
import { ThemeSelector } from './components/ThemeSelector';
import { Preview } from './components/Preview';
import { ShareModal } from './components/ShareModal';
import { Zap, Eye, Code2, Rocket, Palette, LayoutDashboard, Share2 } from 'lucide-react';

const STORAGE_KEY = 'linkforce_profile_data_v4';

export default function App() {
  const [profile, setProfile] = useState<UserProfile>(INITIAL_PROFILE);
  const [activeTab, setActiveTab] = useState<'editor' | 'preview'>('editor');
  const [currentSection, setCurrentSection] = useState<'content' | 'design'>('content');
  const [isShareOpen, setIsShareOpen] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved) {
      try {
        setProfile({ ...INITIAL_PROFILE, ...JSON.parse(saved) });
      } catch (e) {
        console.error("Failed to load profile", e);
      }
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(profile));
  }, [profile]);

  return (
    <div className="min-h-screen bg-[#09090b] text-white font-sans selection:bg-indigo-500/30 overflow-hidden flex flex-col">
      
      {/* Cinematic Background */}
      <div className="fixed inset-0 z-0 pointer-events-none">
         <div className="absolute top-[-20%] left-[-10%] w-[70vw] h-[70vw] bg-indigo-900/20 rounded-full blur-[120px] animate-pulse-slow"></div>
         <div className="absolute bottom-[-20%] right-[-10%] w-[60vw] h-[60vw] bg-blue-900/10 rounded-full blur-[100px]"></div>
         <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-[0.03]"></div>
      </div>

      {/* Top Navbar */}
      <header className="relative z-50 h-20 border-b border-white/5 bg-[#09090b]/80 backdrop-blur-xl flex items-center justify-between px-6 lg:px-10">
          <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-gradient-to-br from-white to-slate-400 rounded-xl flex items-center justify-center shadow-lg shadow-white/5">
                  <Zap className="text-black" size={22} fill="currentColor" />
              </div>
              <span className="text-xl font-black tracking-tighter italic hidden sm:block">
                  LINKFORCE
              </span>
          </div>

          {/* Center Tabs (Desktop) */}
          <div className="hidden md:flex items-center bg-white/5 rounded-full p-1 border border-white/5">
              <button 
                onClick={() => setCurrentSection('content')}
                className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${currentSection === 'content' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                  <LayoutDashboard size={16} /> Content
              </button>
              <button 
                onClick={() => setCurrentSection('design')}
                className={`px-8 py-2.5 rounded-full text-sm font-bold transition-all flex items-center gap-2 ${currentSection === 'design' ? 'bg-white text-black shadow-lg' : 'text-slate-400 hover:text-white hover:bg-white/5'}`}
              >
                  <Palette size={16} /> Appearance
              </button>
          </div>

          <button 
            onClick={() => setIsShareOpen(true)}
            className="flex items-center gap-2 bg-indigo-600 hover:bg-indigo-500 text-white px-5 py-2.5 rounded-xl font-bold transition-all shadow-lg shadow-indigo-600/25 hover:scale-105 active:scale-95"
          >
              <Rocket size={18} /> <span className="hidden sm:inline">Publish Card</span>
          </button>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 relative z-10 flex overflow-hidden">
          
          {/* Left Panel: Editor Area */}
          <div className={`
              flex-1 h-full overflow-y-auto custom-scrollbar p-5 md:p-8 lg:p-12
              ${activeTab === 'preview' ? 'hidden md:block' : 'block'}
          `}>
              <div className="max-w-2xl mx-auto space-y-8 pb-28 md:pb-12">
                  <div className="mb-8">
                      <h1 className="text-3xl md:text-4xl font-bold text-white mb-2">
                          {currentSection === 'content' ? 'Edit Profile' : 'Customize Design'}
                      </h1>
                      <p className="text-slate-400">
                          {currentSection === 'content' 
                            ? 'Manage your links and personal details.' 
                            : 'Change the background, colors, and button styles.'}
                      </p>
                  </div>

                  <div className="space-y-6 animate-slide-up">
                      {currentSection === 'content' ? (
                          <>
                              <ProfileEditor profile={profile} onChange={setProfile} />
                              <LinkEditor profile={profile} onChange={setProfile} />
                          </>
                      ) : (
                          <ThemeSelector profile={profile} onChange={setProfile} />
                      )}
                  </div>
                  
                  {/* Site Footer - Powered By */}
                  <div className="w-full border-t border-white/5 pt-8 mt-12 flex justify-center opacity-50 hover:opacity-100 transition-opacity">
                      <p className="text-[10px] font-black text-slate-500 tracking-[0.2em] uppercase">
                          POWERED BY SAIF - SL88LA
                      </p>
                  </div>

              </div>
          </div>

          {/* Right Panel: Live Preview */}
          <div className={`
              w-full md:w-[450px] lg:w-[550px] bg-[#050505]/50 border-l border-white/5 backdrop-blur-sm relative flex items-center justify-center p-8
              ${activeTab === 'editor' ? 'hidden md:flex' : 'flex absolute inset-0 z-40 bg-[#09090b] md:bg-transparent'}
          `}>
               {/* Mobile Back Button */}
               <button 
                  onClick={() => setActiveTab('editor')}
                  className="md:hidden absolute top-6 left-6 flex items-center gap-2 text-white bg-white/10 px-4 py-2 rounded-full backdrop-blur-md font-medium"
               >
                   <Code2 size={18} /> Edit
               </button>

               <div className="scale-[0.85] sm:scale-90 lg:scale-100 transition-transform duration-500">
                   <Preview profile={profile} />
               </div>
          </div>

      </main>

      {/* Mobile Bottom Navigation Dock */}
      <div className="md:hidden fixed bottom-8 inset-x-0 flex justify-center z-50 pointer-events-none">
          <div className="bg-[#09090b]/90 backdrop-blur-xl border border-white/10 p-2 rounded-full shadow-2xl flex gap-2 pointer-events-auto">
              <button 
                onClick={() => setActiveTab('editor')}
                className={`px-6 py-3 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${activeTab === 'editor' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                  <LayoutDashboard size={18} /> Editor
              </button>
              <div className="w-px bg-white/10 my-2"></div>
              <button 
                onClick={() => setActiveTab('preview')}
                className={`px-6 py-3 rounded-full flex items-center gap-2 text-sm font-bold transition-all ${activeTab === 'preview' ? 'bg-indigo-600 text-white shadow-lg' : 'text-slate-400 hover:text-white'}`}
              >
                  <Eye size={18} /> Preview
              </button>
          </div>
      </div>

      <ShareModal profile={profile} isOpen={isShareOpen} onClose={() => setIsShareOpen(false)} onChange={setProfile} />
    </div>
  );
}