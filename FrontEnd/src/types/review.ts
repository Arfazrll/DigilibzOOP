export interface ReviewDTO {
  id: string;
  bookTitle: string;
  authorName: string;
  date: string;
  rating: number;
  content: string;
}

export interface CreateReviewRequest {
  bookId: string;
  review: {
    authorId: string;
    rating: number;
    content: string;
  };
}