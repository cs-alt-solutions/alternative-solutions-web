/* src/app/dashboard/layout.tsx */
import Sidebar from '@/components/dashboard/Sidebar';

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex h-screen bg-black overflow-hidden">
      {/* 1. THE NAVIGATION ENGINE */}
      <Sidebar />

      {/* 2. THE MAIN VIEWPORT */}
      <main className="flex-1 relative overflow-y-auto bg-black p-4 md:p-8">
        {/* Subtle background glow to keep the high-energy aesthetic */}
        <div className="absolute top-0 left-1/4 w-full h-full bg-brand-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />
        
        <div className="max-w-7xl mx-auto">
          {children}
        </div>
      </main>
    </div>
  );
}