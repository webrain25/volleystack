import { useMemo } from 'react';
import { Cake, Calendar, ChevronRight, Gift, PartyPopper } from 'lucide-react';
import { Link } from 'react-router-dom';

export interface BirthdayPlayer {
  memberId: string;
  name: string;
  birthDate: string; // ISO string
  formattedDate: string;
  daysUntil: number;
  isToday: boolean;
  nextAge?: number;
}

interface BirthdayAlertsProps {
  members?: any[];
  variant?: 'banner' | 'treasurer-widget';
  className?: string;
}

const MONTH_NAMES = [
  'Gennaio', 'Febbraio', 'Marzo', 'Aprile', 'Maggio', 'Giugno',
  'Luglio', 'Agosto', 'Settembre', 'Ottobre', 'Novembre', 'Dicembre'
];

export function getUpcomingBirthdays(members?: any[]): BirthdayPlayer[] {
  if (!members || !Array.isArray(members)) return [];

  const now = new Date();
  const currentYear = now.getFullYear();
  const startOfToday = new Date(currentYear, now.getMonth(), now.getDate());

  const list: BirthdayPlayer[] = [];

  for (const m of members) {
    const user = m.user || m;
    const rawBirthDate = user?.birthDate;
    if (!rawBirthDate) continue;

    const bDate = new Date(rawBirthDate);
    if (isNaN(bDate.getTime())) continue;

    const birthMonth = bDate.getMonth();
    const birthDay = bDate.getDate();

    // Birthday this year
    let targetDate = new Date(currentYear, birthMonth, birthDay);

    // If birthday already occurred this calendar year, look at next year
    if (targetDate.getTime() < startOfToday.getTime()) {
      targetDate = new Date(currentYear + 1, birthMonth, birthDay);
    }

    const diffMs = targetDate.getTime() - startOfToday.getTime();
    const daysUntil = Math.round(diffMs / (1000 * 60 * 60 * 24));
    const isToday = daysUntil === 0;

    const birthYear = bDate.getFullYear();
    const nextAge = birthYear > 1900 ? targetDate.getFullYear() - birthYear : undefined;

    const fullName = user.name || 'Giocatore';
    const formattedDate = `${birthDay} ${MONTH_NAMES[birthMonth]}`;

    list.push({
      memberId: m.id || user.id,
      name: fullName,
      birthDate: rawBirthDate,
      formattedDate,
      daysUntil,
      isToday,
      nextAge,
    });
  }

  // Sort by closest birthday
  return list.sort((a, b) => a.daysUntil - b.daysUntil);
}

export default function BirthdayAlerts({ members, variant = 'banner', className = '' }: BirthdayAlertsProps) {
  const birthdays = useMemo(() => getUpcomingBirthdays(members), [members]);

  if (!birthdays || birthdays.length === 0) {
    if (variant === 'treasurer-widget') {
      return (
        <div className={`p-4 bg-slate-50 dark:bg-surface/50 border border-slate-200 dark:border-white/10 rounded-2xl ${className}`}>
          <div className="flex items-center gap-2.5 text-slate-700 dark:text-slate-300 font-bold text-sm mb-1">
            <Cake className="w-4 h-4 text-amber-500" />
            <span>Compleanni & Turno Paste</span>
          </div>
          <p className="text-xs text-slate-500 dark:text-slate-400">
            Nessuna data di nascita registrata per i giocatori. Invitali ad aggiornare il profilo per ricevere i promemoria del turno paste!
          </p>
        </div>
      );
    }
    return null;
  }

  // Check if anyone has birthday today or within 14 days
  const todayBirthdays = birthdays.filter((b) => b.isToday);
  const nextBirthdays = birthdays.filter((b) => !b.isToday && b.daysUntil <= 30);
  const primaryAlert = todayBirthdays[0] || nextBirthdays[0];

  if (variant === 'banner') {
    if (!primaryAlert || primaryAlert.daysUntil > 14) return null;

    if (primaryAlert.isToday) {
      return (
        <div
          className={`p-3.5 sm:p-4 bg-gradient-to-r from-amber-500/20 via-pink-500/15 to-amber-500/10 border-2 border-amber-500/40 rounded-2xl flex items-center justify-between gap-3 shadow-md animate-in fade-in duration-300 ${className}`}
        >
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-amber-500 text-white flex items-center justify-center shrink-0 shadow-md animate-bounce">
              <PartyPopper className="w-5 h-5" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full bg-amber-500 text-slate-950 font-mono">
                  OGGI È IL COMPLEANNO!
                </span>
                {primaryAlert.nextAge && (
                  <span className="text-xs font-bold text-amber-600 dark:text-amber-400">
                    {primaryAlert.nextAge} anni
                  </span>
                )}
              </div>
              <h4 className="text-sm sm:text-base font-black text-slate-950 dark:text-white truncate">
                Tanti auguri a {primaryAlert.name}! 🎂
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-300 truncate">
                Nello spogliatoio la regola è chiara: oggi il turno delle paste è tuo! 🍰
              </p>
            </div>
          </div>
          <Link
            to="/pastes"
            className="shrink-0 px-3 py-1.5 bg-[#0A4059] hover:bg-[#072d3f] text-white dark:bg-white dark:text-slate-950 dark:hover:bg-slate-100 rounded-xl text-xs font-bold shadow-xs flex items-center gap-1 transition-all"
          >
            Vedi Paste <ChevronRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      );
    }

    return (
      <div
        className={`p-3 sm:p-3.5 bg-amber-500/10 border border-amber-500/25 rounded-2xl flex items-center justify-between gap-3 ${className}`}
      >
        <div className="flex items-center gap-2.5 min-w-0">
          <div className="w-8 h-8 rounded-lg bg-amber-500/20 text-amber-600 dark:text-amber-400 flex items-center justify-center shrink-0">
            <Cake className="w-4 h-4" />
          </div>
          <div className="min-w-0 text-xs text-slate-700 dark:text-slate-200">
            <span className="font-extrabold text-slate-900 dark:text-white">
              🎂 Prossimo Compleanno: {primaryAlert.name}
            </span>{' '}
            festeggia tra <strong className="text-amber-600 dark:text-amber-400">{primaryAlert.daysUntil} giorni</strong> ({primaryAlert.formattedDate}) ·{' '}
            <span className="text-slate-500 dark:text-slate-400">Turno paste in arrivo!</span>
          </div>
        </div>
        <Link
          to="/pastes"
          className="shrink-0 text-xs font-bold text-amber-700 dark:text-amber-400 hover:underline flex items-center gap-0.5"
        >
          Paste <ChevronRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    );
  }

  // Variant: 'treasurer-widget' for Treasury Page
  return (
    <div
      className={`p-4 sm:p-5 bg-gradient-to-br from-amber-500/10 via-slate-50 to-orange-500/5 dark:from-amber-950/20 dark:via-surface dark:to-orange-950/10 border border-amber-500/25 rounded-2xl space-y-3.5 shadow-sm ${className}`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
            <Cake className="w-4 h-4" />
          </div>
          <div>
            <h3 className="text-sm font-black text-slate-900 dark:text-white flex items-center gap-2">
              Segnalazione Tesoriere: Compleanni & Turno Paste
              <span className="px-1.5 py-0.5 text-[10px] font-bold rounded-md bg-amber-500/20 text-amber-700 dark:text-amber-300">
                {birthdays.length} registrati
              </span>
            </h3>
            <p className="text-[11px] text-slate-600 dark:text-slate-400">
              Chi compie gli anni porta le paste per tutta la squadra al prossimo allenamento.
            </p>
          </div>
        </div>

        <Link
          to="/pastes"
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 rounded-xl text-xs font-black shadow-xs transition-all"
        >
          <Gift className="w-3.5 h-3.5" /> Gestisci Paste
        </Link>
      </div>

      {/* List of upcoming birthdays */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5 pt-1">
        {birthdays.slice(0, 6).map((b) => (
          <div
            key={b.memberId}
            className={`p-3 rounded-xl border transition-all flex items-center justify-between ${
              b.isToday
                ? 'bg-amber-500/20 border-amber-500/60 shadow-sm ring-1 ring-amber-500/40'
                : b.daysUntil <= 14
                ? 'bg-amber-500/10 border-amber-500/30'
                : 'bg-white/60 dark:bg-white/5 border-slate-200 dark:border-white/10'
            }`}
          >
            <div className="min-w-0 pr-2">
              <div className="flex items-center gap-1.5">
                <span className="text-xs font-black text-slate-900 dark:text-white truncate">
                  {b.name}
                </span>
                {b.isToday && (
                  <span className="text-[9px] font-black uppercase px-1.5 py-0.2 rounded bg-amber-500 text-slate-950 animate-pulse">
                    Oggi! 🎉
                  </span>
                )}
              </div>
              <div className="flex items-center gap-1 text-[11px] text-slate-600 dark:text-slate-400 mt-0.5">
                <Calendar className="w-3 h-3 text-slate-400" />
                <span>{b.formattedDate}</span>
                {b.nextAge && <span className="text-slate-400">({b.nextAge} anni)</span>}
              </div>
            </div>

            <div className="shrink-0 text-right">
              {b.isToday ? (
                <span className="inline-block px-2 py-1 rounded-lg bg-amber-500 text-slate-950 text-[10px] font-black shadow-xs">
                  PASTE ORA 🍰
                </span>
              ) : (
                <span
                  className={`text-[11px] font-bold ${
                    b.daysUntil <= 14
                      ? 'text-amber-600 dark:text-amber-400'
                      : 'text-slate-500 dark:text-slate-400'
                  }`}
                >
                  tra {b.daysUntil}gg
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
