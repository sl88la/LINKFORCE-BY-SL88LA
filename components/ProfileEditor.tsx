import React, { useState } from 'react';
import { UserProfile } from '../types';
import { Sparkles, Loader2, Camera, User } from 'lucide-react';
import { generateBioWithAI } from '../services/geminiService';

interface ProfileEditorProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
}

export const ProfileEditor: React.FC<ProfileEditorProps> = ({ profile, onChange }) => {
  const [isGenerating, setIsGenerating] = useState(false);
  const [showAiPrompt, setShowAiPrompt] = useState(false);
  const [aiKeywords, setAiKeywords] = useState('');
  const [aiVibe, setAiVibe] = useState('Professional');

  const handleTextChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    onChange({ ...profile, [e.target.name]: e.target.value });
  };

  const handleGenerateBio = async () => {
    setIsGenerating(true);
    try {
      const newBio = await generateBioWithAI(profile.bio, aiKeywords, aiVibe);
      onChange({ ...profile, bio: newBio });
      setShowAiPrompt(false);
    } catch (error) {
      alert("Failed to generate bio. Please check your API Key or try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        onChange({ ...profile, avatarUrl: reader.result as string });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
      <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <User className="text-indigo-400" /> Profile Details
      </h2>
      
      {/* Avatar Uploader */}
      <div className="flex items-center gap-8 mb-8">
        <div className="relative group cursor-pointer w-28 h-28 shrink-0">
          <img 
            src={profile.avatarUrl} 
            alt="Profile" 
            className="w-full h-full rounded-full object-cover border-4 border-slate-800 shadow-xl group-hover:opacity-75 transition bg-slate-800"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/50 rounded-full opacity-0 group-hover:opacity-100 transition backdrop-blur-sm">
             <Camera className="text-white w-8 h-8" />
          </div>
          <input 
            type="file" 
            accept="image/*"
            className="absolute inset-0 opacity-0 cursor-pointer"
            onChange={handleImageUpload}
          />
        </div>
        <div className="flex-1">
          <label className="block text-xs uppercase tracking-wider font-bold text-slate-400 mb-2">Display Name</label>
          <input
            type="text"
            name="name"
            value={profile.name}
            onChange={handleTextChange}
            placeholder="e.g. Elon Musk"
            className="w-full px-5 py-3 rounded-xl bg-black/30 border border-white/10 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none font-medium placeholder-slate-600"
            dir="auto"
          />
        </div>
      </div>

      {/* Bio Section */}
      <div className="mb-2">
        <div className="flex justify-between items-center mb-3">
           <label className="block text-xs uppercase tracking-wider font-bold text-slate-400">Bio</label>
           <button 
             onClick={() => setShowAiPrompt(!showAiPrompt)}
             className="text-xs font-bold text-indigo-400 flex items-center gap-1.5 hover:text-indigo-300 transition bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20"
           >
             <Sparkles size={14} />
             {showAiPrompt ? 'Cancel AI' : 'Rewrite with AI'}
           </button>
        </div>

        {showAiPrompt && (
          <div className="mb-4 p-5 bg-indigo-900/20 rounded-2xl border border-indigo-500/30 animate-fade-in">
            <h3 className="text-sm font-bold text-indigo-300 mb-4">✨ AI Bio Assistant</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="text-xs font-bold text-indigo-200 block mb-1.5">Keywords</label>
                <input 
                  type="text" 
                  value={aiKeywords}
                  onChange={(e) => setAiKeywords(e.target.value)}
                  placeholder="tech, art, travel..." 
                  className="w-full text-sm px-3 py-2.5 rounded-lg bg-black/30 border border-indigo-500/30 text-white focus:outline-none focus:border-indigo-400"
                />
              </div>
              <div>
                <label className="text-xs font-bold text-indigo-200 block mb-1.5">Vibe</label>
                <select 
                  value={aiVibe}
                  onChange={(e) => setAiVibe(e.target.value)}
                  className="w-full text-sm px-3 py-2.5 rounded-lg bg-black/30 border border-indigo-500/30 text-white focus:outline-none focus:border-indigo-400"
                >
                  <option>Professional</option>
                  <option>Funny</option>
                  <option>Casual</option>
                  <option>Mysterious</option>
                  <option>Minimalist</option>
                  <option>Hype</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleGenerateBio}
              disabled={isGenerating}
              className="w-full py-2.5 bg-indigo-600 text-white rounded-lg text-sm font-bold hover:bg-indigo-500 transition flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/20"
            >
              {isGenerating ? <Loader2 size={16} className="animate-spin" /> : <Sparkles size={16} />}
              Generate Magic Bio
            </button>
          </div>
        )}

        <textarea
          name="bio"
          value={profile.bio}
          onChange={handleTextChange}
          placeholder="Tell the world about yourself..."
          rows={3}
          className="w-full px-5 py-4 rounded-xl bg-black/30 border border-white/10 text-white focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 transition-all outline-none resize-none placeholder-slate-600"
          dir="auto"
        />
        <p className="text-xs text-slate-500 mt-2 text-right">{profile.bio.length} characters</p>
      </div>
    </div>
  );
};
