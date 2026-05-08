"use client";

import { useState, useRef, useEffect } from "react";
import useAuthStore from "../store/useAuthStore";
import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { 
  FiLogOut, FiChevronDown, FiBell, FiVideo, FiFileText, 
  FiHome, FiUser, FiSettings, FiHelpCircle, FiZap
} from "react-icons/fi";

export default function Navbar() {
  const { user, logout } = useAuthStore();
  const pathname = usePathname();
  const router = useRouter();
  const [profileDropdownOpen, setProfileDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const dropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setProfileDropdownOpen(false);
      }
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setMobileMenuOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Close on route change
  useEffect(() => {
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  }, [pathname]);

  const handleLogout = () => {
    logout();
    router.push("/");
    setProfileDropdownOpen(false);
    setMobileMenuOpen(false);
  };

  const navLinks = [
    { href: "/", label: "Home", icon: FiHome },
    { href: "/interview", label: "Interviews", icon: FiVideo },
    { 
      href: "/resume", 
      label: "Resume", 
      icon: FiFileText,
      dropdown: [
        { href: "/resume", label: "Resume Builder", desc: "Create and edit your resume" },
        { href: "/atsscore", label: "AI ATS Score", desc: "Analyze your resume performance" }
      ]
    },
  ];

  return (
    <>
      <nav className="fixed top-0 left-0 w-full z-50 bg-[#0a0a0f]/95 backdrop-blur-xl border-b border-white/10 shadow-2xl">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            
            {/* LEFT: Logo */}
            <Link 
              href="/" 
              className="flex items-center gap-2.5 group relative"
            >
              {/* Animated Logo Background */}
              <div className="absolute inset-0 bg-gradient-to-r from-[#adc6ff] to-purple-500 rounded-lg blur-md opacity-0 group-hover:opacity-50 transition-opacity duration-500"></div>
              <div className="relative w-9 h-9 rounded-lg bg-[#adc6ff]/10 flex items-center justify-center shadow-lg group-hover:scale-110 transition-all duration-300">
                <img src="/logo.png" alt="DevCircle Logo" className="w-6 h-6 object-contain" />
              </div>
              <div className="relative">
                <span className="text-xl font-bold bg-gradient-to-r from-white to-zinc-400 bg-clip-text text-transparent group-hover:from-[#adc6ff] group-hover:to-white transition-all duration-300">
                  DevCircle
                </span>
                <div className="absolute -top-1 -right-6">
                  <span className="relative flex h-2 w-2">
                    <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#4edea3] opacity-75"></span>
                    <span className="relative inline-flex rounded-full h-2 w-2 bg-[#4edea3]"></span>
                  </span>
                </div>
              </div>
            </Link>

            {/* DESKTOP NAVIGATION LINKS */}
            <div className="hidden md:flex items-center gap-1 ml-8">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== "/" && pathname?.startsWith(link.href));
                const Tag = link.dropdown ? 'div' : Link;
                return (
                  <Tag
                    key={link.href}
                    href={link.dropdown ? undefined : link.href}
                    className={`relative px-5 py-2.5 rounded-xl text-sm font-medium transition-all duration-300 group ${
                      isActive
                        ? "bg-gradient-to-r from-[#adc6ff]/15 to-purple-500/15 text-[#adc6ff]"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    {link.dropdown ? (
                      <div className="relative group/dropdown">
                        <div className="flex items-center gap-2 cursor-pointer">
                          <link.icon size={16} />
                          <span>{link.label}</span>
                          <FiChevronDown size={14} className="group-hover/dropdown:rotate-180 transition-transform" />
                        </div>
                        
                        <div className="absolute top-full -left-4 pt-4 opacity-0 group-hover/dropdown:opacity-100 invisible group-hover/dropdown:visible transition-all duration-300">
                          <div className="w-56 bg-[#121212] border border-white/10 rounded-xl shadow-2xl overflow-hidden">
                            {link.dropdown.map(item => (
                              <Link 
                                key={item.href} 
                                href={item.href}
                                className="flex flex-col px-4 py-3 hover:bg-white/5 transition-colors border-b border-white/5 last:border-0"
                              >
                                <span className="text-sm font-medium text-white">{item.label}</span>
                                <span className="text-xs text-zinc-500 mt-1">{item.desc}</span>
                              </Link>
                            ))}
                          </div>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-2">
                        <link.icon size={16} />
                        <span>{link.label}</span>
                      </div>
                    )}
                    {isActive && !link.dropdown && (
                      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-8 h-0.5 bg-gradient-to-r from-[#adc6ff] to-purple-500 rounded-full"></div>
                    )}
                  </Tag>
                );
              })}
            </div>

            {/* RIGHT SECTION */}
            <div className="flex items-center gap-3">
             

              {!user ? (
                <div className="flex items-center gap-2">
                  <Link
                    href="/auth"
                    className="px-5 py-2.5 text-sm font-medium text-zinc-300 hover:text-white transition-colors"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth?signup=true"
                    className="px-5 py-2.5 text-sm font-medium text-white bg-gradient-to-r from-[#adc6ff] to-[#8eaeff] rounded-xl hover:shadow-lg hover:shadow-[#adc6ff]/30 transition-all duration-300 transform hover:scale-105"
                  >
                    Get Started
                  </Link>
                </div>
              ) : (
                <div className="flex items-center gap-3">
                  {/* Desktop Profile Dropdown */}
                  <div className="relative" ref={dropdownRef}>
                    <button
                      onClick={() => setProfileDropdownOpen(!profileDropdownOpen)}
                      className="flex items-center gap-2 px-2 py-1.5 rounded-xl hover:bg-white/5 transition-all duration-300 group"
                    >
                      {user?.picture ? (
                        <img
                          src={user.picture}
                          alt={user.name}
                          className="w-9 h-9 rounded-full border-2 border-[#adc6ff]/30 object-cover group-hover:scale-105 transition-transform"
                        />
                      ) : (
                        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#adc6ff]/20 to-purple-500/20 border-2 border-[#adc6ff]/30 flex items-center justify-center text-[#adc6ff] font-bold text-sm group-hover:scale-105 transition-transform">
                          {user?.name?.[0]?.toUpperCase() || "U"}
                        </div>
                      )}
                      <div className="hidden sm:block text-left">
                        <p className="text-xs text-zinc-500">Welcome back</p>
                        <p className="text-sm font-medium text-white group-hover:text-[#adc6ff] transition-colors">
                          {user?.name?.split(" ")[0] || "User"}
                        </p>
                      </div>
                      <FiChevronDown 
                        size={14} 
                        className={`text-zinc-400 transition-all duration-300 hidden sm:block ${
                          profileDropdownOpen ? "rotate-180" : "group-hover:text-white"
                        }`}
                      />
                    </button>

                    {/* Dropdown Menu */}
                    {profileDropdownOpen && (
                      <div className="absolute right-0 mt-3 w-72 bg-[#121212] border border-white/10 rounded-2xl shadow-2xl overflow-hidden animate-slideDown">
                        <div className="px-4 py-4 border-b border-white/10 bg-gradient-to-r from-[#adc6ff]/5 to-transparent">
                          <div className="flex items-center gap-3">
                            {user?.picture ? (
                              <img
                                src={user.picture}
                                alt={user.name}
                                className="w-12 h-12 rounded-full border-2 border-[#adc6ff]/30 object-cover"
                              />
                            ) : (
                              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#adc6ff]/20 to-purple-500/20 border-2 border-[#adc6ff]/30 flex items-center justify-center text-[#adc6ff] font-bold text-lg">
                                {user?.name?.[0]?.toUpperCase() || "U"}
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="text-white font-semibold">{user?.name}</p>
                              <p className="text-xs text-zinc-500">{user?.email}</p>
                              <div className="flex items-center gap-1 mt-1">
                                <FiZap size={10} className="text-[#4edea3]" />
                                <span className="text-[10px] text-[#4edea3]">Active Member</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        
                        
                        <div className="border-t border-white/10 py-2">
                          <button
                            onClick={handleLogout}
                            className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-400 hover:bg-red-500/10 transition-all group"
                          >
                            <div className="w-8 h-8 rounded-lg bg-red-500/10 flex items-center justify-center group-hover:bg-red-500/20 transition-all">
                              <FiLogOut size={14} />
                            </div>
                            Sign Out
                          </button>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Mobile Menu Button */}
                  <button
                    onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                    className="md:hidden p-2 rounded-xl bg-white/5 border border-white/10 text-white hover:bg-white/10 transition-all"
                  >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
                    </svg>
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Mobile Menu */}
      {mobileMenuOpen && user && (
        <div className="fixed top-16 left-0 right-0 z-40 md:hidden bg-[#121212] border-b border-white/10 shadow-2xl animate-slideDown">
          <div className="p-5">
            {/* User Info */}
            <div className="flex items-center gap-3 pb-4 mb-4 border-b border-white/10">
              {user?.picture ? (
                <img
                  src={user.picture}
                  alt={user.name}
                  className="w-12 h-12 rounded-full border-2 border-[#adc6ff]/30 object-cover"
                />
              ) : (
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#adc6ff]/20 to-purple-500/20 border-2 border-[#adc6ff]/30 flex items-center justify-center text-[#adc6ff] font-bold text-lg">
                  {user?.name?.[0]?.toUpperCase() || "U"}
                </div>
              )}
              <div>
                <p className="text-white font-semibold">{user?.name}</p>
                <p className="text-xs text-zinc-500">{user?.email}</p>
              </div>
            </div>

            {/* Navigation Links */}
            <div className="space-y-2">
              {navLinks.map((link) => {
                if (link.dropdown) {
                  return (
                    <div key={link.href} className="space-y-1">
                      <div className="flex items-center gap-3 px-4 py-2 text-xs font-semibold text-zinc-500 uppercase tracking-wider">
                        {link.label}
                      </div>
                      {link.dropdown.map((sublink) => {
                        const isSubActive = pathname === sublink.href;
                        return (
                          <Link
                            key={sublink.href}
                            href={sublink.href}
                            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                              isSubActive
                                ? "bg-gradient-to-r from-[#adc6ff]/10 to-purple-500/10 text-[#adc6ff] border border-[#adc6ff]/20"
                                : "text-zinc-400 hover:text-white hover:bg-white/5"
                            }`}
                          >
                            <link.icon size={18} />
                            <div className="flex flex-col">
                              <span className="font-medium text-sm">{sublink.label}</span>
                              <span className="text-[10px] text-zinc-500">{sublink.desc}</span>
                            </div>
                          </Link>
                        );
                      })}
                    </div>
                  );
                }

                const isActive = pathname === link.href;
                return (
                  <Link
                    key={link.href}
                    href={link.href}
                    className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all ${
                      isActive
                        ? "bg-gradient-to-r from-[#adc6ff]/10 to-purple-500/10 text-[#adc6ff] border border-[#adc6ff]/20"
                        : "text-zinc-400 hover:text-white hover:bg-white/5"
                    }`}
                  >
                    <link.icon size={18} />
                    <span className="font-medium">{link.label}</span>
                  </Link>
                );
              })}
            </div>

            <div className="border-t border-white/10 my-4"></div>

            {/* Actions */}
            <button className="w-full flex items-center gap-3 px-4 py-3 text-zinc-400 hover:text-white hover:bg-white/5 rounded-xl transition-all">
              <FiSettings size={18} />
              <span>Settings</span>
            </button>
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-red-400 hover:bg-red-500/10 rounded-xl transition-all"
            >
              <FiLogOut size={18} />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </>
  );
}