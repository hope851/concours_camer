'use client';

import Link from 'next/link';
import { Zap, Menu, X, LogOut, User } from 'lucide-react';
import { useState, useEffect } from 'react';
import { GetCurrentUser, LogoutUser } from '@/app/action/user';

interface UserType {
  id: string;
  email: string;
  nom: string;
  role: string;
  isActive: boolean;
}

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  const [user, setUser] = useState<UserType | null>(null);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    async function checkUser() {
      try {
        const currentUser = await GetCurrentUser();
        setUser(currentUser);
      } catch (error) {
        console.error("Navbar checkUser error:", error);
      } finally {
        setLoading(false);
      }
    }
    checkUser();
  }, []);

  const navLinks = [
    { href: '/news', label: 'Actualités' },
    { href: '/tutelles', label: 'Tutelles' },
    { href: '/explore', label: 'Établissements' },
    { href: '/concours', label: 'Concours' },
    { href: '/guide', label: 'Guide' },
    { href: '/faq', label: 'FAQ' },
    { href: '/contact', label: 'Contact' },
  ];

  async function handleLogout() {
    await LogoutUser();
    setUser(null);
    setIsDropdownOpen(false);
    window.location.href = '/';
  }

  return (
    <nav className="sticky top-0 z-50 bg-black/30 backdrop-blur-md border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 pr-16 sm:px-6 sm:pr-16 lg:px-8 lg:pr-16 py-4">
        <div className="flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 hover:opacity-80 transition">
            <div className="w-10 h-10 bg-linear-to-br from-indigo-500 to-purple-600 rounded-lg flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-xl font-black text-white hidden sm:inline">Concours-Camer</h1>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden xl:flex gap-6 items-center flex-1 ml-12">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-slate-300 hover:text-white transition font-semibold text-sm"
              >
                {link.label}
              </Link>
            ))}
          </div>

          {/* Auth Section */}
          <div className="hidden xl:flex items-center gap-3">
            {loading ? (
              <div className="w-10 h-10 bg-white/10 rounded-lg animate-pulse"></div>
            ) : user ? (
              <div className="relative">
                <button
                  onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                  className="flex items-center gap-2 px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition font-semibold text-sm"
                >
                  <User size={18} />
                  {user.nom.split(' ')[0]}
                </button>

                {/* Dropdown Menu */}
                {isDropdownOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setIsDropdownOpen(false)}
                    />
                    <div className="absolute right-0 mt-3 w-56 bg-slate-900/95 backdrop-blur-xl border border-white/10 rounded-2xl shadow-2xl py-2 z-50 animate-in fade-in zoom-in-95 duration-200">
                      <div className="px-4 py-3 border-b border-white/5 bg-white/5">
                        <p className="text-sm text-white font-bold truncate">{user.nom}</p>
                        <p className="text-xs text-slate-400 truncate">{user.email}</p>
                      </div>
                      <div className="p-1">
                        <Link
                          href="/profile"
                          className="flex items-center gap-3 px-3 py-2.5 text-slate-300 hover:text-white hover:bg-white/5 rounded-xl transition-all group"
                          onClick={() => setIsDropdownOpen(false)}
                        >
                          <User size={18} className="text-indigo-400 group-hover:scale-110 transition-transform" />
                          <span className="font-medium text-sm">Mon Profil</span>
                        </Link>
                        {user.role === 'ADMIN' && (
                          <Link
                            href="/profile/admin"
                            className="flex items-center gap-3 px-3 py-2.5 text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 rounded-xl transition-all group"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <span className="font-medium text-sm">Console Admin</span>
                          </Link>
                        )}
                        {user.role === 'GESTIONAIRE' && (
                          <Link
                            href="/profile/gestion"
                            className="flex items-center gap-3 px-3 py-2.5 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-xl transition-all group"
                            onClick={() => setIsDropdownOpen(false)}
                          >
                            <span className="font-medium text-sm">Espace Gestion</span>
                          </Link>
                        )}
                        <button
                          onClick={handleLogout}
                          className="w-full flex items-center gap-3 px-3 py-2.5 text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 rounded-xl transition-all group cursor-pointer"
                        >
                          <LogOut size={18} className="group-hover:scale-110 transition-transform" />
                          <span className="font-medium text-sm text-left">Déconnexion</span>
                        </button>
                      </div>
                    </div>
                  </>
                )}
              </div>
            ) : (
              <div className="flex gap-2">
                <Link
                  href="/login"
                  className="px-4 py-2 text-white border border-white/30 hover:bg-white/10 rounded-lg transition font-semibold text-sm"
                >
                  Se connecter
                </Link>
                <Link
                  href="/register"
                  className="px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 hover:from-purple-700 hover:to-blue-700 text-white rounded-lg transition font-semibold text-sm"
                >
                  S&apos;inscrire
                </Link>
              </div>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="xl:hidden p-2 hover:bg-white/10 rounded-lg transition"
            aria-label={isOpen ? 'Fermer le menu' : 'Ouvrir le menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-navigation"
          >
            {isOpen ? (
              <X className="w-6 h-6 text-white" />
            ) : (
              <Menu className="w-6 h-6 text-white" />
            )}
          </button>
        </div>

        {/* Mobile Nav */}
        {isOpen && (
          <div id="mobile-navigation" className="xl:hidden mt-4 space-y-2 pb-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition font-semibold"
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}

            <div className="border-t border-white/10 mt-4 pt-4">
              {loading ? (
                <div className="w-full h-10 bg-white/10 rounded-lg animate-pulse"></div>
              ) : user ? (
                <div className="space-y-2">
                  <div className="min-w-0 px-4 py-2 bg-white/5 rounded-lg">
                    <p className="truncate text-white font-semibold text-sm">{user.nom}</p>
                    <p className="truncate text-slate-400 text-xs">{user.email}</p>
                  </div>
                  <Link
                    href="/profile"
                    className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition font-semibold text-sm"
                    onClick={() => setIsOpen(false)}
                  >
                    Mon Profil
                  </Link>
                  {user.role === 'ADMIN' && (
                    <Link
                      href="/profile/admin"
                      className="block px-4 py-2 text-pink-400 hover:text-pink-300 hover:bg-pink-500/10 rounded-lg transition font-semibold text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Console Admin
                    </Link>
                  )}
                  {user.role === 'GESTIONAIRE' && (
                    <Link
                      href="/profile/gestion"
                      className="block px-4 py-2 text-purple-400 hover:text-purple-300 hover:bg-purple-500/10 rounded-lg transition font-semibold text-sm"
                      onClick={() => setIsOpen(false)}
                    >
                      Espace Gestion
                    </Link>
                  )}
                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-4 py-2 text-red-400 hover:text-red-300 hover:bg-red-500/10 rounded-lg transition font-semibold text-sm"
                  >
                    Déconnexion
                  </button>
                </div>
              ) : (
                <div className="space-y-2">
                  <Link
                    href="/login"
                    className="block px-4 py-2 text-slate-300 hover:text-white hover:bg-white/10 rounded-lg transition font-semibold text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    Se connecter
                  </Link>
                  <Link
                    href="/register"
                    className="block px-4 py-2 bg-linear-to-r from-purple-600 to-blue-600 text-white rounded-lg transition font-semibold text-center"
                    onClick={() => setIsOpen(false)}
                  >
                    S&apos;inscrire
                  </Link>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}
