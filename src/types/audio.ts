
export interface AudioSample {
  id: string;
  title: string;
  genre: string;
  url: string;
  duration: string;
  description?: string;
  artist?: string;
  tags?: string[];
  dateAdded?: string;
  fileSize?: number;
}
