export interface Email {
  id: string;
  sender_id: string;
  recipient_email: string;
  subject: string;
  body: string;
  is_read: boolean;
  is_starred: boolean;
  created_at: string;
  updated_at: string;
  sender_email?: string;
}

export interface Folder {
  id: string;
  user_id: string;
  name: string;
  type: 'inbox' | 'sent' | 'draft' | 'trash' | 'custom';
  created_at: string;
}

// Tambahkan interface untuk User profile
export interface UserProfile {
  id: string;
  email: string;
  created_at: string;
}