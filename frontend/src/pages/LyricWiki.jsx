import React, { useState } from 'react';
import { 
  Search, 
  BookOpen, 
  ThumbsUp, 
  MessageSquare, 
  Plus, 
  Globe2,
  Music,
  Quote,
  Sparkles
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function LyricWiki() {
  // State for search and filtering
  const [searchQuery, setSearchQuery] = useState('');
  const [activeLang, setActiveLang] = useState('All');

  // Filter categories
  const languages = ['All', 'Hindi', 'Marathi', 'Punjabi', 'Tamil', 'Urdu'];

  // Mock Data: The Community Dictionary
  const [wikiTerms, setWikiTerms] = useState([
    {
      id: 1,
      term: 'Jugaad',
      language: 'Hindi',
      pronunciation: '/dʒʊˈɡɑːd/',
      meaning: 'A flexible, innovative approach to problem-solving that uses limited resources in an unconventional way. In songwriting, often used to describe street-smart survival or making things work against the odds.',
      songExample: 'Echoes of Mumbai',
      lyricContext: '"In the city of dreams, we survive on jugaad and caffeine..."',
      author: 'mumbai_indie',
      upvotes: 342
    },
    {
      id: 2,
      term: 'Nakhra',
      language: 'Punjabi / Hindi',
      pronunciation: '/nəkʰrɑː/',
      meaning: 'Attitude, swagger, or playful tantrums. Often used in romantic songs to describe a lover\'s captivating but slightly demanding behavior.',
      songExample: 'Neon Lights',
      lyricContext: '"Your nakhra lights up the room brighter than the neon signs."',
      author: 'lyric_master99',
      upvotes: 890
    },
    {
      id: 3,
      term: 'Jivlaga',
      language: 'Marathi',
      pronunciation: '/dʒiːvəlɑːɡɑː/',
      meaning: 'A deeply affectionate term for someone who is as dear to you as your own life. Stronger than just "friend" or "lover"; a soulmate connection.',
      songExample: 'Desert Rose',
      lyricContext: '"Across the ocean, my jivlaga, my heart beats to your rhythm."',
      author: 'poet_sharma',
      upvotes: 512
    },
    {
      id: 4,
      term: 'Sukoon',
      language: 'Urdu / Hindi',
      pronunciation: '/sʊˈkuːn/',
      meaning: 'A deep sense of peace, relief, and tranquility. The kind of peace you feel when you finally find rest after a chaotic journey.',
      songExample: 'City Whispers',
      lyricContext: '"In the silence of your arms, I finally found my sukoon."',
      author: 'maya_writes',
      upvotes: 1205
    }
  ]);

  // Handle Upvote
  const handleUpvote = (id) => {
    setWikiTerms(wikiTerms.map(term => 
      term.id === id ? { ...term, upvotes: term.upvotes + 1 } : term
    ));
  };

  // Filter Logic
  const filteredTerms = wikiTerms.filter(term => {
    const matchesSearch = term.term.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          term.meaning.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesLang = activeLang === 'All' || term.language.includes(activeLang);
    return matchesSearch && matchesLang;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-pink-100 selection:text-pink-900 font-sans pb-24 relative flex flex-col">
      <Navbar />
      {/* Ambient Background Glow (Pink/Violet themed for Wiki) */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[40%] h-[40%] bg-pink-200/40 rounded-full mix-blend-multiply filter blur-[120px]"></div>
        <div className="absolute bottom-1/4 left-0 w-[50%] h-[30%] bg-violet-200/40 rounded-full mix-blend-multiply filter blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 w-full">
        
        {/* Page Header */}
        <div className="flex flex-col items-center text-center mb-12">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-pink-50 border border-pink-100 text-pink-700 text-sm font-semibold mb-6 shadow-sm">
            <BookOpen size={16} />
            <span>Community Dictionary</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
            Cultural <span className="text-transparent bg-clip-text bg-gradient-to-r from-pink-500 to-violet-500">Lyric Wiki</span>
          </h1>
          <p className="text-lg text-slate-500 max-w-2xl mb-10">
            Discover the deep cultural meanings, slang, and idioms behind the lyrics. Created by songwriters, for the world.
          </p>

          {/* Search Bar & Action Button */}
          <div className="w-full max-w-3xl flex flex-col sm:flex-row gap-4">
            <div className="relative flex-grow group">
              <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                <Search className="h-5 w-5 text-slate-400 group-focus-within:text-pink-500 transition-colors" />
              </div>
              <input
                type="text"
                placeholder="Search for a word, phrase, or meaning..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-12 pr-6 py-4 bg-white/80 backdrop-blur-xl border border-slate-200/80 rounded-2xl text-base text-slate-900 placeholder-slate-400 shadow-md shadow-pink-100/20 focus:outline-none focus:ring-2 focus:ring-pink-500/20 focus:border-pink-500 transition-all duration-300"
              />
            </div>
            <button className="flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-8 py-4 rounded-2xl font-bold shadow-lg transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap">
              <Plus size={20} />
              Add Term
            </button>
          </div>
        </div>

        {/* Filters Panel */}
        <div className="flex flex-wrap items-center justify-center gap-3 mb-12">
          <span className="text-sm font-bold text-slate-400 uppercase tracking-wider mr-2 flex items-center gap-2">
            <Globe2 size={16} /> Filter by Language:
          </span>
          {languages.map(lang => (
            <button
              key={lang}
              onClick={() => setActiveLang(lang)}
              className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${
                activeLang === lang 
                  ? 'bg-pink-500 text-white shadow-md shadow-pink-200 transform scale-105' 
                  : 'bg-white border border-slate-200 text-slate-600 hover:border-pink-300 hover:text-pink-600 hover:bg-pink-50/50'
              }`}
            >
              {lang}
            </button>
          ))}
        </div>

        {/* Dictionary Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {filteredTerms.length > 0 ? (
            filteredTerms.map((item) => (
              <div key={item.id} className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-[2rem] p-6 sm:p-8 shadow-sm hover:shadow-xl hover:shadow-pink-100/40 hover:border-pink-200/60 transition-all duration-300 flex flex-col group">
                
                {/* Header: Term & Language */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h2 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-baseline gap-3">
                      {item.term}
                      <span className="text-sm font-medium text-slate-400 font-serif tracking-normal">
                        {item.pronunciation}
                      </span>
                    </h2>
                  </div>
                  <span className="bg-pink-50 text-pink-700 text-xs font-bold px-3 py-1.5 rounded-full border border-pink-100">
                    {item.language}
                  </span>
                </div>

                {/* Body: Meaning */}
                <p className="text-slate-600 text-base leading-relaxed mb-6 flex-grow">
                  {item.meaning}
                </p>

                {/* Lyric Context Block */}
                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5 mb-6 relative overflow-hidden">
                  <Quote size={80} className="absolute -top-4 -left-4 text-slate-100 rotate-180" />
                  <div className="relative z-10">
                    <p className="text-slate-700 font-medium italic mb-3">
                      {item.lyricContext}
                    </p>
                    <div className="flex items-center gap-2 text-xs font-bold text-slate-500">
                      <Music size={14} className="text-indigo-500" />
                      From the song: <span className="text-indigo-600 hover:underline cursor-pointer">{item.songExample}</span>
                    </div>
                  </div>
                </div>

                {/* Footer: Author & Upvotes */}
                <div className="border-t border-slate-100 pt-4 flex justify-between items-center mt-auto">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-pink-200 to-violet-200 rounded-full flex items-center justify-center text-pink-700 font-bold text-xs">
                      {item.author.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-medium text-slate-500">by {item.author}</span>
                  </div>
                  
                  <div className="flex gap-2">
                    <button 
                      onClick={() => handleUpvote(item.id)}
                      className="flex items-center gap-1.5 bg-slate-50 hover:bg-pink-50 border border-slate-200 hover:border-pink-200 text-slate-600 hover:text-pink-600 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors"
                    >
                      <ThumbsUp size={16} />
                      {item.upvotes}
                    </button>
                    <button className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 text-slate-600 px-3 py-1.5 rounded-lg text-sm font-bold transition-colors">
                      <MessageSquare size={16} />
                    </button>
                  </div>
                </div>

              </div>
            ))
          ) : (
            /* Empty State */
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-pink-200 rounded-[2rem] bg-pink-50/30 backdrop-blur-sm">
              <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mb-6 shadow-sm border border-pink-100">
                <Search size={32} className="text-pink-400" />
              </div>
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No terms found</h3>
              <p className="text-slate-500 max-w-md mb-6">
                Looks like this word hasn't been added to the Wiki yet. Be the first to define it for the community!
              </p>
              <button 
                onClick={() => setSearchQuery('')}
                className="flex items-center gap-2 bg-pink-600 text-white hover:bg-pink-700 px-6 py-3 rounded-xl font-bold transition-colors shadow-md shadow-pink-200"
              >
                <Sparkles size={18} /> Add "{searchQuery}" to Wiki
              </button>
            </div>
          )}
        </div>

      </div>
    </div>
  );
}