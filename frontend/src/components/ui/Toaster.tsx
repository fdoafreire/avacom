interface ToasterProps {
  message: string;
  type: 'success' | 'error';
}

export default function Toaster({ message, type }: ToasterProps) {
  if (!message) return null;
  const isError = type === 'error';

  return (
    <div className="fixed bottom-5 right-5 z-50 shadow-2xl rounded-xl border p-4 bg-white animate-fade-in">
      <div className="flex items-center space-x-3">
        <div className={`h-3 w-3 rounded-full ${isError ? 'bg-rose-500' : 'bg-emerald-500'}`} />
        <span className={`text-sm font-semibold ${isError ? 'text-rose-800' : 'text-slate-700'}`}>
          {message}
        </span>
      </div>
    </div>
  );
}
