import React, { useState, useEffect } from 'react';
import { 
  TrendingUp, 
  Calendar, 
  DollarSign, 
  PieChart, 
  BarChart3, 
  RefreshCw, 
  ShoppingBag,
  ArrowUpRight
} from 'lucide-react';
import { api } from '../../api/api';
import { formatINR } from '../../utils/helpers';
import { useToast } from '../../context/ToastContext';

export default function AdminAnalytics() {
  const { showToast } = useToast();
  const [mode, setMode] = useState('overall'); // 'overall' | 'yearly' | 'monthly' | 'daily'
  const [year, setYear] = useState(new Date().getFullYear());
  const [month, setMonth] = useState(new Date().getMonth() + 1);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);

  const [report, setReport] = useState({ totalBusiness: 0, categorySales: {} });
  const [loading, setLoading] = useState(true);

  const fetchAnalytics = async () => {
    setLoading(true);
    try {
      let data;
      if (mode === 'overall') {
        data = await api.admin.business.getOverall();
      } else if (mode === 'yearly') {
        data = await api.admin.business.getYearly(year);
      } else if (mode === 'monthly') {
        data = await api.admin.business.getMonthly(month, year);
      } else if (mode === 'daily') {
        data = await api.admin.business.getDaily(date);
      }

      setReport({
        totalBusiness: data?.totalBusiness || 0,
        categorySales: data?.categorySales || {}
      });
    } catch (err) {
      showToast(err.message || 'Failed to fetch business analytics', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAnalytics();
  }, [mode, year, month, date]);

  const categoryEntries = Object.entries(report.categorySales || {});
  const totalItemsSold = categoryEntries.reduce((sum, [, count]) => sum + Number(count || 0), 0);

  return (
    <div className="space-y-6">
      {/* Timeframe Selector & Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-slate-800 p-5 rounded-2xl">
        <div>
          <h2 className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-blue-400" />
            Revenue & Sales Performance
          </h2>
          <p className="text-xs text-slate-400 mt-1">
            Real-time financial breakdown based on verified customer orders
          </p>
        </div>

        {/* Mode Selector */}
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex p-1 bg-slate-950 rounded-xl border border-slate-800">
            {['overall', 'yearly', 'monthly', 'daily'].map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold uppercase tracking-wider transition-all ${
                  mode === m
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {m}
              </button>
            ))}
          </div>

          <button
            onClick={fetchAnalytics}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-colors"
            title="Refresh analytics"
          >
            <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
          </button>
        </div>
      </div>

      {/* Date / Time controls if applicable */}
      {mode !== 'overall' && (
        <div className="flex flex-wrap items-center gap-3 p-4 rounded-xl bg-slate-900/40 border border-slate-800/80 text-xs text-slate-300">
          <Calendar className="w-4 h-4 text-blue-400" />
          <span>Filters:</span>

          {(mode === 'yearly' || mode === 'monthly') && (
            <div className="flex items-center gap-1.5">
              <label>Year:</label>
              <input
                type="number"
                min="2020"
                max="2035"
                value={year}
                onChange={(e) => setYear(Number(e.target.value))}
                className="w-20 px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white font-semibold"
              />
            </div>
          )}

          {mode === 'monthly' && (
            <div className="flex items-center gap-1.5">
              <label>Month:</label>
              <select
                value={month}
                onChange={(e) => setMonth(Number(e.target.value))}
                className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white font-semibold"
              >
                {[
                  'January', 'February', 'March', 'April', 'May', 'June',
                  'July', 'August', 'September', 'October', 'November', 'December'
                ].map((name, idx) => (
                  <option key={idx + 1} value={idx + 1}>{name}</option>
                ))}
              </select>
            </div>
          )}

          {mode === 'daily' && (
            <div className="flex items-center gap-1.5">
              <label>Date:</label>
              <input
                type="date"
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="px-2.5 py-1 bg-slate-950 border border-slate-800 rounded-lg text-white font-semibold"
              />
            </div>
          )}
        </div>
      )}

      {/* Stat Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {/* Total Revenue Card */}
        <div className="p-6 rounded-2xl bg-gradient-to-br from-blue-950/40 via-slate-900 to-slate-900 border border-blue-500/20 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
              Total Business Revenue
            </span>
            <div className="p-2 rounded-xl bg-blue-500/10 text-blue-400 border border-blue-500/20">
              <DollarSign className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {formatINR(report.totalBusiness)}
          </div>
          <p className="text-xs text-slate-400 mt-2 flex items-center gap-1">
            <span className="text-emerald-400 font-semibold flex items-center">
              Verified <ArrowUpRight className="w-3.5 h-3.5" />
            </span>
            for selected timeframe
          </p>
        </div>

        {/* Total Units Sold */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-indigo-300">
              Total Units Sold
            </span>
            <div className="p-2 rounded-xl bg-indigo-500/10 text-indigo-400 border border-indigo-500/20">
              <ShoppingBag className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {totalItemsSold}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Across {categoryEntries.length} product categories
          </p>
        </div>

        {/* Active Categories */}
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 mb-3">
            <span className="text-xs font-semibold uppercase tracking-wider text-purple-300">
              Categories Active
            </span>
            <div className="p-2 rounded-xl bg-purple-500/10 text-purple-400 border border-purple-500/20">
              <PieChart className="w-5 h-5" />
            </div>
          </div>
          <div className="text-3xl font-extrabold text-white tracking-tight">
            {categoryEntries.length}
          </div>
          <p className="text-xs text-slate-400 mt-2">
            Generating consumer demand
          </p>
        </div>
      </div>

      {/* Category Breakdown Progress Bars */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-4">
        <div className="flex items-center justify-between border-b border-slate-800 pb-4">
          <div>
            <h3 className="font-bold text-white text-base">Category Sales Breakdown</h3>
            <p className="text-xs text-slate-400 mt-0.5">Units sold per product category</p>
          </div>
          <BarChart3 className="w-5 h-5 text-slate-500" />
        </div>

        {categoryEntries.length === 0 ? (
          <p className="text-xs text-slate-500 text-center py-6">
            No category sales recorded for this period.
          </p>
        ) : (
          <div className="space-y-4 pt-2">
            {categoryEntries.map(([category, count]) => {
              const percentage = totalItemsSold > 0 ? Math.round((count / totalItemsSold) * 100) : 0;
              return (
                <div key={category} className="space-y-1.5">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-slate-200">{category || 'Uncategorized'}</span>
                    <span className="text-slate-400">
                      {count} units <span className="text-blue-400">({percentage}%)</span>
                    </span>
                  </div>
                  <div className="h-2.5 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800">
                    <div
                      className="h-full bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full transition-all duration-500"
                      style={{ width: `${Math.max(percentage, 5)}%` }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
