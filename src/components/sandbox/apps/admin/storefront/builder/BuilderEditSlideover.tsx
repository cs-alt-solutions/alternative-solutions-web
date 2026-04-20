import React from 'react';
import { Edit3, X, Image as ImageIcon, Search, UploadCloud, Save } from 'lucide-react';
import { IconMap, getThemeColor } from '../StorefrontBuilder';

export default function BuilderEditSlideover({ 
    editingBlock, 
    setEditingBlock, 
    editForm, 
    setEditForm, 
    mainCategories, 
    subCategories, 
    handleSave, 
    fileInputRef, 
    isUploading, 
    setShowInventoryModal, 
    setActiveCatPicker 
}: any) {
    if (!editingBlock) return null;

    return (
        <div className="fixed inset-0 z-100 flex justify-end bg-black/80 backdrop-blur-sm animate-in fade-in">
            <div className="w-full max-w-md bg-zinc-950 h-full border-l border-zinc-800 flex flex-col shadow-2xl animate-in slide-in-from-right-8">
                <div className="p-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/50">
                    <h3 className="text-lg font-black uppercase tracking-widest text-white flex items-center gap-2">
                        <Edit3 size={18} className="text-cyan-400"/> 
                        {editingBlock.includes('bento') ? 'Edit Category Box' : 'Edit Banner'}
                    </h3>
                    <button onClick={() => setEditingBlock(null)} className="p-2 bg-zinc-900 rounded-full text-zinc-400 hover:text-white transition-colors">
                        <X size={16}/>
                    </button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                    {!editingBlock.includes('bento') && (
                        <>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Headline (Use \n for new line)</label>
                                <textarea rows={2} value={editForm.title} onChange={e => setEditForm({...editForm, title: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Subheadline</label>
                                <input type="text" value={editForm.subtitle} onChange={e => setEditForm({...editForm, subtitle: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Button Text</label>
                                <input type="text" value={editForm.buttonText} onChange={e => setEditForm({...editForm, buttonText: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Color Theme</label>
                                    <select value={getThemeColor(editForm.color || editForm.colorFrom)} onChange={e => setEditForm({...editForm, color: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none">
                                        <option value="pink">Pink</option>
                                        <option value="emerald">Emerald</option>
                                        <option value="cyan">Cyan</option>
                                        <option value="orange">Orange</option>
                                        <option value="fuchsia">Fuchsia</option>
                                        <option value="amber">Amber</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Icon</label>
                                    <select value={editForm.icon} onChange={e => setEditForm({...editForm, icon: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none">
                                        {Object.keys(IconMap).map(k => <option key={k} value={k}>{k}</option>)}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    {editingBlock.includes('bento') && (
                        <>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Display Name</label>
                                <input type="text" value={editForm.name} onChange={e => setEditForm({...editForm, name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none" />
                            </div>
                            <div>
                                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Description</label>
                                <input type="text" value={editForm.desc} onChange={e => setEditForm({...editForm, desc: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none" />
                            </div>
                            <div className="grid grid-cols-2 gap-4 border-t border-zinc-800/80 pt-4 mt-2">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Target Category</label>
                                    <select value={editForm.cat} onChange={e => setEditForm({...editForm, cat: e.target.value, sub: 'All', name: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-bold text-white focus:border-cyan-500 outline-none">
                                        {mainCategories.map((c:string)=><option key={c} value={c}>{c}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Target Sub-Category</label>
                                    <select value={editForm.sub} onChange={e => setEditForm({...editForm, sub: e.target.value, name: e.target.value === 'All' ? editForm.cat : e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-bold text-white focus:border-cyan-500 outline-none">
                                        <option value="All">All</option>
                                        {subCategories[editForm.cat]?.map((s:string)=><option key={s} value={s}>{s}</option>)}
                                    </select>
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Accent Color</label>
                                    <select value={getThemeColor(editForm.color || editForm.colorFrom)} onChange={e => setEditForm({...editForm, color: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none">
                                        <option value="emerald">Emerald</option>
                                        <option value="cyan">Cyan</option>
                                        <option value="pink">Pink</option>
                                        <option value="orange">Orange</option>
                                        <option value="fuchsia">Fuchsia</option>
                                        <option value="amber">Amber</option>
                                    </select>
                                </div>
                                <div>
                                    <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-widest block mb-2">Icon</label>
                                    <select value={editForm.icon} onChange={e => setEditForm({...editForm, icon: e.target.value})} className="w-full bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-sm font-bold text-white focus:border-cyan-500 outline-none">
                                        {Object.keys(IconMap).map(k => <option key={k} value={k}>{k}</option>)}
                                    </select>
                                </div>
                            </div>
                        </>
                    )}

                    <div className="border-t border-zinc-800/80 pt-6 mt-2">
                        <label className="text-[10px] font-bold text-cyan-400 uppercase tracking-widest flex items-center gap-2 mb-3"><ImageIcon size={14}/> Graphic Selection</label>
                        <div className="space-y-3">
                            <div className="flex gap-2">
                                <input type="text" value={editForm.imgUrl || ''} onChange={e => setEditForm({...editForm, imgUrl: e.target.value})} placeholder="https://..." className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl p-3 text-xs font-mono text-cyan-100 focus:border-cyan-500 outline-none" />
                                <button onClick={() => { setActiveCatPicker(null); setShowInventoryModal(true); }} className="px-4 bg-zinc-800 hover:bg-zinc-700 text-cyan-400 rounded-xl border border-zinc-700 text-xs font-black uppercase tracking-widest transition-colors flex items-center gap-2 whitespace-nowrap">
                                    <Search size={14}/> Find
                                </button>
                            </div>
                            <button 
                                onClick={() => fileInputRef.current?.click()} 
                                disabled={isUploading}
                                className="w-full bg-zinc-900 hover:bg-zinc-800 border-2 border-dashed border-zinc-800 hover:border-cyan-500/50 py-4 rounded-xl flex flex-col items-center justify-center gap-2 transition-all group"
                            >
                                {isUploading ? <UploadCloud size={20} className="text-cyan-400 animate-bounce" /> : <UploadCloud size={20} className="text-zinc-600 group-hover:text-cyan-400" />}
                                <span className="text-[10px] font-black uppercase tracking-widest text-zinc-500 group-hover:text-cyan-400">{isUploading ? 'Uploading to Warehouse...' : 'Upload Local Image'}</span>
                            </button>
                        </div>
                    </div>
                </div>
                
                <div className="p-6 border-t border-zinc-800 bg-zinc-950">
                    <button onClick={handleSave} className="w-full bg-emerald-500 hover:bg-emerald-400 text-zinc-950 py-4 rounded-2xl font-black uppercase tracking-widest shadow-[0_0_20px_rgba(52,211,153,0.3)] transition-all active:scale-95 flex items-center justify-center gap-2">
                        <Save size={16}/> Apply Changes
                    </button>
                </div>
            </div>
        </div>
    );
}