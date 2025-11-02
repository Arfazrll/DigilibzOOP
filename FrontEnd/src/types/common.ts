export interface ApiResponse<T> {
  data: T;
  message?: string;
  status?: number;
}

export interface ApiError {
  timestamp: string;
  status: number;
  error: string;
  message: string;
  path: string;
}

export interface PaginationParams {
  page?: number;
  size?: number;
  sort?: string;
}

export interface Statistics {
  totalBook: number;
  totalUser: number;
  totalTransaction: number;
  totalNotifications: number;
  averageReview: number;
  totalReview: number;
  recentReviews: any[];
}