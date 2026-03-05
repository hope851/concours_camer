'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, FileText, X, Calendar } from 'lucide-react';
import Link from 'next/link';

interface ConcoursEvent {
  id: string;
  nom_concours: string;
  etat: boolean;
  date_ouverture: string;
  limite_depot: string;
  date_exam: string;
  diplome_requis: string;
  adress_exam?: string;
  ees_id: string;
  ees: {
    nom_ees: string;
    id: string;
  };
}

export default function ConcoursCalendar({ concours }: { concours: ConcoursEvent[] }) {
  const [currentMonth, setCurrentMonth] = useState(new Date());
  const [selectedDateStr, setSelectedDateStr] = useState<string | null>(null);

  const monthNames = [
    'Janvier', 'Février', 'Mars', 'Avril', 'Mai', 'Juin',
    'Juillet', 'Août', 'Septembre', 'Octobre', 'Novembre', 'Décembre'
  ];

  const daysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const firstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const concoursMap = useMemo(() => {
    const map = new Map<string, { opening: ConcoursEvent[], deposit: ConcoursEvent[], exam: ConcoursEvent[] }>();
    concours.forEach((c) => {
      const dateExam = new Date(c.date_exam).toLocaleDateString('fr-FR');
      const dateDepot = new Date(c.limite_depot).toLocaleDateString('fr-FR');
      const dateOuverture = new Date(c.date_ouverture).toLocaleDateString('fr-FR');

      // Date d'ouverture
      if (!map.has(dateOuverture)) {
        map.set(dateOuverture, { opening: [], deposit: [], exam: [] });
      }
      map.get(dateOuverture)?.opening.push(c);

      // Limite de dépôt
      if (!map.has(dateDepot)) {
        map.set(dateDepot, { opening: [], deposit: [], exam: [] });
      }
      map.get(dateDepot)?.deposit.push(c);

      // Date d'examen
      if (!map.has(dateExam)) {
        map.set(dateExam, { opening: [], deposit: [], exam: [] });
      }
      map.get(dateExam)?.exam.push(c);
    });
    return map;
  }, [concours]);

  const daysArray = Array.from({ length: daysInMonth(currentMonth) }, (_, i) => i + 1);
  const emptyDays = Array.from({ length: firstDayOfMonth(currentMonth) }, (_, i) => i);

  const upcomingConcours = useMemo(() => {
    const now = new Date();
    return concours
      .filter((c) => new Date(c.date_exam) > now)
      .sort((a, b) => new Date(a.date_exam).getTime() - new Date(b.date_exam).getTime())
      .slice(0, 5);
  }, [concours]);

  const handlePrevMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1));
  };

  const handleNextMonth = () => {
    setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1));
  };

  const getDateString = (day: number) => {
    const date = new Date(currentMonth.getFullYear(), currentMonth.getMonth(), day);
    return date.toLocaleDateString('fr-FR');
  };

  const getConcoursForDate = (dateStr: string) => {
    return concoursMap.get(dateStr) || { opening: [], deposit: [], exam: [] };
  };

  const getEventTypeForDate = (dateStr: string) => {
    const events = getConcoursForDate(dateStr);
    if (events.exam.length > 0) return 'exam';
    if (events.deposit.length > 0) return 'deposit';
    if (events.opening.length > 0) return 'opening';
    return null;
  };

  const getTotalEventsForDate = (dateStr: string) => {
    const events = getConcoursForDate(dateStr);
    return events.opening.length + events.deposit.length + events.exam.length;
  };

  // mapping des couleurs par type pour réutilisation
  const typeColors: Record<string, string> = {
    opening: 'bg-blue-400',
    deposit: 'bg-amber-400',
    exam: 'bg-green-400',
  };

  const getTypesForEventOnDate = (event: ConcoursEvent, dateStr: string) => {
    const types: string[] = [];
    if (new Date(event.date_ouverture).toLocaleDateString('fr-FR') === dateStr) types.push('opening');
    if (new Date(event.limite_depot).toLocaleDateString('fr-FR') === dateStr) types.push('deposit');
    if (new Date(event.date_exam).toLocaleDateString('fr-FR') === dateStr) types.push('exam');
    return types;
  };

  const selectedDayEvents = selectedDateStr ? getConcoursForDate(selectedDateStr) : { opening: [], deposit: [], exam: [] };
  const allSelectedEvents = [...selectedDayEvents.opening, ...selectedDayEvents.deposit, ...selectedDayEvents.exam];

  return (
    <div className="space-y-8">
      {/* Backdrop pour fermer la popup */}
      {selectedDateStr && (
        <div 
          className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
          onClick={() => setSelectedDateStr(null)}
        />
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-50">
        {/* Calendrier */}
        <div className="lg:col-span-2">
          <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="mb-8">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-2xl font-black text-white">
                  {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </h3>
                <div className="flex gap-2">
                  <button
                    onClick={handlePrevMonth}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ChevronLeft className="w-5 h-5 text-indigo-400" />
                  </button>
                  <button
                    onClick={handleNextMonth}
                    className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                  >
                    <ChevronRight className="w-5 h-5 text-indigo-400" />
                  </button>
                </div>
              </div>

              {/* Jours de la semaine */}
              <div className="grid grid-cols-7 gap-2 mb-4">
                {['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam', 'Dim'].map((day) => (
                  <div
                    key={day}
                    className="text-center py-2 text-sm font-bold text-indigo-300"
                  >
                    {day}
                  </div>
                ))}
              </div>

              {/* Jours du mois */}
              <div className="grid grid-cols-7 gap-2">
                {emptyDays.map((_, i) => (
                  <div key={`empty-${i}`} className="aspect-square" />
                ))}
                {daysArray.map((day) => {
                  const dateStr = getDateString(day);
                  const dayEvents = getConcoursForDate(dateStr);
                  const totalEvents = getTotalEventsForDate(dateStr);
                  const eventType = getEventTypeForDate(dateStr);
                  const hasConcours = totalEvents > 0;
                  const isToday =
                    new Date().toLocaleDateString('fr-FR') === dateStr;
                  const isSelected = selectedDateStr === dateStr;

                  // Déterminer les couleurs en fonction du type d'événement
                  let bgColor = '';
                  let textColor = '';
                  let borderColor = '';
                  let shadowColor = '';
                  let dotColor = '';

                  if (isToday) {
                    bgColor = 'bg-linear-to-br from-indigo-500 to-purple-500';
                    textColor = 'text-white';
                    shadowColor = 'shadow-indigo-500/50';
                  } else if (hasConcours) {
                    if (isSelected) {
                      bgColor = 'bg-linear-to-br from-pink-600 to-pink-500';
                      textColor = 'text-white';
                      borderColor = 'border-2 border-pink-300';
                      shadowColor = 'shadow-pink-500/50';
                    } else {
                      // Couleurs basées sur le type d'événement prioritaire
                      if (eventType === 'exam') {
                        bgColor = 'bg-green-500/30';
                        textColor = 'text-green-100';
                        borderColor = 'border border-green-400/50 hover:border-green-400';
                        dotColor = 'bg-green-400';
                      } else if (eventType === 'deposit') {
                        bgColor = 'bg-amber-500/30';
                        textColor = 'text-amber-100';
                        borderColor = 'border border-amber-400/50 hover:border-amber-400';
                        dotColor = 'bg-amber-400';
                      } else if (eventType === 'opening') {
                        bgColor = 'bg-blue-500/30';
                        textColor = 'text-blue-100';
                        borderColor = 'border border-blue-400/50 hover:border-blue-400';
                        dotColor = 'bg-blue-400';
                      }
                    }
                  } else {
                    bgColor = 'bg-white/5';
                    textColor = 'text-white';
                    borderColor = 'border border-white/10 cursor-default';
                  }

                  return (
                    <button
                      key={day}
                      onClick={() => {
                        if (hasConcours) {
                          setSelectedDateStr(isSelected ? null : dateStr);
                        }
                      }}
                      disabled={!hasConcours}
                      className={`aspect-square rounded-xl font-bold text-sm transition-all duration-300 relative group cursor-pointer ${bgColor} ${textColor} ${borderColor} ${
                        hasConcours && !isToday && !isSelected ? 'hover:bg-opacity-50' : ''
                      } ${isToday || isSelected ? 'shadow-lg' : ''}`}
                      style={
                        isToday || isSelected 
                          ? { boxShadow: `0 20px 25px -5px ${shadowColor === 'shadow-indigo-500/50' ? 'rgba(99, 102, 241, 0.5)' : 'rgba(236, 72, 153, 0.5)'}` }
                          : {}
                      }
                    >
                      {day}
                      {hasConcours && (
                        <div className="absolute bottom-1 left-1/2 -translate-x-1/2 flex gap-0.5">
                          {dayEvents.exam.length > 0 && (
                            <div className="w-1 h-1 rounded-full bg-green-400" title="Examen" />
                          )}
                          {dayEvents.deposit.length > 0 && (
                            <div className="w-1 h-1 rounded-full bg-amber-400" title="Limite de dépôt" />
                          )}
                          {dayEvents.opening.length > 0 && (
                            <div className="w-1 h-1 rounded-full bg-blue-400" title="Ouverture" />
                          )}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Légende */}
            <div className="border-t border-white/10 pt-6">
              <p className="text-xs text-slate-400 mb-3 font-semibold">LÉGENDE</p>
              <div className="space-y-2">
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-blue-400" />
                  <span className="text-sm text-slate-300">Ouverture du concours</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-amber-400" />
                  <span className="text-sm text-slate-300">Limite de dépôt</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-green-400" />
                  <span className="text-sm text-slate-300">Date d'examen</span>
                </div>
                <div className="flex items-center gap-2">
                  <div className="w-3 h-3 rounded bg-linear-to-br from-indigo-500 to-purple-500" />
                  <span className="text-sm text-slate-300">Aujourd'hui</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Prochains concours */}
        <div className="lg:col-span-1">
          <div className="bg-linear-to-br from-pink-600/20 to-pink-600/10 backdrop-blur-xl rounded-3xl border border-pink-500/30 p-8 sticky top-20">
            <h3 className="text-xl font-black text-white mb-6">Prochains concours</h3>

            {upcomingConcours.length > 0 ? (
              <div className="space-y-4">
                {upcomingConcours.map((c) => (
                  <Link
                    key={c.id}
                    href={`/explore/${c.ees_id}`}
                    className="group block p-4 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-400/50 transition-all duration-300"
                  >
                    <p className="text-sm font-bold text-pink-300 mb-1 truncate">
                      {c.nom_concours}
                    </p>
                    <p className="text-xs text-slate-400 mb-3 line-clamp-1">
                      {c.ees.nom_ees}
                    </p>
                    <div className="space-y-2">
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <Clock className="w-3 h-3 text-pink-400" />
                        <span>
                          {new Date(c.date_exam).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                      <div className="flex items-center gap-2 text-xs text-slate-300">
                        <FileText className="w-3 h-3 text-indigo-400" />
                        <span>
                          Limite: {new Date(c.limite_depot).toLocaleDateString('fr-FR')}
                        </span>
                      </div>
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-8">
                <p className="text-slate-400 text-sm">Aucun concours prévu</p>
              </div>
            )}

            <Link
              href="/concours"
              className="block mt-6 w-full py-2 bg-linear-to-r from-pink-600 to-pink-500 hover:from-pink-600 hover:to-pink-600 text-white font-bold rounded-lg text-center transition-all duration-300"
            >
              Voir tous les concours
            </Link>
          </div>
        </div>
      </div>

      {/* Popup des événements du jour sélectionné */}
      {selectedDateStr && allSelectedEvents.length > 0 && (
        <div className="fixed inset-0 flex items-center justify-center z-50 p-4">
          <div className="bg-linear-to-br from-slate-800 to-slate-900 backdrop-blur-xl rounded-2xl border border-white/20 p-8 shadow-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-black text-white">{selectedDateStr}</h2>
              </div>
              <button
                onClick={() => setSelectedDateStr(null)}
                className="p-2 hover:bg-white/10 rounded-lg transition-colors shrink-0"
              >
                <X className="w-6 h-6 text-white" />
              </button>
            </div>

            <div className="space-y-3">
              {allSelectedEvents.map((event) => (
                <Link
                  key={event.id}
                  href={`/explore/${event.ees_id}`}
                  className="group block p-4 rounded-xl bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-400/50 transition-all duration-300"
                >
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-indigo-300 group-hover:text-indigo-200 transition line-clamp-2">
                      {event.nom_concours}
                    </h3>
                    <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2 shrink-0 ${
                      event.etat 
                        ? 'bg-green-500/20 border border-green-400/50 text-green-300'
                        : 'bg-slate-500/20 border border-slate-400/50 text-slate-300'
                    }`}>
                      {event.etat ? 'Actif' : 'Fermé'}
                    </span>
                  </div>
                  
                  {/* Badges indiquant le(s) type(s) pour la date sélectionnée */}
                  <div className="mt-2 mb-3">
                    <div className="flex items-center gap-2">
                      {(selectedDateStr ? getTypesForEventOnDate(event, selectedDateStr) : []).map((t) => (
                        <span
                          key={t}
                          className={`px-2 py-0.5 rounded-full text-xs font-semibold whitespace-nowrap ${
                            t === 'opening' ? 'bg-blue-400/20 text-blue-200 border border-blue-400/30' :
                            t === 'deposit' ? 'bg-amber-400/20 text-amber-200 border border-amber-400/30' :
                            'bg-green-400/20 text-green-200 border border-green-400/30'
                          }`}
                        >
                          {t === 'opening' ? 'Ouverture' : t === 'deposit' ? 'Limite' : 'Examen'}
                        </span>
                      ))}
                    </div>
                  </div>

                  <p className="text-sm text-slate-400 mb-3 flex items-center gap-2">
                    <MapPin className="w-4 h-4 text-pink-400 shrink-0" />
                    <span className="line-clamp-1">{event.ees.nom_ees}</span>
                  </p>

                  <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                    <div>
                      <p className="text-xs text-slate-500 font-semibold mb-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                        Ouverture
                      </p>
                      <p className="text-xs text-white">
                        {new Date(event.date_ouverture).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold mb-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                        Limite
                      </p>
                      <p className="text-xs text-amber-300 font-bold">
                        {new Date(event.limite_depot).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs text-slate-500 font-semibold mb-1 flex items-center gap-1">
                        <span className="w-2 h-2 rounded-full bg-green-400"></span>
                        Examen
                      </p>
                      <p className="text-xs text-green-300 font-bold">
                        {new Date(event.date_exam).toLocaleDateString('fr-FR')}
                      </p>
                    </div>
                  </div>

                  <div className="mt-3 pt-3 border-t border-white/10">
                    <p className="text-xs text-slate-400">
                      <span className="font-semibold">Diplôme requis:</span> {event.diplome_requis}
                    </p>
                    {event.adress_exam && (
                      <p className="text-xs text-slate-400 mt-2">
                        <span className="font-semibold">Lieu:</span> {event.adress_exam}
                      </p>
                    )}
                  </div>
                </Link>
              ))}
            </div>

            <button
              onClick={() => setSelectedDateStr(null)}
              className="mt-6 w-full py-2 bg-white/10 hover:bg-white/20 text-white font-semibold rounded-lg transition-all"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
