import React from 'react';
import { Folder } from '../types/email';

interface SidebarProps {
  folders: Folder[];
  activeFolder: string;
  onFolderSelect: (folder: string) => void;
  onCompose: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  folders,
  activeFolder,
  onFolderSelect,
  onCompose,
}) => {
  return (
    <div className="w-64 bg-gray-100 h-screen p-4">
      <button
        onClick={onCompose}
        className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg mb-6 hover:bg-blue-700"
      >
        Compose
      </button>
      
      <nav>
        <ul className="space-y-2">
          {folders.map((folder) => (
            <li key={folder.id}>
              <button
                onClick={() => onFolderSelect(folder.type)}
                className={`w-full text-left px-4 py-2 rounded-lg ${
                  activeFolder === folder.type
                    ? 'bg-blue-100 text-blue-600'
                    : 'text-gray-700 hover:bg-gray-200'
                }`}
              >
                {folder.name}
              </button>
            </li>
          ))}
        </ul>
      </nav>
    </div>
  );
};