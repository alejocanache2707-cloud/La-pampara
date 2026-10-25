import React, { useState } from 'react';
import { GamerLink } from '../types';
import { PLATFORMS_DATA } from '../data/platforms';
import { PlatformIcon } from './PlatformIcon';
import { ExternalLink, Copy, Check, Sparkles } from 'lucide-react';
import { ThemeConfig } from '../data/themes';

interface LinkCardProps {
  link: GamerLink;
  layout: 'grid' | 'list';
  theme: ThemeConfig;
  onCopySuccess: (text: string, label: string) => void;
}

export const LinkCard: React.FC<LinkCardProps> = ({
  link,
  layout,
  theme,
  onCopySuccess,
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const meta = PLATFORMS_DATA[link.platform] || PLATFORMS_DATA.custom;

  const handleCopyTag = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    if (!link.usernameOrHandle) return;

    navigator.clipboard.writeText(link.usernameOrHandle);
    setCopied(true);
    onCopySuccess(link.usernameOrHandle, link.label);
    setTimeout(() => setCopied(false), 2000);
  };

  const isHighlighted = link.isHighlighted;
  const isCopyOnly = link.actionType === 'copy_tag';
  const isBoth = link.actionType === 'both';

  const cardContainerClass = isHighlighted
    ? `${theme.highlightCard} border shadow-lg ${theme.accentGlow}`
    : `${theme.cardBg} border ${theme.cardBorder} transition-all duration-200`;

  if (layout === 'list') {
    return (
      <div
        className={`group relative flex items-center justify-between p-3.5 rounded-xl ${cardContainerClass} transition-transform hover:-translate-y-0.5`}
      >
        <div className="flex items-center gap-3.5 min-w-0 pr-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-white/5"
            style={{
              backgroundColor: `${meta.brandColor}18`,
              color: meta.brandColor,
            }}
          >
            <PlatformIcon platform={link.platform} size={22} />
          </div>

          <div className="min-w-0 flex flex-col">
            <div className="flex items-center gap-2">
              <span className="text-sm font-semibold text-zinc-100 truncate">
                {link.label}
              </span>
              {isHighlighted && (
                <span className={`text-[10px] uppercase font-bold tracking-wider ${theme.accentText}`}>
                  Destacado
                </span>
              )}
            </div>

            <div className="flex items-center gap-2 text-xs text-zinc-400 font-mono truncate">
              <span>{link.usernameOrHandle || meta.name}</span>
              {link.subtitle && (
                <>
                  <span className="text-zinc-600">·</span>
                  <span className="text-zinc-400 font-sans truncate">{link.subtitle}</span>
                </>
              )}
            </div>
          </div>
        </div>

        <div className="flex items-center gap-1.5 shrink-0">
          {(isCopyOnly || isBoth) && (
            <button
              onClick={handleCopyTag}
              title={`Copiar ${link.usernameOrHandle}`}
              className="px-2.5 py-1.5 bg-zinc-800/90 hover:bg-zinc-700 text-zinc-200 hover:text-white rounded-lg text-xs font-medium flex items-center gap-1.5 border border-zinc-700/60 transition-colors"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              <span className="hidden sm:inline">{copied ? 'Copiado' : 'Copiar ID'}</span>
            </button>
          )}

          {!isCopyOnly && (
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className={`p-2 rounded-lg text-zinc-400 hover:text-white hover:bg-zinc-800 transition-colors ${
                isHighlighted ? theme.accentText : ''
              }`}
              title="Abrir enlace"
            >
              <ExternalLink className="w-4 h-4" />
            </a>
          )}
        </div>
      </div>
    );
  }

  // Grid layout (default 2-column or 3-column)
  return (
    <div
      className={`group relative flex flex-col justify-between p-4 rounded-xl ${cardContainerClass} transition-all duration-200 hover:-translate-y-1`}
    >
      <div>
        <div className="flex items-center justify-between gap-2 mb-3">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center shrink-0 border border-white/5 shadow-inner"
            style={{
              backgroundColor: `${meta.brandColor}22`,
              color: meta.brandColor,
            }}
          >
            <PlatformIcon platform={link.platform} size={22} />
          </div>

          <div className="flex items-center gap-1.5">
            {isHighlighted && (
              <span className={`text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded ${theme.accentText} bg-white/5`}>
                Destacado
              </span>
            )}
            <span className="text-[11px] font-mono text-zinc-500">{meta.name}</span>
          </div>
        </div>

        <h3 className="text-sm font-semibold text-zinc-100 group-hover:text-white transition-colors leading-snug">
          {link.label}
        </h3>

        {link.subtitle && (
          <p className="mt-1 text-xs text-zinc-400 leading-relaxed line-clamp-2">
            {link.subtitle}
          </p>
        )}

        <div className="mt-2.5 px-2.5 py-1 bg-black/40 rounded-md border border-white/5 flex items-center justify-between gap-2">
          <span className="text-xs font-mono text-zinc-300 truncate">
            {link.usernameOrHandle || link.url}
          </span>
          {(isCopyOnly || isBoth) && (
            <button
              onClick={handleCopyTag}
              title="Copiar ID"
              className="text-zinc-400 hover:text-white p-0.5 transition-colors shrink-0"
            >
              {copied ? (
                <Check className="w-3.5 h-3.5 text-emerald-400" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          )}
        </div>
      </div>

      <div className="mt-4 pt-3 border-t border-white/5 flex items-center gap-2">
        {isCopyOnly ? (
          <button
            onClick={handleCopyTag}
            className={`w-full py-2 px-3 rounded-lg text-xs font-semibold flex items-center justify-center gap-1.5 transition-colors ${
              copied
                ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                : 'bg-zinc-800 hover:bg-zinc-700 text-zinc-200'
            }`}
          >
            {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
            <span>{copied ? '¡Copiado!' : 'Copiar Identificador'}</span>
          </button>
        ) : isBoth ? (
          <>
            <button
              onClick={handleCopyTag}
              className="flex-1 py-1.5 px-2.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
            >
              {copied ? <Check className="w-3 h-3 text-emerald-400" /> : <Copy className="w-3 h-3" />}
              <span>{copied ? 'Copiado' : 'Copiar ID'}</span>
            </button>
            <a
              href={link.url}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 py-1.5 px-2.5 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium flex items-center justify-center gap-1 transition-colors"
            >
              <ExternalLink className="w-3 h-3" />
              <span>Abrir</span>
            </a>
          </>
        ) : (
          <a
            href={link.url}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-2 px-3 bg-zinc-800/80 hover:bg-zinc-700 hover:text-white text-zinc-300 rounded-lg text-xs font-medium flex items-center justify-center gap-1.5 transition-colors"
          >
            <span>Ir al canal</span>
            <ExternalLink className="w-3.5 h-3.5" />
          </a>
        )}
      </div>
    </div>
  );
};
