export default function Loading() {
  return (
    <div className="absolute inset-0 bg-white/60 backdrop-blur-xs z-50 flex flex-col justify-center items-center rounded-xl">
      <div className="animate-spin rounded-full h-12 w-12 border-4 border-indigo-600 border-t-transparent shadow-xs"></div>
      <p className="mt-4 text-xs font-bold text-indigo-700 uppercase tracking-widest animate-pulse">
        Sincronizando AWS...
      </p>
    </div>
  );
}
