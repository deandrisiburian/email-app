import { useState, useEffect } from 'react';
import { Auth } from './components/Auth';
import { Sidebar } from './components/Sidebar';
import { EmailList } from './components/EmailList';
import { EmailViewer } from './components/EmailViewer';
import { ComposeModal } from './components/ComposeModal';
import { emailService } from './services/emailServices';
import type { Email, Folder } from './types/email';
import { supabase } from './lib/supabase';
import type { User } from '@supabase/supabase-js';

function App() {
  const [user, setUser] = useState<User | null>(null);
  const [emails, setEmails] = useState<Email[]>([]);
  const [folders, setFolders] = useState<Folder[]>([]);
  const [activeFolder, setActiveFolder] = useState('inbox');
  const [selectedEmail, setSelectedEmail] = useState<Email | null>(null);
  const [isComposeOpen, setIsComposeOpen] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check current user session
    const initializeAuth = async () => {
      const { data: { session } } = await supabase.auth.getSession();
      setUser(session?.user ?? null);
      setLoading(false);
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      setUser(session?.user ?? null);
      setLoading(false);
      
      if (event === 'SIGNED_IN') {
        await loadFolders();
        await loadEmails();
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (user) {
      loadFolders();
      loadEmails();
    }
  }, [user, activeFolder]);

  const loadFolders = async () => {
    try {
      const foldersData = await emailService.getFolders();
      setFolders(foldersData);
    } catch (error) {
      console.error('Error loading folders:', error);
    }
  };

  const loadEmails = async () => {
    try {
      const emailsData = await emailService.getEmails(activeFolder);
      setEmails(emailsData);
    } catch (error) {
      console.error('Error loading emails:', error);
    }
  };

  const handleSendEmail = async (recipient: string, subject: string, body: string) => {
    try {
      await emailService.sendEmail(recipient, subject, body);
      if (activeFolder === 'sent') {
        loadEmails(); // Refresh jika di folder sent
      }
    } catch (error) {
      console.error('Error sending email:', error);
      alert('Error sending email');
    }
  };

  const handleEmailSelect = async (email: Email) => {
    setSelectedEmail(email);
    if (!email.is_read) {
      await emailService.markAsRead(email.id);
      // Update local state tanpa reload semua emails
      setEmails(prevEmails => 
        prevEmails.map(e => 
          e.id === email.id ? { ...e, is_read: true } : e
        )
      );
    }
  };

  const handleToggleStar = async (emailId: string, isStarred: boolean) => {
    await emailService.toggleStar(emailId, isStarred);
    // Update local state
    setEmails(prevEmails => 
      prevEmails.map(email => 
        email.id === emailId ? { ...email, is_starred: isStarred } : email
      )
    );
  };

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    setUser(null);
    setEmails([]);
    setSelectedEmail(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-lg">Loading...</div>
      </div>
    );
  }

  if (!user) {
    return <Auth />;
  }

  return (
    <div className="h-screen flex bg-white">
      <Sidebar
        folders={folders}
        activeFolder={activeFolder}
        onFolderSelect={setActiveFolder}
        onCompose={() => setIsComposeOpen(true)}
      />
      
      <div className="flex-1 flex">
        <EmailList
          emails={emails}
          onEmailSelect={handleEmailSelect}
          onToggleStar={handleToggleStar}
        />
        
        <EmailViewer
          email={selectedEmail}
          onBack={() => setSelectedEmail(null)}
        />
      </div>

      <ComposeModal
        isOpen={isComposeOpen}
        onClose={() => setIsComposeOpen(false)}
        onSend={handleSendEmail}
      />

      {/* Header dengan user info dan logout */}
      <div className="absolute top-4 right-4">
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-600">Hello, {user.email}</span>
          <button
            onClick={handleSignOut}
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 text-sm"
          >
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
}

export default App;