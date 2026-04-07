import axios from "axios";
import { useEffect, useState } from "react";
import { IoChatbubbleEllipsesOutline } from "react-icons/io5";
import { Link } from "react-router-dom";

export default function InboxRequests() {

    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [chatThreads, setChatThreads] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);

    useEffect(() => {

        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login';
        }

        axios.get(import.meta.env.VITE_API_URL + '/api/repairs', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            }
        ).then((response) => {

            console.log('Repair Requests:', response.data);
            setRequests(response.data);
            setSelectedRequest(response.data[0] || null);
            const initialThreads = {};
            response.data.forEach((request) => {
                initialThreads[request._id] = [
                    {
                        id: `${request._id}-provider-1`,
                        sender: 'provider',
                        text: 'Hello, I reviewed your request. Could you share a few photos of the device?',
                        time: '10:24 AM',
                    },
                    {
                        id: `${request._id}-customer-1`,
                        sender: 'customer',
                        text: 'Sure, I will send the photos shortly.',
                        time: '10:26 AM',
                    },
                ];
            });
            setChatThreads(initialThreads);
            setIsLoading(false);

        }).catch((error) => {

            console.error('Error fetching repair requests:', error);
            setIsLoading(false);

        });

    }, []);

    const handleSelectRequest = (request) => {
        setSelectedRequest(request);
        setMessageInput('');
    };

    const updateRequestStatus = async (status) => {
        if (!selectedRequest) return;

        try {
            setIsUpdating(true);
            const token = localStorage.getItem('token');

            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}/api/repairs/${selectedRequest._id}/status`,
                {
                    status,
                    note: status === 'Accepted' ? 'Accepted by provider' : 'Declined by provider',
                },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            setRequests((prev) => prev.map((request) => (request._id === response.data._id ? response.data : request)));
            setSelectedRequest(response.data);
        } catch (error) {
            console.error(`Failed to update request status to ${status}:`, error);
        } finally {
            setIsUpdating(false);
        }
    };

    const handleSendMessage = () => {
        if (!selectedRequest || !messageInput.trim()) return;

        const newMessage = {
            id: `${selectedRequest._id}-${Date.now()}`,
            sender: 'provider',
            text: messageInput.trim(),
            time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
        };

        setChatThreads((prev) => ({
            ...prev,
            [selectedRequest._id]: [...(prev[selectedRequest._id] || []), newMessage],
        }));
        setMessageInput('');
    };

    const handleQuickReply = (text) => {
        setMessageInput(text);
    };

    const selectedChatMessages = selectedRequest ? chatThreads[selectedRequest._id] || [] : [];

    return (
        <div className="px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                    <div className="sticky top-24 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">Inbox Requests</h2>
                            <span className="text-xs text-slate-500">{requests.length} items</span>
                        </div>
                        <div>
                            <button className="px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium hover:bg-amber-200"
                            >
                                Pending
                            </button>
                            <button className="ml-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200"
                            >
                                Accepted
                            </button>
                            <button className="ml-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200"
                            >
                                Declined
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[calc(100vh-10rem)] overflow-y-auto pr-1">
                            {isLoading && (
                                <div className="bg-white rounded-2xl p-4 shadow-soft border border-green-100 text-sm text-slate-500">
                                    Loading requests...
                                </div>
                            )}

                            {!isLoading && requests.map((request) => (
                                <button
                                    key={request._id}
                                    onClick={() => handleSelectRequest(request)}
                                    className={`w-full text-left bg-white rounded-2xl p-4 shadow-soft border transition-colors cursor-pointer ${
                                        selectedRequest?._id === request._id
                                            ? 'border-green-400 ring-1 ring-green-200'
                                            : 'border-green-100 hover:border-green-300'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-slate-900 truncate">{request.productName}</h3>
                                            <p className="text-xs text-slate-400 mt-1 truncate">
                                                Customer: {request.user?.firstName} {request.user?.lastName}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{request.description}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-4">
                                            <span className={`px-2.5 py-1 rounded-full text-[11px] font-semibold ${
                                                request.status === 'Pending'
                                                    ? 'bg-amber-100 text-amber-700'
                                                    : request.status === 'Accepted'
                                                        ? 'bg-green-100 text-green-700'
                                                        : request.status === 'Scheduled'
                                                            ? 'bg-blue-100 text-blue-700'
                                                            : request.status === 'In Progress'
                                                                ? 'bg-blue-100 text-blue-700'
                                                                : request.status === 'Completed'
                                                                    ? 'bg-emerald-100 text-emerald-700'
                                                                    : 'bg-red-100 text-red-700'                      
                                            }`}>
                                                {request.status}
                                            </span>
                                            <Link 
                                                className="text-xs text-slate-600 hover:underline px-2"
                                                to={`/provider/manage-request/${request._id}`}
                                            >
                                                View More
                                            </Link>
                                        </div>
                                    </div>
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="lg:col-span-8">
                    <div className="sticky top-24 space-y-4">
                        <h2 className="text-lg font-bold text-slate-900">Negotiation Chat</h2>

                        {!selectedRequest ? (
                            <div className="w-full min-h-128 bg-white rounded-2xl p-6 shadow-soft border border-green-100 flex items-center justify-center">
                                <p className="text-sm text-slate-500">Select a request to view chat and details.</p>
                            </div>
                        ) : (
                            <div className="w-full min-h-128 bg-white rounded-2xl shadow-soft border border-green-300 flex flex-col overflow-hidden">
                                <div className="p-5 border-b border-slate-100 bg-slate-50/70">
                                    <div className="flex items-start justify-between gap-4">
                                        <div>
                                            <h3 className="text-base font-semibold text-slate-900">{selectedRequest.productName}</h3>
                                            <p className="text-xs text-slate-500 mt-1">
                                                {selectedRequest.user?.firstName} {selectedRequest.user?.lastName} • {selectedRequest.updatedAt && new Date(selectedRequest.updatedAt).toLocaleString()}
                                            </p>
                                        </div>
                                        {selectedRequest.status === 'Pending' && (
                                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-amber-100 text-amber-700">
                                                {selectedRequest.status}
                                            </span>
                                        )}
                                        {selectedRequest.status === 'Accepted' && (
                                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-green-100 text-green-700">
                                                {selectedRequest.status}
                                            </span>
                                        )}
                                        {selectedRequest.status === 'Declined' && (
                                            <span className="px-2.5 py-1 rounded-full text-[11px] font-semibold bg-red-100 text-red-700">
                                                {selectedRequest.status}
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-slate-600 mt-3">{selectedRequest.description}</p>
                                </div>

                                <div className="flex-1 p-5 space-y-4 bg-slate-50/40">
                                    {selectedChatMessages.map((message) => (
                                        <div key={message.id} className={`flex ${message.sender === 'provider' ? 'justify-end' : 'justify-start'}`}>
                                            <div className={`max-w-[75%] rounded-2xl px-4 py-3 shadow-sm ${message.sender === 'provider' ? 'rounded-tr-md bg-green-600 text-white' : 'rounded-tl-md bg-white border border-slate-200 text-slate-800'}`}>
                                                <p className="text-sm">{message.text}</p>
                                                <span className={`mt-2 block text-[11px] ${message.sender === 'provider' ? 'text-green-100' : 'text-slate-400'}`}>{message.time}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>

                                <div className="border-t border-slate-100 p-4 bg-white">
                                    <div className="flex flex-wrap gap-2 mb-3">
                                        <button onClick={() => handleQuickReply('Could you please share a few photos of the device?')} className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200">Ask for photos</button>
                                        <button onClick={() => handleQuickReply('Please share your expected budget for this repair.')} className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200">Request budget</button>
                                        <button onClick={() => handleQuickReply('Can we schedule an appointment for tomorrow?')} className="px-3 py-1.5 rounded-full bg-slate-100 text-slate-700 text-xs font-medium hover:bg-slate-200">Suggest appointment</button>
                                    </div>

                                    <div className="flex items-end gap-3">
                                        <textarea
                                            rows={2}
                                            placeholder="Type your message..."
                                            value={messageInput}
                                            onChange={(e) => setMessageInput(e.target.value)}
                                            className="flex-1 resize-none rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                        <button onClick={handleSendMessage} className="px-4 py-3 rounded-2xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors">
                                            Send
                                        </button>
                                    </div>

                                    <div className="flex items-center gap-2 pt-2">
                                        <button
                                            onClick={() => updateRequestStatus('Accepted')}
                                            disabled={isUpdating || selectedRequest.status === 'Accepted'}
                                            className="px-4 py-2 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isUpdating && selectedRequest.status !== 'Accepted' ? 'Updating...' : 'Accept'}
                                        </button>
                                        <button
                                            onClick={() => updateRequestStatus('Cancelled')}
                                            disabled={isUpdating || selectedRequest.status === 'Cancelled'}
                                            className="px-4 py-2 rounded-xl bg-red-100 text-red-700 text-sm font-medium hover:bg-red-200 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                        >
                                            {isUpdating && selectedRequest.status !== 'Cancelled' ? 'Updating...' : 'Decline'}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
