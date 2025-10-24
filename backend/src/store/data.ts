// Shared Data Store with Firebase Firestore persistence

import { initializeFirebaseAdmin, firestore } from '../services/firebase-admin';

// Firestore Data Store Class
class FirestoreDataStore {
  private db: any;

  constructor() {
    try {
      const admin = initializeFirebaseAdmin();
      this.db = admin.firestore;
    } catch (error) {
      console.warn('Firebase not available, falling back to in-memory store:', error);
      this.db = null;
    }
  }

  // Users collection
  async getUser(id: string): Promise<User | null> {
    if (!this.db) return users.get(id) || null;
    try {
      const doc = await this.db.collection('users').doc(id).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('Error getting user from Firestore:', error);
      return users.get(id) || null;
    }
  }

  async setUser(id: string, user: User): Promise<void> {
    if (!this.db) {
      users.set(id, user);
      return;
    }
    try {
      await this.db.collection('users').doc(id).set(user);
    } catch (error) {
      console.error('Error setting user in Firestore:', error);
      users.set(id, user); // fallback
    }
  }

  // Tailors collection
  async getTailor(id: string): Promise<TailorProfile | null> {
    if (!this.db) return tailors.get(id) || null;
    try {
      const doc = await this.db.collection('tailors').doc(id).get();
      return doc.exists ? doc.data() : null;
    } catch (error) {
      console.error('Error getting tailor from Firestore:', error);
      return tailors.get(id) || null;
    }
  }

  async setTailor(id: string, tailor: TailorProfile): Promise<void> {
    if (!this.db) {
      tailors.set(id, tailor);
      return;
    }
    try {
      await this.db.collection('tailors').doc(id).set(tailor);
    } catch (error) {
      console.error('Error setting tailor in Firestore:', error);
      tailors.set(id, tailor); // fallback
    }
  }

  async getAllTailors(): Promise<TailorProfile[]> {
    if (!this.db) return Array.from(tailors.values());
    try {
      const snapshot = await this.db.collection('tailors').get();
      return snapshot.docs.map((doc: any) => doc.data());
    } catch (error) {
      console.error('Error getting all tailors from Firestore:', error);
      return Array.from(tailors.values()); // fallback
    }
  }
}

// Initialize Firestore store
const store = new FirestoreDataStore();

export interface User {
  id: string;
  email: string;
  name: string;
  phone: string;
  role: 'customer' | 'tailor';
  avatar: string | null;
  createdAt: string;
  updatedAt?: string;
  hasCompletedOnboarding: boolean;
}

export interface Order {
  id: string;
  customerId: string;
  tailorId: string;
  status: string;
  items: any[];
  measurements: any;
  measurementId?: string;
  totalAmount: number;
  referenceImages: string[];
  specialInstructions?: string;
  createdAt: string;
  updatedAt: string;
  notes?: any[];
  additionalImages?: string[];
  statusNotes?: string;
  cancelReason?: string;
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

export interface TailorProfile {
  id: string;
  userId: string;
  businessName: string;
  description: string;
  avatar: string | null;
  rating: number;
  reviewCount: number;
  specialties: string[];
  location: {
    address: string;
    city: string;
    region: string;
    coordinates?: {
      latitude: number;
      longitude: number;
    };
  };
  portfolio: {
    id: string;
    imageUrl: string;
    videoUrl?: string;
    type?: 'image' | 'video';
    title: string;
    description?: string;
    category?: string;
    price?: number;
  }[];
  priceRange: { min: number; max: number };
  turnaroundTime: string;
  verified: boolean;
  verificationStatus: 'unverified' | 'pending' | 'verified';
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
  images: string[];
  createdAt: string;
  updatedAt: string;
  response?: {
    message: string;
    responderId: string;
    createdAt: string;
  };
}

export interface Conversation {
  id: string;
  participants: string[]; // Array of user IDs
  createdAt: string;
  updatedAt: string;
}

export interface Message {
  id: string;
  conversationId: string;
  senderId: string;
  recipientId?: string;
  content: string;
  messageType: 'text' | 'image' | 'file';
  metadata?: any;
  read: boolean;
  createdAt: string;
}

// In-memory storage
export const users: Map<string, User> = new Map();
export const orders: Map<string, Order> = new Map();
export const measurements: Map<string, Measurement> = new Map();
export const tailors: Map<string, TailorProfile> = new Map();
export const tailorReviews: Map<string, TailorReview[]> = new Map();
export const conversations: Conversation[] = [];
export const messages: Message[] = [];

// ID counters
export let orderIdCounter = 1;
export let measurementIdCounter = 1;

export function incrementOrderId() {
  return orderIdCounter++;
}

export function incrementMeasurementId() {
  return measurementIdCounter++;
}

// Seed data for demo/testing environments
(function seedInitialData() {
  const tailorId = 'tailor_sample_1';

  if (tailors.has(tailorId)) {
    return;
  }

  const sampleUser: User = {
    id: tailorId,
    email: 'ama.serwaa@example.com',
    name: 'Ama Serwaa',
    phone: '+233501234567',
    role: 'tailor',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    createdAt: new Date('2024-01-01T09:00:00.000Z').toISOString(),
    hasCompletedOnboarding: true,
  };

  users.set(sampleUser.id, sampleUser);

  const sampleTailor: TailorProfile = {
    id: tailorId,
    userId: tailorId,
    businessName: 'Ama Serwaa Tailoring',
    description:
      'Expert tailor blending modern cuts with vibrant Ghanaian textiles. Specializing in bespoke dresses and suits for every celebration.',
    avatar: sampleUser.avatar,
    rating: 4.7,
    reviewCount: 4,
    specialties: ['Evening Wear', 'Kente', 'Suits', 'Alterations'],
    location: {
      address: 'Makola Shopping Mall',
      city: 'Accra',
      region: 'Greater Accra',
      coordinates: {
        latitude: 5.5506,
        longitude: -0.1963,
      },
    },
    portfolio: [
      {
        id: 'portfolio_1',
        type: 'image',
        imageUrl:
          'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
        title: 'Evening Dress',
        category: 'Evening Wear',
        price: 450,
      },
      {
        id: 'portfolio_2',
        type: 'video',
        imageUrl:
          'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerBlazes.mp4',
        title: 'Corporate Suit Showcase',
        category: 'Suits',
        price: 800,
      },
      {
        id: 'portfolio_3',
        type: 'image',
        imageUrl:
          'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800',
        title: 'Traditional Kente',
        category: 'Kente',
        price: 650,
      },
    ],
    priceRange: { min: 150, max: 1500 },
    turnaroundTime: '7-14 days',
    verified: true,
    verificationStatus: 'verified',
  };

  tailors.set(sampleTailor.id, sampleTailor);

  // Tailor 2: Kwame Mensah - Traditional wear specialist
  const tailor2: TailorProfile = {
    id: 'tailor_sample_2',
    userId: 'tailor_sample_2',
    businessName: 'Kwame\'s Traditional Wear',
    description:
      'Master of traditional Ghanaian garments with over 15 years of experience. Specializing in authentic Kente designs and cultural attire.',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    rating: 4.8,
    reviewCount: 0,
    specialties: ['Traditional Wear', 'Kente', 'Smock', 'Cultural Attire'],
    location: {
      address: 'Osu Oxford Street',
      city: 'Accra',
      region: 'Greater Accra',
      coordinates: { latitude: 5.5558, longitude: -0.1766 },
    },
    portfolio: [
      {
        id: 'portfolio_4',
        type: 'video',
        imageUrl: 'https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?w=800',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerEscapes.mp4',
        title: 'Kente Ensemble Showcase',
        category: 'Traditional Wear',
        price: 950,
      },
      {
        id: 'portfolio_5',
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1539008835657-9e8e9680c956?w=800',
        title: 'Cultural Smock',
        category: 'Traditional Wear',
        price: 580,
      },
      {
        id: 'portfolio_6',
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1564859228273-274232fdb516?w=800',
        title: 'Festival Outfit',
        category: 'Cultural Attire',
        price: 720,
      },
    ],
    priceRange: { min: 300, max: 2000 },
    turnaroundTime: '10-21 days',
    verified: true,
    verificationStatus: 'verified',
  };
  tailors.set(tailor2.id, tailor2);

  // Tailor 3: Yaa Asantewaa - Casual & modern styles
  const tailor3: TailorProfile = {
    id: 'tailor_sample_3',
    userId: 'tailor_sample_3',
    businessName: 'Yaa\'s Modern Designs',
    description:
      'Contemporary fashion meets African flair. Creating trendy, comfortable pieces for the modern Ghanaian woman.',
    avatar: 'https://randomuser.me/api/portraits/women/68.jpg',
    rating: 4.6,
    reviewCount: 0,
    specialties: ['Casual Wear', 'Modern Fashion', 'Dresses', 'Separates'],
    location: {
      address: 'Labone Junction',
      city: 'Accra',
      region: 'Greater Accra',
      coordinates: { latitude: 5.5711, longitude: -0.1739 },
    },
    portfolio: [
      {
        id: 'portfolio_8',
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?w=800',
        title: 'Summer Dress',
        category: 'Casual Wear',
        price: 220,
      },
      {
        id: 'portfolio_9',
        type: 'video',
        imageUrl: 'https://images.unsplash.com/photo-1445205170230-053b83016050?w=800',
        videoUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ForBiggerFun.mp4',
        title: 'Office Chic Collection',
        category: 'Modern Fashion',
        price: 380,
      },
      {
        id: 'portfolio_10',
        type: 'image',
        imageUrl: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?w=800',
        title: 'Weekend Outfit',
        category: 'Casual Wear',
        price: 195,
      },
    ],
    priceRange: { min: 120, max: 600 },
    turnaroundTime: '5-10 days',
    verified: true,
    verificationStatus: 'verified',
  };
  tailors.set(tailor3.id, tailor3);

  // Tailor 4: Kofi Agyeman - Formal & corporate
  const tailor4: TailorProfile = {
    id: 'tailor_sample_4',
    userId: 'tailor_sample_4',
    businessName: 'Kofi\'s Executive Tailoring',
    description:
      'Premium corporate and formal wear specialist. Crafting sharp suits and professional attire for executives.',
    avatar: 'https://randomuser.me/api/portraits/men/52.jpg',
    rating: 4.9,
    reviewCount: 0,
    specialties: ['Suits', 'Corporate Attire', 'Blazers', 'Formal Wear'],
    location: {
      address: 'Airport Residential Area',
      city: 'Accra',
      region: 'Greater Accra',
      coordinates: { latitude: 5.6052, longitude: -0.1719 },
    },
    portfolio: [
      {
        id: 'portfolio_11',
        imageUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=800',
        title: 'Executive Suit',
        category: 'Suits',
        price: 1100,
      },
      {
        id: 'portfolio_12',
        imageUrl: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=800',
        title: 'Business Blazer',
        category: 'Corporate Attire',
        price: 680,
      },
      {
        id: 'portfolio_13',
        imageUrl: 'https://images.unsplash.com/photo-1594938291221-94f18cbb5660?w=800',
        title: 'Three-Piece Suit',
        category: 'Formal Wear',
        price: 1450,
      },
    ],
    priceRange: { min: 500, max: 2500 },
    turnaroundTime: '14-21 days',
    verified: true,
    verificationStatus: 'verified',
  };
  tailors.set(tailor4.id, tailor4);

  // Tailor 5: Abena Osei - Bridal specialist
  const tailor5: TailorProfile = {
    id: 'tailor_sample_5',
    userId: 'tailor_sample_5',
    businessName: 'Abena\'s Bridal Couture',
    description:
      'Creating dream wedding gowns and special occasion dresses. Every bride deserves to feel like royalty.',
    avatar: 'https://randomuser.me/api/portraits/women/12.jpg',
    rating: 5.0,
    reviewCount: 0,
    specialties: ['Bridal Wear', 'Evening Gowns', 'Special Occasions', 'Custom Design'],
    location: {
      address: 'East Legon',
      city: 'Accra',
      region: 'Greater Accra',
      coordinates: { latitude: 5.6308, longitude: -0.1574 },
    },
    portfolio: [
      {
        id: 'portfolio_16',
        imageUrl: 'https://images.unsplash.com/photo-1465495976277-4387d4b0b4c6?w=800',
        title: 'Classic Wedding Gown',
        category: 'Bridal Wear',
        price: 2200,
      },
      {
        id: 'portfolio_17',
        imageUrl: 'https://images.unsplash.com/photo-1519657337289-077653f724ed?w=800',
        title: 'Evening Elegance',
        category: 'Evening Gowns',
        price: 1150,
      },
    ],
    priceRange: { min: 800, max: 3500 },
    turnaroundTime: '30-45 days',
    verified: true,
    verificationStatus: 'verified',
  };
  tailors.set(tailor5.id, tailor5);

  const sampleReviews: TailorReview[] = [
    {
      id: 'review_1',
      tailorId,
      customerId: 'customer_akua',
      customerName: 'Akua Mensah',
      customerAvatar: 'https://randomuser.me/api/portraits/women/44.jpg',
      rating: 5,
      comment:
        'Absolutely loved my custom dress! Ama was so professional and the quality is outstanding. Will definitely recommend to my friends.',
      orderType: 'Evening Dress',
      orderAmount: 450,
      images: [
        'https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=800',
        'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=800',
      ],
      createdAt: new Date('2024-01-15T10:20:00.000Z').toISOString(),
      updatedAt: new Date('2024-01-15T10:20:00.000Z').toISOString(),
    },
    {
      id: 'review_2',
      tailorId,
      customerId: 'customer_kofi',
      customerName: 'Kofi Asante',
      customerAvatar: 'https://randomuser.me/api/portraits/men/32.jpg',
      rating: 4,
      comment:
        'Great work on my suit. Only minor adjustments needed. The tailoring was excellent and the fabric choice was perfect.',
      orderType: 'Formal Suit',
      orderAmount: 800,
      images: [],
      createdAt: new Date('2024-01-12T15:45:00.000Z').toISOString(),
      updatedAt: new Date('2024-01-13T08:10:00.000Z').toISOString(),
      response: {
        message:
          "Thank you, Kofi! I'm glad the suit fits well. Happy to make any final tweaks for a perfect finish.",
        responderId: tailorId,
        createdAt: new Date('2024-01-13T08:10:00.000Z').toISOString(),
      },
    },
    {
      id: 'review_3',
      tailorId,
      customerId: 'customer_adwoa',
      customerName: 'Adwoa Osei',
      customerAvatar: 'https://randomuser.me/api/portraits/women/68.jpg',
      rating: 5,
      comment:
        'Exceptional service! From consultation to final fitting, everything was handled professionally. The kente design exceeded expectations.',
      orderType: 'Traditional Kente Dress',
      orderAmount: 650,
      images: [
        'https://images.unsplash.com/photo-1496747611176-843222e1e57c?w=800',
      ],
      createdAt: new Date('2024-01-10T11:30:00.000Z').toISOString(),
      updatedAt: new Date('2024-01-10T11:30:00.000Z').toISOString(),
    },
    {
      id: 'review_4',
      tailorId,
      customerId: 'customer_yaw',
      customerName: 'Yaw Boateng',
      customerAvatar: 'https://randomuser.me/api/portraits/men/52.jpg',
      rating: 3,
      comment:
        'Quality was good but there was a slight delay in delivery. Overall satisfied but would appreciate clearer timelines next time.',
      orderType: 'Casual Shirt',
      orderAmount: 120,
      images: [],
      createdAt: new Date('2024-01-08T09:05:00.000Z').toISOString(),
      updatedAt: new Date('2024-01-08T09:05:00.000Z').toISOString(),
    },
  ];

  tailorReviews.set(tailorId, sampleReviews);

  // Seed sample conversations and messages
  const customerId = 'customer_akua';
  const customerUser: User = {
    id: customerId,
    email: 'akua.customer@example.com',
    name: 'Akua Mensah',
    phone: '+233242345678',
    role: 'customer',
    avatar: 'https://randomuser.me/api/portraits/women/44.jpg',
    createdAt: new Date('2024-01-01T08:00:00.000Z').toISOString(),
    hasCompletedOnboarding: true,
  };
  users.set(customerId, customerUser);

  // Conversation 1: Customer <-> Tailor 1
  const conv1: Conversation = {
    id: 'conv_1',
    participants: [customerId, tailorId],
    createdAt: new Date('2024-01-15T09:00:00.000Z').toISOString(),
    updatedAt: new Date('2024-01-15T14:30:00.000Z').toISOString(),
  };
  conversations.push(conv1);

  messages.push(
    {
      id: 'msg_1',
      conversationId: conv1.id,
      senderId: customerId,
      recipientId: tailorId,
      content: 'Hello! I saw your work online and I\'m interested in getting a custom evening dress made.',
      messageType: 'text',
      read: true,
      createdAt: new Date('2024-01-15T09:00:00.000Z').toISOString(),
    },
    {
      id: 'msg_2',
      conversationId: conv1.id,
      senderId: tailorId,
      recipientId: customerId,
      content: 'Hi Akua! Thank you for reaching out. I\'d love to help you with your dress. Do you have a specific design in mind?',
      messageType: 'text',
      read: true,
      createdAt: new Date('2024-01-15T09:15:00.000Z').toISOString(),
    },
    {
      id: 'msg_3',
      conversationId: conv1.id,
      senderId: customerId,
      recipientId: tailorId,
      content: 'Yes! I want something elegant with traditional Kente accents. When can we meet for measurements?',
      messageType: 'text',
      read: true,
      createdAt: new Date('2024-01-15T10:00:00.000Z').toISOString(),
    },
    {
      id: 'msg_4',
      conversationId: conv1.id,
      senderId: tailorId,
      recipientId: customerId,
      content: 'That sounds beautiful! I\'m available this Thursday or Friday afternoon. Which works better for you?',
      messageType: 'text',
      read: false,
      createdAt: new Date('2024-01-15T14:30:00.000Z').toISOString(),
    }
  );

  // Conversation 2: Customer <-> Tailor 2
  const conv2: Conversation = {
    id: 'conv_2',
    participants: [customerId, 'tailor_sample_2'],
    createdAt: new Date('2024-01-12T11:00:00.000Z').toISOString(),
    updatedAt: new Date('2024-01-13T16:20:00.000Z').toISOString(),
  };
  conversations.push(conv2);

  const tailor2User: User = {
    id: 'tailor_sample_2',
    email: 'kwame.mensah@example.com',
    name: 'Kwame Mensah',
    phone: '+233502345678',
    role: 'tailor',
    avatar: 'https://randomuser.me/api/portraits/men/32.jpg',
    createdAt: new Date('2024-01-01T09:00:00.000Z').toISOString(),
    hasCompletedOnboarding: true,
  };
  users.set(tailor2User.id, tailor2User);

  messages.push(
    {
      id: 'msg_5',
      conversationId: conv2.id,
      senderId: customerId,
      recipientId: 'tailor_sample_2',
      content: 'Hi! I need a traditional smock for an upcoming festival. What\'s your pricing?',
      messageType: 'text',
      read: true,
      createdAt: new Date('2024-01-12T11:00:00.000Z').toISOString(),
    },
    {
      id: 'msg_6',
      conversationId: conv2.id,
      senderId: 'tailor_sample_2',
      recipientId: customerId,
      content: 'Hello! Traditional smocks range from GHS 300-600 depending on the fabric quality and embroidery detail. What\'s your budget?',
      messageType: 'text',
      read: true,
      createdAt: new Date('2024-01-12T12:30:00.000Z').toISOString(),
    },
    {
      id: 'msg_7',
      conversationId: conv2.id,
      senderId: customerId,
      recipientId: 'tailor_sample_2',
      content: 'I\'m looking at around GHS 450. Can you show me some fabric samples?',
      messageType: 'text',
      read: false,
      createdAt: new Date('2024-01-13T16:20:00.000Z').toISOString(),
    }
  );
})();
