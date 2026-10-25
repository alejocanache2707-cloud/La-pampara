import { ThemeStyle } from '../types';

export interface ThemeConfig {
  id: ThemeStyle;
  name: string;
  description: string;
  badge: string;
  bgClass: string;
  cardBg: string;
  cardBorder: string;
  accentColor: string;
  accentText: string;
  accentBg: string;
  accentGlow: string;
  highlightCard: string;
  buttonClass: string;
}

export const THEMES: Record<ThemeStyle, ThemeConfig> = {
  obsidian: {
    id: 'obsidian',
    name: 'Obsidian Stealthed',
    description: 'Carbón mate táctico con acentos cian eléctricos',
    badge: 'Táctico',
    bgClass: 'bg-zinc-950 text-zinc-100',
    cardBg: 'bg-zinc-900/80 hover:bg-zinc-900',
    cardBorder: 'border-zinc-800 hover:border-cyan-500/50',
    accentColor: '#06B6D4',
    accentText: 'text-cyan-400',
    accentBg: 'bg-cyan-500',
    accentGlow: 'shadow-[0_0_20px_rgba(6,182,212,0.25)]',
    highlightCard: 'border-cyan-500/60 bg-gradient-to-r from-cyan-950/40 via-zinc-900 to-zinc-900',
    buttonClass: 'bg-cyan-500 hover:bg-cyan-400 text-zinc-950 font-semibold',
  },
  cyberpunk: {
    id: 'cyberpunk',
    name: 'Neon Cyberpunk',
    description: 'Púrpura de medianoche con destellos neón y magenta',
    badge: 'Neón',
    bgClass: 'bg-[#0a0518] text-zinc-100',
    cardBg: 'bg-[#130b2e]/80 hover:bg-[#1a0f3d]',
    cardBorder: 'border-purple-900/60 hover:border-fuchsia-500/50',
    accentColor: '#D946EF',
    accentText: 'text-fuchsia-400',
    accentBg: 'bg-fuchsia-500',
    accentGlow: 'shadow-[0_0_20px_rgba(217,70,239,0.3)]',
    highlightCard: 'border-fuchsia-500/60 bg-gradient-to-r from-purple-950/60 via-[#160c33] to-[#160c33]',
    buttonClass: 'bg-fuchsia-500 hover:bg-fuchsia-400 text-zinc-950 font-semibold',
  },
  emerald: {
    id: 'emerald',
    name: 'Matrix Jade',
    description: 'Estilo táctico FPS con verde esmeralda y fosforescencia militar',
    badge: 'Esmeralda',
    bgClass: 'bg-[#040f0a] text-zinc-100',
    cardBg: 'bg-[#091a13]/80 hover:bg-[#0c241b]',
    cardBorder: 'border-emerald-950/70 hover:border-emerald-500/50',
    accentColor: '#10B981',
    accentText: 'text-emerald-400',
    accentBg: 'bg-emerald-500',
    accentGlow: 'shadow-[0_0_20px_rgba(16,185,129,0.25)]',
    highlightCard: 'border-emerald-500/60 bg-gradient-to-r from-emerald-950/50 via-[#0a1f16] to-[#0a1f16]',
    buttonClass: 'bg-emerald-500 hover:bg-emerald-400 text-zinc-950 font-semibold',
  },
  crimson: {
    id: 'crimson',
    name: 'Crimson Arena',
    description: 'Rojo escarlata y grafito profundo para espíritu competitivo',
    badge: 'Arena',
    bgClass: 'bg-[#0d0407] text-zinc-100',
    cardBg: 'bg-[#180a0f]/80 hover:bg-[#220d15]',
    cardBorder: 'border-rose-950/70 hover:border-rose-500/50',
    accentColor: '#F43F5E',
    accentText: 'text-rose-400',
    accentBg: 'bg-rose-500',
    accentGlow: 'shadow-[0_0_20px_rgba(244,63,94,0.3)]',
    highlightCard: 'border-rose-500/60 bg-gradient-to-r from-rose-950/50 via-[#1b0a11] to-[#1b0a11]',
    buttonClass: 'bg-rose-500 hover:bg-rose-400 text-zinc-950 font-semibold',
  },
  solargold: {
    id: 'solargold',
    name: 'Champion Gold',
    description: 'Oro campeonato sobre carbón oscuro de trofeos',
    badge: 'Championship',
    bgClass: 'bg-[#0a0a07] text-zinc-100',
    cardBg: 'bg-[#17160e]/80 hover:bg-[#211f12]',
    cardBorder: 'border-amber-950/70 hover:border-amber-500/50',
    accentColor: '#F59E0B',
    accentText: 'text-amber-400',
    accentBg: 'bg-amber-500',
    accentGlow: 'shadow-[0_0_20px_rgba(245,158,11,0.25)]',
    highlightCard: 'border-amber-500/60 bg-gradient-to-r from-amber-950/50 via-[#1b190f] to-[#1b190f]',
    buttonClass: 'bg-amber-500 hover:bg-amber-400 text-zinc-950 font-semibold',
  },
  monochrome: {
    id: 'monochrome',
    name: 'Stealth Mono',
    description: 'Monocromático brutalista, blanco frío y gris grafito',
    badge: 'Minimal',
    bgClass: 'bg-black text-zinc-100',
    cardBg: 'bg-zinc-950/80 hover:bg-zinc-900',
    cardBorder: 'border-zinc-800 hover:border-zinc-400/50',
    accentColor: '#E4E4E7',
    accentText: 'text-zinc-200',
    accentBg: 'bg-zinc-100 text-zinc-950',
    accentGlow: 'shadow-[0_0_20px_rgba(255,255,255,0.15)]',
    highlightCard: 'border-zinc-400/60 bg-gradient-to-r from-zinc-900 via-zinc-950 to-zinc-950',
    buttonClass: 'bg-zinc-100 hover:bg-white text-zinc-950 font-semibold',
  },
};
