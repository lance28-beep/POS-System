'use client';

import AdminLayout from '../components/layouts/AdminLayout';
import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import dynamic from 'next/dynamic';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
} from 'chart.js';

// Dynamically import chart components to avoid SSR issues
const Line = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Line),
  { ssr: false }
);

const Bar = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Bar),
  { ssr: false }
);

const Doughnut = dynamic(
  () => import('react-chartjs-2').then((mod) => mod.Doughnut),
  { ssr: false }
);

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
);

interface DashboardStats {
  totalSales: number;
  totalInventory: number;
  activeUsers: number;
  recentTransactions: number;
  lowStockItems: number;
  pendingBills: number;
  monthlyRevenue: number;
  monthlyExpenses: number;
}

interface ChartData {
  labels: string[];
  datasets: {
    label: string;
    data: number[];
    borderColor?: string;
    backgroundColor?: string | string[];
    fill?: boolean;
  }[];
}

export default function Dashboard() {
  const [isClient, setIsClient] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState('');
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalInventory: 0,
    activeUsers: 0,
    recentTransactions: 0,
    lowStockItems: 0,
    pendingBills: 0,
    monthlyRevenue: 0,
    monthlyExpenses: 0,
  });

  const [salesTrend, setSalesTrend] = useState<ChartData>({
    labels: [],
    datasets: [{
      label: 'Sales',
      data: [],
      borderColor: 'rgb(75, 192, 192)',
      fill: false,
    }],
  });

  const [categoryDistribution, setCategoryDistribution] = useState<ChartData>({
    labels: [],
    datasets: [{
      label: 'Products by Category',
      data: [],
      backgroundColor: [
        'rgb(255, 99, 132)',
        'rgb(54, 162, 235)',
        'rgb(255, 205, 86)',
        'rgb(75, 192, 192)',
        'rgb(153, 102, 255)',
      ],
    }],
  });

  const [revenueExpenses, setRevenueExpenses] = useState<ChartData>({
    labels: [],
    datasets: [
      {
        label: 'Revenue',
        data: [],
        backgroundColor: 'rgba(75, 192, 192, 0.5)',
      },
      {
        label: 'Expenses',
        data: [],
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
      },
    ],
  });

  const router = useRouter();

  useEffect(() => {
    setIsClient(true);
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      setIsLoading(true);
      setError('');

      // Fetch dashboard statistics
      const statsResponse = await fetch('/api/dashboard/stats');
      if (!statsResponse.ok) throw new Error('Failed to fetch statistics');
      const statsData = await statsResponse.json();
      setStats(statsData);

      // Fetch sales trend data
      const salesResponse = await fetch('/api/dashboard/sales-trend');
      if (!salesResponse.ok) throw new Error('Failed to fetch sales trend');
      const salesData = await salesResponse.json();
      setSalesTrend({
        labels: salesData.labels || [],
        datasets: [{
          label: 'Sales',
          data: salesData.data || [],
          borderColor: 'rgb(75, 192, 192)',
          fill: false,
        }],
      });

      // Fetch category distribution data
      const categoryResponse = await fetch('/api/dashboard/category-distribution');
      if (!categoryResponse.ok) throw new Error('Failed to fetch category distribution');
      const categoryData = await categoryResponse.json();
      setCategoryDistribution({
        labels: categoryData.labels || [],
        datasets: [{
          label: 'Products by Category',
          data: categoryData.data || [],
          backgroundColor: [
            'rgb(255, 99, 132)',
            'rgb(54, 162, 235)',
            'rgb(255, 205, 86)',
            'rgb(75, 192, 192)',
            'rgb(153, 102, 255)',
          ],
        }],
      });

      // Fetch revenue vs expenses data
      const revenueResponse = await fetch('/api/dashboard/revenue-expenses');
      if (!revenueResponse.ok) throw new Error('Failed to fetch revenue and expenses');
      const revenueData = await revenueResponse.json();
      setRevenueExpenses({
        labels: revenueData.labels || [],
        datasets: [
          {
            label: 'Revenue',
            data: revenueData.revenue || [],
            backgroundColor: 'rgba(75, 192, 192, 0.5)',
          },
          {
            label: 'Expenses',
            data: revenueData.expenses || [],
            backgroundColor: 'rgba(255, 99, 132, 0.5)',
          },
        ],
      });
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError(error instanceof Error ? error.message : 'Failed to fetch dashboard data');
    } finally {
      setIsLoading(false);
    }
  };

  const quickActions = [
    { title: 'Add Product', href: '/inventory/new', color: 'bg-blue-500' },
    { title: 'New Sale', href: '/sales/new', color: 'bg-green-500' },
    { title: 'Generate Bill', href: '/billing/new', color: 'bg-purple-500' },
    { title: 'Add User', href: '/users/new', color: 'bg-orange-500' },
  ];

  const LoadingSpinner = () => (
    <div className="flex items-center justify-center h-80">
      <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
    </div>
  );

  const ErrorMessage = () => (
    <div className="flex items-center justify-center h-80">
      <div className="text-red-500">
        <svg className="w-12 h-12 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
        </svg>
        <p className="text-center">{error || 'Failed to load chart data'}</p>
      </div>
    </div>
  );

  return (
    <AdminLayout>
      <div className="space-y-6">
        {/* Error Message */}
        {error && (
          <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-lg">
            {error}
          </div>
        )}

        {/* Page Header */}
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
          <button
            onClick={() => router.refresh()}
            className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Refresh Data
          </button>
        </div>

        {/* Statistics Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Sales</p>
                <p className="text-2xl font-bold text-gray-900">₱{stats.totalSales.toLocaleString()}</p>
              </div>
              <div className="bg-blue-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Inventory</p>
                <p className="text-2xl font-bold text-gray-900">{stats.totalInventory.toLocaleString()}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 8h14M5 8a2 2 0 110-4h14a2 2 0 110 4M5 8v10a2 2 0 002 2h10a2 2 0 002-2V8m-9 4h4" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-gray-900">{stats.activeUsers}</p>
              </div>
              <div className="bg-purple-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Recent Transactions</p>
                <p className="text-2xl font-bold text-gray-900">{stats.recentTransactions}</p>
              </div>
              <div className="bg-orange-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {quickActions.map((action, index) => (
            <button
              key={index}
              onClick={() => router.push(action.href)}
              className={`${action.color} text-white p-6 rounded-lg shadow hover:opacity-90 transition-opacity`}
            >
              <h3 className="text-lg font-medium">{action.title}</h3>
              <p className="text-sm opacity-90">Click to proceed</p>
            </button>
          ))}
        </div>

        {/* Charts Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Sales Trend Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Sales Trend</h2>
            <div className="h-80">
              {isLoading ? (
                <LoadingSpinner />
              ) : error ? (
                <ErrorMessage />
              ) : isClient && salesTrend?.labels?.length > 0 ? (
                <Line
                  data={salesTrend}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Revenue vs Expenses Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Revenue vs Expenses</h2>
            <div className="h-80">
              {isLoading ? (
                <LoadingSpinner />
              ) : error ? (
                <ErrorMessage />
              ) : isClient && revenueExpenses?.labels?.length > 0 ? (
                <Bar
                  data={revenueExpenses}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'top' as const,
                      },
                      title: {
                        display: false,
                      },
                    },
                    scales: {
                      y: {
                        beginAtZero: true,
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Category Distribution Chart */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Product Categories</h2>
            <div className="h-80">
              {isLoading ? (
                <LoadingSpinner />
              ) : error ? (
                <ErrorMessage />
              ) : isClient && categoryDistribution?.labels?.length > 0 ? (
                <Doughnut
                  data={categoryDistribution}
                  options={{
                    responsive: true,
                    maintainAspectRatio: false,
                    plugins: {
                      legend: {
                        position: 'right' as const,
                      },
                      title: {
                        display: false,
                      },
                    },
                  }}
                />
              ) : (
                <div className="flex items-center justify-center h-full text-gray-500">
                  No data available
                </div>
              )}
            </div>
          </div>

          {/* Additional Metrics */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-lg font-medium text-gray-900 mb-4">Key Metrics</h2>
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Low Stock Items</span>
                <span className="text-red-600 font-medium">{stats.lowStockItems}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Pending Bills</span>
                <span className="text-orange-600 font-medium">{stats.pendingBills}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Revenue</span>
                <span className="text-green-600 font-medium">₱{stats.monthlyRevenue.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-gray-600">Monthly Expenses</span>
                <span className="text-red-600 font-medium">₱{stats.monthlyExpenses.toLocaleString()}</span>
              </div>
              <div className="flex justify-between items-center pt-2 border-t">
                <span className="text-gray-900 font-medium">Net Profit</span>
                <span className={`font-medium ${
                  stats.monthlyRevenue - stats.monthlyExpenses > 0
                    ? 'text-green-600'
                    : 'text-red-600'
                }`}>
                  ₱{(stats.monthlyRevenue - stats.monthlyExpenses).toLocaleString()}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
} 