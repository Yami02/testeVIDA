import { useState, useEffect } from 'react';

interface DriveFile {
  id: string;
  name: string;
  mimeType: string;
}

export function useDrivePhotos(folderId: string | null) {
  const [photos, setPhotos] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!folderId) return;

    const apiKey = import.meta.env.VITE_GOOGLE_API_KEY;
    if (!apiKey) {
      console.error('VITE_GOOGLE_API_KEY não configurada');
      setError('Missing Google API Key');
      return;
    }

    const fetchPhotos = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(
          `https://www.googleapis.com/drive/v3/files?q='${folderId}'+in+parents&key=${apiKey}&fields=files(id,name,mimeType)`
        );

        if (!response.ok) {
          throw new Error(`Error fetching from Drive: ${response.statusText}`);
        }

        const data = await response.json();
        
        if (data.files) {
          const imageIds = data.files
            .filter((file: DriveFile) => file.mimeType.startsWith('image/'))
            .map((file: DriveFile) => file.id);
          
          setPhotos(imageIds);
        }
      } catch (err: any) {
        setError(err.message || 'Failed to fetch photos');
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [folderId]);

  return { photos, loading, error };
}
