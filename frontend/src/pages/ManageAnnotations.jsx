import React, { useEffect, useMemo, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import Navbar from '../components/Navbar.jsx';
import { useToast } from '../components/Toast.jsx';
import { BASE_URL, API_ENDPOINTS } from '../utils/constants.js';
import {
  ArrowLeft,
  CheckCircle2,
  XCircle,
  MessageSquare,
  Clock3,
  BookOpenText,
  LockOpen,
  LoaderCircle,
  User,
} from 'lucide-react';

const STATUS_STYLES = {
  pending:  'bg-amber-50 text-amber-700 border border-amber-200',
  accepted: 'bg-emerald-50 text-emerald-700 border border-emerald-200',
  rejected: 'bg-rose-50 text-rose-700 border border-rose-200',
};

export default function ManageAnnotations() {
  const { songId } = useParams();
  const navigate = useNavigate();
  const { addToast } = useToast();

  const [song, setSong] = useState(null);
  const [annotations, setAnnotations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [fetchError, setFetchError] = useState('');
  // track which request IDs are mid-review
  const [reviewing, setReviewing] = useState(new Set());

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        setFetchError('');

        const [profileResponse, songResponse] = await Promise.all([
          axios.get(`${BASE_URL}${API_ENDPOINTS.PROFILE}`, { withCredentials: true }),
          axios.get(`${BASE_URL}${API_ENDPOINTS.SONGS}${songId}/`, { withCredentials: true }),
        ]);

        const user = profileResponse.data;
        const songInfo = songResponse.data;

        if (songInfo.author !== user.id) {
          setFetchError('Only the song author can view and manage annotation requests.');
          setLoading(false);
          return;
        }

        setSong(songInfo);

        // Fetch real annotation requests from the backend
        const annotationsResponse = await axios.get(
          `${BASE_URL}${API_ENDPOINTS.ANNOTATION_REQUESTS}?song=${songId}`,
          { withCredentials: true },
        );
        setAnnotations(annotationsResponse.data);
      } catch (error) {
        console.error('Failed to load manage annotations page:', error);
        if (error.response?.status === 401) {
          navigate('/login');
          return;
        }
        setFetchError('Unable to load the annotation review workspace.');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [navigate, songId]);

  const annotationStats = useMemo(() => ({
    total:    annotations.length,
    pending:  annotations.filter((a) => a.status === 'pending').length,
    accepted: annotations.filter((a) => a.status === 'accepted').length,
  }), [annotations]);

  const handleReview = async (annotationId, newStatus) => {
    setReviewing((prev) => new Set(prev).add(annotationId));
    try {
      const response = await axios.post(
        `${BASE_URL}${API_ENDPOINTS.ANNOTATION_REQUEST_REVIEW(annotationId)}`,
        { status: newStatus },
        { withCredentials: true },
      );
      // Remove the reviewed annotation from the list — the queue only shows pending items
      setAnnotations((prev) => prev.filter((a) => a.id !== annotationId));
      addToast({
        type: 'success',
        title: newStatus === 'accepted' ? 'Annotation accepted' : 'Annotation rejected',
        description: newStatus === 'accepted'
          ? "The contributor's proposed lyrics have been applied to your song."
          : "The annotation request has been rejected.",
      });
    } catch (error) {
      console.error('Failed to review annotation:', error);
      const description = error.response?.data?.error || 'Unable to review this annotation right now.';
      addToast({ type: 'error', title: 'Review failed', description });
    } finally {
      setReviewing((prev) => {
        const next = new Set(prev);
        next.delete(annotationId);
        return next;
      });
    }
  };

  return (
    <div className="min-h-screen bg-[#fafafa] selection:bg-indigo-100 selection:text-indigo-900 font-sans pb-24 relative flex flex-col">
      <Navbar />

      <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
        <div className="absolute top-[-10%] right-[-10%] w-[50%] h-[50%] bg-indigo-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-40" />
        <div className="absolute bottom-[20%] left-[-10%] w-[40%] h-[40%] bg-violet-200 rounded-full mix-blend-multiply filter blur-[120px] opacity-30" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 w-full pt-12">
        <div className="flex items-center gap-4 mb-8">
          <Link to="/annotations" className="p-2 text-slate-400 hover:text-slate-900 hover:bg-slate-100 rounded-full transition-colors">
            <ArrowLeft size={20} />
          </Link>
          <div>
            <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight">Manage Annotations</h1>
            <p className="text-slate-500 mt-1">Review contributor submissions and decide what to accept.</p>
          </div>
        </div>

        {fetchError && (
          <div className="mb-6 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm font-medium text-red-700">
            {fetchError}
          </div>
        )}

        {loading ? (
          <div className="flex items-center justify-center h-72 text-slate-400">
            <LoaderCircle size={28} className="animate-spin" />
          </div>
        ) : song ? (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left sidebar — song info */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-[2rem] p-6 shadow-sm">
                <span className="inline-flex items-center gap-2 rounded-full bg-sky-50 border border-sky-100 px-3 py-1 text-xs font-bold uppercase tracking-wider text-sky-700">
                  <LockOpen size={13} /> Open for Annotation
                </span>
                <h2 className="text-2xl font-extrabold text-slate-900 mt-4">{song.title}</h2>
                <p className="text-sm text-slate-500 mt-2">By {song.author_username}</p>
                <div className="mt-6 space-y-3 text-sm text-slate-600">
                  <div className="flex items-center gap-2">
                    <MessageSquare size={15} className="text-slate-400" />
                    {annotationStats.total} total contribution{annotationStats.total !== 1 ? 's' : ''}
                  </div>
                  <div className="flex items-center gap-2">
                    <Clock3 size={15} className="text-slate-400" />
                    {annotationStats.pending} pending review
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 size={15} className="text-slate-400" />
                    {annotationStats.accepted} accepted
                  </div>
                </div>
              </div>

              <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-[2rem] p-6 shadow-sm">
                <div className="flex items-center gap-2 mb-4">
                  <BookOpenText size={18} className="text-slate-400" />
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">Original Lyrics</h3>
                </div>
                <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-700 max-h-64 overflow-y-auto">
                  {song.original_lyrics || 'No lyrics available.'}
                </pre>
              </div>
            </div>

            {/* Right panel — annotation requests */}
            <div className="lg:col-span-8">
              <div className="bg-white/80 backdrop-blur-md border border-slate-200/60 rounded-[2rem] p-6 sm:p-8 shadow-sm">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-sm font-extrabold text-slate-900 uppercase tracking-wider">
                    Contributor Annotation Requests
                  </h3>
                  <span className="text-xs font-semibold text-slate-500">{annotationStats.total} items</span>
                </div>

                <div className="space-y-6">
                  {annotations.length ? annotations.map((annotation) => {
                    const isReviewing = reviewing.has(annotation.id);
                    const isPending = annotation.status === 'pending';
                    return (
                      <div key={annotation.id} className="rounded-2xl border border-slate-200 bg-slate-50 p-5">
                        {/* Header row */}
                        <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                          <div className="flex items-center gap-2">
                            <div className="w-8 h-8 rounded-full bg-indigo-100 flex items-center justify-center flex-shrink-0">
                              <User size={15} className="text-indigo-600" />
                            </div>
                            <div>
                              <p className="text-sm font-bold text-slate-900">{annotation.contributor_username}</p>
                              <p className="text-xs text-slate-400">
                                {new Date(annotation.created_at).toLocaleString('en-IN', {
                                  day: 'numeric', month: 'short', year: 'numeric',
                                  hour: 'numeric', minute: '2-digit',
                                })}
                              </p>
                            </div>
                          </div>
                          <span className={`inline-flex items-center rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${STATUS_STYLES[annotation.status] || STATUS_STYLES.pending}`}>
                            {annotation.status}
                          </span>
                        </div>

                        {/* Note from contributor */}
                        {annotation.note && (
                          <div className="mb-4 bg-white border border-slate-200 rounded-xl px-4 py-3">
                            <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Note from contributor</p>
                            <p className="text-sm text-slate-700 leading-relaxed">{annotation.note}</p>
                          </div>
                        )}

                        {/* Proposed lyrics */}
                        <div className="mb-4">
                          <p className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">Proposed Lyrics</p>
                          <pre className="whitespace-pre-wrap text-sm leading-7 text-slate-800 bg-white border border-slate-200 rounded-xl p-4 max-h-52 overflow-y-auto font-sans">
                            {annotation.proposed_lyrics}
                          </pre>
                        </div>

                        {/* Action buttons — only for pending */}
                        {isPending && (
                          <div className="flex gap-3">
                            <button
                              type="button"
                              onClick={() => handleReview(annotation.id, 'accepted')}
                              disabled={isReviewing}
                              className="inline-flex items-center gap-2 rounded-xl bg-slate-900 px-4 py-2 text-sm font-bold text-white hover:bg-slate-800 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {isReviewing ? <LoaderCircle size={14} className="animate-spin" /> : <CheckCircle2 size={15} />}
                              Accept
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReview(annotation.id, 'rejected')}
                              disabled={isReviewing}
                              className="inline-flex items-center gap-2 rounded-xl border border-rose-200 bg-white px-4 py-2 text-sm font-bold text-rose-600 hover:bg-rose-50 disabled:opacity-60 disabled:cursor-not-allowed"
                            >
                              {isReviewing ? <LoaderCircle size={14} className="animate-spin" /> : <XCircle size={15} />}
                              Reject
                            </button>
                          </div>
                        )}

                        {/* Reviewed timestamp */}
                        {annotation.reviewed_at && (
                          <p className="text-xs text-slate-400 mt-3">
                            Reviewed on{' '}
                            {new Date(annotation.reviewed_at).toLocaleString('en-IN', {
                              day: 'numeric', month: 'short', year: 'numeric',
                              hour: 'numeric', minute: '2-digit',
                            })}
                          </p>
                        )}
                      </div>
                    );
                  }) : (
                    <div className="rounded-2xl border-2 border-dashed border-slate-200 p-12 text-center text-slate-500">
                      <MessageSquare size={32} className="mx-auto mb-3 text-slate-300" />
                      <p className="font-semibold text-slate-700 mb-1">No annotation requests yet</p>
                      <p className="text-sm">When other users annotate your song, their contributions will appear here.</p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ) : null}
      </div>
    </div>
  );
}
