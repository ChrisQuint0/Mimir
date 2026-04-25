"use client";

import { useRouter } from "next/navigation";
import { signOut, getCurrentUser } from "@/lib/supabase/auth";
import { Compass, LayoutGrid, LogOut, User } from "lucide-react";
import { useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { createClient } from "@/lib/supabase/client";
import logoWhite from "../../public/mimir_logo_white.png";

export function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [displayName, setDisplayName] = useState<string | null>(null);
  const [userEmail, setUserEmail] = useState<string | null>(null);
  const [avatarSrc, setAvatarSrc] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    async function loadUser() {
      try {
        const user = await getCurrentUser();
        const metadataName = user?.user_metadata?.display_name;
        const avatarValue = user?.user_metadata?.avatar_url;
        const fallbackName = user?.email?.split("@")[0] ?? null;
        setDisplayName(metadataName || fallbackName);
        setUserEmail(user?.email || null);

        if (typeof avatarValue === "string" && avatarValue.length > 0) {
          if (
            avatarValue.startsWith("http://") ||
            avatarValue.startsWith("https://")
          ) {
            setAvatarSrc(avatarValue);
          } else {
            const supabase = createClient();
            const { data } = await supabase.storage
              .from("profile_pictures")
              .createSignedUrl(avatarValue, 60 * 60 * 24 * 7);
            setAvatarSrc(data?.signedUrl ?? null);
          }
        } else {
          setAvatarSrc(null);
        }
      } catch {
        setDisplayName(null);
        setUserEmail(null);
        setAvatarSrc(null);
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
        <div className="flex items-center gap-8">
          <Link href="/" className="flex items-center gap-2 group">
            <Image
              src={logoWhite}
              alt="Mimir"
              height={32}
              className="w-auto"
              priority
            />
            <span
              className="text-xl font-bold text-white"
              style={{ fontFamily: "var(--font-lora)" }}
            >
              Mimir
            </span>
          </Link>

          <nav className="hidden md:flex items-center gap-2">
            <Link
              href="/"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${pathname === "/" ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}
            >
              <Compass className="w-4 h-4" />
              <span>Feed</span>
            </Link>
            <Link
              href="/dashboard"
              className={`inline-flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors ${pathname.startsWith("/dashboard") ? "bg-slate-800 text-white" : "text-slate-400 hover:text-white hover:bg-slate-800/60"}`}
            >
              <LayoutGrid className="w-4 h-4" />
              <span>My Bootcamps</span>
            </Link>
          </nav>
        </div>

        {/* User menu */}
        <div className="flex items-center gap-4">
          <Link
            href="/profile"
            className="flex items-center gap-3 rounded-2xl border border-slate-800 bg-slate-900/60 px-3 py-2 text-sm text-slate-400 transition-colors hover:border-slate-700 hover:text-white"
          >
            <div className="flex h-9 w-9 items-center justify-center overflow-hidden rounded-full border border-slate-700 bg-slate-800 text-slate-300">
              {avatarSrc ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  src={avatarSrc}
                  alt={displayName ?? "Profile"}
                  className="h-full w-full object-cover"
                />
              ) : (
                <User className="w-4 h-4" />
              )}
            </div>
            <div className="hidden sm:flex flex-col leading-tight">
              <span className="max-w-[200px] truncate text-slate-200">
                {displayName}
              </span>
              <span className="max-w-[220px] truncate text-xs text-slate-500">
                {userEmail}
              </span>
            </div>
          </Link>

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
