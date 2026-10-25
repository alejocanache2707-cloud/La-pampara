import React, { useState, useEffect } from 'react';
import { GamerProfile } from './types';
import { INITIAL_GAMER_PROFILE } from './data/initialProfile';
import { GamerProfileView } from './components/GamerProfileView';
import { GamerProfileEditor } from './components/GamerProfileEditor';
import { TopNavbar } from './components/TopNavbar';
import { ShareModal } from './components/ShareModal';
import { Toast } from './components/Toast';

const LOCAL_STORAGE_KEY = 'nexus_gamer_hub_profile_v1';

export default function App() {
  const [profile, setProfile] = useState<GamerProfile>(() => {
    try {
      const saved = localStorage.getItem(LOCAL_STORAGE_KEY);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch (e) {
      console.error('Failed to parse profile from localStorage', e);
    }
    return INITIAL_GAMER_PROFILE;
  });

  const [currentView, setCurrentView] = useState<'view' | 'edit'>('view');
  const [isShareModalOpen, setIsShareModalOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Save profile to localStorage whenever it changes
  useEffect(() => {
    try {
      localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(profile));
    } catch (e) {
      console.error('Failed to save profile to localStorage', e);
    }
  }, [profile]);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => {
      setToastMessage(null);
    }, 2800);
  };

  const handleResetDefaults = () => {
    setProfile(INITIAL_GAMER_PROFILE);
    try {
      localStorage.removeItem(LOCAL_STORAGE_KEY);
    } catch (e) {
      console.error(e);
    }
  };

  const handleCopyProfileUrl = () => {
    navigator.clipboard.writeText(window.location.href);
    showToast('¡Enlace de tu perfil copiado al portapapeles!');
  };

  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-zinc-950">
      <TopNavbar
        currentView={currentView}
        onSelectView={setCurrentView}
        onOpenShareModal={() => setIsShareModalOpen(true)}
        onCopyProfileUrl={handleCopyProfileUrl}
      />

      <main className="flex-1">
        {currentView === 'view' ? (
          <GamerProfileView
            profile={profile}
            onOpenShareModal={() => setIsShareModalOpen(true)}
            onShowToast={showToast}
          />
        ) : (
          <GamerProfileEditor
            profile={profile}
            onUpdateProfile={setProfile}
            onResetDefaults={handleResetDefaults}
            onShowToast={showToast}
            onPreview={() => setCurrentView('view')}
          />
        )}
      </main>

      {/* Share / QR Modal */}
      <ShareModal
        isOpen={isShareModalOpen}
        onClose={() => setIsShareModalOpen(false)}
        profile={profile}
        shareUrl={window.location.href}
        onShowToast={showToast}
      />

      {/* Instant Action Toast */}
      <Toast message={toastMessage} />
    </div>
  );
}
