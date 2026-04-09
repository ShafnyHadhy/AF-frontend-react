import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';
import { FileDown, Calendar, Filter, Save, Upload, Search, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { BarChart, Bar, XAxis, YAxis, Tooltip, Legend, PieChart, Pie, Cell, LineChart, Line, ResponsiveContainer } from 'recharts';

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8'];

export default function ReportGeneration() {
    const [filters, setFilters] = useState({
        startDate: '',
        endDate: '',
        providerId: 'all',
        category: 'all',
        repairStatus: 'all',
        recycleStatus: 'all'
    });

    const [providers, setProviders] = useState([]);
    const [reportData, setReportData] = useState([]);
    const [chartsData, setChartsData] = useState({ barChart: [], pieChartRepairs: [], pieChartRecycling: [], lineChart: [] });
    const [loading, setLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    
    // Export options
    const [exportFormat, setExportFormat] = useState('csv');
    const [exportColumns, setExportColumns] = useState({
        date: true,
        type: true,
        product: true,
        category: true,
        status: true,
        user: true,
        provider: true
    });

    // Saved Configs
    const [configName, setConfigName] = useState('');
    const [savedConfigs, setSavedConfigs] = useState([]);

    useEffect(() => {
        // Load providers
        const fetchProviders = async () => {
            try {
                const res = await axios.get('http://localhost:5001/api/admin/providers', {
                    headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
                });
                setProviders(res.data);
            } catch (err) {
                console.error('Failed to load providers');
            }
        };
        fetchProviders();

        // Load saved configs
        const configs = JSON.parse(localStorage.getItem('ecoRevive_reportConfigs') || '[]');
        setSavedConfigs(configs);

        // Initial fetch
        fetchReportData();
    }, []);

    const fetchReportData = async (activeFilters = filters) => {
        setLoading(true);
        try {
            const queryParams = new URLSearchParams();
            if (activeFilters.startDate) queryParams.append('startDate', activeFilters.startDate);
            if (activeFilters.endDate) queryParams.append('endDate', activeFilters.endDate);
            if (activeFilters.providerId !== 'all') queryParams.append('providerId', activeFilters.providerId);
            if (activeFilters.category !== 'all') queryParams.append('category', activeFilters.category);
            if (activeFilters.repairStatus !== 'all') queryParams.append('repairStatus', activeFilters.repairStatus);
            if (activeFilters.recycleStatus !== 'all') queryParams.append('recycleStatus', activeFilters.recycleStatus);

            const res = await axios.get(`http://localhost:5001/api/admin/report?${queryParams.toString()}`, {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            
            setReportData(res.data.list);
            setChartsData(res.data.charts);
        } catch (error) {
            toast.error("Failed to fetch report data");
        } finally {
            setLoading(false);
        }
    };

    const handleFilterChange = (field, value) => {
        setFilters(prev => ({ ...prev, [field]: value }));
    };

    const applyFilters = () => {
        fetchReportData(filters);
    };

    const saveConfig = () => {
        if (!configName) return toast.error("Please enter a configuration name");
        const newConfig = { name: configName, filters };
        const updated = [...savedConfigs, newConfig];
        setSavedConfigs(updated);
        localStorage.setItem('ecoRevive_reportConfigs', JSON.stringify(updated));
        toast.success("Configuration saved!");
        setConfigName('');
    };

    const loadConfig = (config) => {
        setFilters(config.filters);
        toast.success(`Loaded configuration: ${config.name}`);
        fetchReportData(config.filters);
    };

    const toggleColumn = (col) => {
        setExportColumns(prev => ({ ...prev, [col]: !prev[col] }));
    };

    // Filtered data for Table Search
    const filteredReportData = reportData.filter(item => {
        if (!searchTerm) return true;
        const searchLower = searchTerm.toLowerCase();
        return (
            item.productName?.toLowerCase().includes(searchLower) ||
            item.category?.toLowerCase().includes(searchLower) ||
            item.status?.toLowerCase().includes(searchLower) ||
            item.type?.toLowerCase().includes(searchLower) ||
            (item.user?.firstName + ' ' + item.user?.lastName).toLowerCase().includes(searchLower)
        );
    });

    const handleExport = () => {
        if (filteredReportData.length === 0) return toast.error("No data to export!");

        // Build header based on columns
        const headers = [];
        if (exportColumns.date) headers.push("Date");
        if (exportColumns.type) headers.push("Type");
        if (exportColumns.product) headers.push("Product");
        if (exportColumns.category) headers.push("Category");
        if (exportColumns.status) headers.push("Status");
        if (exportColumns.user) headers.push("User");
        if (exportColumns.provider) headers.push("Provider");

        // Build Rows
        const rows = filteredReportData.map(item => {
            const row = [];
            if (exportColumns.date) row.push(new Date(item.createdAt).toLocaleDateString());
            if (exportColumns.type) row.push(item.type);
            if (exportColumns.product) row.push(`"${item.productName || ''}"`); // quote to prevent CSV break 
            if (exportColumns.category) row.push(item.category || 'N/A');
            if (exportColumns.status) row.push(item.status);
            if (exportColumns.user) row.push(`"${item.user?.firstName || ''} ${item.user?.lastName || ''}"`);
            if (exportColumns.provider) row.push(`"${item.provider ? item.provider.firstName + ' ' + item.provider.lastName : 'N/A'}"`);
            return row;
        });

        if (exportFormat === 'csv') {
            const csvContent = "data:text/csv;charset=utf-8," 
                + headers.join(",") + "\n" 
                + rows.map(e => e.join(",")).join("\n");
            
            const encodedUri = encodeURI(csvContent);
            const link = document.createElement("a");
            link.setAttribute("href", encodedUri);
            link.setAttribute("download", `eco-revive-report-${Date.now()}.csv`);
            document.body.appendChild(link);
            link.click();
            link.remove();
            toast.success("CSV Exported successfully!");
        } else {
            // PDF
            const doc = new jsPDF();
            doc.setFontSize(18);
            doc.setTextColor(46, 125, 50);
            doc.text(`Eco-Revive Custom Report`, 14, 22);

            doc.setFontSize(10);
            doc.setTextColor(100);
            doc.text(`Generated on: ${new Date().toLocaleString()}`, 14, 30);

            autoTable(doc, {
                startY: 40,
                head: [headers],
                body: rows,
                theme: 'grid',
                headStyles: { fillColor: [46, 125, 50] }
            });

            doc.save(`eco-revive-report-${Date.now()}.pdf`);
            toast.success("PDF Exported successfully!");
        }
    };

    return (
        <div className="p-8 pb-32">
            <h1 className="text-3xl font-bold text-gray-800 mb-8">Custom Report Generation</h1>

            {/* Config & Filters Section */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 mb-8">
                <div className="flex justify-between items-center mb-6">
                    <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                        <Filter className="w-5 h-5 text-primary" />
                        Report Filters
                    </h3>
                    
                    {savedConfigs.length > 0 && (
                        <select 
                            onChange={(e) => {
                                const cfg = savedConfigs.find(c => c.name === e.target.value);
                                if(cfg) loadConfig(cfg);
                            }}
                            className="p-2 bg-gray-50 border border-gray-200 rounded-lg text-sm"
                        >
                            <option value="">Load Saved Config...</option>
                            {savedConfigs.map(c => <option key={c.name} value={c.name}>{c.name}</option>)}
                        </select>
                    )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                        <input type="date" value={filters.startDate} onChange={e => handleFilterChange('startDate', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">End Date</label>
                        <input type="date" value={filters.endDate} onChange={e => handleFilterChange('endDate', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none" />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Provider</label>
                        <select value={filters.providerId} onChange={e => handleFilterChange('providerId', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none">
                            <option value="all">All Providers</option>
                            {providers.map(p => <option key={p._id} value={p._id}>{p.firstName} {p.lastName}</option>)}
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                        <select value={filters.category} onChange={e => handleFilterChange('category', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none">
                            <option value="all">All Categories</option>
                            <option value="Electronics">Electronics</option>
                            <option value="Furniture">Furniture</option>
                            <option value="Clothing">Clothing</option>
                            <option value="Appliances">Appliances</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Repair Status</label>
                        <select value={filters.repairStatus} onChange={e => handleFilterChange('repairStatus', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none">
                            <option value="all">All</option>
                            <option value="Pending">Pending</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Completed">Completed</option>
                            <option value="Cancelled">Cancelled</option>
                        </select>
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-2">Recycling Status</label>
                        <select value={filters.recycleStatus} onChange={e => handleFilterChange('recycleStatus', e.target.value)} className="w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-primary/50 outline-none">
                            <option value="all">All</option>
                            <option value="Pending">Pending</option>
                            <option value="Collected">Collected</option>
                            <option value="Recycled">Recycled</option>
                        </select>
                    </div>
                </div>

                <div className="flex flex-wrap items-center justify-between gap-4 mt-8 pt-6 border-t border-gray-100">
                    <div className="flex items-center gap-2 w-full md:w-auto">
                        <input 
                            type="text" 
                            placeholder="Config name..." 
                            value={configName} 
                            onChange={e => setConfigName(e.target.value)}
                            className="p-2 text-sm border border-gray-200 rounded-lg outline-none"
                        />
                        <button onClick={saveConfig} className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-4 py-2 rounded-lg text-sm flex items-center gap-2 transition-colors">
                            <Save className="w-4 h-4"/> Save Filter
                        </button>
                    </div>
                    
                    <button 
                        onClick={applyFilters} 
                        disabled={loading}
                        className="bg-primary hover:bg-primary/90 text-white px-8 py-2.5 rounded-lg font-medium flex items-center justify-center gap-2 transition-all w-full md:w-auto"
                    >
                        {loading ? 'Crunching Data...' : 'Apply Filters'}
                    </button>
                </div>
            </div>

            {/* Data Visualization */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
                {/* Bar Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-blue-500" /> Requests Overview
                    </h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <BarChart data={chartsData.barChart}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="count" fill="#4ade80" radius={[4, 4, 0, 0]} />
                        </BarChart>
                    </ResponsiveContainer>
                </div>

                {/* Line Chart */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96">
                    <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                        <BarChart3 className="w-5 h-5 text-indigo-500" /> Monthly Trends
                    </h3>
                    <ResponsiveContainer width="100%" height="85%">
                        <LineChart data={chartsData.lineChart}>
                            <XAxis dataKey="name" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Line type="monotone" dataKey="repairs" stroke="#3b82f6" strokeWidth={3} />
                            <Line type="monotone" dataKey="recycling" stroke="#10b981" strokeWidth={3} />
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Pie Charts */}
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 h-96 lg:col-span-2 flex flex-col md:flex-row items-center gap-8 justify-around">
                    <div className="w-full md:w-1/2 h-full flex flex-col items-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-orange-500" /> Repair Statuses
                        </h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie data={chartsData.pieChartRepairs} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#8884d8" label>
                                    {chartsData.pieChartRepairs.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                    <div className="w-full md:w-1/2 h-full flex flex-col items-center">
                        <h3 className="text-lg font-semibold text-gray-800 mb-2 flex items-center gap-2">
                            <PieChartIcon className="w-5 h-5 text-green-500" /> Recycling Statuses
                        </h3>
                        <ResponsiveContainer width="100%" height="80%">
                            <PieChart>
                                <Pie data={chartsData.pieChartRecycling} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80} fill="#82ca9d" label>
                                    {chartsData.pieChartRecycling.map((entry, index) => <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />)}
                                </Pie>
                                <Tooltip />
                                <Legend />
                            </PieChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            {/* Export & Data Table */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-8">
                    <div>
                        <h3 className="text-xl font-bold text-gray-800">Generated Data Report</h3>
                        <p className="text-gray-500 text-sm mt-1">{filteredReportData.length} records found</p>
                    </div>
                    
                    <div className="flex flex-wrap items-center gap-4 w-full lg:w-auto">
                        <div className="relative w-full lg:w-64">
                            <Search className="w-4 h-4 absolute left-3 top-3 text-gray-400" />
                            <input 
                                type="text"
                                placeholder="Search records..."
                                value={searchTerm}
                                onChange={e => setSearchTerm(e.target.value)}
                                className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg text-sm focus:ring-2 focus:ring-primary/50 outline-none"
                            />
                        </div>
                        
                        <div className="flex items-center gap-2 border border-gray-200 rounded-lg p-1 bg-gray-50">
                            <button onClick={() => setExportFormat('csv')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${exportFormat === 'csv' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}>CSV</button>
                            <button onClick={() => setExportFormat('pdf')} className={`px-4 py-1.5 text-sm font-medium rounded-md transition-colors ${exportFormat === 'pdf' ? 'bg-white shadow-sm text-primary' : 'text-gray-500'}`}>PDF</button>
                        </div>
                        
                        <button 
                            onClick={handleExport}
                            className="bg-primary hover:bg-primary/90 text-white font-medium px-4 py-2 rounded-lg flex items-center justify-center gap-2 transition-all shadow-sm"
                        >
                            <FileDown className="w-4 h-4" /> Export
                        </button>
                    </div>
                </div>

                {/* Column Customization */}
                <div className="mb-6 p-4 bg-blue-50/50 rounded-xl border border-blue-100">
                    <p className="text-sm font-medium text-blue-800 mb-3">Include columns in export:</p>
                    <div className="flex flex-wrap items-center gap-4">
                        {Object.keys(exportColumns).map(col => (
                            <label key={col} className="flex items-center gap-2 text-sm text-gray-700 cursor-pointer select-none border border-gray-200 bg-white px-3 py-1.5 rounded-lg hover:border-blue-300 transition-colors">
                                <input type="checkbox" checked={exportColumns[col]} onChange={() => toggleColumn(col)} className="text-primary rounded focus:ring-primary accent-primary" />
                                <span className="capitalize">{col}</span>
                            </label>
                        ))}
                    </div>
                </div>

                {/* Data Preview Table */}
                <div className="overflow-x-auto rounded-xl border border-gray-100">
                    <table className="w-full text-left text-sm whitespace-nowrap">
                        <thead className="bg-gray-50 text-gray-700 font-medium border-b border-gray-100">
                            <tr>
                                <th className="px-6 py-4">Date</th>
                                <th className="px-6 py-4">Type</th>
                                <th className="px-6 py-4">Product</th>
                                <th className="px-6 py-4">Status</th>
                                <th className="px-6 py-4">User</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100/50">
                            {filteredReportData.slice(0, 50).map((item, idx) => (
                                <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                                    <td className="px-6 py-4 text-gray-600">{new Date(item.createdAt).toLocaleDateString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-2.5 py-1 rounded-full text-xs font-medium ${item.type === 'Repair' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}`}>
                                            {item.type}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 font-medium text-gray-800">{item.productName}</td>
                                    <td className="px-6 py-4">
                                        <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">
                                            {item.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-4 text-gray-600">{item.user?.firstName} {item.user?.lastName}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    {filteredReportData.length === 0 && (
                        <div className="text-center py-12 text-gray-500">No records found matching criteria.</div>
                    )}
                    {filteredReportData.length > 50 && (
                        <div className="text-center py-4 text-xs font-medium text-gray-400 bg-gray-50 border-t border-gray-100">
                            Showing first 50 records. Export to view all {filteredReportData.length} records.
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
