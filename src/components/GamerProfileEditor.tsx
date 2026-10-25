import React, { useState } from 'react';
import {
  GamerProfile,
  GamerLink,
  PlatformType,
  ProfileStatus,
  ThemeStyle,
  LinkCategory,
  MainGame,
  SetupSpec,
  StreamSchedule,
} from '../types';
import { PLATFORMS_DATA, PlatformMeta } from '../data/platforms';
import { THEMES } from '../data/themes';
import { PlatformIcon } from './PlatformIcon';
import {
  Plus,
  Trash2,
  ArrowUp,
  ArrowDown,
  Sparkles,
  Save,
  RotateCcw,
  Check,
  FileJson,
  Upload,
  Gamepad2,
  Tv,
  Eye,
  Sliders,
  Calendar,
  Cpu,
} from 'lucide-react';

interface GamerProfileEditorProps {
  profile: GamerProfile;
  onUpdateProfile: (updated: GamerProfile) => void;
  onResetDefaults: () => void;
  onShowToast: (msg: string) => void;
  onPreview: () => void;
}

export const GamerProfileEditor: React.FC<GamerProfileEditorProps> = ({
  profile,
  onUpdateProfile,
  onResetDefaults,
  onShowToast,
  onPreview,
}) => {
  const [activeTab, setActiveTab] = useState<'links' | 'profile' | 'themes' | 'games' | 'specs'>(
    'links'
  );
  const [selectedPlatformToAdd, setSelectedPlatformToAdd] = useState<PlatformType>('twitch');

  const updateField = <K extends keyof GamerProfile>(key: K, value: GamerProfile[K]) => {
    onUpdateProfile({
      ...profile,
      [key]: value,
    });
  };

  // Add Link
  const handleAddLink = () => {
    const meta = PLATFORMS_DATA[selectedPlatformToAdd];
    const newLink: GamerLink = {
      id: `link-${Date.now()}`,
      platform: selectedPlatformToAdd,
      label: meta.suggestedLabel,
      url: meta.placeholderUrl,
      usernameOrHandle: meta.placeholderHandle,
      category: meta.defaultCategory,
      isHighlighted: false,
      actionType: meta.defaultCategory === 'gaming_id' ? 'copy_tag' : 'open_url',
      enabled: true,
      subtitle: '',
    };

    onUpdateProfile({
      ...profile,
      links: [newLink, ...profile.links],
    });
    onShowToast(`Enlace de ${meta.name} añadido`);
  };

  // Update Link
  const handleUpdateLink = (id: string, updates: Partial<GamerLink>) => {
    onUpdateProfile({
      ...profile,
      links: profile.links.map((link) => (link.id === id ? { ...link, ...updates } : link)),
    });
  };

  // Remove Link
  const handleRemoveLink = (id: string) => {
    onUpdateProfile({
      ...profile,
      links: profile.links.filter((link) => link.id !== id),
    });
    onShowToast('Enlace eliminado');
  };

  // Move Link
  const handleMoveLink = (index: number, direction: 'up' | 'down') => {
    const newIndex = direction === 'up' ? index - 1 : index + 1;
    if (newIndex < 0 || newIndex >= profile.links.length) return;

    const newLinks = [...profile.links];
    const temp = newLinks[index];
    newLinks[index] = newLinks[newIndex];
    newLinks[newIndex] = temp;

    onUpdateProfile({
      ...profile,
      links: newLinks,
    });
  };

  // Export JSON
  const handleExportJson = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(profile, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', `${profile.gamerTag}_gamer_hub_backup.json`);
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    onShowToast('Configuración exportada en JSON');
  };

  // Import JSON
  const handleImportJson = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const parsed = JSON.parse(event.target?.result as string);
        if (parsed.gamerTag && Array.isArray(parsed.links)) {
          onUpdateProfile(parsed);
          onShowToast('¡Perfil gamer importado exitosamente!');
        } else {
          onShowToast('El archivo JSON no tiene la estructura correcta.');
        }
      } catch {
        onShowToast('Error al leer el archivo JSON.');
      }
    };
    reader.readAsText(file);
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Top Editor Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-zinc-800">
        <div>
          <h2 className="text-xl font-bold text-white flex items-center gap-2">
            <Sliders className="w-5 h-5 text-cyan-400" />
            <span>Personalizar Mi Perfil Gamer</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-0.5">
            Los cambios se guardan de inmediato en tu navegador.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={onPreview}
            className="px-3.5 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-lg shadow-cyan-500/20"
          >
            <Eye className="w-4 h-4" />
            <span>Ver Perfil Público</span>
          </button>

          <button
            onClick={handleExportJson}
            title="Exportar copia de seguridad en JSON"
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-medium border border-zinc-700/60 transition-colors"
          >
            <FileJson className="w-4 h-4" />
          </button>

          <label
            title="Importar perfil desde JSON"
            className="p-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 rounded-xl text-xs font-medium border border-zinc-700/60 cursor-pointer transition-colors"
          >
            <Upload className="w-4 h-4" />
            <input type="file" accept=".json" onChange={handleImportJson} className="hidden" />
          </label>

          <button
            onClick={() => {
              if (window.confirm('¿Deseas restablecer los valores por defecto?')) {
                onResetDefaults();
                onShowToast('Perfil restablecido a los valores iniciales');
              }
            }}
            title="Restablecer a valores iniciales"
            className="p-2 bg-zinc-800 hover:bg-rose-950/60 hover:text-rose-400 text-zinc-400 rounded-xl text-xs font-medium border border-zinc-700/60 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Editor Navigation Tabs */}
      <div className="mt-6 flex items-center gap-2 border-b border-zinc-800 pb-2 overflow-x-auto no-scrollbar">
        <button
          onClick={() => setActiveTab('links')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'links'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Cuentas y Enlaces ({profile.links.length})
        </button>
        <button
          onClick={() => setActiveTab('profile')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'profile'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Datos del Perfil & Stream
        </button>
        <button
          onClick={() => setActiveTab('themes')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'themes'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Temas & Estilo
        </button>
        <button
          onClick={() => setActiveTab('games')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'games'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Juegos & Ranks
        </button>
        <button
          onClick={() => setActiveTab('specs')}
          className={`px-4 py-2 text-xs font-semibold rounded-lg transition-colors whitespace-nowrap ${
            activeTab === 'specs'
              ? 'bg-zinc-800 text-white border border-zinc-700'
              : 'text-zinc-400 hover:text-white'
          }`}
        >
          Horarios & Setup PC
        </button>
      </div>

      {/* TAB 1: LINKS & ACCOUNTS */}
      {activeTab === 'links' && (
        <div className="mt-6 space-y-6">
          {/* Add Link Bar */}
          <div className="p-4 bg-zinc-900 border border-zinc-800 rounded-2xl flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
            <div className="flex items-center gap-3">
              <label className="text-xs font-semibold text-zinc-300">
                Añadir nueva plataforma:
              </label>
              <select
                value={selectedPlatformToAdd}
                onChange={(e) => setSelectedPlatformToAdd(e.target.value as PlatformType)}
                aria-label="Seleccionar plataforma para agregar"
                className="px-3 py-1.5 bg-zinc-950 border border-zinc-700 rounded-lg text-xs font-medium text-white focus:outline-none focus:border-cyan-500"
              >
                {Object.values(PLATFORMS_DATA).map((p) => (
                  <option key={p.id} value={p.id}>
                    {p.name} ({p.defaultCategory})
                  </option>
                ))}
              </select>
            </div>

            <button
              onClick={handleAddLink}
              className="px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-colors"
            >
              <Plus className="w-4 h-4" />
              <span>Añadir Enlace</span>
            </button>
          </div>

          {/* Links List Editor */}
          <div className="space-y-3">
            {profile.links.map((link, index) => {
              const meta = PLATFORMS_DATA[link.platform] || PLATFORMS_DATA.custom;
              return (
                <div
                  key={link.id}
                  className={`p-4 rounded-2xl border transition-all ${
                    link.enabled
                      ? 'bg-zinc-900/90 border-zinc-800'
                      : 'bg-zinc-950/40 border-zinc-900 opacity-60'
                  }`}
                >
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-zinc-800/60">
                    <div className="flex items-center gap-2.5">
                      <div
                        className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
                        style={{
                          backgroundColor: `${meta.brandColor}25`,
                          color: meta.brandColor,
                        }}
                      >
                        <PlatformIcon platform={link.platform} size={18} />
                      </div>

                      <div>
                        <span className="text-xs font-bold text-white">{meta.name}</span>
                        <span className="text-[10px] text-zinc-400 ml-2 font-mono">
                          {link.category}
                        </span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2">
                      <button
                        onClick={() => handleUpdateLink(link.id, { isHighlighted: !link.isHighlighted })}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold flex items-center gap-1 transition-colors ${
                          link.isHighlighted
                            ? 'bg-amber-500/20 text-amber-300 border border-amber-500/40'
                            : 'bg-zinc-800 text-zinc-400 hover:text-zinc-200'
                        }`}
                      >
                        <Sparkles className="w-3 h-3" />
                        <span>Destacado</span>
                      </button>

                      <button
                        onClick={() => handleUpdateLink(link.id, { enabled: !link.enabled })}
                        className={`px-2.5 py-1 rounded-md text-[11px] font-semibold transition-colors ${
                          link.enabled
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/40'
                            : 'bg-zinc-800 text-zinc-500'
                        }`}
                      >
                        {link.enabled ? 'Activo' : 'Oculto'}
                      </button>

                      <button
                        onClick={() => handleMoveLink(index, 'up')}
                        disabled={index === 0}
                        title="Subir"
                        className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowUp className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleMoveLink(index, 'down')}
                        disabled={index === profile.links.length - 1}
                        title="Bajar"
                        className="p-1 text-zinc-400 hover:text-white disabled:opacity-30"
                      >
                        <ArrowDown className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleRemoveLink(link.id)}
                        title="Eliminar enlace"
                        className="p-1 text-zinc-400 hover:text-rose-400"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  <div className="mt-3 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        Título / Texto del botón
                      </label>
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => handleUpdateLink(link.id, { label: e.target.value })}
                        className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        URL de enlace
                      </label>
                      <input
                        type="text"
                        value={link.url}
                        onChange={(e) => handleUpdateLink(link.id, { url: e.target.value })}
                        placeholder="https://..."
                        className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        Handle, Tag o ID para Copiar
                      </label>
                      <input
                        type="text"
                        value={link.usernameOrHandle}
                        onChange={(e) =>
                          handleUpdateLink(link.id, { usernameOrHandle: e.target.value })
                        }
                        placeholder="ej: Usuario#1234 o @tag"
                        className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div className="sm:col-span-2">
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        Subtítulo o descripción breve
                      </label>
                      <input
                        type="text"
                        value={link.subtitle || ''}
                        onChange={(e) => handleUpdateLink(link.id, { subtitle: e.target.value })}
                        placeholder="ej: Transmisiones diarias a las 19hs"
                        className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-medium text-zinc-400 mb-1">
                        Acción principal
                      </label>
                      <select
                        value={link.actionType}
                        onChange={(e) =>
                          handleUpdateLink(link.id, {
                            actionType: e.target.value as 'open_url' | 'copy_tag' | 'both',
                          })
                        }
                        className="w-full px-3 py-1.5 bg-zinc-950 border border-zinc-800 rounded-lg text-xs text-white focus:outline-none focus:border-cyan-500"
                      >
                        <option value="open_url">Abrir enlace externo</option>
                        <option value="copy_tag">Copiar ID/Tag al portapapeles</option>
                        <option value="both">Ambas opciones (Copiar + Abrir)</option>
                      </select>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: PROFILE & STREAM */}
      {activeTab === 'profile' && (
        <div className="mt-6 space-y-6">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              Información Básica del Jugador
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Gamertag / Alias principal
                </label>
                <input
                  type="text"
                  value={profile.gamerTag}
                  onChange={(e) => updateField('gamerTag', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white font-semibold focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Nombre real / Subtítulo
                </label>
                <input
                  type="text"
                  value={profile.realName || ''}
                  onChange={(e) => updateField('realName', e.target.value)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Clan, Equipo o Rol
                </label>
                <input
                  type="text"
                  value={profile.teamOrClan}
                  onChange={(e) => updateField('teamOrClan', e.target.value)}
                  placeholder="ej: TEAM VALKYRIE // IGL"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Región / Servidor principal
                </label>
                <input
                  type="text"
                  value={profile.region}
                  onChange={(e) => updateField('region', e.target.value)}
                  placeholder="ej: LATAM Sur · Servidor Santiago"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Biografía / Descripción del Canal
              </label>
              <textarea
                rows={3}
                value={profile.bio}
                onChange={(e) => updateField('bio', e.target.value)}
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500 leading-relaxed"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                URL de Avatar / Foto de Perfil
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={profile.avatarUrl}
                  onChange={(e) => updateField('avatarUrl', e.target.value)}
                  className="flex-1 px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold text-zinc-300 mb-1">
                Insignias / Logros (separados por coma)
              </label>
              <input
                type="text"
                value={profile.badges.join(', ')}
                onChange={(e) =>
                  updateField(
                    'badges',
                    e.target.value.split(',').map((s) => s.trim()).filter(Boolean)
                  )
                }
                placeholder="ej: Radiante S8, Master Apex, Creador Verificado"
                className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
              />
            </div>
          </div>

          {/* Stream & Status */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl space-y-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
              <Tv className="w-4 h-4 text-cyan-400" />
              <span>Estado en Directo / Transmisión</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Estado actual
                </label>
                <select
                  value={profile.status}
                  onChange={(e) => updateField('status', e.target.value as ProfileStatus)}
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white font-medium focus:outline-none focus:border-cyan-500"
                >
                  <option value="streaming">🔴 EN DIRECTO / STREAMING AHORA</option>
                  <option value="competitive">🏆 EN RANKED COMPETITIVA</option>
                  <option value="casual">🎮 JUGANDO CON LA COMUNIDAD</option>
                  <option value="offline">⚪ OFFLINE // CREANDO CONTENIDO</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  URL del directo (Twitch, Kick o YouTube)
                </label>
                <input
                  type="text"
                  value={profile.statusUrl}
                  onChange={(e) => updateField('statusUrl', e.target.value)}
                  placeholder="https://twitch.tv/tu_canal"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white font-mono focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-semibold text-zinc-300 mb-1">
                  Título del directo o actividad actual
                </label>
                <input
                  type="text"
                  value={profile.statusText}
                  onChange={(e) => updateField('statusText', e.target.value)}
                  placeholder="ej: Ranked tryhard subiendo a Radiante en Valorant"
                  className="w-full px-3 py-2 bg-zinc-950 border border-zinc-700 rounded-xl text-xs text-white focus:outline-none focus:border-cyan-500"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 3: THEMES & STYLE */}
      {activeTab === 'themes' && (
        <div className="mt-6 space-y-6">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono mb-4">
              Selecciona el Estilo Gamer de tu Hub
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
              {Object.values(THEMES).map((th) => {
                const isSelected = profile.theme === th.id;
                return (
                  <button
                    key={th.id}
                    onClick={() => {
                      updateField('theme', th.id);
                      onShowToast(`Tema cambiado a ${th.name}`);
                    }}
                    className={`p-4 rounded-xl text-left border transition-all ${
                      isSelected
                        ? 'border-cyan-400 bg-zinc-800 shadow-lg ring-1 ring-cyan-400'
                        : 'border-zinc-800 bg-zinc-950/60 hover:bg-zinc-900 hover:border-zinc-700'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-bold text-white">{th.name}</span>
                      <span
                        className="w-3.5 h-3.5 rounded-full"
                        style={{ backgroundColor: th.accentColor }}
                      />
                    </div>
                    <p className="text-xs text-zinc-400 leading-relaxed">{th.description}</p>
                    <div className="mt-3 flex items-center justify-between text-[11px] font-mono text-zinc-500">
                      <span>{th.badge}</span>
                      {isSelected && <span className="text-cyan-400 font-bold">Activo ✓</span>}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl flex items-center justify-between">
            <div>
              <span className="text-sm font-bold text-white">Disposición predeterminada de enlaces</span>
              <p className="text-xs text-zinc-400 mt-0.5">
                Elige si los visitantes verán tus enlaces en cuadrícula o lista
              </p>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={() => updateField('cardLayout', 'grid')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  profile.cardLayout === 'grid'
                    ? 'bg-cyan-500 text-zinc-950'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Cuadrícula
              </button>
              <button
                onClick={() => updateField('cardLayout', 'list')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold ${
                  profile.cardLayout === 'list'
                    ? 'bg-cyan-500 text-zinc-950'
                    : 'bg-zinc-800 text-zinc-400'
                }`}
              >
                Lista
              </button>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: GAMES & RANKS */}
      {activeTab === 'games' && (
        <div className="mt-6 space-y-4">
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Gamepad2 className="w-4 h-4 text-cyan-400" />
                  <span>Juegos Principales y Ranks</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Muestra a tus seguidores y compañeros tus juegos activos y rangos competitivos
                </p>
              </div>

              <button
                onClick={() => {
                  const newGame: MainGame = {
                    name: 'Nuevo Juego',
                    rank: 'Diamante',
                    role: 'Main',
                  };
                  updateField('mainGames', [...profile.mainGames, newGame]);
                }}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Juego</span>
              </button>
            </div>

            <div className="space-y-3">
              {profile.mainGames.map((game, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center"
                >
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1">
                      Nombre del Juego
                    </label>
                    <input
                      type="text"
                      value={game.name}
                      onChange={(e) => {
                        const updated = [...profile.mainGames];
                        updated[idx].name = e.target.value;
                        updateField('mainGames', updated);
                      }}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1">
                      Rango / ELO
                    </label>
                    <input
                      type="text"
                      value={game.rank || ''}
                      onChange={(e) => {
                        const updated = [...profile.mainGames];
                        updated[idx].rank = e.target.value;
                        updateField('mainGames', updated);
                      }}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1">
                        Rol / Especialidad
                      </label>
                      <input
                        type="text"
                        value={game.role || ''}
                        onChange={(e) => {
                          const updated = [...profile.mainGames];
                          updated[idx].role = e.target.value;
                          updateField('mainGames', updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <button
                      onClick={() => {
                        updateField(
                          'mainGames',
                          profile.mainGames.filter((_, i) => i !== idx)
                        );
                      }}
                      className="mt-4 p-1.5 text-zinc-500 hover:text-rose-400"
                      title="Eliminar juego"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* TAB 5: SPECS & SCHEDULE */}
      {activeTab === 'specs' && (
        <div className="mt-6 space-y-6">
          {/* Schedule */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-cyan-400" />
                  <span>Horarios Semanales de Transmisión</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Indica a tus seguidores cuándo pueden encontrarte en directo
                </p>
              </div>

              <button
                onClick={() => {
                  const newSlot: StreamSchedule = {
                    day: 'Nuevo Horario',
                    time: '20:00 - 23:00',
                    activity: 'Ranked & Torneos',
                  };
                  updateField('schedule', [...profile.schedule, newSlot]);
                }}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Horario</span>
              </button>
            </div>

            <div className="space-y-3">
              {profile.schedule.map((slot, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center"
                >
                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1">
                      Día(s)
                    </label>
                    <input
                      type="text"
                      value={slot.day}
                      onChange={(e) => {
                        const updated = [...profile.schedule];
                        updated[idx].day = e.target.value;
                        updateField('schedule', updated);
                      }}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div>
                    <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1">
                      Horario
                    </label>
                    <input
                      type="text"
                      value={slot.time}
                      onChange={(e) => {
                        const updated = [...profile.schedule];
                        updated[idx].time = e.target.value;
                        updateField('schedule', updated);
                      }}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="flex-1">
                      <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1">
                        Actividad / Juego
                      </label>
                      <input
                        type="text"
                        value={slot.activity}
                        onChange={(e) => {
                          const updated = [...profile.schedule];
                          updated[idx].activity = e.target.value;
                          updateField('schedule', updated);
                        }}
                        className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                      />
                    </div>
                    <button
                      onClick={() => {
                        updateField(
                          'schedule',
                          profile.schedule.filter((_, i) => i !== idx)
                        );
                      }}
                      className="mt-4 p-1.5 text-zinc-500 hover:text-rose-400"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Setup specs */}
          <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-2xl">
            <div className="flex items-center justify-between mb-4">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono flex items-center gap-2">
                  <Cpu className="w-4 h-4 text-cyan-400" />
                  <span>Hardware y Setup PC</span>
                </h3>
                <p className="text-xs text-zinc-400 mt-0.5">
                  Responde la clásica pregunta "¿Qué componentes usas?"
                </p>
              </div>

              <button
                onClick={() => {
                  const newSpec: SetupSpec = {
                    category: 'Periférico',
                    item: 'Nuevo componente',
                  };
                  updateField('setupSpecs', [...profile.setupSpecs, newSpec]);
                }}
                className="px-3 py-1.5 bg-cyan-500 hover:bg-cyan-400 text-zinc-950 rounded-lg text-xs font-semibold flex items-center gap-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Añadir Componente</span>
              </button>
            </div>

            <div className="space-y-3">
              {profile.setupSpecs.map((spec, idx) => (
                <div
                  key={idx}
                  className="p-3 bg-zinc-950 rounded-xl border border-zinc-800 flex items-center gap-3"
                >
                  <div className="w-36">
                    <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1">
                      Categoría
                    </label>
                    <input
                      type="text"
                      value={spec.category}
                      onChange={(e) => {
                        const updated = [...profile.setupSpecs];
                        updated[idx].category = e.target.value;
                        updateField('setupSpecs', updated);
                      }}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <div className="flex-1">
                    <label className="block text-[10px] text-zinc-500 uppercase font-mono mb-1">
                      Modelo / Marca
                    </label>
                    <input
                      type="text"
                      value={spec.item}
                      onChange={(e) => {
                        const updated = [...profile.setupSpecs];
                        updated[idx].item = e.target.value;
                        updateField('setupSpecs', updated);
                      }}
                      className="w-full px-2.5 py-1.5 bg-zinc-900 border border-zinc-700 rounded-lg text-xs text-white"
                    />
                  </div>

                  <button
                    onClick={() => {
                      updateField(
                        'setupSpecs',
                        profile.setupSpecs.filter((_, i) => i !== idx)
                      );
                    }}
                    className="mt-4 p-1.5 text-zinc-500 hover:text-rose-400"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
