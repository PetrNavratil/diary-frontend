export interface Reading {
  id: number;
  start: string;
  stop: string;
  bookId: number;
  userId: number;
  title?: string;
  author?: string;
  completed: boolean;
  intervals: Interval[];

}

export interface StoredReading {
  lastInterval: Reading;
  readings: Reading[];
}

export interface Interval {
  start: string;
  stop: string;
  readingId: number;
}