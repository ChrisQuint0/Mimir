import { Header } from "@/components/layout/Header";

export default function BootcampLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-950">
      <Header />
      <main>{children}</main>
    </div>
  );
}
