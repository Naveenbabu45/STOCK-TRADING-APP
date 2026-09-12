import { Link } from 'react-router-dom';
import {
  TrendingUp,
  Shield,
  BarChart3,
  Wallet,
  ArrowRight,
  LineChart,
  Layers,
  Zap,
} from 'lucide-react';

const features = [
  {
    icon: BarChart3,
    title: 'Live Market Data',
    desc: 'Track real-time prices across major US exchanges with instant updates.',
  },
  {
    icon: LineChart,
    title: 'Historical Charts',
    desc: 'Analyze price history with interactive charts to inform your trades.',
  },
  {
    icon: Wallet,
    title: 'Virtual Cash',
    desc: 'Start with $10,000 in virtual money. No risk, pure learning.',
  },
  {
    icon: Layers,
    title: 'Portfolio Management',
    desc: 'Build and track your holdings with detailed P&L breakdowns.',
  },
  {
    icon: Shield,
    title: 'Secure & Private',
    desc: 'JWT-protected sessions keep your account and trades safe.',
  },
  {
    icon: Zap,
    title: 'Instant Orders',
    desc: 'Buy and sell in seconds. See your order history at a glance.',
  },
];

const stats = [
  { value: '10K+', label: 'Virtual Cash' },
  { value: '500+', label: 'US Stocks' },
  { value: '2', label: 'Exchanges' },
  { value: '100%', label: 'Risk-Free' },
];

const Landing = () => {
  return (
    <div className="animate-fade-in">
      {/* Hero */}
      <section className="relative overflow-hidden">
        <div className="absolute inset-0 pointer-events-none">
          <div className="absolute top-20 left-1/4 w-72 h-72 bg-finance-600/20 rounded-full blur-3xl animate-float" />
          <div className="absolute bottom-10 right-1/4 w-96 h-96 bg-finance-500/10 rounded-full blur-3xl animate-float" style={{ animationDelay: '2s' }} />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 pt-20 pb-24 text-center">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full glass text-sm text-finance-300 mb-8 animate-slide-down">
            <span className="w-2 h-2 rounded-full bg-gain animate-pulse" />
            Paper trading — zero risk, real learning
          </div>

          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tight max-w-4xl mx-auto leading-[1.05] animate-slide-up">
            Master the markets with{' '}
            <span className="text-gradient">SB Stocks</span>
          </h1>

          <p className="mt-6 text-lg sm:text-xl text-slate-400 max-w-2xl mx-auto animate-slide-up" style={{ animationDelay: '0.1s' }}>
            Practice trading US stocks with virtual money. Build your portfolio, track your
            performance, and learn the ropes — all without risking a cent.
          </p>

          <div className="mt-10 flex flex-col sm:flex-row items-center justify-center gap-4 animate-slide-up" style={{ animationDelay: '0.2s' }}>
            <Link to="/register" className="btn-primary text-base !px-8 !py-4">
              Get Started Free <ArrowRight size={18} />
            </Link>
            <Link to="/login" className="btn-ghost text-base !px-8 !py-4">
              Sign In
            </Link>
          </div>

          {/* Stats */}
          <div className="mt-20 grid grid-cols-2 md:grid-cols-4 gap-4 max-w-3xl mx-auto">
            {stats.map((s, i) => (
              <div key={s.label} className="glass-card p-5 animate-scale-in" style={{ animationDelay: `${0.3 + i * 0.1}s` }}>
                <p className="text-3xl font-bold text-gradient">{s.value}</p>
                <p className="text-sm text-slate-400 mt-1">{s.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="text-center mb-14">
          <h2 className="text-3xl sm:text-4xl font-bold text-white">Everything you need to trade</h2>
          <p className="mt-3 text-slate-400 max-w-2xl mx-auto">
            A complete trading simulator with professional-grade tools and a clean, modern interface.
          </p>
        </div>

        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {features.map((f, i) => (
            <div
              key={f.title}
              className="glass-card p-6 hover:border-finance-500/30 hover:-translate-y-1 transition-all duration-300 animate-slide-up"
              style={{ animationDelay: `${i * 0.05}s` }}
            >
              <div className="w-12 h-12 rounded-xl bg-finance-600/15 flex items-center justify-center text-finance-400 mb-4">
                <f.icon size={24} />
              </div>
              <h3 className="text-lg font-semibold text-white mb-2">{f.title}</h3>
              <p className="text-sm text-slate-400 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* About */}
      <section id="about" className="max-w-7xl mx-auto px-4 sm:px-6 py-20">
        <div className="glass-card p-8 sm:p-12 grid lg:grid-cols-2 gap-10 items-center">
          <div>
            <div className="inline-flex items-center gap-2 text-finance-400 text-sm font-medium mb-4">
              <TrendingUp size={18} /> About SB Stocks
            </div>
            <h2 className="text-3xl font-bold text-white mb-4">
              Built for learning. Designed for confidence.
            </h2>
            <p className="text-slate-400 leading-relaxed mb-6">
              SB Stocks is a paper trading platform that mirrors the real US stock market without
              the risk. Whether you&apos;re a beginner learning the basics or an experienced trader
              testing strategies, our simulator gives you the tools to practice with real market
              mechanics and virtual money.
            </p>
            <ul className="space-y-3">
              {['Real-time price feeds', 'Buy & sell orders with instant execution', 'Full transaction and order history', 'Admin dashboard for platform oversight'].map(
                (item) => (
                  <li key={item} className="flex items-center gap-3 text-slate-300">
                    <span className="w-5 h-5 rounded-full bg-gain/15 flex items-center justify-center flex-shrink-0">
                      <ArrowRight size={12} className="text-gain" />
                    </span>
                    {item}
                  </li>
                )
              )}
            </ul>
          </div>
          <div className="relative">
            <div className="glass-card p-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm text-slate-400">Portfolio Preview</span>
                <span className="badge bg-gain/10 text-gain">+12.4%</span>
              </div>
              <div className="space-y-3">
                {[
                  { sym: 'AAPL', price: 189.32, chg: 1.8 },
                  { sym: 'TSLA', price: 248.5, chg: -0.9 },
                  { sym: 'NVDA', price: 721.4, chg: 3.2 },
                  { sym: 'MSFT', price: 412.1, chg: 0.6 },
                ].map((s) => (
                  <div key={s.sym} className="flex items-center justify-between py-2 border-b border-white/5 last:border-0">
                    <span className="font-semibold text-white">{s.sym}</span>
                    <div className="text-right">
                      <p className="font-mono text-white text-sm">${s.price.toFixed(2)}</p>
                      <p className={`text-xs ${s.chg >= 0 ? 'text-gain' : 'text-loss'}`}>
                        {s.chg >= 0 ? '+' : ''}{s.chg}%
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-4xl mx-auto px-4 sm:px-6 py-20">
        <div className="glass-card p-10 sm:p-14 text-center relative overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-finance-600/10 to-transparent pointer-events-none" />
          <div className="relative">
            <h2 className="text-3xl sm:text-4xl font-bold text-white mb-4">
              Ready to start trading?
            </h2>
            <p className="text-slate-400 mb-8 max-w-xl mx-auto">
              Join SB Stocks today and get $10,000 in virtual cash to build your portfolio.
            </p>
            <Link to="/register" className="btn-primary text-base !px-8 !py-4">
              Get Started <ArrowRight size={18} />
            </Link>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 mt-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-finance-500 to-finance-700 flex items-center justify-center">
              <TrendingUp size={16} className="text-white" />
            </div>
            <span className="font-bold text-white">SB Stocks</span>
          </div>
          <p className="text-sm text-slate-500">
            © {new Date().getFullYear()} SB Stocks. Paper trading platform. Not financial advice.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
