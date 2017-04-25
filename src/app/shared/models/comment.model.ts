export interface DiaryComment {
  id?: number;
  date: string;
  userName: string;
  firstName: string;
  lastName: string;
  text: string;
  userAvatar?: string;
  bookId: number;
  userId: number;
}
