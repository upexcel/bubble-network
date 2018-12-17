export interface BubblePost {
  author: string;
  date: string;
  likes: number;
  url: string;
  description: string;
  comments: Comment[];
}
export interface Comment {
  author: string;
  text: string;
  date: string;
}