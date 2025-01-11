import { ApiResponse } from '../types/api';
import { getApiKey } from '../utils/apiKeys';
import { fetchWithRetry } from '../utils/apiClient';

export async function searchYoutube(query: string): Promise<ApiResponse> {
  const apiKey = await getApiKey('youtube');
  
  // First, search for videos
  const searchResponse = await fetchWithRetry(
    `https://www.googleapis.com/youtube/v3/search?part=snippet&q=${encodeURIComponent(query)}&type=video&maxResults=10&key=${apiKey}`
  );

  const searchData = await searchResponse.json();
  const videoIds = searchData.items.map((item: any) => item.id.videoId).join(',');

  // Then, get video statistics
  const statsResponse = await fetchWithRetry(
    `https://www.googleapis.com/youtube/v3/videos?part=statistics&id=${videoIds}&key=${apiKey}`
  );

  const statsData = await statsResponse.json();
  const statsMap = new Map(
    statsData.items.map((item: any) => [item.id, item.statistics])
  );
  
  return {
    results: searchData.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      url: `https://www.youtube.com/watch?v=${item.id.videoId}`,
      source: 'youtube',
      date: item.snippet.publishedAt,
      statistics: {
        views: parseInt(statsMap.get(item.id.videoId)?.viewCount || '0'),
        likes: parseInt(statsMap.get(item.id.videoId)?.likeCount || '0'),
      }
    })),
    source: 'youtube'
  };
}