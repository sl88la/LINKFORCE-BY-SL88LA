import React from 'react';
import { UserProfile, LinkItem } from '../types';
import { Plus, Trash2, GripVertical, Link as LinkIcon, Edit2 } from 'lucide-react';

interface LinkEditorProps {
  profile: UserProfile;
  onChange: (profile: UserProfile) => void;
}

export const LinkEditor: React.FC<LinkEditorProps> = ({ profile, onChange }) => {
  const addLink = () => {
    const newLink: LinkItem = {
      id: Date.now().toString(),
      title: '',
      url: '',
      isActive: true
    };
    onChange({ ...profile, links: [newLink, ...profile.links] });
  };

  const updateLink = (id: string, updates: Partial<LinkItem>) => {
    const updatedLinks = profile.links.map(link => 
      link.id === id ? { ...link, ...updates } : link
    );
    onChange({ ...profile, links: updatedLinks });
  };

  const deleteLink = (id: string) => {
    const updatedLinks = profile.links.filter(link => link.id !== id);
    onChange({ ...profile, links: updatedLinks });
  };

  const toggleActive = (id: string) => {
    const updatedLinks = profile.links.map(link => 
        link.id === id ? { ...link, isActive: !link.isActive } : link
    );
    onChange({ ...profile, links: updatedLinks });
  };

  return (
    <div className="bg-slate-900/50 backdrop-blur-md rounded-3xl p-8 border border-white/10">
       <div className="flex justify-between items-center mb-8">
        <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <LinkIcon className="text-indigo-400" /> Links
        </h2>
        <button 
            onClick={addLink}
            className="bg-white text-slate-900 px-5 py-2.5 rounded-full text-sm font-bold hover:bg-slate-200 transition flex items-center gap-2 shadow-lg hover:scale-105 active:scale-95"
        >
            <Plus size={18} /> Add Link
        </button>
       </div>

       {profile.links.length === 0 ? (
           <div className="text-center py-12 bg-white/5 rounded-2xl border-2 border-dashed border-white/10">
               <div className="mx-auto w-14 h-14 bg-white/10 rounded-full flex items-center justify-center mb-4">
                   <LinkIcon className="text-slate-400" size={24} />
               </div>
               <p className="text-slate-400 font-medium">Your link list is empty.</p>
               <button onClick={addLink} className="text-indigo-400 font-bold mt-2 hover:text-indigo-300">Create your first link</button>
           </div>
       ) : (
           <div className="space-y-4">
               {profile.links.map((link) => (
                   <div key={link.id} className="group bg-white/5 border border-white/5 rounded-2xl p-5 hover:border-indigo-500/50 hover:bg-white/[0.07] transition-all shadow-sm">
                       <div className="flex items-start gap-4">
                           <div className="mt-4 text-slate-500 cursor-move hover:text-white transition">
                               <GripVertical size={20} />
                           </div>
                           
                           <div className="flex-1 space-y-3">
                               <div className="flex items-center gap-3">
                                   <Edit2 size={16} className="text-slate-500" />
                                   <input
                                       type="text"
                                       value={link.title}
                                       onChange={(e) => updateLink(link.id, { title: e.target.value })}
                                       placeholder="Link Title (e.g. My Website)"
                                       className="font-bold text-white w-full bg-transparent outline-none placeholder-slate-600 text-lg"
                                       dir="auto"
                                   />
                               </div>
                               <div className="flex items-center gap-3">
                                   <LinkIcon size={16} className="text-slate-500" />
                                   <input
                                       type="url"
                                       value={link.url}
                                       onChange={(e) => updateLink(link.id, { url: e.target.value })}
                                       placeholder="https://..."
                                       className="text-sm text-slate-400 w-full bg-transparent outline-none placeholder-slate-700 font-mono"
                                   />
                               </div>
                           </div>

                           <div className="flex flex-col gap-3 pl-4 border-l border-white/5">
                               <label className="relative inline-flex items-center cursor-pointer">
                                   <input 
                                       type="checkbox" 
                                       checked={link.isActive} 
                                       onChange={() => toggleActive(link.id)}
                                       className="sr-only peer" 
                                   />
                                   <div className="w-10 h-6 bg-slate-800 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-green-500 shadow-inner"></div>
                               </label>
                               <button 
                                   onClick={() => deleteLink(link.id)}
                                   className="p-2 text-slate-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition"
                                   title="Delete"
                               >
                                   <Trash2 size={18} />
                               </button>
                           </div>
                       </div>
                   </div>
               ))}
           </div>
       )}
    </div>
  );
};
