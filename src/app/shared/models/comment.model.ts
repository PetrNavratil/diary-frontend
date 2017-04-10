export interface DiaryComment {
  id?: number;
  date: string;
  userName: string;
  text: string;
  userAvatar?: string;
  bookId: number;
  userId: number;
}
