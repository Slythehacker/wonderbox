import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { supabase } from '@/integrations/supabase/client';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  Upload, 
  Trash2, 
  PlayCircle, 
  Image, 
  Video, 
  FileText,
  Loader2
} from 'lucide-react';

interface MovieUpload {
  movie_id: string;
  movie_title: string;
  movie_type: string;
  quality: string;
  files: {
    movie?: File;
    trailer?: File;
    poster?: File;
    thumbnail?: File;
  };
}

export const MovieDownloadManager: React.FC = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const [uploads, setUploads] = useState<MovieUpload[]>([]);
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState<Record<string, number>>({});

  const addMovieUpload = () => {
    const newUpload: MovieUpload = {
      movie_id: `movie_${Date.now()}`,
      movie_title: '',
      movie_type: 'movie',
      quality: '1080p',
      files: {}
    };
    setUploads([...uploads, newUpload]);
  };

  const updateUpload = (index: number, field: keyof MovieUpload, value: any) => {
    const updatedUploads = [...uploads];
    updatedUploads[index] = { ...updatedUploads[index], [field]: value };
    setUploads(updatedUploads);
  };

  const updateUploadFile = (index: number, fileType: keyof MovieUpload['files'], file: File) => {
    const updatedUploads = [...uploads];
    updatedUploads[index].files[fileType] = file;
    setUploads(updatedUploads);
  };

  const removeUpload = (index: number) => {
    setUploads(uploads.filter((_, i) => i !== index));
  };

  const uploadFile = async (file: File, bucket: string, path: string) => {
    const { data, error } = await supabase.storage
      .from(bucket)
      .upload(path, file, {
        cacheControl: '3600',
        upsert: true
      });

    if (error) throw error;
    return data.path;
  };

  const uploadMoviePackage = async (upload: MovieUpload) => {
    if (!upload.movie_title || !upload.files.movie) {
      throw new Error('Movie title and movie file are required');
    }

    const movieId = upload.movie_id;
    const basePath = `${movieId}`;
    
    // Upload files to different buckets
    const filePaths: Record<string, string> = {};

    // Upload movie file
    if (upload.files.movie) {
      const moviePath = `${basePath}.${upload.files.movie.name.split('.').pop()}`;
      filePaths.movie = await uploadFile(upload.files.movie, 'movies', moviePath);
    }

    // Upload trailer
    if (upload.files.trailer) {
      const trailerPath = `${basePath}_trailer.${upload.files.trailer.name.split('.').pop()}`;
      filePaths.trailer = await uploadFile(upload.files.trailer, 'trailers', trailerPath);
    }

    // Upload poster
    if (upload.files.poster) {
      const posterPath = `${basePath}_poster.${upload.files.poster.name.split('.').pop()}`;
      filePaths.poster = await uploadFile(upload.files.poster, 'posters', posterPath);
    }

    // Upload thumbnail
    if (upload.files.thumbnail) {
      const thumbnailPath = `${basePath}_thumb.${upload.files.thumbnail.name.split('.').pop()}`;
      filePaths.thumbnail = await uploadFile(upload.files.thumbnail, 'thumbnails', thumbnailPath);
    }

    // Save movie storage record
    const { error: dbError } = await supabase
      .from('movie_storage')
      .insert([{
        movie_id: movieId,
        movie_title: upload.movie_title,
        movie_type: upload.movie_type,
        file_path: filePaths.movie,
        trailer_path: filePaths.trailer,
        poster_path: filePaths.poster,
        thumbnail_path: filePaths.thumbnail,
        file_size: upload.files.movie?.size || 0,
        quality: upload.quality,
        download_status: 'completed'
      }]);

    if (dbError) throw dbError;
  };

  const handleUploadAll = async () => {
    if (uploads.length === 0) return;

    setUploading(true);
    const totalUploads = uploads.length;
    let completed = 0;

    try {
      for (const upload of uploads) {
        setUploadProgress({ [upload.movie_id]: 0 });
        
        // Simulate progress updates
        const progressInterval = setInterval(() => {
          setUploadProgress(prev => ({
            ...prev,
            [upload.movie_id]: Math.min((prev[upload.movie_id] || 0) + Math.random() * 20, 90)
          }));
        }, 500);

        await uploadMoviePackage(upload);
        
        clearInterval(progressInterval);
        setUploadProgress(prev => ({ ...prev, [upload.movie_id]: 100 }));
        completed++;

        toast({
          title: "Upload Complete",
          description: `${upload.movie_title} has been uploaded successfully.`
        });
      }

      // Clear uploads after successful upload
      setUploads([]);
      setUploadProgress({});
      
      toast({
        title: "All Uploads Complete",
        description: `Successfully uploaded ${totalUploads} movie(s).`
      });

    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload Failed",
        description: error instanceof Error ? error.message : "An error occurred during upload.",
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

  return (
    <Card className="bg-gradient-card border-border/50">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <span className="flex items-center gap-2">
            <Upload className="h-5 w-5 text-primary" />
            Movie Upload Manager
          </span>
          <div className="flex gap-2">
            <Button 
              onClick={addMovieUpload}
              size="sm"
              variant="outline"
              disabled={uploading}
            >
              Add Movie
            </Button>
            {uploads.length > 0 && (
              <Button 
                onClick={handleUploadAll}
                size="sm"
                disabled={uploading}
                className="bg-primary hover:bg-primary/90"
              >
                {uploading ? (
                  <>
                    <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  <>
                    <Upload className="h-4 w-4 mr-2" />
                    Upload All
                  </>
                )}
              </Button>
            )}
          </div>
        </CardTitle>
      </CardHeader>
      <CardContent>
        {uploads.length === 0 ? (
          <div className="text-center py-8">
            <Upload className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-lg font-semibold mb-2">No Movies Queued</h3>
            <p className="text-muted-foreground mb-4">
              Add movies to upload them to the storage system
            </p>
            <Button onClick={addMovieUpload}>
              <Upload className="h-4 w-4 mr-2" />
              Add Your First Movie
            </Button>
          </div>
        ) : (
          <div className="space-y-6">
            {uploads.map((upload, index) => (
              <Card key={upload.movie_id} className="border-border/30">
                <CardContent className="p-4">
                  <div className="flex items-start justify-between mb-4">
                    <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Movie Title</label>
                        <input
                          type="text"
                          value={upload.movie_title}
                          onChange={(e) => updateUpload(index, 'movie_title', e.target.value)}
                          className="w-full px-3 py-2 bg-input border border-border rounded-md text-sm"
                          placeholder="Enter movie title"
                          disabled={uploading}
                        />
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Type</label>
                        <Select 
                          value={upload.movie_type} 
                          onValueChange={(value) => updateUpload(index, 'movie_type', value)}
                          disabled={uploading}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="movie">Movie</SelectItem>
                            <SelectItem value="series">TV Series</SelectItem>
                            <SelectItem value="documentary">Documentary</SelectItem>
                            <SelectItem value="anime">Anime</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium mb-1 block">Quality</label>
                        <Select 
                          value={upload.quality} 
                          onValueChange={(value) => updateUpload(index, 'quality', value)}
                          disabled={uploading}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="4K">4K Ultra HD</SelectItem>
                            <SelectItem value="1080p">1080p Full HD</SelectItem>
                            <SelectItem value="720p">720p HD</SelectItem>
                            <SelectItem value="480p">480p SD</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeUpload(index)}
                      className="ml-4 text-destructive hover:text-destructive hover:bg-destructive/10"
                      disabled={uploading}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>

                  {/* File Upload Section */}
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    {/* Movie File */}
                    <div>
                      <label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Video className="h-4 w-4" />
                        Movie File *
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) updateUploadFile(index, 'movie', file);
                        }}
                        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-primary file:text-primary-foreground hover:file:bg-primary/90"
                        disabled={uploading}
                      />
                      {upload.files.movie && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {upload.files.movie.name}
                        </p>
                      )}
                    </div>

                    {/* Trailer */}
                    <div>
                      <label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <PlayCircle className="h-4 w-4" />
                        Trailer
                      </label>
                      <input
                        type="file"
                        accept="video/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) updateUploadFile(index, 'trailer', file);
                        }}
                        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-secondary file:text-secondary-foreground hover:file:bg-secondary/90"
                        disabled={uploading}
                      />
                      {upload.files.trailer && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {upload.files.trailer.name}
                        </p>
                      )}
                    </div>

                    {/* Poster */}
                    <div>
                      <label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <Image className="h-4 w-4" />
                        Poster
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) updateUploadFile(index, 'poster', file);
                        }}
                        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-accent file:text-accent-foreground hover:file:bg-accent/90"
                        disabled={uploading}
                      />
                      {upload.files.poster && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {upload.files.poster.name}
                        </p>
                      )}
                    </div>

                    {/* Thumbnail */}
                    <div>
                      <label className="text-sm font-medium mb-2 flex items-center gap-2">
                        <FileText className="h-4 w-4" />
                        Thumbnail
                      </label>
                      <input
                        type="file"
                        accept="image/*"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) updateUploadFile(index, 'thumbnail', file);
                        }}
                        className="w-full text-sm file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-medium file:bg-muted file:text-muted-foreground hover:file:bg-muted/90"
                        disabled={uploading}
                      />
                      {upload.files.thumbnail && (
                        <p className="text-xs text-muted-foreground mt-1">
                          {upload.files.thumbnail.name}
                        </p>
                      )}
                    </div>
                  </div>

                  {/* Upload Progress */}
                  {uploading && uploadProgress[upload.movie_id] !== undefined && (
                    <div className="mt-4">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-sm font-medium">Uploading...</span>
                        <span className="text-sm text-muted-foreground">
                          {Math.round(uploadProgress[upload.movie_id])}%
                        </span>
                      </div>
                      <Progress value={uploadProgress[upload.movie_id]} className="h-2" />
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  );
};