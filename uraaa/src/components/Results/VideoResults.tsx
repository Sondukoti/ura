import React from 'react';
import { SearchResult } from '../../types/api';
import { ExternalLink, Youtube, Brain } from 'lucide-react';
import { AnalyzeButton } from '../AI/AnalyzeButton';

interface VideoResultsProps {
  results: SearchResult[];
}

export const VideoResults: React.FC<VideoResultsProps> = ({ results }) => {
  if (results.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No video results found.</p>
      </div>
    );
  }

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2">
      {results.map((video) => {
        const videoId = video.url.split('v=')[1];
        const thumbnailUrl = `https://img.youtube.com/vi/${videoId}/maxresdefault.jpg`;

        return (
          <div key={video.id} className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow">
            <a
              href={video.url}
              target="_blank"
              rel="noopener noreferrer"
              className="block"
            >
              <div className="relative aspect-video">
                <img
                  src={thumbnailUrl}
                  alt={video.title}
                  className="w-full h-full object-cover rounded-t-lg"
                />
                <div className="absolute inset-0 bg-black bg-opacity-0 hover:bg-opacity-10 transition-opacity flex items-center justify-center">
                  <Youtube className="h-12 w-12 text-white opacity-0 hover:opacity-100 transition-opacity" />
                </div>
              </div>
            </a>
            
            <div className="p-4">
              <div className="flex items-start justify-between">
                <h3 className="text-lg font-medium text-gray-900 line-clamp-2">
                  {video.title}
                </h3>
                <div className="flex items-center gap-2">
                  <AnalyzeButton title={video.title} content={video.description} />
                  <a
                    href={video.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-shrink-0 text-gray-400 hover:text-gray-600"
                  >
                    <ExternalLink className="h-5 w-5" />
                  </a>
                </div>
              </div>
              <p className="mt-2 text-sm text-gray-600 line-clamp-2">
                {video.description}
              </p>
              <div className="mt-2 flex items-center gap-4 text-xs text-gray-500">
                {video.date && (
                  <span>{new Date(video.date).toLocaleDateString()}</span>
                )}
                {video.statistics && (
                  <>
                    <span>{video.statistics.views.toLocaleString()} views</span>
                    <span>{video.statistics.likes.toLocaleString()} likes</span>
                  </>
                )}
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
};