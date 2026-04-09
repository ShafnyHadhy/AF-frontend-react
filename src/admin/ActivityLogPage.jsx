import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast } from 'react-hot-toast';

export default function ActivityLogPage() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchLogs();
    }, []);

    const fetchLogs = async () => {
        try {
            const res = await axios.get('http://localhost:5001/api/admin/logs', {
                headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
            });
            setLogs(res.data);
            setLoading(false);
        } catch (error) {
            toast.error('Failed to fetch activity logs');
            setLoading(false);
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-8">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Activity Audit Trail</h1>

            <div className="bg-white rounded-2xl shadow-sm border border-gray-100">
                <ul className="divide-y divide-gray-100">
                    {logs.map(log => (
                        <li key={log._id} className="p-4 sm:p-6 hover:bg-gray-50/50">
                            <div className="flex justify-between items-start">
                                <div>
                                    <div className="font-bold text-gray-900 mb-1">
                                        {log.adminId ? `${log.adminId.firstName} ${log.adminId.lastName}` : "System Admin"}
                                        <span className="font-normal text-gray-500 mx-2">performed</span>
                                        <span className="text-primary">{log.action}</span>
                                    </div>
                                    <div className="text-sm text-gray-500">
                                        Target: {log.entityType} ({log.entityId})
                                    </div>
                                </div>
                                <div className="text-sm text-gray-400 whitespace-nowrap">
                                    {new Date(log.createdAt).toLocaleString()}
                                </div>
                            </div>
                        </li>
                    ))}
                    {logs.length === 0 && (
                        <li className="p-6 text-center text-gray-500">No activity recorded yet.</li>
                    )}
                </ul>
            </div>
        </div>
    );
}
