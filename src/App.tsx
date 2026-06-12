import React, { useState, useEffect, useCallback } from 'react';
import { Calendar, Briefcase, CalendarOff, Palmtree, Trophy, ArrowRight, Info, MoonStar, MapPin, PartyPopper, Globe, Activity, RefreshCw, Sun, Moon, Download, Clock, Home, ChevronLeft, ChevronRight, Wifi, WifiOff } from 'lucide-react';

// ============================================================
// DADOS ESTÁTICOS - JOGOS DO BRASIL
// ============================================================
const matchesGroup = [
  { date: '2026-06-13', dayAfter: '2026-06-14', start: '23:00', end: '01:00', title: '🇧🇷 Brasil x 🇲🇦 Marrocos (Grupo C)', watchParty: { title: 'Casa do César', time: '19:23 às 01:15' } },
  { date: '2026-06-20', dayAfter: '2026-06-20', start: '01:30', end: '03:30', title: '🇧🇷 Brasil x 🇭🇹 Haiti (Grupo C)', madrugada: true, watchParty: { title: 'Casa do Allan', time: '23:00 (dia 19) às 03:35' } },
  { date: '2026-06-24', dayAfter: '2026-06-25', start: '23:00', end: '01:00', title: '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Escócia x 🇧🇷 Brasil (Grupo C)', watchParty: { title: 'Watch Party a definir', time: '' } }
];

const matchesPath1 = [
  { date: '2026-06-29', dayAfter: '2026-06-30', start: '18:00', end: '21:00', title: '16-Avos de Final (1C x 2F)', isKnockout: true, watchParty: { title: 'Watch Party a definir', time: '' } },
  { date: '2026-07-05', dayAfter: '2026-07-06', start: '21:00', end: '00:00', title: 'Oitavos de Final', isKnockout: true, watchParty: { title: 'Watch Party a definir', time: '' } },
  { date: '2026-07-11', dayAfter: '2026-07-12', start: '22:00', end: '01:00', title: 'Quartos de Final', isKnockout: true, watchParty: { title: 'Watch Party a definir', time: '' } },
  { date: '2026-07-15', dayAfter: '2026-07-16', start: '20:00', end: '23:00', title: 'Meia-Final', isKnockout: true, watchParty: { title: 'Watch Party a definir', time: '' } },
  { date: '2026-07-19', dayAfter: '2026-07-20', start: '20:00', end: '23:00', title: 'Final do Mundial 🏆', isKnockout: true, watchParty: { title: 'Watch Party a definir', time: '' } }
];

const matchesPath2 = [
  { date: '2026-06-30', dayAfter: '2026-06-30', start: '02:00', end: '05:00', title: '16-Avos de Final (1F x 2C)', isKnockout: true, madrugada: true, watchParty: { title: 'Watch Party a definir', time: '' } },
  { date: '2026-07-04', dayAfter: '2026-07-05', start: '22:00', end: '01:00', title: 'Oitavos de Final', isKnockout: true, watchParty: { title: 'Watch Party a definir', time: '' } },
  { date: '2026-07-09', dayAfter: '2026-07-10', start: '21:00', end: '00:00', title: 'Quartos de Final', isKnockout: true, watchParty: { title: 'Watch Party a definir', time: '' } },
  { date: '2026-07-14', dayAfter: '2026-07-15', start: '20:00', end: '23:00', title: 'Meia-Final', isKnockout: true, watchParty: { title: 'Watch Party a definir', time: '' } },
  { date: '2026-07-19', dayAfter: '2026-07-20', start: '20:00', end: '23:00', title: 'Final do Mundial 🏆', isKnockout: true, watchParty: { title: 'Watch Party a definir', time: '' } }
];

// ============================================================
// DADOS ESTÁTICOS - GRUPOS DA FASE DE GRUPOS (A a L, 48 seleções)
// Fonte: sorteio oficial de 05/12/2025
// ============================================================
const groupLetters = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L'];

// Mapeamento código FIFA -> emoji de bandeira
const flagMap = {
  MEX: '🇲🇽', RSA: '🇿🇦', KOR: '🇰🇷', CZE: '🇨🇿',
  CAN: '🇨🇦', BIH: '🇧🇦', QAT: '🇶🇦', SUI: '🇨🇭',
  BRA: '🇧🇷', MAR: '🇲🇦', HAI: '🇭🇹', SCO: '🏴󠁧󠁢󠁳󠁣󠁴󠁿',
  USA: '🇺🇸', PAR: '🇵🇾', AUS: '🇦🇺', TUR: '🇹🇷',
  GER: '🇩🇪', CUW: '🇨🇼', CIV: '🇨🇮', ECU: '🇪🇨',
  NED: '🇳🇱', JPN: '🇯🇵', SWE: '🇸🇪', TUN: '🇹🇳',
  BEL: '🇧🇪', EGY: '🇪🇬', IRN: '🇮🇷', NZL: '🇳🇿',
  ESP: '🇪🇸', CPV: '🇨🇻', KSA: '🇸🇦', URU: '🇺🇾',
  FRA: '🇫🇷', SEN: '🇸🇳', IRQ: '🇮🇶', NOR: '🇳🇴',
  ARG: '🇦🇷', ALG: '🇩🇿', AUT: '🇦🇹', JOR: '🇯🇴',
  POR: '🇵🇹', COD: '🇨🇩', UZB: '🇺🇿', COL: '🇨🇴',
  ENG: '🏴󠁧󠁢󠁥󠁮󠁧󠁿', CRO: '🇭🇷', GHA: '🇬🇭', PAN: '🇵🇦',
};

const groupsData = {
  A: [{ code: 'MEX', name: 'México' }, { code: 'RSA', name: 'África do Sul' }, { code: 'KOR', name: 'Coreia do Sul' }, { code: 'CZE', name: 'Rep. Tcheca' }],
  B: [{ code: 'CAN', name: 'Canadá' }, { code: 'BIH', name: 'Bósnia e Herzegovina' }, { code: 'QAT', name: 'Catar' }, { code: 'SUI', name: 'Suíça' }],
  C: [{ code: 'BRA', name: 'Brasil' }, { code: 'MAR', name: 'Marrocos' }, { code: 'HAI', name: 'Haiti' }, { code: 'SCO', name: 'Escócia' }],
  D: [{ code: 'USA', name: 'Estados Unidos' }, { code: 'PAR', name: 'Paraguai' }, { code: 'AUS', name: 'Austrália' }, { code: 'TUR', name: 'Turquia' }],
  E: [{ code: 'GER', name: 'Alemanha' }, { code: 'CUW', name: 'Curaçao' }, { code: 'CIV', name: 'Costa do Marfim' }, { code: 'ECU', name: 'Equador' }],
  F: [{ code: 'NED', name: 'Holanda' }, { code: 'JPN', name: 'Japão' }, { code: 'SWE', name: 'Suécia' }, { code: 'TUN', name: 'Tunísia' }],
  G: [{ code: 'BEL', name: 'Bélgica' }, { code: 'EGY', name: 'Egito' }, { code: 'IRN', name: 'Irã' }, { code: 'NZL', name: 'Nova Zelândia' }],
  H: [{ code: 'ESP', name: 'Espanha' }, { code: 'CPV', name: 'Cabo Verde' }, { code: 'KSA', name: 'Arábia Saudita' }, { code: 'URU', name: 'Uruguai' }],
  I: [{ code: 'FRA', name: 'França' }, { code: 'SEN', name: 'Senegal' }, { code: 'IRQ', name: 'Iraque' }, { code: 'NOR', name: 'Noruega' }],
  J: [{ code: 'ARG', name: 'Argentina' }, { code: 'ALG', name: 'Argélia' }, { code: 'AUT', name: 'Áustria' }, { code: 'JOR', name: 'Jordânia' }],
  K: [{ code: 'POR', name: 'Portugal' }, { code: 'COD', name: 'RD Congo' }, { code: 'UZB', name: 'Uzbequistão' }, { code: 'COL', name: 'Colômbia' }],
  L: [{ code: 'ENG', name: 'Inglaterra' }, { code: 'CRO', name: 'Croácia' }, { code: 'GHA', name: 'Gana' }, { code: 'PAN', name: 'Panamá' }],
};

// Classificação estática (zeros antes do torneio começar)
const buildStandings = (letter) =>
  groupsData[letter].map(({ code, name }) => ({
    team: `${flagMap[code] || ''} ${name}`,
    code,
    P: 0, V: 0, E: 0, D: 0, GP: 0, GS: 0, SG: 0, Pts: 0
  }));

// ============================================================
// HELPERS
// ============================================================
const formatDate = (d) => {
  if (!d) return null;
  const y = d.getFullYear();
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${y}-${m}-${day}`;
};

const getMatchTimes = (match) => {
  const start = new Date(`${match.date}T${match.start}:00`);
  const endDateStr = match.end < match.start ? match.dayAfter : match.date;
  const end = new Date(`${endDateStr}T${match.end}:00`);
  return { start, end };
};

const formatCountdown = (ms) => {
  const totalSec = Math.max(0, Math.floor(ms / 1000));
  const days = Math.floor(totalSec / 86400);
  const hours = Math.floor((totalSec % 86400) / 3600);
  const mins = Math.floor((totalSec % 3600) / 60);
  const secs = totalSec % 60;
  return { days, hours, mins, secs };
};

const downloadICS = (match) => {
  const fmt = (dateStr, timeStr) => dateStr.replace(/-/g, '') + 'T' + timeStr.replace(':', '') + '00';
  const endDateStr = match.end < match.start ? match.dayAfter : match.date;
  const dtStart = fmt(match.date, match.start);
  const dtEnd = fmt(endDateStr, match.end);
  const desc = match.watchParty && match.watchParty.title
    ? `Onde encontrar o Victor: ${match.watchParty.title}${match.watchParty.time ? ' - ' + match.watchParty.time : ''}`
    : 'Calendario Mundial 2026 - Victor Frossard';

  const ics = [
    'BEGIN:VCALENDAR', 'VERSION:2.0',
    'PRODID:-//Victor Frossard//World Cup 2026//PT',
    'BEGIN:VEVENT',
    `UID:${match.date}-${match.start}-worldcup2026@victor`,
    `DTSTART:${dtStart}`, `DTEND:${dtEnd}`,
    `SUMMARY:${match.title}`, `DESCRIPTION:${desc}`,
    'END:VEVENT', 'END:VCALENDAR'
  ].join('\r\n');

  const blob = new Blob([ics], { type: 'text/calendar;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url; a.download = `jogo-${match.date}.ics`;
  document.body.appendChild(a); a.click();
  document.body.removeChild(a); URL.revokeObjectURL(url);
};

// ============================================================
// SERVIÇO DE API - TheSportsDB (gratuito, CORS aberto, GitHub Pages OK)
// Documentação: https://www.thesportsdb.com/api.php
// Chave pública "3" para testes; para produção use chave própria gratuita
// Liga FIFA World Cup 2026 = id 4429
// ============================================================
const TSDB_BASE = 'https://www.thesportsdb.com/api/v1/json/3';
const WC_LEAGUE_ID = '4429';

// Converte timestamp UTC da API para hora de Lisboa
const toLisbonTime = (dateStr, timeStr) => {
  if (!dateStr || !timeStr) return { localDate: dateStr, localTime: '--:--' };
  try {
    const utc = new Date(`${dateStr}T${timeStr}Z`);
    const localDate = utc.toLocaleDateString('en-CA', { timeZone: 'Europe/Lisbon' });
    const localTime = utc.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit', timeZone: 'Europe/Lisbon' });
    return { localDate, localTime };
  } catch {
    return { localDate: dateStr, localTime: '--:--' };
  }
};

// Parse status da TheSportsDB para português
const parseStatus = (ev) => {
  const s = ev.strStatus || '';
  const hasScore = ev.intHomeScore !== null && ev.intHomeScore !== undefined && ev.intHomeScore !== '';
  if (s === 'Match Finished' || s === 'FT') return 'Finalizado';
  if (s && s !== 'Not Started' && !isNaN(parseInt(s))) return `Ao Vivo ${s}'`;
  if (hasScore && s !== 'Not Started') return 'Ao Vivo';
  return 'Agendado';
};

// Busca jogos para uma data específica (hora Lisboa)
const fetchGamesByDate = async (dateStr) => {
  const res = await fetch(`${TSDB_BASE}/eventsday.php?d=${dateStr}&l=${WC_LEAGUE_ID}`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  return (data.events || []).filter(ev => ev.strHomeTeam && ev.strAwayTeam);
};

// Busca classificação de um grupo via TheSportsDB
// Endpoint: /lookuptable.php?l=LEAGUE_ID&s=SEASON
const fetchGroupStandings = async (groupLetter) => {
  // TheSportsDB não tem endpoint de classificação por grupo diretamente.
  // Usamos o endpoint de tabela da liga. Seasons format: "2026"
  const res = await fetch(`${TSDB_BASE}/lookuptable.php?l=${WC_LEAGUE_ID}&s=2026`);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const data = await res.json();
  if (!data.table || !data.table.length) return null;

  // A API retorna todas as seleções; filtramos pelo grupo
  const groupTeamCodes = groupsData[groupLetter].map(t => t.code);
  const filtered = data.table.filter(row =>
    groupTeamCodes.some(code =>
      row.strTeam?.toLowerCase().includes(code.toLowerCase()) ||
      row.strTeamBadge?.includes(code)
    )
  );
  return filtered.length > 0 ? filtered : null;
};

// ============================================================
// APP
// ============================================================
export default function App() {
  const [path, setPath] = useState('1st');
  const [dark, setDark] = useState(false);
  const [groupIndex, setGroupIndex] = useState(2); // Grupo C por padrão

  const today = new Date();
  const todayFormattedStr = formatDate(today);
  const todayDisplay = today.toLocaleDateString('pt-PT', { day: '2-digit', month: '2-digit', year: 'numeric' });

  // --- Tema ---
  const pageBg = dark ? 'bg-slate-950' : 'bg-slate-100';
  const textPrimary = dark ? 'text-slate-100' : 'text-slate-800';
  const subText = dark ? 'text-slate-400' : 'text-slate-600';
  const cardBg = dark ? 'bg-slate-900 border-slate-800' : 'bg-white border-gray-200';
  const cardInnerBg = dark ? 'bg-slate-950/50' : 'bg-slate-50/50';
  const headerGrad = dark ? 'from-black to-slate-900' : 'from-slate-800 to-slate-900';
  const dayBg = dark ? 'bg-slate-900' : 'bg-white';
  const dayBorder = dark ? 'border-slate-800' : 'border-gray-200';

  const getDayInfo = (dateObj, selectedPath) => {
    if (!dateObj) return null;
    const dateStr = formatDate(dateObj);

    const vacations = [
      '2026-06-14', '2026-07-05', '2026-07-12',
      '2026-07-15', '2026-07-16', '2026-07-17', '2026-07-18', '2026-07-19'
    ];
    let schedule = { type: 'trabalho', label: 'Trabalho (10h-19h)' };

    const dow = dateObj.getDay();
    if (dow === 1 || dow === 2) schedule = { type: 'folga', label: 'Folga' };
    if (vacations.includes(dateStr)) schedule = { type: 'ferias', label: 'Férias' };

    let customEvents = [];
    if (dateStr === '2026-06-14') {
      customEvents.push({
        typeLabel: 'After Party (Vitória)',
        title: 'Samba no Mercado Municipal de Braga',
        time: 'A partir das 01:15',
        color: dark ? 'bg-fuchsia-950 text-fuchsia-200 border-fuchsia-800' : 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-300'
      });
    }
    if (dateStr === '2026-06-19') {
      customEvents.push({
        typeLabel: 'Pré-jogo',
        title: 'Casa do Allan (Brasil x Haiti)',
        time: 'A partir das 23:00',
        color: dark ? 'bg-indigo-950 text-indigo-200 border-indigo-800' : 'bg-indigo-100 text-indigo-800 border-indigo-300'
      });
    }

    const activeMatches = [...matchesGroup, ...(selectedPath === '1st' ? matchesPath1 : matchesPath2)];
    const game = activeMatches.find(m => m.date === dateStr);
    const isDayAfter = activeMatches.some(m => m.dayAfter === dateStr);
    const isToday = dateStr === todayFormattedStr;

    return { dateStr, schedule, game, isDayAfter, customEvents, isToday };
  };

  const generateDays = (year, month) => {
    const days = [];
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDay = new Date(year, month, 1).getDay();
    let emptyCells = firstDay === 0 ? 6 : firstDay - 1;
    for (let i = 0; i < emptyCells; i++) days.push(null);
    for (let i = 1; i <= daysInMonth; i++) days.push(new Date(year, month, i));
    return days;
  };

  const juneDays = generateDays(2026, 5);
  const julyDays = generateDays(2026, 6);

  // ----------------------------------------------------------
  // SchedulePill
  // ----------------------------------------------------------
  const SchedulePill = ({ schedule }) => {
    if (schedule.type === 'trabalho') return (
      <div className={`text-xs font-semibold flex items-center px-2 py-1 rounded w-fit mb-2 ${dark ? 'text-slate-300 bg-slate-800' : 'text-slate-700 bg-slate-200'}`}>
        <Briefcase size={14} className="mr-1.5" /> {schedule.label}
      </div>
    );
    if (schedule.type === 'folga') return (
      <div className={`text-xs font-semibold flex items-center px-2 py-1 rounded w-fit mb-2 ${dark ? 'text-sky-200 bg-sky-900' : 'text-sky-800 bg-sky-200'}`}>
        <CalendarOff size={14} className="mr-1.5" /> {schedule.label}
      </div>
    );
    if (schedule.type === 'ferias') return (
      <div className={`text-xs font-semibold flex items-center px-2 py-1 rounded w-fit mb-2 shadow-sm border ${dark ? 'text-purple-200 bg-purple-950 border-purple-800' : 'text-purple-800 bg-purple-100 border-purple-300'}`}>
        <Palmtree size={14} className="mr-1.5" /> {schedule.label}
      </div>
    );
    return null;
  };

  // ----------------------------------------------------------
  // MatchInfoCard
  // ----------------------------------------------------------
  const MatchInfoCard = ({ game, dateObj }) => {
    if (!game) return null;
    const dow = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'][dateObj.getDay()];
    return (
      <div className="mt-2 bg-emerald-600 text-white p-2.5 rounded-lg shadow flex flex-col gap-1.5 border border-emerald-500 relative overflow-hidden transition-all duration-300 hover:scale-105">
        {game.madrugada && <MoonStar className="absolute top-2 right-2 text-emerald-400 opacity-30" size={32} />}
        <div className="text-[10px] font-bold flex items-center bg-emerald-800 w-fit px-1.5 py-0.5 rounded uppercase tracking-wider relative z-10">
          <Trophy size={10} className="mr-1.5" /> Jogo Brasil
        </div>
        <div className="font-bold text-sm leading-tight relative z-10">{game.title}</div>
        <div className="text-xs font-medium bg-emerald-700/80 p-1 rounded inline-block w-fit relative z-10">
          {dow}, {game.start} - {game.end}
        </div>
        {game.watchParty && (
          <div className="mt-1 bg-emerald-800/60 p-2 rounded-lg border border-emerald-500/50 flex flex-col gap-1 relative z-10">
            <div className="text-[10px] uppercase text-emerald-300 font-bold flex items-center tracking-wider">
              <MapPin size={12} className="mr-1.5" /> Onde me encontrar
            </div>
            <div className="text-xs font-bold text-white leading-tight">
              {game.watchParty.title}
              {game.watchParty.time && <span className="block text-[10px] text-emerald-100 mt-0.5 font-medium">{game.watchParty.time}</span>}
            </div>
          </div>
        )}
        {game.isKnockout && (
          <div className="text-[10px] bg-white/20 px-1.5 py-1 rounded mt-1 leading-tight font-medium relative z-10">
            * Margem p/ prolongamento e penáltis
          </div>
        )}
        <button
          onClick={() => downloadICS(game)}
          className="mt-1 text-[10px] font-bold uppercase tracking-wider flex items-center justify-center bg-white/15 hover:bg-white/30 transition-colors px-2 py-1.5 rounded-lg relative z-10 w-fit"
        >
          <Download size={12} className="mr-1.5" /> Adicionar ao calendário
        </button>
      </div>
    );
  };

  // ----------------------------------------------------------
  // NextMatchWidget (sem alterações de lógica, mas com dados reais quando disponíveis)
  // ----------------------------------------------------------
  const NextMatchWidget = () => {
    const [now, setNow] = useState(new Date());

    useEffect(() => {
      const t = setInterval(() => setNow(new Date()), 1000);
      return () => clearInterval(t);
    }, []);

    const allMatches = [...matchesGroup, ...(path === '1st' ? matchesPath1 : matchesPath2)];
    const withTimes = allMatches.map(m => {
      const { start, end } = getMatchTimes(m);
      const bufferedEnd = m.isKnockout ? new Date(end.getTime() + 30 * 60000) : end;
      return { ...m, start, end, bufferedEnd };
    });

    const target = withTimes.find(m => m.bufferedEnd > now);

    if (!target) return (
      <div className={`rounded-2xl md:rounded-3xl p-5 md:p-6 mb-12 max-w-5xl mx-auto shadow-md border ${cardBg} flex items-center gap-4`}>
        <div className="bg-emerald-100 p-3 rounded-full flex-shrink-0"><Trophy className="text-emerald-600" size={24} /></div>
        <div>
          <h3 className={`font-bold text-lg ${textPrimary}`}>Sem mais jogos agendados</h3>
          <p className={`text-sm ${subText}`}>A jornada do Brasil neste cenário já terminou.</p>
        </div>
      </div>
    );

    const isLive = now >= target.start && now <= target.bufferedEnd;
    const cd = formatCountdown(target.start - now);

    return (
      <div className={`rounded-2xl md:rounded-3xl p-5 md:p-6 mb-12 max-w-5xl mx-auto shadow-lg border relative overflow-hidden ${dark ? 'bg-gradient-to-br from-emerald-950 to-slate-900 border-emerald-900' : 'bg-gradient-to-br from-emerald-50 to-white border-emerald-200'}`}>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className={`p-3 rounded-full flex-shrink-0 ${isLive ? 'bg-red-100' : 'bg-emerald-100'}`}>
              {isLive ? <Activity className="text-red-600 animate-pulse" size={24} /> : <Clock className="text-emerald-600" size={24} />}
            </div>
            <div>
              <div className={`text-[10px] font-bold uppercase tracking-widest ${isLive ? 'text-red-500' : 'text-emerald-600'}`}>
                {isLive ? '🔴 A decorrer agora' : 'Próximo jogo do Brasil'}
              </div>
              <h3 className={`font-black text-lg md:text-xl ${textPrimary}`}>{target.title}</h3>
              <p className={`text-xs md:text-sm ${subText}`}>
                {target.start.toLocaleDateString('pt-PT', { weekday: 'long', day: '2-digit', month: '2-digit' })} • {target.start.toTimeString().slice(0, 5)} - {target.bufferedEnd.toTimeString().slice(0, 5)} (Portugal)
              </p>
            </div>
          </div>
          {!isLive && (
            <div className="flex gap-2 md:gap-3">
              {[['Dias', cd.days], ['Horas', cd.hours], ['Min', cd.mins], ['Seg', cd.secs]].map(([label, val]) => (
                <div key={label} className={`flex flex-col items-center justify-center rounded-xl px-3 py-2 min-w-[56px] shadow-sm ${dark ? 'bg-slate-800' : 'bg-white border border-emerald-100'}`}>
                  <span className={`text-xl md:text-2xl font-black tabular-nums ${textPrimary}`}>{String(val).padStart(2, '0')}</span>
                  <span className={`text-[9px] uppercase tracking-widest font-bold ${subText}`}>{label}</span>
                </div>
              ))}
            </div>
          )}
        </div>
        {target.watchParty?.title && (
          <div className={`mt-4 flex items-center gap-2 text-xs md:text-sm font-semibold ${subText}`}>
            <MapPin size={14} className="text-emerald-500" /> {target.watchParty.title} {target.watchParty.time && `• ${target.watchParty.time}`}
          </div>
        )}
      </div>
    );
  };

  // ----------------------------------------------------------
  // GroupStandingsTable — com dados reais da TheSportsDB
  // ----------------------------------------------------------
  const GroupStandingsTable = () => {
    const letter = groupLetters[groupIndex];
    const [standings, setStandings] = useState(buildStandings(letter));
    const [apiStatus, setApiStatus] = useState('idle'); // idle | loading | live | static | error
    const [lastFetch, setLastFetch] = useState(null);

    const prevGroup = () => setGroupIndex((groupIndex - 1 + groupLetters.length) % groupLetters.length);
    const nextGroup = () => setGroupIndex((groupIndex + 1) % groupLetters.length);

    const headBg = dark ? 'bg-slate-950 text-slate-500 border-slate-800' : 'bg-slate-50 text-slate-500 border-slate-100';
    const rowBorder = dark ? 'border-slate-800' : 'border-slate-50';
    const rowHover = dark ? 'hover:bg-slate-800' : 'hover:bg-slate-50';
    const brHover = dark ? 'hover:bg-emerald-950' : 'hover:bg-emerald-50';

    const loadStandings = useCallback(async () => {
      setApiStatus('loading');
      try {
        const data = await fetchGroupStandings(letter);
        if (data && data.length > 0) {
          // Mapear resposta da API para o formato local
          const mapped = groupsData[letter].map(({ code, name }) => {
            const row = data.find(r =>
              r.strTeam?.toLowerCase().includes(name.toLowerCase().split(' ')[0])
            );
            return {
              team: `${flagMap[code] || ''} ${name}`,
              code,
              P: parseInt(row?.intPlayed || 0),
              V: parseInt(row?.intWin || 0),
              E: parseInt(row?.intDraw || 0),
              D: parseInt(row?.intLoss || 0),
              GP: parseInt(row?.intGoalsFor || 0),
              GS: parseInt(row?.intGoalsAgainst || 0),
              SG: parseInt(row?.intGoalDifference || 0),
              Pts: parseInt(row?.intPoints || 0),
            };
          }).sort((a, b) => b.Pts - a.Pts || b.SG - a.SG || b.GP - a.GP);
          setStandings(mapped);
          setApiStatus('live');
        } else {
          // API não tem dados ainda (torneio não começou) — usar zeros estáticos
          setStandings(buildStandings(letter));
          setApiStatus('static');
        }
      } catch {
        setStandings(buildStandings(letter));
        setApiStatus('error');
      }
      setLastFetch(new Date());
    }, [letter]);

    useEffect(() => {
      setStandings(buildStandings(letter));
      loadStandings();
    }, [letter, loadStandings]);

    const StatusBadge = () => {
      if (apiStatus === 'loading') return (
        <span className={`text-[9px] flex items-center gap-1 ${subText}`}>
          <RefreshCw size={9} className="animate-spin" /> A carregar...
        </span>
      );
      if (apiStatus === 'live') return (
        <span className="text-[9px] flex items-center gap-1 text-emerald-500">
          <Wifi size={9} /> Dados reais
        </span>
      );
      if (apiStatus === 'static') return (
        <span className={`text-[9px] flex items-center gap-1 ${subText}`}>
          <Clock size={9} /> Aguarda início
        </span>
      );
      if (apiStatus === 'error') return (
        <span className="text-[9px] flex items-center gap-1 text-amber-500">
          <WifiOff size={9} /> Offline
        </span>
      );
      return null;
    };

    return (
      <div className={`col-span-1 rounded-2xl shadow-lg border overflow-hidden flex flex-col ${cardBg}`}>
        <div className="bg-emerald-700 p-4 flex items-center justify-between gap-2">
          <button onClick={prevGroup} className="bg-emerald-800/60 hover:bg-emerald-800 text-white p-1.5 rounded-lg transition-colors flex-shrink-0" title="Grupo anterior">
            <ChevronLeft size={18} />
          </button>
          <div className="flex flex-col items-center gap-0.5">
            <h3 className="text-white font-bold flex items-center text-sm md:text-base gap-2">
              <Globe className="text-emerald-200 flex-shrink-0" size={18} /> Grupo {letter}
            </h3>
            <StatusBadge />
          </div>
          <button onClick={nextGroup} className="bg-emerald-800/60 hover:bg-emerald-800 text-white p-1.5 rounded-lg transition-colors flex-shrink-0" title="Próximo grupo">
            <ChevronRight size={18} />
          </button>
        </div>

        <div className="flex-grow overflow-x-auto">
          <table className="w-full text-sm text-left h-full whitespace-nowrap">
            <thead className={`text-[10px] md:text-xs uppercase border-b ${headBg}`}>
              <tr>
                <th className="px-3 py-3">Seleção</th>
                <th className="px-2 py-3 text-center" title="Pontos">Pts</th>
                <th className="px-2 py-3 text-center" title="Saldo de Gols">SG</th>
                <th className="px-2 py-3 text-center" title="Gols Pró">GP</th>
                <th className="px-2 py-3 text-center" title="Jogos">J</th>
                <th className="px-2 py-3 text-center" title="Vitórias">V</th>
                <th className="px-2 py-3 text-center" title="Empates">E</th>
                <th className="px-2 py-3 text-center" title="Derrotas">D</th>
                <th className="px-2 py-3 text-center" title="Gols Sofridos">GS</th>
              </tr>
            </thead>
            <tbody>
              {standings.map((row) => {
                const isBrasil = letter === 'C' && row.code === 'BRA';
                const isPortugal = letter === 'K' && row.code === 'POR';
                const isHighlight = isBrasil || isPortugal;
                return (
                  <tr key={row.team} className={`border-b ${rowBorder} ${isHighlight ? brHover : rowHover} transition-colors`}>
                    <td className={`px-3 py-3 font-medium ${isHighlight ? `font-bold ${textPrimary}` : textPrimary}`}>{row.team}</td>
                    <td className={`px-2 py-3 text-center font-black ${isHighlight ? 'text-emerald-500' : textPrimary}`}>{row.Pts}</td>
                    <td className={`px-2 py-3 text-center font-bold ${subText}`}>{row.SG > 0 ? `+${row.SG}` : row.SG}</td>
                    <td className={`px-2 py-3 text-center font-bold ${subText}`}>{row.GP}</td>
                    <td className={`px-2 py-3 text-center font-bold ${subText}`}>{row.P}</td>
                    <td className={`px-2 py-3 text-center font-bold ${subText}`}>{row.V}</td>
                    <td className={`px-2 py-3 text-center font-bold ${subText}`}>{row.E}</td>
                    <td className={`px-2 py-3 text-center font-bold ${subText}`}>{row.D}</td>
                    <td className={`px-2 py-3 text-center font-bold ${subText}`}>{row.GS}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        <div className={`px-3 py-2 text-[9px] leading-relaxed border-t flex items-center justify-between gap-2 ${dark ? 'border-slate-800 text-slate-500' : 'border-slate-100 text-slate-400'}`}>
          <span>Pontos → Saldo → Gols → Confronto Direto</span>
          <button onClick={loadStandings} className={`hover:text-emerald-500 transition-colors flex-shrink-0 ${subText}`} title="Atualizar classificação">
            <RefreshCw size={10} className={apiStatus === 'loading' ? 'animate-spin' : ''} />
          </button>
        </div>
      </div>
    );
  };

  // ----------------------------------------------------------
  // LivePanel — Jogos do dia via TheSportsDB + fallback
  // ----------------------------------------------------------
  const LivePanel = () => {
    const [todaysGames, setTodaysGames] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [lastUpdate, setLastUpdate] = useState(new Date());
    const [isRefreshing, setIsRefreshing] = useState(false);
    const [dataSource, setDataSource] = useState('loading'); // 'loading' | 'api' | 'fallback' | 'empty'

    // Jogos do Brasil como fallback mínimo
    const fallbackBrazilGames = matchesGroup.map(m => ({
      date: m.date,
      team1: m.title.includes('Escócia') ? '🏴󠁧󠁢󠁳󠁣󠁴󠁿 Escócia' : m.title.split(' x ')[0].trim(),
      team2: m.title.split(' x ')[1]?.split(' (')[0].trim() || '',
      time: m.start,
      status: 'Agendado',
      score1: null, score2: null,
      stadium: '', city: '',
    }));

    const fetchLiveGames = async () => {
      setIsRefreshing(true);
      try {
        // Busca hoje e amanhã (para jogos que começam depois da meia-noite em Lisboa)
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const tomorrowStr = formatDate(tomorrow);

        const [todayEvents, tomorrowEvents] = await Promise.all([
          fetchGamesByDate(todayFormattedStr).catch(() => []),
          fetchGamesByDate(tomorrowStr).catch(() => []),
        ]);

        const allEvents = [...todayEvents, ...tomorrowEvents];

        const mapped = allEvents
          .map(ev => {
            const { localDate, localTime } = toLisbonTime(ev.dateEvent, ev.strTime);
            return {
              date: localDate,
              team1: ev.strHomeTeam,
              team2: ev.strAwayTeam,
              time: localTime,
              status: parseStatus(ev),
              score1: (ev.intHomeScore !== null && ev.intHomeScore !== undefined && ev.intHomeScore !== '') ? ev.intHomeScore : null,
              score2: (ev.intAwayScore !== null && ev.intAwayScore !== undefined && ev.intAwayScore !== '') ? ev.intAwayScore : null,
              stadium: ev.strVenue || '',
              city: ev.strCity || '',
              round: ev.intRound || '',
            };
          })
          .filter(g => g.date === todayFormattedStr);

        if (mapped.length > 0) {
          setTodaysGames(mapped);
          setDataSource('api');
        } else {
          // Sem jogos hoje via API — verificar se há jogo do Brasil hoje no calendário estático
          const brazilToday = fallbackBrazilGames.filter(g => g.date === todayFormattedStr);
          setTodaysGames(brazilToday);
          setDataSource(brazilToday.length > 0 ? 'fallback' : 'empty');
        }
      } catch {
        const brazilToday = fallbackBrazilGames.filter(g => g.date === todayFormattedStr);
        setTodaysGames(brazilToday);
        setDataSource(brazilToday.length > 0 ? 'fallback' : 'empty');
      } finally {
        setLastUpdate(new Date());
        setIsLoading(false);
        setIsRefreshing(false);
      }
    };

    useEffect(() => {
      fetchLiveGames();
      // Atualiza a cada 60 segundos durante o torneio
      const interval = setInterval(fetchLiveGames, 60000);
      return () => clearInterval(interval);
    }, []);

    const hasLiveGame = todaysGames.some(g => g.status.includes('Ao Vivo'));

    return (
      <div className="mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6 max-w-5xl mx-auto w-full">
        <div className={`col-span-1 lg:col-span-2 rounded-2xl shadow-lg border overflow-hidden flex flex-col ${cardBg}`}>
          <div className={`bg-gradient-to-r ${headerGrad} p-4 flex items-center justify-between`}>
            <div className="flex items-center gap-2">
              <Activity className={`${hasLiveGame ? 'text-red-400 animate-pulse' : 'text-emerald-400'} flex-shrink-0`} size={18} />
              <h3 className="text-white font-bold text-sm md:text-base">
                Jogos de Hoje
                {hasLiveGame && <span className="ml-2 text-[10px] bg-red-500 px-1.5 py-0.5 rounded font-bold uppercase tracking-wider">Ao Vivo</span>}
              </h3>
            </div>
            <div className="flex items-center gap-3">
              <div className="flex flex-col items-end">
                <span className="text-[10px] text-slate-300 hidden sm:inline-block">
                  {lastUpdate.toLocaleTimeString('pt-PT', { hour: '2-digit', minute: '2-digit' })}
                </span>
                {dataSource === 'api' && <span className="text-[9px] text-emerald-400 flex items-center gap-0.5 hidden sm:flex"><Wifi size={8}/> API ao vivo</span>}
                {dataSource === 'fallback' && <span className="text-[9px] text-amber-400 flex items-center gap-0.5 hidden sm:flex"><WifiOff size={8}/> Dados locais</span>}
              </div>
              <button
                onClick={fetchLiveGames}
                className="bg-slate-700 hover:bg-slate-600 text-white p-1.5 md:px-3 md:py-1.5 rounded flex items-center transition-colors border border-slate-600"
                title="Atualizar resultados"
              >
                <RefreshCw size={14} className={`text-emerald-400 md:mr-1.5 ${isRefreshing ? 'animate-spin' : ''}`} />
                <span className="hidden md:inline text-xs font-bold">Refresh</span>
              </button>
            </div>
          </div>

          <div className={`p-4 flex-grow relative min-h-[140px] ${cardInnerBg}`}>
            {isLoading ? (
              <div className={`absolute inset-0 flex flex-col items-center justify-center z-10 ${cardInnerBg}`}>
                <RefreshCw size={24} className="text-emerald-500 animate-spin mb-2" />
                <span className={`text-xs font-bold ${subText}`}>A sincronizar com a API…</span>
              </div>
            ) : todaysGames.length > 0 ? (
              <div className="flex flex-col gap-3">
                {dataSource === 'fallback' && (
                  <div className={`text-[10px] font-semibold px-3 py-2 rounded-lg flex items-center gap-2 ${dark ? 'bg-amber-950 text-amber-300' : 'bg-amber-50 text-amber-700'}`}>
                    <WifiOff size={12} /> A mostrar dados do calendário local (API indisponível ou sem jogos hoje na API)
                  </div>
                )}
                {todaysGames.map((game, i) => (
                  <div key={i} className={`p-3 md:p-4 rounded-xl border shadow-sm hover:shadow-md transition-shadow ${dark ? 'bg-slate-800 border-slate-700' : 'bg-white border-slate-200'}`}>
                    <div className="flex items-center justify-between">
                      <span className={`font-bold w-5/12 text-right text-sm md:text-base truncate ${textPrimary}`}>{game.team1}</span>
                      <div className="flex flex-col items-center w-2/12 px-1">
                        <span className={`text-[10px] uppercase tracking-widest font-bold mb-1 ${game.status.includes('Ao Vivo') ? 'text-red-500 animate-pulse' : game.status === 'Finalizado' ? 'text-slate-400' : (dark ? 'text-slate-500' : 'text-slate-400')}`}>
                          {game.status}
                        </span>
                        {game.score1 !== null ? (
                          <span className={`text-sm md:text-base font-black px-3 py-1 rounded-full ${dark ? 'bg-slate-700 text-slate-100' : 'bg-slate-100 text-slate-800'}`}>
                            {game.score1} — {game.score2}
                          </span>
                        ) : (
                          <span className={`text-xs md:text-sm font-black px-3 py-1 rounded-full border ${dark ? 'bg-slate-700 border-slate-600 text-slate-100' : 'bg-slate-100 border-slate-200 text-slate-800'}`}>{game.time}</span>
                        )}
                      </div>
                      <span className={`font-bold w-5/12 text-left text-sm md:text-base truncate ${textPrimary}`}>{game.team2}</span>
                    </div>
                    {(game.stadium || game.city) && (
                      <div className={`mt-2 flex items-center justify-center gap-1 text-[10px] ${subText}`}>
                        <MapPin size={9} /> {[game.city, game.stadium].filter(Boolean).join(' · ')}
                        {game.round && <span className="ml-2">Ronda {game.round}</span>}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            ) : (
              <div className={`h-full flex flex-col items-center justify-center py-6 ${subText}`}>
                <CalendarOff size={32} className="mb-3 opacity-50" />
                <p className="text-sm font-medium">Nenhum jogo do Mundial agendado para hoje.</p>
                <p className={`text-xs mt-1 ${subText}`}>O torneio começa a 11 de junho de 2026.</p>
              </div>
            )}
          </div>
        </div>

        <GroupStandingsTable />
      </div>
    );
  };

  // ----------------------------------------------------------
  // MonthCalendar
  // ----------------------------------------------------------
  const MonthCalendar = ({ name, days }) => (
    <div className={`mb-12 md:rounded-3xl shadow-xl border-y md:border overflow-hidden ${cardBg}`}>
      <div className={`bg-gradient-to-r ${headerGrad} text-white p-5 md:p-6 font-black text-xl md:text-2xl text-center tracking-wide shadow-inner`}>
        {name}
      </div>
      <div className={`p-4 md:p-6 lg:p-8 ${cardInnerBg}`}>
        <div className="hidden md:grid grid-cols-7 gap-4 mb-4">
          {['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta', 'Sábado', 'Domingo'].map(d => (
            <div key={d} className={`text-center font-bold text-xs uppercase tracking-widest pb-3 border-b-2 ${dark ? 'text-slate-500 border-slate-800' : 'text-slate-400 border-slate-200'}`}>
              {d}
            </div>
          ))}
        </div>
        <div className="grid grid-cols-1 md:grid-cols-7 gap-4 md:gap-3 lg:gap-4">
          {days.map((dateObj, i) => {
            if (!dateObj) return <div key={`empty-${i}`} className="hidden md:block bg-transparent rounded-2xl"></div>;
            const info = getDayInfo(dateObj, path);
            let bgClass = dayBg;
            let borderClass = `${dayBorder} md:border-2 border`;

            if (info.game && info.isDayAfter) {
              bgClass = dark ? 'bg-gradient-to-br from-emerald-950 to-amber-950' : 'bg-gradient-to-br from-emerald-50 to-amber-50';
              borderClass = 'border-emerald-500 border-2 shadow-md ring-2 ring-amber-200/50 z-10';
            } else if (info.game) {
              bgClass = dark ? 'bg-emerald-950' : 'bg-emerald-50';
              borderClass = 'border-emerald-500 border-2 shadow-md ring-4 ring-emerald-50/30 z-10';
            } else if (info.isDayAfter) {
              bgClass = dark ? 'bg-amber-950/40' : 'bg-amber-50/80';
              borderClass = 'border-amber-400 border-2 shadow-sm z-10';
            }
            if (info.isToday) borderClass += ' ring-2 ring-offset-2 ring-blue-400 ' + (dark ? 'ring-offset-slate-900' : 'ring-offset-white');

            const dowMobile = ['Domingo', 'Segunda-feira', 'Terça-feira', 'Quarta-feira', 'Quinta-feira', 'Sexta-feira', 'Sábado'][dateObj.getDay()];

            return (
              <div key={info.dateStr} id={`day-${info.dateStr}`} className={`p-4 md:p-3 lg:p-4 rounded-2xl md:min-h-[160px] flex flex-col transition-all duration-300 hover:-translate-y-1 ${bgClass} ${borderClass}`}>
                <div className={`flex justify-between items-center mb-3 border-b pb-2 md:pb-1 ${dark ? 'border-slate-800' : 'border-slate-100'}`}>
                  <span className={`font-black text-2xl md:text-xl lg:text-2xl flex items-center gap-2 ${textPrimary}`}>
                    {dateObj.getDate()}
                    {info.isToday && <span className="text-[9px] uppercase tracking-widest font-bold bg-blue-500 text-white px-1.5 py-0.5 rounded">Hoje</span>}
                  </span>
                  <span className={`md:hidden text-[10px] font-bold uppercase tracking-widest px-2.5 py-1 rounded-md ${dark ? 'text-slate-400 bg-slate-800' : 'text-slate-500 bg-slate-100'}`}>{dowMobile}</span>
                </div>
                <SchedulePill schedule={info.schedule} />
                {info.customEvents && info.customEvents.map((ev, idx) => (
                  <div key={`ce-${idx}`} className={`mb-2 p-2 rounded-xl md:rounded-lg border shadow-sm flex flex-col gap-0.5 relative z-10 ${ev.color}`}>
                    <div className="text-[10px] font-bold uppercase tracking-wider flex items-center opacity-80">
                      <PartyPopper size={12} className="mr-1.5" /> {ev.typeLabel}
                    </div>
                    <div className="text-xs font-bold leading-tight mt-0.5">{ev.title}</div>
                    <div className="text-[10px] font-medium opacity-90">{ev.time}</div>
                  </div>
                ))}
                <MatchInfoCard game={info.game} dateObj={dateObj} />
                {info.isDayAfter && (
                  <div className="mt-auto pt-4 pb-1 text-xs text-amber-800 font-bold flex items-center">
                    <div className={`p-2 rounded-xl md:rounded-lg flex items-center shadow-sm w-full border ${dark ? 'bg-gradient-to-r from-amber-900 to-amber-950 border-amber-800 text-amber-200' : 'bg-gradient-to-r from-amber-200 to-amber-100 border-amber-300'}`}>
                      <ArrowRight size={16} className="mr-2 flex-shrink-0 text-amber-600" />
                      <span className="leading-tight font-bold">
                        {info.game && info.game.madrugada ? 'Recuperação no mesmo dia!' : 'Recuperação Pós-Jogo'}
                      </span>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );

  const scrollToToday = () => {
    const el = document.getElementById(`day-${todayFormattedStr}`);
    if (el) el.scrollIntoView({ behavior: 'smooth', block: 'center' });
  };

  return (
    <div className={`min-h-screen ${pageBg} ${textPrimary} py-6 md:py-8 font-sans selection:bg-emerald-200 transition-colors duration-300`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">

        <header className="mb-10 md:mb-12 text-center mt-4 relative">
          <button
            onClick={() => setDark(!dark)}
            className={`absolute right-0 top-0 p-2.5 rounded-full shadow-lg border transition-all hover:scale-110 ${dark ? 'bg-slate-800 border-slate-700 text-amber-300' : 'bg-white border-slate-200 text-slate-700'}`}
            title="Alternar modo escuro"
          >
            {dark ? <Sun size={18} /> : <Moon size={18} />}
          </button>
          <div className="inline-flex items-center justify-center p-3 bg-slate-800 text-emerald-400 rounded-full mb-6 shadow-lg border border-slate-700 hover:scale-105 transition-transform">
            <Calendar size={18} className="mr-2" />
            <span className="font-bold text-xs tracking-widest uppercase">Agenda Pública 2026</span>
          </div>
          <h1 className="text-3xl md:text-5xl lg:text-6xl font-black mb-6 tracking-tight leading-tight">
            Calendário Oficial de Victor Frossard <br className="hidden md:block" />
            <span className="text-emerald-500 text-xl md:text-3xl lg:text-4xl mt-3 inline-block font-extrabold">FIFA World Cup™ Canadá/México/EUA 2026</span>
          </h1>
          <p className={`max-w-3xl mx-auto text-sm md:text-lg leading-relaxed font-medium ${subText}`}>
            Bem-vindo à minha agenda oficial. Aqui podem acompanhar a minha disponibilidade, dias de trabalho, férias e os momentos em que estarei incontactável a apoiar a <strong className={textPrimary}>Seleção Brasileira 🇧🇷</strong>. Agenda com horários convertidos para <strong className={textPrimary}>Portugal (WEST/WEST+1 - 24h)</strong>.
          </p>
        </header>

        <NextMatchWidget />
        <LivePanel />

        <div className={`border p-5 md:p-6 rounded-2xl md:rounded-3xl mb-12 flex flex-col md:flex-row items-start gap-4 max-w-5xl mx-auto shadow-md ${dark ? 'bg-gradient-to-r from-blue-950 to-indigo-950 border-blue-900' : 'bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200'}`}>
          <div className={`p-3 rounded-full flex-shrink-0 mt-1 shadow-inner ${dark ? 'bg-blue-900' : 'bg-blue-100'}`}>
            <Info className={dark ? 'text-blue-300' : 'text-blue-700'} size={24} />
          </div>
          <div className={`text-sm md:text-base ${subText}`}>
            <h3 className={`font-bold text-lg mb-2 ${dark ? 'text-blue-300' : 'text-blue-900'}`}>Cenário Atualizado ({todayDisplay})</h3>
            <p className="leading-relaxed">O Brasil 🇧🇷 joga na fase de grupos contra Marrocos 🇲🇦 (Nova Iorque), Haiti 🇭🇹 (Filadélfia) e Escócia 🏴󠁧󠁢󠁳󠁣󠁴󠁿 (Miami). O jogo com o Haiti começa às <strong className={dark ? 'text-blue-300 bg-blue-900 px-1 rounded' : 'text-blue-900 bg-blue-100 px-1 rounded'}>01h30 da manhã</strong> do dia 20 em Portugal.</p>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row justify-center gap-4 mb-12 px-4">
          {['1st', '2nd'].map((p) => (
            <button
              key={p}
              onClick={() => setPath(p)}
              className={`px-4 sm:px-6 py-3 md:py-4 rounded-2xl font-bold transition-all shadow-sm flex items-center justify-center text-sm md:text-base flex-1 max-w-sm w-full ${path === p ? 'bg-emerald-600 text-white ring-4 ring-emerald-300 ring-offset-2 scale-[1.02]' : (dark ? 'bg-slate-900 text-slate-300 hover:bg-slate-800 border border-slate-700 hover:border-emerald-700' : 'bg-white text-slate-700 hover:bg-slate-50 border border-slate-200 hover:border-emerald-300')}`}
            >
              <Trophy className="mr-2 flex-shrink-0" size={20} />
              Se o Brasil 🇧🇷 Passar em {p === '1st' ? '1º' : '2º'}
            </button>
          ))}
        </div>

        <div className={`p-5 md:p-8 rounded-3xl shadow-lg border mb-12 max-w-5xl mx-auto ${cardBg}`}>
          <h3 className={`text-[10px] md:text-xs font-black uppercase tracking-widest mb-4 text-center ${subText}`}>Guia Visual do Calendário</h3>
          <div className="flex flex-wrap gap-4 md:gap-6 items-center justify-center text-xs md:text-sm">
            {[
              { color: dark ? 'bg-emerald-950 border-emerald-500' : 'bg-emerald-50 border-emerald-500', label: 'Jogo 🇧🇷' },
              { color: dark ? 'bg-amber-950 border-amber-400' : 'bg-amber-50 border-amber-400', label: 'Recuperação Pós-Jogo' },
            ].map(({ color, label }) => (
              <div key={label} className={`flex items-center font-bold px-3 py-1.5 rounded-lg border ${dark ? 'text-slate-300 bg-slate-800 border-slate-700' : 'text-slate-700 bg-slate-50 border-slate-100'}`}>
                <div className={`w-4 h-4 border-2 rounded mr-2 shadow-sm ${color}`}></div> {label}
              </div>
            ))}
            {[
              { Icon: Briefcase, bg: dark ? 'bg-slate-800 text-slate-300' : 'bg-slate-200 text-slate-700', label: 'Trabalho' },
              { Icon: CalendarOff, bg: dark ? 'bg-sky-900 text-sky-200' : 'bg-sky-200 text-sky-800', label: 'Folga' },
              { Icon: Palmtree, bg: dark ? 'bg-purple-950 text-purple-200' : 'bg-purple-100 text-purple-800', label: 'Férias' },
            ].map(({ Icon, bg, label }) => (
              <div key={label} className={`flex items-center font-bold px-3 py-1.5 rounded-lg border ${dark ? 'text-slate-300 bg-slate-800 border-slate-700' : 'text-slate-700 bg-slate-50 border-slate-100'}`}>
                <div className={`w-5 h-5 flex items-center justify-center rounded mr-2 shadow-sm ${bg}`}><Icon size={12} /></div> {label}
              </div>
            ))}
            <div className={`flex items-center font-bold px-3 py-1.5 rounded-lg border ${dark ? 'text-slate-300 bg-slate-800 border-slate-700' : 'text-slate-700 bg-slate-50 border-slate-100'}`}>
              <div className="w-4 h-4 ring-2 ring-blue-400 rounded mr-2"></div> Hoje
            </div>
          </div>
        </div>

        <MonthCalendar name="Junho 2026" days={juneDays} />
        <MonthCalendar name="Julho 2026" days={julyDays} />

        {/* Rodapé com créditos da API */}
        <div className={`mt-4 mb-8 text-center text-[10px] ${subText} flex items-center justify-center gap-1`}>
          <Wifi size={10} className="text-emerald-500" />
          Dados em tempo real via <a href="https://www.thesportsdb.com" target="_blank" rel="noopener noreferrer" className="text-emerald-500 hover:underline ml-1">TheSportsDB</a>
          <span className="mx-1">·</span> Funciona em GitHub Pages · Sem chave de API necessária
        </div>
      </div>

      <button
        onClick={scrollToToday}
        className="fixed bottom-5 right-5 bg-emerald-600 hover:bg-emerald-700 text-white p-4 rounded-full shadow-2xl transition-all hover:scale-110 z-50 flex items-center gap-2 font-bold text-sm"
        title="Ir para hoje"
      >
        <Home size={18} /> <span className="hidden sm:inline">Hoje</span>
      </button>
    </div>
  );
}