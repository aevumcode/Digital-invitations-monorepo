"use client";

import { ReactNode } from "react";

export default function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen flex font-sans">
      {/* Lijeva strana */}
      <aside
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden"
        style={{ backgroundColor: "#3F3FF3" }}
      >
        <div className="relative z-10 flex flex-col justify-between w-full px-12 py-12">
          <header className="flex items-center">
            <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center mr-3">
              <div className="w-4 h-4 rounded-sm" style={{ backgroundColor: "#3F3FF3" }} />
            </div>
            <h1 className="text-xl font-semibold text-white">Digital Invitations</h1>
          </header>

          <main className="flex-1 flex flex-col justify-center">
            <h2 className="text-4xl text-white mb-6 leading-tight">
              Jednostavno upravljajte svojim projektima i pozivnicama.
            </h2>
            <p className="text-white/90 text-lg leading-relaxed">
              Prijavite se ili izradite račun za pristup svojoj nadzornoj ploči.
            </p>
          </main>

          <footer className="flex justify-between items-center text-white/70 text-sm">
            <span>© 2025 Digital Invitations</span>
            <a href="#" className="hover:text-white/90">
              Pravila privatnosti
            </a>
          </footer>
        </div>
      </aside>

      {/* Desna strana */}
      <main className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-white">
        <div className="w-full max-w-md space-y-8">{children}</div>
      </main>
    </div>
  );
}
