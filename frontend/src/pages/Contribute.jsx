import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // Assuming you are using react-router
import Navbar from '../components/Navbar';
import { 
  Save, 
  Send, 
  Languages, 
  Highlighter, 
  BookOpen, 
  Music, 
  Mic, 
  Info,
  ChevronDown,
  Sparkles,
  ArrowLeft
} from 'lucide-react';

export default function Contribute() {
  const [activeTab, setActiveTab] = useState('translate'); // 'translate' or 'wiki'
  const [targetLang, setTargetLang] = useState('Hindi');
  const [isTranslating, setIsTranslating] = useState(false);

  // Mock function to simulate an API call for translation
  const handleTranslate = (e) => {
    e.preventDefault();
    setIsTranslating(true);
    setTimeout(() => setIsTranslating(false), 1500); // Simulate network delay
  };

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-indigo-100 selection:text-indigo-900 font-sans flex flex-col relative pb-20">
    <Navbar />
      {/* Ambient Background Glow */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-50"></div>
        <div className="absolute bottom-[-10%] right-[-10%] w-[40%] h-[40%] bg-purple-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-50"></div>
      </div>

      {/* Top Action Bar */}
      <div className="sticky top-0 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-200/60 py-4">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/dashboard" className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Create New Song</h1>
              <p className="text-xs font-medium text-slate-500">Draft • Saved 2 mins ago</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button className="hidden sm:flex items-center gap-2 px-4 py-2 text-sm font-semibold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 rounded-full transition-all shadow-sm">
              <Save size={16} />
              Save Draft
            </button>
            <button className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-2 rounded-full text-sm font-semibold shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5">
              <Send size={16} />
              Publish
            </button>
          </div>
        </div>
      </div>

      {/* Main Editor Layout */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full mt-8 flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          
          {/* Left Column: Editor & Metadata (Spans 8 cols on large screens) */}
          <div className="lg:col-span-8 flex flex-col gap-6">
            
            {/* Metadata Card */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl p-6 shadow-sm">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Song Title</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Music className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="text" placeholder="e.g., Midnight Rain" className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-bold text-lg placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all" />
                  </div>
                </div>
                
                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Artist / Band</label>
                  <div className="relative">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                      <Mic className="h-5 w-5 text-slate-400" />
                    </div>
                    <input type="text" placeholder="Artist Name" className="w-full pl-11 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all" />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Original Language</label>
                  <div className="relative">
                    <select className="w-full appearance-none pl-4 pr-10 py-2.5 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 font-medium focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all">
                      <option>English</option>
                      <option>Hindi</option>
                      <option>Marathi</option>
                    </select>
                    <div className="absolute inset-y-0 right-0 pr-4 flex items-center pointer-events-none">
                      <ChevronDown className="h-4 w-4 text-slate-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Main Lyric Editor */}
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col flex-grow min-h-[500px]">
              
              {/* Editor Toolbar */}
              <div className="border-b border-slate-200/60 bg-slate-50/50 p-3 flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-1">
                  <button className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors flex items-center gap-2 text-sm font-semibold" title="Highlight text to add meaning">
                    <Highlighter size={16} />
                    <span className="hidden sm:inline">Add Wiki Annotation</span>
                  </button>
                </div>
                
                <button 
                  onClick={handleTranslate}
                  className="flex items-center gap-2 bg-indigo-50 text-indigo-700 border border-indigo-100 hover:bg-indigo-100 hover:border-indigo-200 px-4 py-1.5 rounded-lg text-sm font-bold transition-all"
                >
                  {isTranslating ? (
                    <span className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
                      Translating...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      <Sparkles size={16} />
                      Auto-Translate
                    </span>
                  )}
                </button>
              </div>

              {/* Text Area */}
              <textarea 
                className="w-full flex-grow p-6 bg-transparent resize-none focus:outline-none text-slate-800 text-lg leading-relaxed placeholder-slate-300 font-medium"
                placeholder="Start writing your lyrics here...&#10;&#10;[Verse 1]&#10;Walking through the midnight rain...&#10;&#10;(Tip: Highlight any word to add a cultural annotation)"
              ></textarea>
            </div>

          </div>

          {/* Right Column: Assistant Tools (Translation & Wiki) */}
          <div className="lg:col-span-4 flex flex-col h-full">
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-2xl shadow-sm overflow-hidden flex flex-col sticky top-28 min-h-[600px] h-full">
              
              {/* Tabs */}
              <div className="flex border-b border-slate-200/60">
                <button 
                  onClick={() => setActiveTab('translate')}
                  className={`flex-1 flex justify-center items-center gap-2 py-4 text-sm font-bold transition-colors ${activeTab === 'translate' ? 'text-indigo-600 border-b-2 border-indigo-600 bg-indigo-50/30' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                  <Languages size={18} />
                  Translation
                </button>
                <button 
                  onClick={() => setActiveTab('wiki')}
                  className={`flex-1 flex justify-center items-center gap-2 py-4 text-sm font-bold transition-colors ${activeTab === 'wiki' ? 'text-pink-600 border-b-2 border-pink-600 bg-pink-50/30' : 'text-slate-500 hover:text-slate-700 hover:bg-slate-50'}`}
                >
                  <BookOpen size={18} />
                  Lyric Wiki
                </button>
              </div>

              {/* Tab Content: Translation */}
              {activeTab === 'translate' && (
                <div className="flex flex-col flex-grow p-5 animate-in fade-in duration-300">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-sm font-bold text-slate-800">Target Language</h3>
                    <select 
                      value={targetLang}
                      onChange={(e) => setTargetLang(e.target.value)}
                      className="text-sm bg-slate-100 border-none rounded-lg px-3 py-1.5 font-semibold text-slate-700 focus:ring-2 focus:ring-indigo-600/20 outline-none cursor-pointer"
                    >
                      <option value="Hindi">Hindi (हिंदी)</option>
                      <option value="Marathi">Marathi (मराठी)</option>
                      <option value="Tamil">Tamil (தமிழ்)</option>
                    </select>
                  </div>
                  
                  <div className="flex-grow bg-slate-50 border border-slate-200/60 rounded-xl p-4 text-slate-600 text-base leading-relaxed overflow-y-auto">
                    {isTranslating ? (
                      <div className="flex flex-col items-center justify-center h-full text-slate-400 space-y-3">
                        <div className="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"></div>
                        <p className="text-sm font-medium">Analyzing cultural context...</p>
                      </div>
                    ) : (
                      <p className="italic text-slate-400 text-center mt-10">
                        Click "Auto-Translate" to generate the {targetLang} version of your lyrics.
                      </p>
                    )}
                  </div>
                </div>
              )}

              {/* Tab Content: Lyric Wiki (Annotations) */}
              {activeTab === 'wiki' && (
                <div className="flex flex-col flex-grow p-5 animate-in fade-in duration-300">
                  <div className="bg-pink-50 border border-pink-100 rounded-xl p-4 mb-4 flex gap-3 text-pink-800">
                    <Info size={20} className="flex-shrink-0 mt-0.5" />
                    <p className="text-sm font-medium leading-relaxed">
                      Highlight words in your editor to add cultural context or deeper meanings for your collaborators and fans.
                    </p>
                  </div>

                  {/* Empty State for Wiki */}
                  <div className="flex-grow border-2 border-dashed border-slate-200 rounded-xl flex flex-col items-center justify-center text-center p-6 text-slate-500">
                    <Highlighter size={32} className="text-slate-300 mb-3" />
                    <p className="text-sm font-bold text-slate-700 mb-1">No annotations yet</p>
                    <p className="text-xs max-w-[200px]">Select text in the editor and click the highlight button to start building your wiki.</p>
                  </div>
                </div>
              )}

            </div>
          </div>

        </div>
      </div>
    </div>
  );
}