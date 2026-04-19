import { Home, AlertCircle } from "lucide-react";

export function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center min-h-[90vh] px-[5%] text-center animation-fade-in">
      <div className="w-24 h-24 bg-m-red/10 rounded-full flex items-center justify-center text-m-red mb-8">
        <AlertCircle className="w-12 h-12" />
      </div>
      <h1 className="text-[124px] font-black text-m-ink leading-none mb-4">404</h1>
      <h2 className="text-[24px] font-bold text-m-ink mb-6">Page Not Found</h2>
      <a
        href="/"
        className="flex items-center gap-2 bg-m-red hover:bg-m-red/90 text-white px-4 py-2 rounded-full font-bold text-[12px] transition-all hover:scale-105 active:scale-95 shadow-lg shadow-m-red/20"
      >
        <Home className="w-4 h-4" />
        Back to Home
      </a>
    </div>
  );
}
