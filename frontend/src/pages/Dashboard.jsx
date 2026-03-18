import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Plus, 
  Music, 
  MoreVertical, 
  Trash2, 
  Edit3, 
  Share2, 
  Globe2, 
  BookOpen, 
  TrendingUp,
  X,
  AlertCircle
} from 'lucide-react';
import Navbar from '../components/Navbar';

export default function Dashboard() {
  const navigate = useNavigate();
  
  // State for search, filtering, and our Dialog Box
  const [searchQuery, setSearchQuery] = useState('');
  const [activeTab, setActiveTab] = useState('All');
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [songToDelete, setSongToDelete] = useState(null);

  // Mock Data for the user's songs
  const [songs, setSongs] = useState([
    { id: 1, title: 'Midnight Rain', artist: 'Jane Doe', originalLang: 'English', translatedTo: ['Hindi', 'Marathi'], status: 'Published', date: 'Oct 12, 2023', views: 1205 },
    { id: 2, title: 'Echoes of Mumbai', artist: 'Jane Doe', originalLang: 'English', translatedTo: ['Hindi'], status: 'Draft', date: 'Oct 28, 2023', views: 0 },
    { id: 3, title: 'Desert Rose', artist: 'Jane Doe', originalLang: 'English', translatedTo: ['Marathi'], status: 'Published', date: 'Nov 05, 2023', views: 840 },
  ]);

  // Dialog Box Handlers
  const openDeleteDialog = (song) => {
    setSongToDelete(song);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = () => {
    setSongs(songs.filter(s => s.id !== songToDelete.id));
    setIsDeleteDialogOpen(false);
    setSongToDelete(null);
  };

  // Filter Logic
  const filteredSongs = songs.filter(song => {
    const matchesSearch = song.title.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesTab = activeTab === 'All' || song.status === activeTab;
    return matchesSearch && matchesTab;
  });

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-indigo-100 selection:text-indigo-900 font-sans pb-20 relative">
      <Navbar />
      {/* Custom Animation for the Dialog Box */}
      <style>{`
        @keyframes modalScale {
          from { opacity: 0; transform: scale(0.95) translateY(10px); }
          to { opacity: 1; transform: scale(1) translateY(0); }
        }
        .animate-modal {
          animation: modalScale 0.3s cubic-bezier(0.16, 1, 0.3, 1) forwards;
        }
      `}</style>

      {/* Ambient Background Glow */}
      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[50%] h-[30%] bg-indigo-200/40 rounded-full mix-blend-multiply filter blur-[120px]"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12">
        
        {/* Page Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-10">
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">My Workspace</h1>
            <p className="text-slate-500 mt-1">Manage your lyrics, translations, and wiki contributions.</p>
          </div>
          <button 
            onClick={() => navigate('/contribute')}
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-6 py-3 rounded-full text-sm font-semibold shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-0.5 whitespace-nowrap"
          >
            <Plus size={18} />
            Create New Song
          </button>
        </div>

        {/* Quick Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
          {[
            { label: 'Total Songs', value: songs.length, icon: Music, color: 'text-indigo-600', bg: 'bg-indigo-50' },
            { label: 'Wiki Annotations', value: '24', icon: BookOpen, color: 'text-pink-600', bg: 'bg-pink-50' },
            { label: 'Total Views', value: '2.4k', icon: TrendingUp, color: 'text-emerald-600', bg: 'bg-emerald-50' }
          ].map((stat, i) => (
            <div key={i} className="bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm flex items-center gap-5 hover:shadow-md transition-shadow">
              <div className={`w-14 h-14 rounded-full ${stat.bg} flex items-center justify-center`}>
                <stat.icon size={24} className={stat.color} />
              </div>
              <div>
                <p className="text-sm font-bold text-slate-500 uppercase tracking-wider mb-1">{stat.label}</p>
                <h3 className="text-3xl font-extrabold text-slate-900">{stat.value}</h3>
              </div>
            </div>
          ))}
        </div>

        {/* Search & Filter Bar */}
        <div className="bg-white border border-slate-200/60 rounded-2xl p-2 sm:p-4 shadow-sm mb-8 flex flex-col sm:flex-row gap-4 justify-between items-center sticky top-24 z-30 backdrop-blur-xl bg-white/80">
          
          {/* Tabs */}
          <div className="flex bg-slate-100/80 p-1 rounded-xl w-full sm:w-auto overflow-x-auto">
            {['All', 'Published', 'Draft'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`flex-1 sm:flex-none px-6 py-2 rounded-lg text-sm font-bold transition-all ${activeTab === tab ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
              >
                {tab}
              </button>
            ))}
          </div>

          {/* Search Input */}
          <div className="relative w-full sm:w-72">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={16} className="text-slate-400" />
            </div>
            <input
              type="text"
              placeholder="Search your songs..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-sm text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600 focus:bg-white transition-all"
            />
          </div>
        </div>

        {/* Song Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredSongs.length > 0 ? (
            filteredSongs.map((song) => (
              <div key={song.id} className="group bg-white border border-slate-200/60 rounded-2xl p-6 shadow-sm hover:shadow-xl hover:border-indigo-100 transition-all duration-300 flex flex-col">
                
                {/* Card Header (Status & Menu) */}
                <div className="flex justify-between items-start mb-4">
                  <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                    song.status === 'Published' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200/50' : 'bg-amber-50 text-amber-700 border border-amber-200/50'
                  }`}>
                    {song.status}
                  </span>
                  
                  {/* Dropdown Menu Trigger (Mockup) */}
                  <div className="relative">
                    <button className="p-1.5 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors">
                      <MoreVertical size={18} />
                    </button>
                    {/* Hover Menu */}
                    <div className="absolute right-0 mt-1 w-36 bg-white border border-slate-200 rounded-xl shadow-lg opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-20 overflow-hidden origin-top-right transform scale-95 group-hover:scale-100">
                      <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-medium transition-colors">
                        <Edit3 size={14} /> Edit
                      </button>
                      {song.status === 'Published' && (
                        <button className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-slate-600 hover:bg-slate-50 hover:text-indigo-600 font-medium transition-colors">
                          <Share2 size={14} /> Share
                        </button>
                      )}
                      <div className="border-t border-slate-100"></div>
                      <button 
                        onClick={() => openDeleteDialog(song)}
                        className="w-full flex items-center gap-2 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 font-medium transition-colors"
                      >
                        <Trash2 size={14} /> Delete
                      </button>
                    </div>
                  </div>
                </div>

                {/* Card Body */}
                <div className="flex-grow cursor-pointer" onClick={() => navigate('/contribute')}>
                  <h3 className="text-xl font-extrabold text-slate-900 mb-1 group-hover:text-indigo-600 transition-colors line-clamp-1">{song.title}</h3>
                  <p className="text-sm text-slate-500 mb-6 line-clamp-1">{song.artist}</p>
                  
                  <div className="flex flex-wrap gap-2 mb-6">
                    <div className="flex items-center gap-1.5 bg-slate-50 border border-slate-200 px-2.5 py-1 rounded-md text-xs font-semibold text-slate-600">
                      <Globe2 size={12} className="text-slate-400" />
                      {song.originalLang}
                    </div>
                    {song.translatedTo.map(lang => (
                      <div key={lang} className="flex items-center gap-1.5 bg-indigo-50/50 border border-indigo-100 px-2.5 py-1 rounded-md text-xs font-semibold text-indigo-700">
                        <Globe2 size={12} className="text-indigo-400" />
                        {lang}
                      </div>
                    ))}
                  </div>
                </div>

                {/* Card Footer */}
                <div className="border-t border-slate-100 pt-4 flex justify-between items-center mt-auto">
                  <span className="text-xs font-medium text-slate-400">Edited {song.date}</span>
                  {song.status === 'Published' && (
                    <span className="flex items-center gap-1.5 text-xs font-bold text-slate-500">
                      <TrendingUp size={14} className="text-slate-400" />
                      {song.views} views
                    </span>
                  )}
                </div>

              </div>
            ))
          ) : (
            /* Empty State */
            <div className="col-span-full py-20 flex flex-col items-center justify-center text-center border-2 border-dashed border-slate-200 rounded-3xl bg-slate-50/50">
              <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm mb-4">
                <Music size={28} className="text-slate-300" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 mb-2">No songs found</h3>
              <p className="text-slate-500 text-sm max-w-sm">
                {searchQuery ? "We couldn't find any songs matching your search." : "You haven't created any songs yet. Start writing your first masterpiece!"}
              </p>
              {!searchQuery && (
                <button 
                  onClick={() => navigate('/contribute')}
                  className="mt-6 flex items-center gap-2 bg-indigo-50 text-indigo-600 hover:bg-indigo-100 px-6 py-2.5 rounded-full text-sm font-bold transition-colors"
                >
                  <Plus size={16} /> Write a Song
                </button>
              )}
            </div>
          )}
        </div>

      </div>

      {/* Delete Confirmation Dialog Box (Modal) */}
      {isDeleteDialogOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-slate-900/40 backdrop-blur-sm transition-opacity"
            onClick={() => setIsDeleteDialogOpen(false)}
          ></div>
          
          {/* Modal Content */}
          <div className="relative bg-white rounded-[2rem] shadow-2xl w-full max-w-md p-6 sm:p-8 animate-modal border border-slate-100">
            
            <button 
              onClick={() => setIsDeleteDialogOpen(false)}
              className="absolute top-6 right-6 p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-full transition-colors"
            >
              <X size={20} />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100">
                <AlertCircle size={32} className="text-red-500" />
              </div>
              
              <h3 className="text-2xl font-extrabold text-slate-900 mb-2 tracking-tight">
                Delete Song?
              </h3>
              
              <p className="text-slate-500 mb-8 leading-relaxed">
                Are you sure you want to delete <span className="font-bold text-slate-900">"{songToDelete?.title}"</span>? This action cannot be undone and will remove all associated wiki annotations.
              </p>

              <div className="flex gap-3 w-full">
                <button 
                  onClick={() => setIsDeleteDialogOpen(false)}
                  className="flex-1 py-3.5 px-4 bg-slate-50 hover:bg-slate-100 text-slate-700 rounded-xl text-sm font-bold transition-colors border border-slate-200"
                >
                  Cancel
                </button>
                <button 
                  onClick={confirmDelete}
                  className="flex-1 py-3.5 px-4 bg-red-600 hover:bg-red-700 text-white rounded-xl text-sm font-bold shadow-md hover:shadow-lg transition-all"
                >
                  Yes, Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}