import React from 'react';
import { CheckCircle2, Copy } from 'lucide-react';

interface ToastProps {
  message: string | null;
  type?: 'success' | 'info';
}

export const Toast: React.FC<ToastProps> = ({ message, type = 'success' }) => {
  if (!message) return null;

  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2.5 px-4 py-2.5 bg-zinc-900/95 border border-zinc-700/80 text-zinc-100 rounded-lg shadow-2xl backdrop-blur-md animate-in fade-in slide-in-from-bottom-3 duration-200">
      {type === 'success' ? (
        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
      ) : (
        <Copy className="w-4 h-4 text-cyan-400 shrink-0" />
      )}
      <span className="text-xs font-medium tracking-tight whitespace-nowrap">{message}</span>
    </div>
  );
};
