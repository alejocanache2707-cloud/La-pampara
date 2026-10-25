import React, { useEffect, useState, useRef } from 'react';
import QRCode from 'qrcode';
import confetti from 'canvas-confetti';
import { X, Copy, Check, Download, Share2, Sparkles, ExternalLink } from 'lucide-react';
import { GamerProfile } from '../types';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  profile: GamerProfile;
  shareUrl: string;
  onShowToast: (msg: string) => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({
  isOpen,
  onClose,
  profile,
  shareUrl,
  onShowToast,
}) => {
  const [qrDataUrl, setQrDataUrl] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    if (!isOpen) return;

    QRCode.toDataURL(shareUrl, {
      width: 320,
      margin: 2,
      color: {
        dark: '#09090b',
        light: '#ffffff',
      },
      errorCorrectionLevel: 'H',
    })
      .then((url) => setQrDataUrl(url))
      .catch((err) => console.error('Error generating QR code', err));
  }, [isOpen, shareUrl]);

  if (!isOpen) return null;

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      onShowToast('¡Enlace del perfil gamer copiado al portapapeles!');
      confetti({
        particleCount: 50,
        spread: 60,
        origin: { y: 0.8 },
      });
      setTimeout(() => setCopied(false), 2500);
    } catch {
      onShowToast('No se pudo copiar automáticamente. Por favor selecciónalo.');
    }
  };

  const handleDownloadQr = () => {
    if (!qrDataUrl) return;
    const a = document.createElement('a');
    a.href = qrDataUrl;
    a.download = `${profile.gamerTag.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_gamer_hub_qr.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    onShowToast('¡Código QR descargado!');
  };

  return (
    <div
      role="dialog"
      aria-modal="true"
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
    >
      <div
        className="relative w-full max-w-md bg-zinc-900 border border-zinc-800 rounded-2xl p-6 shadow-2xl text-zinc-100"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between pb-4 border-b border-zinc-800">
          <div className="flex items-center gap-2">
            <Share2 className="w-5 h-5 text-cyan-400" />
            <h2 className="text-base font-semibold text-zinc-100">Compartir Hub Gamer</h2>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            aria-label="Cerrar modal"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="mt-5 flex flex-col items-center">
          <div className="p-3 bg-white rounded-xl shadow-lg border border-zinc-200">
            {qrDataUrl ? (
              <img
                src={qrDataUrl}
                alt={`Código QR para el perfil de ${profile.gamerTag}`}
                className="w-48 h-48 block rounded-md"
              />
            ) : (
              <div className="w-48 h-48 flex items-center justify-center text-zinc-500 text-xs">
                Generando QR...
              </div>
            )}
          </div>

          <p className="mt-3 text-xs text-zinc-400 text-center max-w-xs">
            Escanea desde tu móvil, úsalo en tu pantalla de stream o ponlo en el chat para que
            encuentren todos tus links al instante.
          </p>

          <div className="mt-5 w-full">
            <label className="block text-xs font-medium text-zinc-400 mb-1.5">
              Enlace directo a tu perfil
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                readOnly
                value={shareUrl}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-800 rounded-lg text-xs font-mono text-zinc-200 select-all focus:outline-none focus:border-cyan-500"
              />
              <button
                onClick={handleCopy}
                className="px-3 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-colors shrink-0"
              >
                {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                <span>{copied ? 'Copiado' : 'Copiar'}</span>
              </button>
            </div>
          </div>

          <div className="mt-4 flex items-center gap-3 w-full">
            <button
              onClick={handleDownloadQr}
              disabled={!qrDataUrl}
              className="flex-1 py-2 px-3 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium flex items-center justify-center gap-2 transition-colors disabled:opacity-50"
            >
              <Download className="w-4 h-4" />
              <span>Descargar QR (PNG)</span>
            </button>
            <button
              onClick={() => {
                window.open(shareUrl, '_blank');
              }}
              className="py-2 px-3 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Abrir</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
