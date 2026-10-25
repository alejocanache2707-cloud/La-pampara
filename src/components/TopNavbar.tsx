import React from 'react';
import { Eye, Edit3, Share2, Sparkles } from 'lucide-react';

interface TopNavbarProps {
  currentView: 'view' | 'edit';
  onSelectView: (view: 'view' | 'edit') => void;
  onOpenShareModal: () => void;
  onCopyProfileUrl: () => void;
}

export const TopNavbar: React.FC<TopNavbarProps> = ({
  currentView,
  onSelectView,
  onOpenShareModal,
  onCopyProfileUrl,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-zinc-950/90 backdrop-blur-md border-b border-zinc-800/80 px-4 sm:px-8 py-3">
      <div className="max-w-6xl mx-auto flex items-center justify-between gap-8">
        {/* Zone 1: Brand wordmark (single text element) */}
        <button
          onClick={() => onSelectView('view')}
          className="text-base sm:text-lg font-bold tracking-tight text-white whitespace-nowrap shrink-0 hover:text-cyan-400 transition-colors"
        >
          NexusGamer Hub
        </button>

        {/* Zone 2: 4 single-line nav links */}
        <nav className="hidden md:flex items-center gap-6 text-xs font-semibold text-zinc-400">
          <button
            onClick={() => onSelectView('view')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'view' ? 'text-cyan-400 underline underline-offset-4' : 'hover:text-zinc-200'
            }`}
          >
            Perfil Público
          </button>
          <button
            onClick={() => onSelectView('edit')}
            className={`whitespace-nowrap shrink-0 transition-colors ${
              currentView === 'edit' ? 'text-cyan-400 underline underline-offset-4' : 'hover:text-zinc-200'
            }`}
          >
            Personalizar Cuentas
          </button>
          <button
            onClick={onOpenShareModal}
            className="whitespace-nowrap shrink-0 hover:text-zinc-200 transition-colors"
          >
            Código QR
          </button>
          <button
            onClick={onCopyProfileUrl}
            className="whitespace-nowrap shrink-0 hover:text-zinc-200 transition-colors"
          >
            Copiar Enlace
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-2 shrink-0">
          {currentView === 'view' ? (
            <button
              onClick={() => onSelectView('edit')}
              className="px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <Edit3 className="w-3.5 h-3.5" />
              <span>Editar Perfil</span>
            </button>
          ) : (
            <button
              onClick={() => onSelectView('view')}
              className="px-3.5 py-1.5 text-xs font-semibold text-zinc-950 bg-cyan-400 hover:bg-cyan-300 rounded-lg transition-colors whitespace-nowrap shrink-0 flex items-center gap-1.5 shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Ver Perfil</span>
            </button>
          )}
        </div>
      </div>
    </header>
  );
};
