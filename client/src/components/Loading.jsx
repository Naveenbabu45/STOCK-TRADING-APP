import { TrendingUp } from 'lucide-react';

const Loading = ({ fullScreen = false, label = 'Loading…' }) => {
  const content = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div className="relative">
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-finance-500 to-finance-700 flex items-center justify-center shadow-lg shadow-finance-600/40 animate-pulse-soft">
          <TrendingUp size={26} className="text-white" />
        </div>
        <div className="absolute inset-0 rounded-2xl border-2 border-finance-400/30 border-t-finance-400 animate-spin" />
      </div>
      <p className="text-sm text-slate-400 font-medium">{label}</p>
    </div>
  );

  if (fullScreen) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-finance-950">{content}</div>
    );
  }
  return <div className="py-20 flex items-center justify-center">{content}</div>;
};

export default Loading;
