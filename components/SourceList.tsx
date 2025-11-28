import React from 'react';
import { SourceLink } from '../types';

interface SourceListProps {
  sources: SourceLink[];
}

const SourceList: React.FC<SourceListProps> = ({ sources }) => {
  if (!sources || sources.length === 0) return null;

  // De-duplicate sources based on URI
  const sourceMap = new Map<string, SourceLink>();
  sources.forEach((s) => {
    sourceMap.set(s.uri, s);
  });

  const uniqueSources = Array.from(sourceMap.values()).slice(0, 5);

  return (
    <div className="mt-8 pt-6 border-t border-gray-100">
      <h4 className="text-xs font-bold uppercase tracking-widest text-gray-400 mb-3">
        Kilder
      </h4>
      <ul className="space-y-1">
        {uniqueSources.map((source, idx) => (
          <li key={idx}>
            <a 
              href={source.uri} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-xs text-gray-500 hover:text-gray-900 hover:underline truncate block max-w-full"
            >
              {source.title || new URL(source.uri).hostname}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SourceList;