import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { RiProgress3Line } from "react-icons/ri";
import { FiSend } from "react-icons/fi";
import { TbProgressCheck, TbProgressX, TbProgressHelp, TbProgressBolt } from "react-icons/tb";
import { IoCheckmarkDoneCircleOutline } from "react-icons/io5";

export default function InboxRequests() {

    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);
    const [messageInput, setMessageInput] = useState('');
    const [chatThreads, setChatThreads] = useState({});
    const [isUpdating, setIsUpdating] = useState(false);
    const [activeFilter, setActiveFilter] = useState('All');
    const [providerType, setProviderType] = useState('');
    const [searchQuery, setSearchQuery] = useState('');

    const isRepairCenter = providerType === 'repair_center';
    const requestLabel = isRepairCenter ? 'Repair Requests' : 'Recycle Requests';
    const requestEndpoint = isRepairCenter ? '/api/repairs' : '/api/recycling';
    const statusLabel = isRepairCenter ? 'repair' : 'recycling';
    const requestTypeState = isRepairCenter ? 'repair' : 'recycle';

    useEffect(() => {

        const token = localStorage.getItem('token');

        if (!token) {
            window.location.href = '/login';
        }

        let cancelled = false;

        const loadInbox = async () => {
            try {
                setIsLoading(true);

                const profileResponse = await axios.get(import.meta.env.VITE_API_URL + '/api/providers/me', {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const profile = Array.isArray(profileResponse.data) ? profileResponse.data[0] : profileResponse.data;
                const nextProviderType = profile?.providerType || '';
                if (cancelled) return;

                setProviderType(nextProviderType);

                const endpoint = nextProviderType === 'recycler' ? '/api/recycling' : '/api/repairs';
                const response = await axios.get(import.meta.env.VITE_API_URL + endpoint, {
                    headers: { Authorization: `Bearer ${token}` }
                });

                const list = Array.isArray(response.data) ? response.data : [];
                if (cancelled) return;

                setRequests(list);
                setSelectedRequest(list[0] || null);

                const initialThreads = {};
                list.forEach((request) => {
                    initialThreads[request._id] = [
                        {
                            id: `${request._id}-provider-1`,
                            sender: 'provider',
                            text: nextProviderType === 'recycler'
                                ? 'Hello, I reviewed your recycling request. Could you share any extra details or photos?'
                                : 'Hello, I reviewed your request. Could you share a few photos of the device?',
                            time: '10:24 AM',
                        },
                        {
                            id: `${request._id}-customer-1`,
                            sender: 'customer',
                            text: nextProviderType === 'recycler'
                                ? 'Sure, I will send the recycling details shortly.'
                                : 'Sure, I will send the photos shortly.',
                            time: '10:26 AM',
                        },
                    ];
                });

                setChatThreads(initialThreads);
            } catch (error) {
                console.error('Error fetching inbox requests:', error);
            } finally {
                if (!cancelled) setIsLoading(false);
            }
        };

        loadInbox();

        return () => {
            cancelled = true;
        };

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
            const endpoint = isRepairCenter ? '/api/repairs' : '/api/recycling';

            const response = await axios.patch(
                `${import.meta.env.VITE_API_URL}${endpoint}/${selectedRequest._id}/status`,
                {
                    status,
                    note: status === 'Accepted'
                        ? 'Accepted by provider'
                        : status === 'Cancelled'
                            ? 'Declined by provider'
                            : `Status updated to ${status}`,
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

    const filteredRequests = requests.filter( request => {
        const searchText = searchQuery.trim().toLowerCase();
        const matchesSearch = !searchText || [
            request.productName,
            request.description,
            request.user?.firstName,
            request.user?.lastName,
            request.status,
        ].some((field) => String(field || '').toLowerCase().includes(searchText));

        if (!matchesSearch) return false;

        if (activeFilter === 'All') return true;
        if (activeFilter === 'Accepted') {
            return isRepairCenter
                ? ['Accepted', 'Scheduled', 'In Progress', 'Completed'].includes(request.status)
                : ['Scheduled', 'Collected', 'Recycled'].includes(request.status);
        }
        return request.status === activeFilter;
    });

    const selectedChatMessages = selectedRequest ? chatThreads[selectedRequest._id] || [] : [];

    return (
        <div className="px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                <div className="lg:col-span-4">
                    <div className="sticky top-24 space-y-4">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">{requestLabel}</h2>
                            <span className="text-xs text-slate-500">{requests.length} items</span>
                        </div>
                        <div>
                            <div className="mb-3">
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                    placeholder="Search requests..."
                                    className="w-full h-9 px-3 rounded-full bg-white border border-slate-200 text-xs text-slate-700 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-green-500"
                                />
                            </div>
                            <button 
                                className="px-3 py-1.5 rounded-full bg-slate-200 text-slate-700 text-xs font-medium hover:bg-slate-300"
                                onClick={() => setActiveFilter('All')}
                            >
                                All
                            </button>
                            <button 
                                className="ml-2 px-3 py-1.5 rounded-full bg-amber-100 text-amber-700 text-xs font-medium hover:bg-amber-200"
                                onClick={() => setActiveFilter('Pending')}
                            >
                                Pending
                            </button>
                            <button 
                                className="ml-2 px-3 py-1.5 rounded-full bg-green-100 text-green-700 text-xs font-medium hover:bg-green-200"
                                onClick={() => setActiveFilter('Accepted')}
                            >
                                Accepted
                            </button>
                            <button 
                                className="ml-2 px-3 py-1.5 rounded-full bg-red-100 text-red-700 text-xs font-medium hover:bg-red-200"
                                onClick={() => setActiveFilter('Cancelled')}
                            >
                                Cancelled
                            </button>
                        </div>

                        <div className="space-y-3 max-h-[calc(100vh-10rem)] overflow-y-auto pr-1">
                            {isLoading && (
                                <div className="bg-white rounded-2xl p-4 shadow-soft border border-green-100 text-sm text-slate-500">
                                    Loading requests...
                                </div>
                            )}

                            {!isLoading && filteredRequests.map((request) => (
                                <button
                                    key={request._id}
                                    onClick={() => handleSelectRequest(request)}
                                    className={`w-full text-left bg-white rounded-2xl p-4 shadow-soft border transition-colors cursor-pointer ${
                                        selectedRequest?._id === request._id
                                            ? 'border-green-400 ring-1 ring-green-200'
                                            : 'border-green-200 hover:border-green-300'
                                    }`}
                                >
                                    <div className="flex items-start justify-between gap-3">
                                        <div className="flex-1 min-w-0">
                                            <h3 className="text-sm font-semibold text-slate-900 truncate">{request.productName}</h3>
                                            <p className="text-xs text-slate-400 mt-1 truncate italic">
                                                Customer: {request.user?.firstName} {request.user?.lastName}
                                            </p>
                                            <p className="text-xs text-slate-500 mt-1 line-clamp-2">{request.description}</p>
                                        </div>
                                        <div className="flex flex-col items-end gap-4">
                                            <span className={`flex items-center justify-center w-8 h-8 rounded-full ${
                                                request.status === 'Pending' ? 'bg-amber-100 text-amber-700' :
                                                request.status === 'Accepted' ? 'bg-green-100 text-green-700' :
                                                request.status === 'Scheduled' ? 'bg-blue-100 text-blue-700' :
                                                request.status === 'In Progress' ? 'bg-blue-100 text-blue-700' :
                                                request.status === 'Completed' ? 'bg-emerald-100 text-emerald-700' :
                                                'bg-red-100 text-red-700'                      
                                            }`} title={request.status}>
                                                {request.status === 'Pending' && <TbProgressHelp className="text-[18px]" />} 
                                                {request.status === 'Accepted' && <TbProgressCheck className="text-[18px]" />}
                                                {request.status === 'Scheduled' && <RiProgress3Line className="text-[18px]" />}
                                                {request.status === 'In Progress' && <TbProgressBolt className="text-[18px]" />}
                                                {request.status === 'Completed' && <IoCheckmarkDoneCircleOutline className="text-[18px]" />}
                                                {request.status === 'Cancelled' && <TbProgressX className="text-[18px]" />}
                                            </span>
                                            <Link 
                                                className="text-xs text-slate-600 hover:underline px-2"
                                                to={`/provider/manage-request/${request._id}`}
                                                state={{ requestType: requestTypeState }}
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
                                <p className="text-sm text-slate-500">Select a {statusLabel} request to view chat and details.</p>
                            </div>
                        ) : (
                            <div className="w-full min-h-128 bg-white rounded-2xl shadow-soft border border-green-300 flex flex-col overflow-hidden">
                                <div className="p-5 border-b border-slate-200 bg-slate-100">
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
                                        {selectedRequest.status === 'Cancelled' && (
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
                                            className="flex-1 resize-none rounded-2xl border border-slate-300 bg-slate-50 px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-green-500"
                                        />
                                        <button onClick={handleSendMessage} className="px-3 py-3 rounded-xl bg-green-600 text-white text-sm font-medium hover:bg-green-700 transition-colors">
                                            <FiSend className="w-4 h-4" />
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
