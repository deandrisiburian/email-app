import React from 'react';
import { Email } from '../types/email';

interface EmailViewerProps {
  email: Email | null;
  onBack: () => void;
}

export const EmailViewer: React.FC<EmailViewerProps> = ({ email, onBack }) => {
  if (!email) {
    return (
      <div className="flex-1 flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Select an email to read</p>
      </div>
    );
  }

  return (
    <div className="flex-1 bg-white">
      <div className="p-4 border-b border-gray-200">
        <button
          onClick={onBack}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back
        </button>
        <h1 className="text-2xl font-bold">{email.subject}</h1>
        <div className="flex justify-between items-center mt-2">
          <div>
            <p className="text-gray-600">
              From: {email.sender_email || 'Unknown'}
            </p>
            <p className="text-gray-600">
              To: {email.recipient_email}
            </p>
          </div>
          <p className="text-gray-500 text-sm">
            {new Date(email.created_at).toLocaleString()}
          </p>
        </div>
      </div>
      <div className="p-6">
        <div className="prose max-w-none">
          {email.body.split('\n').map((paragraph, index) => (
            <p key={index} className="mb-4">
              {paragraph}
            </p>
          ))}
        </div>
      </div>
    </div>
  );
};