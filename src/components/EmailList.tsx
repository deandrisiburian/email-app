import React from 'react';
import { Email } from '../types/email';

interface EmailListProps {
  emails: Email[];
  onEmailSelect: (email: Email) => void;
  onToggleStar: (emailId: string, isStarred: boolean) => void;
}

export const EmailList: React.FC<EmailListProps> = ({
  emails,
  onEmailSelect,
  onToggleStar,
}) => {
  return (
    <div className="flex-1 border-r border-gray-200">
      <div className="p-4 border-b border-gray-200">
        <h2 className="text-lg font-semibold">Inbox</h2>
      </div>
      <div className="overflow-y-auto h-full">
        {emails.map((email) => (
          <div
            key={email.id}
            className={`border-b border-gray-200 p-4 cursor-pointer hover:bg-gray-50 ${
              !email.is_read ? 'bg-blue-50' : ''
            }`}
            onClick={() => onEmailSelect(email)}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    onToggleStar(email.id, !email.is_starred);
                  }}
                  className="text-gray-400 hover:text-yellow-500"
                >
                  {email.is_starred ? '★' : '☆'}
                </button>
                <span className={`font-medium ${!email.is_read ? 'font-bold' : ''}`}>
                  {email.sender_email || email.recipient_email}
                </span>
              </div>
              <span className="text-sm text-gray-500">
                {new Date(email.created_at).toLocaleDateString()}
              </span>
            </div>
            <p className={`mt-1 text-gray-600 ${!email.is_read ? 'font-semibold' : ''}`}>
              {email.subject}
            </p>
            <p className="mt-1 text-gray-500 text-sm truncate">
              {email.body.substring(0, 100)}...
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};