import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import { useToast } from '../components/Toast.jsx';
import { BASE_URL, API_ENDPOINTS } from '../utils/constants.js';
import { saveStoredAnnotation, getStoredAnnotations } from '../utils/annotationStore.js';
import {
  ArrowLeft, CheckCircle2, MessageSquare, Search, Globe2,
  X, FileText, BookOpenText, LoaderCircle,
} from 'lucide-react';

export default function Annotate() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [songData, setSongData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  const [activeSelectionType, setActiveSelectionType] = useState(null);
  const [selectedLines, setSelectedLines] = useState(new Set());
  const [selectedWord, setSelectedWord] = useState('');
  const [newAnnotation, setNewAnnotation] = useState('');
  const [contributions, setContributions] = useState([]);

  useEffect(() => {
    const fetchSong = async () => {
      try {
        setLoading(true);
        setFetchError('');
        const response = await axios.get(`${BASE_URL}${API_ENDPOINTS.SONGS}${id}/`, {
          withCredentials: true,
        });

        if (response.data.status !== 'PENDING' || !response.data.can_annotate) {
          throw new Error('This song is not currently accepting annotations.');
        }

        setSongData(response.data);
        setContributions(getStoredAnnotations(id));
      } catch (error) {
        console.error('Failed to load annotation workspace:', error);
        if (error.response?.status === 401) {
          navigate('/login');
          return;
        }
        setFetchError(error.message || 'Unable to load this annotation workspace.');
      } finally {
        setLoading(false);
      }
    };

    fetchSong();
  }, [id, navigate]);

  const lyricsData = useMemo(() => {
    const rawLyrics = songData?.original_lyrics || '';
    return rawLyrics
      .split('\n')
      .map((line) => line.trim())
      .filter(Boolean)
      .map((line, index) => ({ id: index + 1, text: line }));
  }, [songData]);

  const handleWordSelection = (word) => {
    setActiveSelectionType('word');
    setSelectedWord(word.replace(/[,.]/g, ''));
    setSelectedLines(new Set());
  };

  const handleLineSelectionToggle = (lineId) => {
    setActiveSelectionType('lines');
    setSelectedWord('');
    setSelectedLines((current) => {
      const next = new Set(current);
      if (next.has(lineId)) {
        next.delete(lineId);
      } else {
        next.add(lineId);
      }
      return next;
    });
  };

  const clearSelection = () => {
    setActiveSelectionType(null);
    setSelectedWord('');
    setSelectedLines(new Set());
    setNewAnnotation('');
  };

  const renderSelectedContext = () => {
    if (activeSelectionType === 'word' && selectedWord) {
      return `Word: ${selectedWord}`;
    }
    if (activeSelectionType === 'lines' && selectedLines.size > 0) {
      const sorted = [...selectedLines].sort((a, b) => a - b);
      return sorted.length === 1 ? `Line: ${sorted[0]}` : `Lines: ${sorted[0]} - ${sorted[sorted.length - 1]}`;
    }
    return null;
  };

  const handleSaveContribution = () => {
    const context = renderSelectedContext();
    if (!context || !newAnnotation.trim()) {
      return;
    }

    const next = saveStoredAnnotation(id, {
      contributor: 'Current User',
      lines: context,
      annotation: newAnnotation.trim(),
    });
    setContributions(next);
    clearSelection();
    addToast({
      type: 'success',
      title: 'Contribution saved',
      description: 'Your annotation is now available for the song author to review.',
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col">
        <Navbar />
        <div className="flex flex-1 items-center justify-center text-slate-500">
          <LoaderCircle size={24} className="animate-spin" />
        </div>
      </div>
    );
  }

  if (fetchError || !songData) {
    return (
      <div className="min-h-screen bg-[#fafafa] font-sans flex flex-col">
        <Navbar />
        <div className="max-w-3xl mx-auto px-4 sm:px-6 w-full mt-20">
          <div className="bg-white/80 border border-slate-200/60 rounded-[2rem] p-10 shadow-sm text-center">
            <h1 className="text-3xl font-extrabold text-slate-900 mb-3">Unable to open annotation workspace</h1>
            <p className="text-slate-500 mb-6">{fetchError}</p>
            <Link to="/explore" className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-5 py-3 text-sm font-bold text-white hover:bg-slate-800">
              <ArrowLeft size={16} /> Back to Explore
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-indigo-100 selection:text-indigo-900 font-sans pb-24 relative flex flex-col">
      <Navbar />

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40" />
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-violet-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-30" />
      </div>

      <div className="sticky top-16 z-40 backdrop-blur-xl bg-white/70 border-b border-slate-200/60 py-4 mb-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 flex justify-between items-center">
          <div className="flex items-center gap-4">
            <Link to="/explore" className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
              <ArrowLeft size={20} />
            </Link>
            <div className="flex flex-col">
              <span className="text-xs font-medium text-slate-500">Annotating:</span>
              <h1 className="text-xl font-bold text-slate-900 tracking-tight">{songData.title} by {songData.author_username}</h1>
            </div>
          </div>
          <button
            onClick={handleSaveContribution}
            disabled={!activeSelectionType || !newAnnotation.trim()}
            className="flex items-center gap-2 px-6 py-2.5 bg-slate-900 disabled:bg-slate-700 hover:bg-slate-800 text-white rounded-full text-sm font-semibold shadow-md"
          >
            <CheckCircle2 size={16} /> Save Contribution
          </button>
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full flex-grow">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
          <div className="lg:col-span-8">
            <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-[2rem] p-8 sm:p-12 shadow-sm min-h-[500px]">
              <div className="space-y-6">
                {lyricsData.map((line) => {
                  const isLineSelected = selectedLines.has(line.id);
                  return (
                    <div key={line.id} className={`relative flex items-start gap-4 p-4 -mx-4 rounded-2xl transition-all ${isLineSelected ? 'bg-indigo-50 border border-indigo-200 shadow-inner' : 'hover:bg-slate-50'}`}>
                      <input
                        type="checkbox"
                        checked={isLineSelected}
                        onChange={() => handleLineSelectionToggle(line.id)}
                        className="mt-2 h-5 w-5 rounded-md border-slate-300 text-indigo-600 focus:ring-indigo-600/20"
                      />
                      <div className="text-xs font-bold text-slate-300 mt-2 select-none w-4">{line.id}</div>
                      <div className="flex-1">
                        <p className={`text-2xl sm:text-3xl font-bold ${isLineSelected ? 'text-indigo-950' : 'text-slate-800'} leading-snug`}>
                          {line.text.split(' ').map((word, wordIndex) => (
                            <span key={`${line.id}-${wordIndex}`} className="relative inline-block group">
                              <span
                                onClick={() => handleWordSelection(word)}
                                className={`cursor-pointer transition-colors ${activeSelectionType === 'word' && selectedWord === word.replace(/[,.]/g, '') ? 'text-indigo-600 bg-indigo-100 rounded-md px-1' : 'group-hover:text-indigo-600 group-hover:bg-indigo-50 rounded-md'}`}
                              >
                                {word}
                              </span>{' '}
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

          <div className="lg:col-span-4 flex flex-col gap-6">
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
                  <div className="bg-indigo-50 text-indigo-900 p-4 rounded-2xl border border-indigo-100 font-bold flex items-center justify-between gap-3">
                    <span className="truncate">{renderSelectedContext()}</span>
                    <MessageSquare size={18} className="text-indigo-400 shrink-0" />
                  </div>
                  <div>
                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Annotation / Suggest Edit</label>
                    <textarea
                      rows="4"
                      value={newAnnotation}
                      onChange={(event) => setNewAnnotation(event.target.value)}
                      placeholder={`Add your explanation or suggest better words for ${renderSelectedContext()}...`}
                      className="w-full p-4 bg-slate-50 border border-slate-200 rounded-2xl text-slate-900 font-medium resize-none focus:outline-none focus:ring-2 focus:ring-indigo-600/20 focus:border-indigo-600"
                    />
                  </div>
                  {activeSelectionType === 'word' && (
                    <div className="border-t border-slate-100 pt-6">
                      <div className="flex gap-2 mb-4">
                        <BookOpenText size={20} className="text-slate-400" />
                        <h4 className="text-sm font-bold text-slate-900">Look Up: '{selectedWord}'</h4>
                      </div>
                      <div className="space-y-4">
                        <div>
                          <h5 className="text-xs font-bold text-slate-500 mb-1.5 uppercase">Suggested context</h5>
                          <p className="text-xs font-medium text-slate-600 leading-relaxed bg-slate-50 p-3 rounded-lg border border-slate-100">
                            Use this space to explain local idioms, cultural references, or better word choices for future readers.
                          </p>
                        </div>
                      </div>
                    </div>
                  )}
                  {activeSelectionType === 'lines' && selectedLines.size > 0 && (
                    <div className="border-t border-slate-100 pt-6">
                      <div className="flex items-center gap-3 bg-violet-50 text-violet-800 p-4 rounded-2xl border border-violet-100">
                        <Globe2 size={20} className="text-violet-500" />
                        <div className="flex flex-col">
                          <p className="text-xs font-bold text-violet-900 mb-1">Line-level note</p>
                          <p className="text-sm font-medium leading-snug">Suggest phrasing, context, or translation guidance for the selected lines.</p>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              ) : (
                <div className="flex flex-col items-center justify-center text-center py-12 text-slate-500">
                  <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mb-6 border-4 border-white shadow-inner">
                    <FileText size={24} className="text-slate-400" />
                  </div>
                  <h4 className="text-base font-extrabold text-slate-800 mb-1.5">Select lyrics to annotate</h4>
                  <p className="text-sm leading-relaxed max-w-xs font-medium">Pick a word or lines from the lyrics and submit your contribution.</p>
                </div>
              )}
            </div>

            <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-3xl p-6 sm:p-8 shadow-sm">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Recent Contributions</h3>
                <span className="text-xs font-semibold text-slate-500">{contributions.length} saved</span>
              </div>
              <div className="space-y-5">
                {contributions.length ? contributions.map((contribution) => (
                  <div key={contribution.id} className="border-b border-slate-100 pb-5 last:border-0 last:pb-0">
                    <div className="flex justify-between items-start gap-2 mb-2">
                      <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">{contribution.lines}</span>
                      <span className="text-xs font-semibold text-slate-400">{new Date(contribution.created_at).toLocaleDateString('en-IN')}</span>
                    </div>
                    <p className="text-sm font-medium text-slate-800 leading-relaxed">{contribution.annotation}</p>
                  </div>
                )) : (
                  <div className="text-sm text-slate-500">No contributions saved for this song yet.</div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
