"use client";

import { useRouter } from "next/navigation";
import { signOut, getCurrentUser } from "@/lib/supabase/auth";
import { LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import logoWhite from "../../public/mimir_logo_white.png";

export function Header() {
  const router = useRouter();
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getCurrentUser();
        setUserEmail(user?.email || null);
      } catch (error) {
        setUserEmail(null);
      }
    }
    loadUser();
  }, []);

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      router.push("/login");
      router.refresh();
    } catch (error) {
      console.error("Sign out error:", error);
    } finally {
      setLoading(false);
    }
  };

  if (!userEmail) return null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-slate-800/50 bg-slate-950/80 backdrop-blur-xl">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link href="/dashboard" className="flex items-center gap-2 group">
          <Image src={logoWhite} alt="Mimir" height={32} className="w-auto" priority />
          <span className="text-xl font-bold text-white" style={{ fontFamily: 'var(--font-lora)' }}>
            Mimir
          </span>
        </Link>

        {/* User menu */}
        <div className="flex items-center gap-4">
          <div className="hidden sm:flex items-center gap-2 text-sm text-slate-400">
            <User className="w-4 h-4" />
            <span className="max-w-[200px] truncate">{userEmail}</span>
          </div>

          <button
            onClick={handleSignOut}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 text-sm text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">Sign Out</span>
          </button>
        </div>
      </div>
    </header>
  );
}
