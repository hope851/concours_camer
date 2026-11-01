'use client';

import { useState, useMemo } from 'react';
import { ChevronLeft, ChevronRight, Clock, MapPin, FileText, X, Calendar } from 'lucide-react';
import Link from 'next/link';

interface ConcoursEvent {
  id: string;
  nomConcours?: string;
  nom_concours?: string;
  etat: boolean;
  dateOuverture?: string | Date;
  date_ouverture?: string | Date;
  limiteDepot?: string | Date;
  limite_depot?: string | Date;
  dateExamEcrit?: string | Date | null;
  date_exam_ecrit?: string | Date | null;
  diplomeRequis?: string;
  diplome_requis?: string;
  adressExam?: string | null;
  adress_exam?: string | null;
  eesId?: string;
  ees_id?: string;
  ees: {
    nomEes?: string;
    nom_ees?: string;
    id: string;
  };
}

const getNomConcours = (c: ConcoursEvent) => c.nomConcours ?? c.nom_concours ?? '';
const getDateOuverture = (c: ConcoursEvent) => c.dateOuverture ?? c.date_ouverture ?? '';
const getLimiteDepot = (c: ConcoursEvent) => c.limiteDepot ?? c.limite_depot ?? '';
const getDateExam = (c: ConcoursEvent) => c.dateExamEcrit ?? c.date_exam_ecrit ?? '';
const getDiplomeRequis = (c: ConcoursEvent) => c.diplomeRequis ?? c.diplome_requis ?? '';
const getAdressExam = (c: ConcoursEvent) => c.adressExam ?? c.adress_exam;
const getEesId = (c: ConcoursEvent) => c.eesId ?? c.ees_id ?? c.ees.id;
const getNomEes = (c: ConcoursEvent) => c.ees.nomEes ?? c.ees.nom_ees ?? '';

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
      const dateExam = new Date(getDateExam(c)).toLocaleDateString('fr-FR');
      const dateDepot = new Date(getLimiteDepot(c)).toLocaleDateString('fr-FR');
      const dateOuverture = new Date(getDateOuverture(c)).toLocaleDateString('fr-FR');

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
      .filter((c) => new Date(getDateExam(c)) > now)
      .sort((a, b) => new Date(getDateExam(a)).getTime() - new Date(getDateExam(b)).getTime())
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

  const getTotalEventsForDate = (dateStr: string) => {
    const events = getConcoursForDate(dateStr);
    return events.opening.length + events.deposit.length + events.exam.length;
  };

  const getTypesForEventOnDate = (event: ConcoursEvent, dateStr: string) => {
    const types: string[] = [];
    if (new Date(getDateOuverture(event)).toLocaleDateString('fr-FR') === dateStr) types.push('opening');
    if (new Date(getLimiteDepot(event)).toLocaleDateString('fr-FR') === dateStr) types.push('deposit');
    if (new Date(getDateExam(event)).toLocaleDateString('fr-FR') === dateStr) types.push('exam');
    return types;
  };

  const selectedDayEvents = selectedDateStr ? getConcoursForDate(selectedDateStr) : { opening: [], deposit: [], exam: [] };
  const allSelectedEvents = [...selectedDayEvents.opening, ...selectedDayEvents.deposit, ...selectedDayEvents.exam];

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 relative z-10">
        {/* Calendrier */}
        <div className="lg:col-span-2">
          <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-8 shadow-2xl">
            <div className="flex items-center justify-between mb-8">
              <h2 className="text-2xl font-black text-white flex items-center gap-3">
                <Calendar className="w-6 h-6 text-pink-400" />
                {monthNames[currentMonth.getMonth()]} {currentMonth.getFullYear()}
              </h2>
              <div className="flex gap-2">
                <button
                  onClick={handlePrevMonth}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all border border-white/10 cursor-pointer"
                >
                  <ChevronLeft className="w-5 h-5" />
                </button>
                <button
                  onClick={handleNextMonth}
                  className="p-2 bg-white/5 hover:bg-white/10 text-white rounded-lg transition-all border border-white/10 cursor-pointer"
                >
                  <ChevronRight className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* En-tête des jours */}
            <div className="grid grid-cols-7 gap-2 mb-4">
              {['Dim', 'Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'].map((day) => (
                <div key={day} className="text-center text-xs font-bold text-slate-400 py-2">
                  {day}
                </div>
              ))}
            </div>

            {/* Grille du calendrier */}
            <div className="grid grid-cols-7 gap-2">
              {emptyDays.map((_, i) => (
                <div key={`empty-${i}`} className="h-20 bg-white/2 rounded-xl" />
              ))}

              {daysArray.map((day) => {
                const dateStr = getDateString(day);
                const events = getConcoursForDate(dateStr);
                const hasEvents = events.opening.length > 0 || events.deposit.length > 0 || events.exam.length > 0;
                const totalEvents = getTotalEventsForDate(dateStr);

                return (
                  <div
                    key={day}
                    onClick={() => setSelectedDateStr(dateStr)}
                    className={`h-20 p-2 rounded-xl border transition-all duration-300 flex flex-col justify-between cursor-pointer hover:scale-105 shadow-lg ${
                      hasEvents
                        ? 'bg-white/15 border-indigo-500/50 hover:bg-indigo-500/20'
                        : 'bg-white/5 border-white/10 hover:bg-white/10 hover:border-white/20 text-slate-400'
                    }`}
                  >
                    <div className="flex justify-between items-start">
                      <span className={`text-sm font-bold ${hasEvents ? 'text-white' : 'text-slate-400'}`}>
                        {day}
                      </span>
                      {hasEvents && (
                        <span className="text-[10px] font-bold px-1.5 py-0.5 rounded-full bg-indigo-500/30 text-indigo-300 border border-indigo-400/30">
                          {totalEvents}
                        </span>
                      )}
                    </div>

                    {hasEvents && (
                      <div className="flex gap-1 flex-wrap">
                        {events.opening.length > 0 && (
                          <div className="w-2 h-2 rounded-full bg-blue-400" title="Ouverture" />
                        )}
                        {events.deposit.length > 0 && (
                          <div className="w-2 h-2 rounded-full bg-amber-400" title="Limite dépôt" />
                        )}
                        {events.exam.length > 0 && (
                          <div className="w-2 h-2 rounded-full bg-green-400" title="Examen" />
                        )}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Légende */}
            <div className="flex items-center gap-6 mt-8 pt-6 border-t border-white/10 text-xs text-slate-300">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-blue-400" />
                <span>Ouverture</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-amber-400" />
                <span>Limite dépôt</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-full bg-green-400" />
                <span>Jour d'examen</span>
              </div>
            </div>
          </div>
        </div>

        {/* Panneau latéral - Prochains concours */}
        <div className="lg:col-span-1">
          <div className="bg-linear-to-br from-white/10 to-white/5 backdrop-blur-xl rounded-3xl border border-white/20 p-6 shadow-2xl h-full flex flex-col justify-between">
            <div>
              <h3 className="text-lg font-black text-white mb-6 flex items-center gap-2">
                <Clock className="w-5 h-5 text-pink-400" />
                Prochains Concours
              </h3>

              {upcomingConcours.length > 0 ? (
                <div className="space-y-4">
                  {upcomingConcours.map((c) => (
                    <Link
                      key={c.id}
                      href={`/explore/${getEesId(c)}`}
                      className="group block p-4 rounded-xl bg-white/5 hover:bg-pink-500/20 border border-white/10 hover:border-pink-400/50 transition-all duration-300"
                    >
                      <p className="text-sm font-bold text-pink-300 mb-1 truncate">
                        {getNomConcours(c)}
                      </p>
                      <p className="text-xs text-slate-400 mb-3 line-clamp-1">
                        {getNomEes(c)}
                      </p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <Clock className="w-3 h-3 text-pink-400" />
                          <span>
                            {new Date(getDateExam(c)).toLocaleDateString('fr-FR')}
                          </span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-slate-300">
                          <FileText className="w-3 h-3 text-indigo-400" />
                          <span>
                            Limite: {new Date(getLimiteDepot(c)).toLocaleDateString('fr-FR')}
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
      </div>

      {/* Popup des événements du jour sélectionné */}
      {selectedDateStr && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="fixed inset-0 bg-black/70 backdrop-blur-md"
            onClick={() => setSelectedDateStr(null)}
          />

          <div className="relative z-10 bg-slate-900 border border-white/20 p-8 rounded-3xl shadow-2xl max-w-2xl w-full max-h-[85vh] overflow-y-auto">
            <div className="flex items-center justify-between mb-6 border-b border-white/10 pb-4">
              <div className="flex items-center gap-3">
                <Calendar className="w-6 h-6 text-indigo-400" />
                <h2 className="text-2xl font-black text-white">{selectedDateStr}</h2>
              </div>
              <button
                onClick={() => setSelectedDateStr(null)}
                className="p-2 hover:bg-white/10 rounded-xl transition-colors text-slate-400 hover:text-white"
              >
                <X className="w-6 h-6" />
              </button>
            </div>

            {allSelectedEvents.length > 0 ? (
              <div className="space-y-3">
                {allSelectedEvents.map((event) => (
                  <Link
                    key={event.id}
                    href={`/explore/${getEesId(event)}`}
                    className="group block p-4 rounded-xl bg-white/5 hover:bg-indigo-500/20 border border-white/10 hover:border-indigo-400/50 transition-all duration-300"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="text-lg font-bold text-indigo-300 group-hover:text-indigo-200 transition line-clamp-2">
                        {getNomConcours(event)}
                      </h3>
                      <span className={`px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap ml-2 shrink-0 ${
                        event.etat 
                          ? 'bg-green-500/20 border border-green-400/50 text-green-300'
                          : 'bg-slate-500/20 border border-slate-400/50 text-slate-300'
                      }`}>
                        {event.etat ? 'Actif' : 'Fermé'}
                      </span>
                    </div>
                    
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
                      <span className="line-clamp-1">{getNomEes(event)}</span>
                    </p>

                    <div className="grid grid-cols-3 gap-3 pt-3 border-t border-white/10">
                      <div>
                        <p className="text-xs text-slate-500 font-semibold mb-1 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-blue-400"></span>
                          Ouverture
                        </p>
                        <p className="text-xs text-white">
                          {new Date(getDateOuverture(event)).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-semibold mb-1 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-amber-400"></span>
                          Limite
                        </p>
                        <p className="text-xs text-amber-300 font-bold">
                          {new Date(getLimiteDepot(event)).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                      <div>
                        <p className="text-xs text-slate-500 font-semibold mb-1 flex items-center gap-1">
                          <span className="w-2 h-2 rounded-full bg-green-400"></span>
                          Examen
                        </p>
                        <p className="text-xs text-green-300 font-bold">
                          {new Date(getDateExam(event)).toLocaleDateString('fr-FR')}
                        </p>
                      </div>
                    </div>

                    <div className="mt-3 pt-3 border-t border-white/10">
                      <p className="text-xs text-slate-400">
                        <span className="font-semibold">Diplôme requis:</span> {getDiplomeRequis(event)}
                      </p>
                      {getAdressExam(event) && (
                        <p className="text-xs text-slate-400 mt-2">
                          <span className="font-semibold">Lieu:</span> {getAdressExam(event)}
                        </p>
                      )}
                    </div>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="text-center py-10">
                <p className="text-slate-200 font-bold text-lg mb-2">Aucun événement répertorié</p>
                <p className="text-slate-400 text-sm">Il n&apos;y a pas de concours prévu à cette date ({selectedDateStr}).</p>
              </div>
            )}

            <button
              onClick={() => setSelectedDateStr(null)}
              className="mt-6 w-full py-3 bg-white/10 hover:bg-white/20 text-white font-bold rounded-xl transition-all cursor-pointer"
            >
              Fermer
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
