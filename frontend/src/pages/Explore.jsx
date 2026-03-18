import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
    Search,
    Globe2,
    Heart,
    BookOpen,
    SearchIcon,
    PlayCircle,
    TrendingUp,
    Sparkles,
    Music,
    ChevronRight
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Explore() {
    const navigate = useNavigate();

    // State for search and filters
    const [searchQuery, setSearchQuery] = useState('');
    const [activeLanguage, setActiveLanguage] = useState('All');
    const [activeGenre, setActiveGenre] = useState('All');

    // Filter Options
    const languages = ['All', 'Hindi', 'Marathi', 'Tamil', 'Punjabi', 'Bengali'];
    const genres = ['All', 'Pop', 'Folk', 'Indie', 'Acoustic', 'R&B'];

    // Mock Data for the Community Songs
    const allSongs = [
        { id: 1, title: 'Midnight Rain', artist: 'Arjun Jay', genre: 'Pop', originalLang: 'English', translatedTo: ['Hindi', 'Marathi'], likes: 1205, annotations: 14, color: 'from-blue-500 to-indigo-500' },
        { id: 2, title: 'Desert Rose', artist: 'Priya Sharma', genre: 'Folk', originalLang: 'English', translatedTo: ['Marathi', 'Punjabi'], likes: 840, annotations: 8, color: 'from-amber-400 to-orange-500' },
        { id: 3, title: 'Neon Lights', artist: 'The Wanderers', genre: 'Indie', originalLang: 'English', translatedTo: ['Hindi', 'Tamil'], likes: 2300, annotations: 32, color: 'from-pink-500 to-rose-500' },
        { id: 4, title: 'Acoustic Heart', artist: 'David Chen', genre: 'Acoustic', originalLang: 'English', translatedTo: ['Bengali'], likes: 450, annotations: 3, color: 'from-emerald-400 to-teal-500' },
        { id: 5, title: 'City Whispers', artist: 'Maya & Co.', genre: 'R&B', originalLang: 'English', translatedTo: ['Hindi', 'Marathi'], likes: 1890, annotations: 21, color: 'from-violet-500 to-fuchsia-500' },
        { id: 6, title: 'Ocean Waves', artist: 'Samir', genre: 'Pop', originalLang: 'English', translatedTo: ['Tamil'], likes: 670, annotations: 5, color: 'from-cyan-400 to-blue-500' },
    ];

    // Filtering Logic
    const filteredSongs = allSongs.filter(song => {
        const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase()) || song.artist.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesLang = activeLanguage === 'All' || song.translatedTo.includes(activeLanguage);
        const matchesGenre = activeGenre === 'All' || song.genre === activeGenre;
        return matchesSearch && matchesLang && matchesGenre;
    });

    return (
        <div className="min-h-screen bg-[#fafafa] selection:bg-indigo-100 selection:text-indigo-900 font-sans pb-24 relative flex flex-col">
            <Navbar />
            {/* Ambient Background Glow */}
            <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
                <div className="absolute top-0 right-0 w-[50%] h-[40%] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[120px]"></div>
                <div className="absolute top-40 left-[-10%] w-[40%] h-[40%] bg-purple-200/40 rounded-full mix-blend-multiply filter blur-[120px]"></div>
            </div>

            <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 w-full">

                {/* Page Header & Search */}
                <div className="flex flex-col items-center text-center mb-16">
                    <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-100 text-indigo-700 text-sm font-semibold mb-6">
                        <Sparkles size={16} />
                        <span>Community Library</span>
                    </div>

                    <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 tracking-tight mb-6">
                        Explore <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-500">Lyricsverse</span>
                    </h1>
                    <p className="text-lg text-slate-500 max-w-2xl mb-10">
                        Discover thousands of songs translated into regional languages, complete with cultural annotations and deep meanings.
                    </p>

                    {/* Large Search Bar */}


                    <div className="relative w-full max-w-md">
                        {/* The Icon Wrapper */}
                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <Search className="h-5 w-5 text-slate-400" />
                        </div>

                        {/* The Input Field */}
                        <input
                            type="text"
                            placeholder="Search songs..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-full pl-10 pr-4 py-2 bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-600 focus:border-transparent transition-all"
                        />
                    </div>
                </div>

                {/* Filters Section */}
                <div className="bg-white/60 backdrop-blur-md border border-slate-200/60 rounded-[2rem] p-6 sm:p-8 shadow-sm mb-12">

                    {/* Language Filter */}
                    <div className="mb-6">
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Globe2 size={14} /> Language
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {languages.map(lang => (
                                <button
                                    key={lang}
                                    onClick={() => setActiveLanguage(lang)}
                                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${activeLanguage === lang
                                            ? 'bg-slate-900 text-white shadow-md transform scale-105'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50'
                                        }`}
                                >
                                    {lang}
                                </button>
                            ))}
                        </div>
                    </div>

                    {/* Genre Filter */}
                    <div>
                        <h3 className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-3 flex items-center gap-2">
                            <Music size={14} /> Genre
                        </h3>
                        <div className="flex flex-wrap gap-2">
                            {genres.map(genre => (
                                <button
                                    key={genre}
                                    onClick={() => setActiveGenre(genre)}
                                    className={`px-5 py-2 rounded-full text-sm font-bold transition-all duration-200 ${activeGenre === genre
                                            ? 'bg-indigo-600 text-white shadow-md shadow-indigo-200 transform scale-105'
                                            : 'bg-white border border-slate-200 text-slate-600 hover:border-indigo-300 hover:text-indigo-600 hover:bg-indigo-50/50'
                                        }`}
                                >
                                    {genre}
                                </button>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Results Header */}
                <div className="flex justify-between items-end mb-8">
                    <div>
                        <h2 className="text-2xl font-extrabold text-slate-900 flex items-center gap-2">
                            <TrendingUp className="text-indigo-600" size={24} />
                            {searchQuery ? 'Search Results' : 'Trending Now'}
                        </h2>
                        <p className="text-slate-500 text-sm mt-1">Showing {filteredSongs.length} songs</p>
                    </div>
                </div>

                {/* Songs Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
                    {filteredSongs.length > 0 ? (
                        filteredSongs.map((song) => (
                            <div
                                key={song.id}
                                className="group bg-white border border-slate-200/60 rounded-[2rem] p-4 shadow-sm hover:shadow-2xl hover:shadow-indigo-100/50 hover:-translate-y-1 transition-all duration-300 cursor-pointer flex flex-col"
                                onClick={() => navigate('/song-view')} // Setup this route next!
                            >

                                {/* Abstract Album Art */}
                                <div className={`w-full aspect-video rounded-2xl bg-gradient-to-br ${song.color} mb-5 relative overflow-hidden shadow-inner flex items-center justify-center`}>
                                    {/* Decorative glass overlay */}
                                    <div className="absolute inset-0 bg-white/10 backdrop-blur-[2px]"></div>

                                    {/* Hover Play Button */}
                                    <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/20 backdrop-blur-sm">
                                        <div className="w-14 h-14 bg-white/90 rounded-full flex items-center justify-center shadow-lg transform scale-75 group-hover:scale-100 transition-transform duration-300">
                                            <PlayCircle size={28} className="text-indigo-600 ml-1" />
                                        </div>
                                    </div>

                                    {/* Genre Badge */}
                                    <div className="absolute top-3 right-3 bg-white/20 backdrop-blur-md border border-white/30 text-white text-xs font-bold px-3 py-1.5 rounded-full">
                                        {song.genre}
                                    </div>
                                </div>

                                {/* Song Info */}
                                <div className="px-2 flex-grow">
                                    <h3 className="text-xl font-extrabold text-slate-900 mb-1 line-clamp-1">{song.title}</h3>
                                    <p className="text-sm font-medium text-slate-500 mb-4">{song.artist}</p>

                                    {/* Translation Path */}
                                    <div className="flex items-center gap-2 text-xs font-bold text-slate-400 uppercase tracking-wider mb-5 bg-slate-50 w-fit px-3 py-1.5 rounded-lg border border-slate-100">
                                        <span className="text-slate-600">{song.originalLang}</span>
                                        <ChevronRight size={14} className="text-indigo-400" />
                                        <span className="text-indigo-600">{song.translatedTo.join(', ')}</span>
                                    </div>
                                </div>

                                {/* Card Footer (Stats) */}
                                <div className="px-2 pt-4 border-t border-slate-100 flex items-center justify-between mt-auto">
                                    <div className="flex gap-4">
                                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 group-hover:text-pink-600 transition-colors">
                                            <Heart size={16} className="group-hover:fill-pink-600 transition-colors" />
                                            {song.likes}
                                        </div>
                                        <div className="flex items-center gap-1.5 text-sm font-semibold text-slate-500 group-hover:text-indigo-600 transition-colors">
                                            <BookOpen size={16} />
                                            {song.annotations}
                                        </div>
                                    </div>
                                    <div className="w-8 h-8 rounded-full bg-slate-50 flex items-center justify-center group-hover:bg-indigo-50 group-hover:text-indigo-600 transition-colors text-slate-400">
                                        <ChevronRight size={18} />
                                    </div>
                                </div>

                            </div>
                        ))
                    ) : (
                        /* Empty State */
                        <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-[2rem] bg-white/50 backdrop-blur-sm">
                            <div className="w-20 h-20 bg-slate-100 rounded-full flex items-center justify-center mb-6">
                                <Search size={32} className="text-slate-400" />
                            </div>
                            <h3 className="text-2xl font-extrabold text-slate-900 mb-2">No songs found</h3>
                            <p className="text-slate-500 max-w-md">
                                We couldn't find any songs matching your exact search and filters. Try adjusting your categories or search terms.
                            </p>
                            <button
                                onClick={() => { setSearchQuery(''); setActiveGenre('All'); setActiveLanguage('All'); }}
                                className="mt-6 px-6 py-3 bg-white border-2 border-slate-200 text-slate-700 hover:border-indigo-300 hover:text-indigo-600 rounded-xl font-bold transition-colors"
                            >
                                Clear all filters
                            </button>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}