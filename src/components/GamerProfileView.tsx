import React, { useState, useMemo } from 'react';
import { GamerProfile, LinkCategory, GamerLink } from '../types';
import { THEMES } from '../data/themes';
import { LinkCard } from './LinkCard';
import {
  Share2,
  Tv,
  Gamepad2,
  Users,
  HeartHandshake,
  LayoutGrid,
  List,
  Search,
  Calendar,
  Cpu,
  Radio,
  ExternalLink,
  ChevronDown,
  ChevronUp,
  ShieldCheck,
  Trophy,
} from 'lucide-react';

interface GamerProfileViewProps {
  profile: GamerProfile;
  onOpenShareModal: () => void;
  onShowToast: (msg: string) => void;
  isOverlayMode?: boolean;
}

export const GamerProfileView: React.FC<GamerProfileViewProps> = ({
  profile,
  onOpenShareModal,
  onShowToast,
  isOverlayMode = false,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [layout, setLayout] = useState<'grid' | 'list'>(profile.cardLayout || 'grid');
  const [showSetup, setShowSetup] = useState<boolean>(false);
  const [showSchedule, setShowSchedule] = useState<boolean>(false);

  const theme = THEMES[profile.theme] || THEMES.obsidian;

  const filteredLinks = useMemo(() => {
    return profile.links.filter((link) => {
      if (!link.enabled) return false;
      const matchesCategory =
        selectedCategory === 'all' || link.category === selectedCategory;
      const matchesQuery =
        searchQuery.trim() === '' ||
        link.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
        link.usernameOrHandle.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (link.subtitle && link.subtitle.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesQuery;
    });
  }, [profile.links, selectedCategory, searchQuery]);

  const handleCopySuccess = (text: string, label: string) => {
    onShowToast(`¡Copiado: ${text}! (${label})`);
  };

  const getStatusBadge = () => {
    switch (profile.status) {
      case 'streaming':
        return (
          <a
            href={profile.statusUrl || '#'}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 px-3 py-1 bg-red-600/20 border border-red-500/50 text-red-300 rounded-full text-xs font-semibold hover:bg-red-600/30 transition-all shadow-[0_0_15px_rgba(239,68,68,0.3)] animate-pulse"
          >
            <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
            <span>EN DIRECTO AHORA</span>
            <ExternalLink className="w-3 h-3 text-red-400" />
          </a>
        );
      case 'competitive':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-cyan-950/60 border border-cyan-800/80 text-cyan-300 rounded-full text-xs font-semibold">
            <Trophy className="w-3.5 h-3.5 text-cyan-400" />
            <span>EN RANKED COMPETITIVA</span>
          </span>
        );
      case 'casual':
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-950/60 border border-indigo-800/80 text-indigo-300 rounded-full text-xs font-semibold">
            <Users className="w-3.5 h-3.5 text-indigo-400" />
            <span>JUGANDO CON LA COMUNIDAD</span>
          </span>
        );
      case 'offline':
      default:
        return (
          <span className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-900 border border-zinc-800 text-zinc-400 rounded-full text-xs font-medium">
            <Radio className="w-3 h-3 text-zinc-500" />
            <span>OFFLINE // CREANDO CONTENIDO</span>
          </span>
        );
    }
  };

  return (
    <div className={`min-h-screen ${theme.bgClass} transition-colors duration-300 pb-16`}>
      {/* Top Gamer Header Banner */}
      <div className="relative w-full h-44 sm:h-52 bg-gradient-to-b from-zinc-900 to-zinc-950 overflow-hidden border-b border-white/5">
        <div
          className="absolute inset-0 opacity-20 bg-[radial-gradient(#38bdf8_1px,transparent_1px)] [background-size:16px_16px]"
          aria-hidden="true"
        />
        <div
          className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent"
          aria-hidden="true"
        />
      </div>

      {/* Main Container */}
      <div className="max-w-3xl mx-auto px-4 sm:px-6 -mt-20 relative z-10">
        {/* Profile Card Header */}
        <div className="flex flex-col items-center text-center">
          {/* Avatar with gamer border */}
          <div className="relative group">
            <div
              className={`w-28 h-28 sm:w-32 sm:h-32 rounded-2xl overflow-hidden p-1 border-2 shadow-2xl transition-transform duration-300 group-hover:scale-105 ${
                profile.status === 'streaming'
                  ? 'border-red-500 shadow-[0_0_25px_rgba(239,68,68,0.4)]'
                  : `border-zinc-700 ${theme.accentGlow}`
              }`}
              style={{ backgroundColor: '#09090b' }}
            >
              <img
                src={
                  profile.avatarUrl ||
                  'https://images.unsplash.com/photo-1566492031773-4f4e44671857?auto=format&fit=crop&w=400&q=80'
                }
                alt={profile.gamerTag}
                className="w-full h-full object-cover rounded-xl"
                referrerPolicy="no-referrer"
              />
            </div>
            {profile.status === 'streaming' && (
              <span className="absolute -bottom-2.5 left-1/2 -translate-x-1/2 bg-red-600 text-[10px] font-black text-white px-2 py-0.5 rounded shadow tracking-wider uppercase whitespace-nowrap">
                LIVE
              </span>
            )}
          </div>

          {/* Gamertag & Team */}
          <div className="mt-4 flex flex-col items-center">
            <div className="flex items-center gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight text-white flex items-center gap-2">
                {profile.gamerTag}
              </h1>
              <span title="Perfil Verificado">
                <ShieldCheck className="w-5 h-5 text-cyan-400 shrink-0" />
              </span>
            </div>

            {profile.realName && (
              <p className="text-xs text-zinc-400 font-medium mt-0.5">{profile.realName}</p>
            )}

            {profile.teamOrClan && (
              <div className="mt-1.5 text-xs font-mono tracking-wider font-semibold text-zinc-300">
                {profile.teamOrClan}
              </div>
            )}
          </div>

          {/* Live Status indicator */}
          <div className="mt-3">{getStatusBadge()}</div>

          {profile.status === 'streaming' && profile.statusText && (
            <p className="mt-2 text-xs font-medium text-red-300/90 max-w-md">
              "{profile.statusText}"
            </p>
          )}

          {/* Bio */}
          {profile.bio && (
            <p className="mt-3.5 text-sm text-zinc-300 leading-relaxed max-w-xl text-center">
              {profile.bio}
            </p>
          )}

          {/* Region & Badges (Clean metadata with separators - zero-pill rule compliance) */}
          <div className="mt-3 flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-xs text-zinc-400 font-mono">
            {profile.region && (
              <>
                <span>{profile.region}</span>
                <span aria-hidden="true" className="text-zinc-600">
                  ·
                </span>
              </>
            )}
            {profile.badges.map((badge, idx) => (
              <React.Fragment key={badge}>
                <span className="text-zinc-300">{badge}</span>
                {idx < profile.badges.length - 1 && (
                  <span aria-hidden="true" className="text-zinc-600">
                    ·
                  </span>
                )}
              </React.Fragment>
            ))}
          </div>

          {/* Quick share button */}
          <div className="mt-5 flex items-center gap-3">
            <button
              onClick={onOpenShareModal}
              className={`px-4 py-2 rounded-xl text-xs font-semibold flex items-center gap-2 shadow-lg transition-all ${theme.buttonClass}`}
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Compartir Hub Gamer</span>
            </button>
            <button
              onClick={() => {
                navigator.clipboard.writeText(window.location.href);
                onShowToast('¡Enlace del perfil copiado al portapapeles!');
              }}
              className="px-4 py-2 bg-zinc-800/80 hover:bg-zinc-700 text-zinc-200 rounded-xl text-xs font-medium border border-zinc-700/60 transition-colors"
            >
              Copiar Enlace
            </button>
          </div>
        </div>

        {/* Main Games & Ranks Section */}
        {profile.mainGames && profile.mainGames.length > 0 && (
          <div className="mt-8 p-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase flex items-center gap-1.5">
                <Gamepad2 className="w-4 h-4 text-cyan-400" />
                Ranks & Juegos Principales
              </span>
              <span className="text-[11px] font-mono text-zinc-500">Temporada Activa</span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5">
              {profile.mainGames.map((game) => (
                <div
                  key={game.name}
                  className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex flex-col justify-between"
                >
                  <span className="text-xs font-semibold text-zinc-200 truncate">{game.name}</span>
                  <div className="mt-1 flex items-baseline justify-between gap-1">
                    <span className={`text-xs font-mono font-bold ${theme.accentText}`}>
                      {game.rank || 'Unranked'}
                    </span>
                    {game.role && (
                      <span className="text-[10px] text-zinc-500 font-mono truncate">
                        {game.role}
                      </span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Filters & Search Toolbar */}
        <div className="mt-8 flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
          {/* Category Tabs */}
          <div className="flex items-center gap-1 p-1 bg-zinc-900/80 border border-zinc-800 rounded-xl overflow-x-auto no-scrollbar">
            <button
              onClick={() => setSelectedCategory('all')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'all'
                  ? `${theme.accentBg} text-zinc-950 font-semibold shadow-sm`
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Todos ({profile.links.filter((l) => l.enabled).length})
            </button>
            <button
              onClick={() => setSelectedCategory('stream')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'stream'
                  ? `${theme.accentBg} text-zinc-950 font-semibold shadow-sm`
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Streams & Videos
            </button>
            <button
              onClick={() => setSelectedCategory('gaming_id')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'gaming_id'
                  ? `${theme.accentBg} text-zinc-950 font-semibold shadow-sm`
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              IDs de Juego
            </button>
            <button
              onClick={() => setSelectedCategory('social')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'social'
                  ? `${theme.accentBg} text-zinc-950 font-semibold shadow-sm`
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Redes
            </button>
            <button
              onClick={() => setSelectedCategory('community')}
              className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap transition-colors ${
                selectedCategory === 'community'
                  ? `${theme.accentBg} text-zinc-950 font-semibold shadow-sm`
                  : 'text-zinc-400 hover:text-white'
              }`}
            >
              Comunidad
            </button>
          </div>

          {/* Search + Layout controls */}
          <div className="flex items-center gap-2">
            <div className="relative flex-1 sm:w-44">
              <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-zinc-500" />
              <input
                type="text"
                placeholder="Buscar enlace..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-8 pr-3 py-1.5 bg-zinc-900 border border-zinc-800 rounded-xl text-xs text-zinc-200 placeholder-zinc-500 focus:outline-none focus:border-zinc-700"
              />
            </div>

            <div className="flex items-center bg-zinc-900 border border-zinc-800 rounded-xl p-0.5">
              <button
                onClick={() => setLayout('grid')}
                title="Vista cuadrícula"
                className={`p-1.5 rounded-lg transition-colors ${
                  layout === 'grid' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <LayoutGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setLayout('list')}
                title="Vista lista compacta"
                className={`p-1.5 rounded-lg transition-colors ${
                  layout === 'list' ? 'bg-zinc-800 text-white' : 'text-zinc-500 hover:text-zinc-300'
                }`}
              >
                <List className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Links Container */}
        <div className="mt-5">
          {filteredLinks.length === 0 ? (
            <div className="py-12 text-center rounded-2xl border border-dashed border-zinc-800 bg-zinc-900/30">
              <p className="text-sm text-zinc-400">No se encontraron cuentas o enlaces con este filtro.</p>
              <button
                onClick={() => {
                  setSelectedCategory('all');
                  setSearchQuery('');
                }}
                className="mt-2 text-xs text-cyan-400 hover:underline"
              >
                Limpiar búsqueda y filtros
              </button>
            </div>
          ) : layout === 'grid' ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
              {filteredLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  layout="grid"
                  theme={theme}
                  onCopySuccess={handleCopySuccess}
                />
              ))}
            </div>
          ) : (
            <div className="flex flex-col gap-2.5">
              {filteredLinks.map((link) => (
                <LinkCard
                  key={link.id}
                  link={link}
                  layout="list"
                  theme={theme}
                  onCopySuccess={handleCopySuccess}
                />
              ))}
            </div>
          )}
        </div>

        {/* Collapsible Schedule Section */}
        {profile.schedule && profile.schedule.length > 0 && (
          <div className="mt-8 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 overflow-hidden">
            <button
              onClick={() => setShowSchedule(!showSchedule)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Calendar className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-zinc-200">
                  Horarios de Transmisión & Torneos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono">Semana en curso</span>
                {showSchedule ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </div>
            </button>

            {showSchedule && (
              <div className="px-4 pb-4 pt-1 border-t border-zinc-800/60 divide-y divide-zinc-800/50">
                {profile.schedule.map((slot, idx) => (
                  <div key={idx} className="py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                    <div>
                      <span className="text-xs font-semibold text-zinc-200">{slot.day}</span>
                      <p className="text-xs text-zinc-400">{slot.activity}</p>
                    </div>
                    <span className="text-xs font-mono text-cyan-400 whitespace-nowrap">{slot.time}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}

        {/* Collapsible Hardware & Setup Specs */}
        {profile.setupSpecs && profile.setupSpecs.length > 0 && (
          <div className="mt-4 rounded-2xl bg-zinc-900/50 border border-zinc-800/80 overflow-hidden">
            <button
              onClick={() => setShowSetup(!showSetup)}
              className="w-full p-4 flex items-center justify-between text-left hover:bg-zinc-800/40 transition-colors"
            >
              <div className="flex items-center gap-2">
                <Cpu className="w-4 h-4 text-cyan-400" />
                <span className="text-sm font-semibold text-zinc-200">
                  Setup, PC Gamer & Periféricos
                </span>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-xs text-zinc-500 font-mono">Hardware</span>
                {showSetup ? (
                  <ChevronUp className="w-4 h-4 text-zinc-400" />
                ) : (
                  <ChevronDown className="w-4 h-4 text-zinc-400" />
                )}
              </div>
            </button>

            {showSetup && (
              <div className="px-4 pb-4 pt-1 border-t border-zinc-800/60">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
                  {profile.setupSpecs.map((spec, idx) => (
                    <div
                      key={idx}
                      className="p-2.5 rounded-xl bg-black/40 border border-white/5 flex items-center justify-between"
                    >
                      <span className="text-xs font-mono font-semibold text-zinc-400">
                        {spec.category}
                      </span>
                      <span className="text-xs font-medium text-zinc-200 truncate ml-2">
                        {spec.item}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Footer info */}
        <div className="mt-12 pt-6 border-t border-zinc-900 text-center text-xs text-zinc-500 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>{profile.gamerTag} · Todos los enlaces y cuentas oficiales</span>
          <button
            onClick={onOpenShareModal}
            className="text-cyan-400 hover:text-cyan-300 font-medium transition-colors"
          >
            Generar Código QR de este Perfil
          </button>
        </div>
      </div>
    </div>
  );
};
