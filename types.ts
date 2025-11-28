export interface NewsItem {
  title: string;
  content: string;
  sources: SourceLink[];
  imageUrl?: string;
}

export interface SourceLink {
  title: string;
  uri: string;
}

export interface GroundingChunk {
  web?: {
    uri?: string;
    title?: string;
  };
}

export enum LoadingState {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}