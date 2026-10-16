import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { 
  DailySalesItem, 
  CategoryMetricItem, 
  PaymentMethodItem, 
  DeliveryLeadTimeItem 
} from '../types';
import { MonochromeBarChart, MonochromeLineChart } from '../components/MonochromeChart';
import { 
  BarChart3, 
  TrendingUp, 
  CreditCard, 
  Truck, 
  Filter,
  Info
} from 'lucide-react';

export const AnalyticsPage: React.FC = () => {
  const [dailySales, setDailySales] = useState<DailySalesItem[]>([]);
  const [categories, setCategories] = useState<CategoryMetricItem[]>([]);
  const [payments, setPayments] = useState<PaymentMethodItem[]>([]);
  const [deliveryTimes, setDeliveryTimes] = useState<DeliveryLeadTimeItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [timeFilter, setTimeFilter] = useState<'ALL' | '2017' | '2018'>('ALL');

  useEffect(() => {
    loadAnalytics();
  }, []);

  const loadAnalytics = async () => {
    try {
      setLoading(true);
      const [salesRes, catRes, payRes, delRes] = await Promise.all([
        api.getDailySales(),
        api.getCategoryMetrics(10),
        api.getPaymentBreakdown(),
        api.getDeliveryLeadTimes(10)
      ]);
      setDailySales(salesRes);
      setCategories(catRes);
      setPayments(payRes);
      setDeliveryTimes(delRes);
    } catch (e) {
      console.error('Failed to load analytics data:', e);
    } finally {
      setLoading(false);
    }
  };

  // Filter daily sales based on time window
  const filteredDailySales = dailySales.filter(d => {
    if (timeFilter === 'ALL') return true;
    return d.date.startsWith(timeFilter);
  });

  const lineChartData = filteredDailySales.map(d => ({
    x: d.date.slice(5), // MM-DD
    y: Math.round(d.sales)
  }));

  const categoryBarData = categories.map(c => ({
    label: c.category,
    value: Math.round(c.sales),
    sublabel: `${c.items_sold.toLocaleString()} items`
  }));

  const paymentBarData = payments.map(p => ({
    label: p.method,
    value: Math.round(p.total_value),
    sublabel: `${p.transactions.toLocaleString()} txns`
  }));

  const deliveryBarData = deliveryTimes.map(d => ({
    label: d.state,
    value: d.avg_days,
    sublabel: `${d.delivered_orders.toLocaleString()} orders`
  }));

  return (
    <div className="space-y-8 animate-fadeIn">
      {/* Header */}
      <div className="border-b border-neutral-800 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-[11px] font-mono uppercase tracking-widest text-neutral-400 mb-1">
            Empirical Intelligence
          </div>
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-sans">
            E-Commerce Operations & Logistics Analytics
          </h1>
          <p className="text-sm text-neutral-400 mt-1 max-w-2xl">
            Derived strictly from historical Brazilian E-Commerce records. Observed order sales, category 
            aggregations, payment channels, and geographic delivery transit times.
          </p>
        </div>

        {/* Time Filter Controls */}
        <div className="flex items-center space-x-2 border border-neutral-800 bg-neutral-950 p-1 rounded font-mono text-xs">
          <Filter className="w-3.5 h-3.5 text-neutral-400 ml-1.5" />
          <span className="text-neutral-400 text-[11px] mr-1">Period:</span>
          {(['ALL', '2017', '2018'] as const).map(year => (
            <button
              key={year}
              onClick={() => setTimeFilter(year)}
              className={`px-3 py-1 rounded transition-colors ${
                timeFilter === year
                  ? 'bg-white text-black font-semibold'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {year}
            </button>
          ))}
        </div>
      </div>

      {/* Grid of 4 Monochrome Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Chart 1: Daily Observed Sales Trend */}
        <div className="border border-neutral-800 bg-neutral-950 p-6 rounded space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
            <div className="flex items-center space-x-2">
              <TrendingUp className="w-4 h-4 text-white" />
              <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                Daily Observed Sales (BRL)
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">
              {filteredDailySales.length} Daily Observations
            </span>
          </div>

          <MonochromeLineChart
            data={lineChartData}
            height={220}
            valuePrefix="R$ "
          />

          <div className="text-[11px] text-neutral-400 font-mono border-t border-neutral-900 pt-2 flex items-center space-x-1.5">
            <Info className="w-3 h-3 text-neutral-400 flex-shrink-0" />
            <span>Definition: Daily sum of item prices and freight for placed orders.</span>
          </div>
        </div>

        {/* Chart 2: Top Product Categories */}
        <div className="border border-neutral-800 bg-neutral-950 p-6 rounded space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
            <div className="flex items-center space-x-2">
              <BarChart3 className="w-4 h-4 text-white" />
              <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                Top Categories by Observed Sales
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">Top 10 Categories</span>
          </div>

          <MonochromeBarChart
            data={categoryBarData}
            height={220}
            valuePrefix="R$ "
          />

          <div className="text-[11px] text-neutral-400 font-mono border-t border-neutral-900 pt-2 flex items-center space-x-1.5">
            <Info className="w-3 h-3 text-neutral-400 flex-shrink-0" />
            <span>Translated to English via product_category_name_translation.</span>
          </div>
        </div>

        {/* Chart 3: Payment Method Volume */}
        <div className="border border-neutral-800 bg-neutral-950 p-6 rounded space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
            <div className="flex items-center space-x-2">
              <CreditCard className="w-4 h-4 text-white" />
              <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                Payment Method Value Distribution
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">4 Payment Channels</span>
          </div>

          <MonochromeBarChart
            data={paymentBarData}
            height={220}
            valuePrefix="R$ "
          />

          <div className="text-[11px] text-neutral-400 font-mono border-t border-neutral-900 pt-2 flex items-center space-x-1.5">
            <Info className="w-3 h-3 text-neutral-400 flex-shrink-0" />
            <span>Includes credit card, boleto, voucher, and debit card transactions.</span>
          </div>
        </div>

        {/* Chart 4: Delivery Lead Times by State */}
        <div className="border border-neutral-800 bg-neutral-950 p-6 rounded space-y-4">
          <div className="flex items-center justify-between border-b border-neutral-900 pb-3">
            <div className="flex items-center space-x-2">
              <Truck className="w-4 h-4 text-white" />
              <span className="font-mono text-xs font-semibold text-white uppercase tracking-wider">
                Average Delivery Lead Time (Days) by State
              </span>
            </div>
            <span className="text-[10px] font-mono text-neutral-400">Top 10 Destination States</span>
          </div>

          <MonochromeBarChart
            data={deliveryBarData}
            height={220}
            valueSuffix=" days"
          />

          <div className="text-[11px] text-neutral-400 font-mono border-t border-neutral-900 pt-2 flex items-center space-x-1.5">
            <Info className="w-3 h-3 text-neutral-400 flex-shrink-0" />
            <span>Lead Time: order_delivered_customer_date - order_purchase_timestamp.</span>
          </div>
        </div>
      </div>
    </div>
  );
};
