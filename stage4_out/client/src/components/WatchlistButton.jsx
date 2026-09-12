import { useState } from 'react';
import { Star } from 'lucide-react';
import axiosInstance from './axiosInstance';
import { useGeneralContext } from '../context/GeneralContext';

const WatchlistButton = ({ symbol, initialActive = false, onChange, compact = false }) => {
  const { showToast } = useGeneralContext();
  const [active, setActive] = useState(initialActive);
  const [busy, setBusy] = useState(false);

  const toggle = async (event) => {
    event?.preventDefault();
    event?.stopPropagation();
    if (busy) return;
    setBusy(true);
    try {
      const response = active
        ? await axiosInstance.delete(`/users/watchlist/${encodeURIComponent(symbol)}`)
        : await axiosInstance.post('/users/watchlist', { symbol });
      const nextActive = response.data.includes(symbol.toUpperCase());
      setActive(nextActive);
      onChange?.(nextActive, response.data);
    } catch (error) {
      showToast(error.response?.data?.message || 'Unable to update watchlist', 'error');
    } finally {
      setBusy(false);
    }
  };

  return (
    <button
      type="button"
      onClick={toggle}
      disabled={busy}
      aria-label={active ? `Remove ${symbol} from watchlist` : `Add ${symbol} to watchlist`}
      title={active ? 'Remove from watchlist' : 'Add to watchlist'}
      className={`${compact ? 'w-9 h-9' : 'px-3 py-2'} rounded-xl flex items-center justify-center gap-2 transition-all border ${
        active
          ? 'bg-amber-400/10 border-amber-400/30 text-amber-300'
          : 'bg-white/5 border-white/10 text-slate-400 hover:text-white hover:bg-white/10'
      } disabled:opacity-50`}
    >
      <Star size={compact ? 16 : 15} fill={active ? 'currentColor' : 'none'} />
      {!compact && <span>{active ? 'Watching' : 'Watchlist'}</span>}
    </button>
  );
};

export default WatchlistButton;
