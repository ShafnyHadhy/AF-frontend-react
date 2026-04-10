import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line
} from 'recharts';
import {
  TrendingUp, Package, Hammer, Recycle, FileDown,
  ArrowUpRight, Users, Clock
} from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import toast from 'react-hot-toast';

export default function AdminDashboard() {
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const res = await axios.get(import.meta.env.VITE_API_URL + '/api/admin/stats', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setStats(res.data);
      setLoading(false);
    } catch (error) {
      toast.error("Failed to fetch dashboard stats");
      setLoading(false);
    }
  };

  const generatePDF = async () => {
    try {
      const res = await axios.get('http://localhost:5001/api/admin/report', {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      const data = res.data;

      const doc = new jsPDF();

      // Add Logo/Header
      doc.setFontSize(22);
      doc.setTextColor(46, 125, 50); // Primary green
      doc.text('Eco-Revive Admin Report', 14, 22);

      doc.setFontSize(10);
      doc.setTextColor(100);
      doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

      // KPI Summary
      autoTable(doc, {
        startY: 40,
        head: [['Total Repairs', 'Total Recycling', 'Completed Repairs', 'Completed Recycling']],
        body: [[
          stats.kpis.totalRepairs,
          stats.kpis.totalRecycling,
          stats.kpis.completedRepairs,
          stats.kpis.completedRecycling
        ]],
        theme: 'striped',
        headStyles: { fillColor: [46, 125, 50] }
      });

      // Detailed Data Table
      autoTable(doc, {
        startY: doc.lastAutoTable.finalY + 10,
        head: [['Type', 'Product', 'User', 'Status', 'Date']],
        body: data.map(item => [
          item.type,
          item.productName,
          `${item.user?.firstName} ${item.user?.lastName}`,
          item.status,
          new Date(item.createdAt).toLocaleDateString()
        ]),
        theme: 'grid',
        headStyles: { fillColor: [66, 66, 66] }
      });

      doc.save(`eco-revive-report-${Date.now()}.pdf`);
      toast.success("PDF Report Exported!");
    } catch (error) {
      console.error(error);
      toast.error("Failed to generate PDF: " + (error.response?.data?.message || error.message));
    }
  };

  if (loading) return (
    <div className="flex items-center justify-center h-screen bg-gray-50">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50 p-8 pt-24">
      <div className="max-w-7xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Admin Dashboard</h1>
            <p className="text-gray-500">Monitor recycling and repair trends</p>
          </div>
          <button
            onClick={generatePDF}
            className="flex items-center gap-2 bg-gray-900 text-white px-6 py-3 rounded-2xl hover:bg-black transition-all shadow-lg active:scale-95"
          >
            <FileDown className="w-5 h-5" />
            Generate Report
          </button>
        </div>

        {/* KPI Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <StatCard
            title="Total Repairs"
            value={stats.kpis.totalRepairs}
            icon={Hammer}
            color="bg-blue-500"
            trend="+12%"
          />
          <StatCard
            title="Total Recycling"
            value={stats.kpis.totalRecycling}
            icon={Recycle}
            color="bg-green-500"
            trend="+5%"
          />
          <StatCard
            title="Completed Repairs"
            value={stats.kpis.completedRepairs}
            icon={Package}
            color="bg-purple-500"
            trend="88%"
          />
          <StatCard
            title="Completed Recycling"
            value={stats.kpis.completedRecycling}
            icon={TrendingUp}
            color="bg-orange-500"
            trend="92%"
          />
        </div>

        {/* Charts */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-6 text-gray-700">Monthly Volume Comparison</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={stats.trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Bar dataKey="repairs" fill="#3b82f6" radius={[4, 4, 0, 0]} name="Repairs" />
                  <Bar dataKey="recycling" fill="#22c55e" radius={[4, 4, 0, 0]} name="Recycling" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>

          <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100">
            <h3 className="text-lg font-bold mb-6 text-gray-700">Growth Trends</h3>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={stats.trendData}>
                  <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f0f0f0" />
                  <XAxis dataKey="name" axisLine={false} tickLine={false} />
                  <YAxis axisLine={false} tickLine={false} />
                  <Tooltip
                    contentStyle={{ borderRadius: '16px', border: 'none', boxShadow: '0 10px 15px -3px rgb(0 0 0 / 0.1)' }}
                  />
                  <Legend />
                  <Line type="monotone" dataKey="repairs" stroke="#3b82f6" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Repairs" />
                  <Line type="monotone" dataKey="recycling" stroke="#22c55e" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Recycling" />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </div>
        </div>

        {/* Additional Stats Area */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="col-span-1 md:col-span-2 bg-white p-6 rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <h3 className="text-lg font-bold text-gray-700">Quick Actions</h3>
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
              <ActionButton icon={Users} label="Manage Users" />
              <ActionButton icon={Package} label="Inventory" />
              <ActionButton icon={Clock} label="Schedules" />
            </div>
          </div>
          <div className="bg-primary/5 p-8 rounded-3xl border border-primary/10 flex flex-col items-center justify-center text-center">
            <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
              <TrendingUp className="text-primary w-8 h-8" />
            </div>
            <h4 className="font-bold text-primary text-xl mb-1">Impact Goal</h4>
            <p className="text-sm text-primary/70 mb-4">You are at 82% of your monthly recycling goal of 500 items.</p>
            <div className="w-full bg-primary/10 h-2 rounded-full overflow-hidden">
              <div className="bg-primary h-full transition-all duration-1000" style={{ width: '82%' }}></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function StatCard({ title, value, icon: Icon, color, trend }) {
  return (
    <div className="bg-white p-6 rounded-3xl shadow-sm border border-gray-100 group hover:shadow-md transition-all">
      <div className="flex items-center justify-between mb-4">
        <div className={`${color} p-3 rounded-2xl text-white shadow-lg`}>
          <Icon className="w-6 h-6" />
        </div>
        <div className="flex items-center gap-1 text-xs font-bold text-green-600 bg-green-50 px-2 py-1 rounded-lg">
          <ArrowUpRight className="w-3 h-3" />
          {trend}
        </div>
      </div>
      <p className="text-gray-500 text-sm font-medium">{title}</p>
      <h2 className="text-3xl font-bold text-gray-800 tabular-nums">{value}</h2>
    </div>
  );
}

function ActionButton({ icon: Icon, label }) {
  return (
    <button className="flex flex-col items-center gap-3 p-4 rounded-2xl bg-gray-50 hover:bg-gray-100 transition-all group">
      <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center group-hover:scale-110 transition-transform">
        <Icon className="w-6 h-6 text-gray-600" />
      </div>
      <span className="text-xs font-bold text-gray-600">{label}</span>
    </button>
  );
}