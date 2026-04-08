const STORAGE_PREFIX = 'lyricsverse-annotations-';

function getStorageKey(songId) {
  return `${STORAGE_PREFIX}${songId}`;
}

export function getStoredAnnotations(songId) {
  try {
    return JSON.parse(localStorage.getItem(getStorageKey(songId)) || '[]');
  } catch {
    return [];
  }
}

export function saveStoredAnnotation(songId, annotation) {
  const current = getStoredAnnotations(songId);
  const next = [
    {
      id: `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      status: 'pending',
      created_at: new Date().toISOString(),
      ...annotation,
    },
    ...current,
  ];
  localStorage.setItem(getStorageKey(songId), JSON.stringify(next));
  return next;
}

export function updateStoredAnnotation(songId, annotationId, updates) {
  const current = getStoredAnnotations(songId);
  const next = current.map((annotation) =>
    annotation.id === annotationId
      ? {
          ...annotation,
          ...updates,
          reviewed_at: new Date().toISOString(),
        }
      : annotation,
  );
  localStorage.setItem(getStorageKey(songId), JSON.stringify(next));
  return next;
}
