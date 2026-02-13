export interface Country {
  id: number;
  name: string;
  abbreviation?: string;
  capital?: string;
  phone?: string;
  population?: number;
  media?: {
    flag?: string;
    emblem?: string;
    orthographic?: string;
  };
}
