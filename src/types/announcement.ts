export type AnnouncementDetail = {
    id: string;
    title: string;
    content: string;
    postDate: string;
  };

export type Announcement = {
    id: number;
    title: string;
    date: string;
    postDate: string; // Adjust this field according to your actual API response
    isNew?: boolean;
};


export type AnnouncementDetails = Record<string, AnnouncementDetail>;
