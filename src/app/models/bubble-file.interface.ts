export interface BubbleFile {
  url: string;
  description: string;
  date: string;
  author: string;
  likes: number;
  animationDelay: string | number;
  redBorderAnimation?: boolean;
  starsAnimation?: boolean;
  raysAnimation?: boolean;
  coloredLinesAnimation?: boolean;
}