import { useQuery } from '@tanstack/react-query';
import { announcementApi } from '../../services/api/announcementApi';

export interface Announcement {
  id: number;
  title: string;
  content: string;
  announcement_type: string;
  priority: string;
  publish_date: string;
  is_new: boolean;
}

export const useAnnouncements = () => {
  return useQuery<Announcement[], Error>({
    queryKey: ['announcements'],
    queryFn: announcementApi.getAnnouncements,
    staleTime: 1000 * 60 * 5, // 5 minutes
    gcTime: 1000 * 60 * 30, // 30 minutes
    refetchOnWindowFocus: false,
    retry: 2,
  });
};