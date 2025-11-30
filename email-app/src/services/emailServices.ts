import { supabase } from '../lib/supabase';
import { Email, Folder } from '../types/email';

export const emailService = {
  // Get emails for current user
  async getEmails(folder: string = 'inbox'): Promise<Email[]> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let query = supabase
      .from('emails')
      .select('*')
      .order('created_at', { ascending: false });

    if (folder === 'inbox') {
      query = query.eq('recipient_email', user.email);
    } else if (folder === 'sent') {
      query = query.eq('sender_id', user.id);
    }

    const { data, error } = await query;
    if (error) throw error;

    // Get sender emails for inbox
    if (folder === 'inbox' && data) {
      const emailsWithSenders = await Promise.all(
        data.map(async (email) => {
          // Untuk mendapatkan email pengirim, kita perlu query auth users
          // Karena Supabase Auth tidak bisa langsung di-query, kita simpan sender_email di email
          const { data: sender } = await supabase.auth.admin.getUserById(email.sender_id);
          return {
            ...email,
            sender_email: sender?.user?.email || 'Unknown',
          };
        })
      );
      return emailsWithSenders;
    }

    return data || [];
  },

  // Send new email
  async sendEmail(recipientEmail: string, subject: string, body: string): Promise<void> {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('emails')
      .insert([
        {
          sender_id: user.id,
          recipient_email: recipientEmail,
          subject,
          body,
        },
      ]);

    if (error) throw error;
  },

  // Mark email as read
  async markAsRead(emailId: string): Promise<void> {
    const { error } = await supabase
      .from('emails')
      .update({ is_read: true, updated_at: new Date().toISOString() })
      .eq('id', emailId);

    if (error) throw error;
  },

  // Toggle star
  async toggleStar(emailId: string, isStarred: boolean): Promise<void> {
    const { error } = await supabase
      .from('emails')
      .update({ is_starred: isStarred, updated_at: new Date().toISOString() })
      .eq('id', emailId);

    if (error) throw error;
  },

  // Get folders
  async getFolders(): Promise<Folder[]> {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .order('created_at');

    if (error) throw error;
    return data || [];
  },
};