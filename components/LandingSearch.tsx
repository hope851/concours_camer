'use client';

import { useState, useEffect } from 'react';
import { Search, MapPin, BookOpen, ArrowRight, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function LandingSearch() {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<{ id: string; name: string; type: 'ees' | 'concours'; ville?: string }[]>([]);
    const [isSearching, setIsSearching] = useState(false);
    const router = useRouter();

    useEffect(() => {
        const delayDebounceFn = setTimeout(async () => {
            if (query.length > 2) {
                setIsSearching(true);
                try {
                    const res = await fetch(`/api/search?q=${encodeURIComponent(query)}`);
                    const data = await res.json();
                    setResults(data);
                } catch (error) {
                    console.error('Search error:', error);
                } finally {
                    setIsSearching(false);
                }
            } else {
                setResults([]);
            }
        }, 300);

        return () => clearTimeout(delayDebounceFn);
    }, [query]);

    return (
        <div className="relative group">
            <div className="relative">
                <div className="absolute left-5 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-400 transition-colors">
                    {isSearching ? <Loader2 size={20} className="animate-spin" /> : <Search size={20} />}
                </div>
                <input
                    type="text"
                    value={query}
                    onChange={(e) => setQuery(e.target.value)}
                    placeholder="Rechercher une école, un concours, une ville..."
                    className="w-full pl-14 pr-6 py-5 bg-white/5 border border-white/10 rounded-2xl text-white placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 focus:bg-white/10 transition-all text-lg shadow-2xl"
                />
            </div>

            {results.length > 0 && (
                <div className="absolute top-full mt-4 w-full bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-3xl overflow-hidden z-50 animate-in fade-in zoom-in-95 duration-200">
                    <div className="max-h-100 overflow-y-auto p-2">
                        {results.map((item) => (
                            <Link
                                key={`${item.type}-${item.id}`}
                                href={item.type === 'ees' ? `/explore/${item.id}` : `/concours/${item.id}`}
                                className="flex items-center gap-4 p-4 hover:bg-white/5 rounded-xl transition-colors group/item"
                            >
                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center shrink-0 ${item.type === 'ees' ? 'bg-indigo-500/10 text-indigo-400' : 'bg-pink-500/10 text-pink-400'
                                    }`}>
                                    {item.type === 'ees' ? <BookOpen size={20} /> : <MapPin size={20} />}
                                </div>
                                <div className="flex-1 min-w-0">
                                    <p className="text-white font-bold truncate">{item.name}</p>
                                    <p className="text-slate-400 text-xs flex items-center gap-1 uppercase tracking-widest font-semibold mt-0.5">
                                        {item.type === 'ees' ? 'Établissement' : 'Concours'}
                                        {item.ville && ` • ${item.ville}`}
                                    </p>
                                </div>
                                <ArrowRight size={16} className="text-slate-600 group-hover/item:text-indigo-400 group-hover/item:translate-x-1 transition-all" />
                            </Link>
                        ))}
                    </div>
                    <div className="p-4 bg-white/5 border-t border-white/5 text-center">
                        <p className="text-xs text-slate-500">Appuyez sur Entrée pour voir tous les résultats</p>
                    </div>
                </div>
            )}
        </div>
    );
}
