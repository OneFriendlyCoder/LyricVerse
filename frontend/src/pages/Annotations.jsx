import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../components/Navbar.jsx';
import { useToast } from '../components/Toast.jsx';
import { 
  ArrowLeft, CheckCircle2, MessageSquare, Plus, Edit3, User, Search, Globe2, 
  Trash2, X, FileText, ChevronRight, BookOpenText
} from 'lucide-react';

export default function SongAnnotationWorkspace() {
  const navigate = useNavigate();
  const { addToast } = useToast();

  // --- UI State & Permissions ---
  // Temporarily toggle this to True to test the Author view
  const [isOwner, setIsOwner] = useState(false); 
  const [activeWorkspaceTab, setActiveWorkspaceTab] = useState('annotate'); // 'annotate', 'lookup', 'history'
  
  // --- SELECTION STATE ---
  const [activeSelectionType, setActiveSelectionType] = useState(null); // 'word' | 'lines'
  const [selectedLines, setSelectedLines] = useState(new Set()); // Store IDs
  const [selectedWord, setSelectedWord] = useState(''); // Store word text
  const [newAnnotation, setNewAnnotation] = useState('');
  
  // --- MOCK DATA (Simulating API returns) ---
  const songData = { id: 101, title: "Midnight Drives", artist: "The Independents" };

  const lyricsData = [
    { id: 1, section: "Verse 1", text: "We're driving fast down the empty coast" },
    { id: 2, section: "Verse 1", text: "With the radio playing our favorite ghost" },
    { id: 3, section: "Verse 1", text: "I look at you in the dashboard light" },
    { id: 4, section: "Verse 1", text: "And everything feels so perfectly right" },
  ];

  const myContributions = [
    { id: 1, lines: "Line 1-2", annotation: "Great use of imagery, 'favorite ghost' suggests a shared past.", date: "May 10, 2024" },
  ];

  const allContributions = [
    { id: 1, contributor: "Priya M.", lines: "Line 1-2", annotation: "Love the internal rhyme of 'fast' and 'coast'. Very catchy.", date: "May 12, 2024", verified: true },
    { id: 2, contributor: "Rahul S.", lines: "Word: dashboard", annotation: "Suggest edit: Change to 'console' light? Flows better with pop genre.", date: "May 13, 2024", verified: false },
  ];

  // --- Placeholder API Calls (Dummy responses) ---
  const lookUpResults = {
    word: selectedWord,
    synonyms: ["Twilight", "Dusk", "Evenfall", "Darksome"],
    meaning: "The middle of the night; specifically : twelve o'clock at night.",
    translation: activeSelectionType === 'lines' && [...selectedLines].length > 0
        ? `[Dummy translation of selected lines into Marathi...]`
        : null
  };

  // --- Handlers ---
  const handleWordSelection = (word) => {
    setActiveSelectionType('word');
    setSelectedWord(word.replace(/[,.]/g, '')); // Clear selected lines if word picked
    setSelectedLines(new Set()); 
  };

  const handleLineSelectionToggle = (id) => {
    setActiveSelectionType('lines');
    setSelectedWord(''); // Clear selected word if line picked
    setSelectedLines((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const clearSelection = () => {
    setActiveSelectionType(null);
    setSelectedWord('');
    setSelectedLines(new Set());
    setNewAnnotation('');
  };

  const handleSaveContribution = () => {
    // API CALL PLACEHOLDER: axios.post('/api/annotations/', { song_id: 101, selection_type: ... })
    clearSelection();
    addToast({
      type: 'success',
      title: 'Contribution Saved',
      description: 'Your annotation has been submitted for review.'
    });
  };

  const renderSelectedContext = () => {
    if (activeSelectionType === 'word' && selectedWord) {
      return `Word: ${selectedWord}`;
    }
    if (activeSelectionType === 'lines' && selectedLines.size > 0) {
      const sorted = [...selectedLines].sort();
      if (sorted.length === 1) return `Line: ${sorted[0]}`;
      return `Lines: ${sorted[0]} - ${sorted[sorted.length - 1]}`;
    }
    return null;
  };

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-indigo-100 selection:text-indigo-900 font-sans pb-24 relative flex flex-col">
      <style>{`
        @keyframes fadeUp { from { opacity: 0; transform: translateY(20px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fade-up { animation: fadeUp 0.6s cubic-bezier(0.16, 1, 0.3, 1) forwards; }
      `}</style>

      <Navbar />

      {/* Ambient Glows */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40"></div>
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-violet-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-30"></div>
      </div>

      {/* Sticky Top Nav */}
      <div className="sticky top-16 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-200/60 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to={`/songs/${songData.id}`} className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex flex-col">
                <span className="text-xs font-medium text-slate-500">Workspace for:</span>
                <h1 className="text-xl font-bold text-slate-900 tracking-tight">{songData.title} by {songData.artist}</h1>
            </div>
          </div>
          <div className="flex gap-2">
            <button 
              onClick={handleSaveContribution}
              disabled={!activeSelectionType || !newAnnotation}
              className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 disabled:bg-slate-700 hover:bg-slate-800 text-white rounded-full text-sm font-semibold shadow-md transition-all transform hover:-translate-y-0.5"
            >
              <CheckCircle2 size={16} /> Save Contribution
            </button>
          </div>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 animate-fade-up">
          
          {/* LEFT: Lyrics Display */}
          <div className="lg:col-span-8">
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-[2rem] p-8 sm:p-12 shadow-sm min-h-[500px]">
              <div className="space-y-6">
                {lyricsData.map((line, index) => {
                  const isLineSelected = selectedLines.has(line.id);
                  const isMultiLineActive = activeSelectionType === 'lines';
                  
                  return (
                    <div key={line.id} className={`relative flex items-start gap-4 p-4 -mx-4 rounded-2xl transition-all ${isLineSelected ? 'bg-indigo-50 border border-indigo-200 shadow-inner' : 'hover:bg-slate-50'}`}>
                      {/* Checkbox for Line Selection */}
                      <input 
                        type="checkbox" 
                        checked={isLineSelected}
                        onChange={() => handleLineSelectionToggle(line.id)}
                        className="mt-2 h-5 w-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-600/20"
                      />
                      
                      {/* Subdued Line Number */}
                      <div className="text-xs font-bold text-slate-300 mt-2 select-none w-4">
                        {line.id}
                      </div>

                      {/* Interactive Lyric Text */}
                      <div className="flex-1">
                        <p className={`text-2xl sm:text-3xl font-bold ${isLineSelected ? 'text-indigo-950' : 'text-slate-800'} leading-snug`}>
                          {line.text.split(' ').map((word, wordIndex) => (
                            <span key={wordIndex} className="relative inline-block group">
                              <span 
                                onClick={() => handleWordSelection(word)}
                                className={`cursor-pointer transition-colors ${activeSelectionType === 'word' && selectedWord === word.replace(/[,.]/g, '') ? 'text-indigo-600 bg-indigo-100 rounded-md px-1' : 'group-hover:text-indigo-600 group-hover:bg-indigo-50 rounded-md'}`}
                              >
                                {word}
                              </span>
                              {' '}
                            </span>
                          ))}
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* RIGHT: Workspace Panel */}
          <div className="lg:col-span-4 flex flex-col gap-6">
            
            {/* Dynamic Workspace Container */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Contribution Workspace</h3>
                {activeSelectionType && (
                    <button onClick={clearSelection} className="p-1 text-slate-400 hover:text-slate-900 rounded-md">
                        <X size={16} />
                    </button>
                )}
              </div>

              {activeSelectionType ? (
                <div className="space-y-6">
                  {/* Selection Context */}
                  <div className="bg-indigo-50 text-indigo-900 p-4 rounded-2xl border border-indigo-100 font-bold flex items-center justify-between gap-3">
                    <span className="truncate">{renderSelectedContext()}</span>
                    <MessageSquare size={18} className="text-indigo-400 shrink-0" />
                  </div>

                  {/* Input Form */}
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Annotation / Suggest Edit</label>
                    <textarea 
                      rows="4"
                      value={newAnnotation}
                      onChange={(e) => setNewAnnotation(e.target.value)}
                      placeholder={`Add your explanation or suggest better words for ${renderSelectedContext()}...`}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 transition-all"
                    ></textarea>
                  </div>
                  
                  {/* Lookup Panel (Only if Word Selected) */}
                  {activeSelectionType === 'word' && (
                    <div className="border-t border-slate-100 pt-6">
                        <div className="flex gap-2 mb-4">
                            <BookOpenText size={20} className="text-slate-400" />
                            <h4 className="text-sm font-bold text-slate-900">Look Up: '{selectedWord}'</h4>
                        </div>
                        
                        <div className="space-y-4">
                            <div>
                                <h5 className="text-xs font-bold text-slate-500 mb-1.5 uppercase">Synonyms</h5>
                                <div className="flex flex-wrap gap-2">
                                    {/* DUMMY LOOKUP API */}
                                    {lookUpResults.synonyms.map(syn => (
                                        <span key={syn} className="text-xs font-semibold text-slate-700 bg-slate-100 px-2.5 py-1 rounded-md">
                                            {syn}
                                        </span>
                                    ))}
                                </div>
                            </div>
                            <div>
                                <h5 className="text-xs font-bold text-slate-500 mb-1.5 uppercase">Meaning</h5>
                                <p className="text-xs font-medium text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                                    {/* DUMMY LOOKUP API */}
                                    {lookUpResults.meaning}
                                </p>
                            </div>
                        </div>
                    </div>
                  )}

                  {/* Translation Panel (Only if Lines Selected) */}
                  {activeSelectionType === 'lines' && selectedLines.size > 0 && (
                    <div className="border-t border-slate-100 pt-6">
                        <div className="flex items-center gap-3 bg-violet-50 text-violet-800 p-4 rounded-2xl border border-violet-100">
                            <Globe2 size={20} className="text-violet-500" />
                            <div className="flex flex-col">
                                <p className="text-xs font-bold text-violet-900 mb-1">Dummy Translation</p>
                                <p className="text-sm font-medium leading-snug">{lookUpResults.translation}</p>
                            </div>
                        </div>
                    </div>
                  )}

                </div>
              ) : (
                // Empty State
                <div className="flex flex-col items-center justify-center text-center py-12 text-slate-500">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-inner">
                    <FileText size={24} className="text-slate-400" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-800 mb-1.5">Isolate to Annotate</h4>
                  <p className="text-sm leading-relaxed max-w-xs font-medium">Select a word or toggle lines to start contributing.</p>
                </div>
              )}
            </div>

            {/* CONTRIBUTION HISTORY (Separated by Role) */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm">
                
                {/* Switch for Owner to see all (Normally you get this role from your UserContext) */}
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Contribution History</h3>
                    <label className="relative inline-flex items-center cursor-pointer scale-90">
                        <input type="checkbox" className="sr-only peer" checked={isOwner} onChange={() => setIsOwner(!isOwner)} />
                        <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-2 peer-focus:ring-indigo-600/10 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-indigo-600"></div>
                        <span className="ml-2 text-xs font-semibold text-slate-600">Author view</span>
                    </label>
                </div>

                <div className="space-y-5">
                    {/* Render my Contributions (Regular User) */}
                    {!isOwner && myContributions.map(cont => (
                        <div key={cont.id} className="group border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                            <div className="flex justify-between items-start gap-2 mb-2">
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{cont.lines}</span>
                                <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                    <button className="text-slate-400 hover:text-slate-900 transition-colors"><Edit3 size={14} /></button>
                                    <button className="text-slate-400 hover:text-red-600 transition-colors"><Trash2 size={14} /></button>
                                </div>
                            </div>
                            <p className="text-sm font-medium text-slate-800 leading-relaxed mb-1.5">{cont.annotation}</p>
                            <p className="text-xs text-slate-400">{cont.date}</p>
                        </div>
                    ))}

                    {/* Render All Contributions (Author/Owner only) */}
                    {isOwner && allContributions.map(cont => (
                        <div key={cont.id} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                            <div className="flex items-center gap-3 mb-2.5 justify-between">
                                <div className="flex items-center gap-2.5">
                                    <div className="w-7 h-7 rounded-full bg-slate-100 flex items-center justify-center text-slate-500 font-bold text-xs border border-slate-200 shadow-inner">
                                        <User size={14} />
                                    </div>
                                    <p className="text-sm font-bold text-slate-900">{cont.contributor}</p>
                                </div>
                                <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{cont.lines}</span>
                            </div>
                            
                            <p className="text-sm font-medium text-slate-800 leading-relaxed mb-2.5">{cont.annotation}</p>
                            
                            <div className="flex justify-between items-center text-xs text-slate-400">
                                <span>{cont.date}</span>
                                <div className="flex items-center gap-1">
                                    {cont.verified ? (
                                        <span className="flex items-center gap-1 text-emerald-600 font-bold bg-emerald-50 px-2 py-1 rounded-md">
                                            <CheckCircle2 size={12} /> Verified
                                        </span>
                                    ) : (
                                        <button className="text-indigo-600 font-bold hover:text-indigo-800">Review contribution →</button>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

            </div>

          </div>
        </div>
      </div>
    </div>
  );
}