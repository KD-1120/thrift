// Core Type Definitions for ThriftAccra

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'tailor';
  avatar?: string;
  createdAt: string;
}

export interface Tailor {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  avatar: string | null;
  rating: number;
  reviewCount: number;
  specialties: string[];
  location: Location;
  portfolio: PortfolioItem[];
  priceRange: { min: number; max: number };
  turnaroundTime: string;
  verified: boolean;
}

export interface TailorReviewResponse {
  reviews: TailorReview[];
  summary: TailorReviewSummary;
}

export interface TailorReview {
  id: string;
  tailorId: string;
  customerId: string;
  customerName: string;
  customerAvatar?: string | null;
  rating: number;
  comment: string;
  orderType?: string;
  orderAmount?: number;
  images?: string[];
  createdAt: string;
  updatedAt: string;
  response?: {
    message: string;
    responderId: string;
    createdAt: string;
  };
}

export interface TailorReviewSummary {
  totalReviews: number;
  averageRating: number;
  pendingResponses: number;
}

export interface PortfolioItem {
  id: string;
  imageUrl: string;
  videoUrl?: string;
  type?: 'image' | 'video';
  title: string;
  description?: string;
  category: string;
  price?: number;
  likes?: number;
  createdAt?: Date;
}

export interface Location {
  address: string;
  city: string;
  region: string;
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

export interface Measurement {
  id: string;
  userId: string;
  name: string;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulders?: number;
  armLength?: number;
  inseam?: number;
  neck?: number;
  custom?: Record<string, number>;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  customerId: string;
  tailorId: string;
  status: OrderStatus;
  items: OrderItem[];
  measurements: Measurement;
  totalAmount: number;
  deposit?: number;
  fabricImages: string[];
  referenceImages: string[];
  specialInstructions?: string;
  deliveryDate?: string;
  createdAt: string;
  updatedAt: string;
}

export type OrderStatus =
  | 'pending'
  | 'accepted'
  | 'confirmed'
  | 'in_progress'
  | 'in-progress'
  | 'ready_for_fitting'
  | 'completed'
  | 'cancelled';

export interface OrderItem {
  id: string;
  name?: string;
  garmentType?: string;
  fabricType?: string;
  description?: string;
  price: number;
  quantity: number;
  measurements?: Measurement | Record<string, number>;
}

export interface Message {
  id: string;
  senderId: string;
  recipientId?: string;
  content: string;
  messageType?: 'text' | 'image';
  imageUrl?: string;
  read: boolean;
  createdAt: string;
}

export interface ApiError {
  message: string;
  code?: string;
  details?: Record<string, any>;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  hasMore: boolean;
}

export interface MediaItem {
  id: string;
  type: 'image' | 'video';
  url: string;
  thumbnailUrl: string;
  aspectRatio: number; // width/height for bento grid layout
  author: {
    id: string;
    name: string;
    avatar: string;
  };
  caption?: string;
  likes: number;
  comments: number;
  shares: number;
  isLiked: boolean;
  isBookmarked: boolean;
  createdAt: string;
  duration?: number; // for videos in seconds
  tags?: string[];
}
