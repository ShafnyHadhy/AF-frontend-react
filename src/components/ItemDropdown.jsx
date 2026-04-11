import React, { useState } from 'react';
import { 
    Smartphone, Monitor, Watch, Tablet, Camera, HardDrive, Tv, 
    Refrigerator, WashingMachine, Microwave, Snowflake, Cctv, 
    Drone, Bike, EvCharger, Fan, Gamepad2, Headphones, 
    Printer, Radio, Speaker, PlusCircle 
} from 'lucide-react';

// Expanded and sorted alphabetically
const items = [
    { name: 'Accessories', id: 'accessories', icon: HardDrive, image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200' },
    { name: 'Air Conditioner', id: 'air_conditioner', icon: Snowflake, image: 'https://images.unsplash.com/photo-1631553127988-347209995544?w=200' },
    { name: 'Camera', id: 'camera', icon: Camera, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200' },
    { name: 'CCTV', id: 'cctv', icon: Cctv, image: 'https://images.unsplash.com/photo-1551708411-bd56a655225a?w=200' },
    { name: 'Drone', id: 'drone', icon: Drone, image: 'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=200' },
    { name: 'Electric Bike', id: 'electric_bike', icon: Bike, image: 'https://images.unsplash.com/photo-1596417601532-15f590747db5?w=200' },
    { name: 'EV Charger', id: 'ev_charger', icon: EvCharger, image: 'https://images.unsplash.com/photo-1593941707882-a5bba14938c7?w=200' },
    { name: 'Fan', id: 'fan', icon: Fan, image: 'https://images.unsplash.com/photo-1618941705461-1e96a2f9011e?w=200' },
    { name: 'Gaming Console', id: 'gaming_console', icon: Gamepad2, image: 'https://images.unsplash.com/photo-1486401899868-283af2427517?w=200' },
    { name: 'Headphones', id: 'headphones', icon: Headphones, image: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' },
    { name: 'Laptop', id: 'laptop', icon: Monitor, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200' },
    { name: 'Oven', id: 'oven', icon: Microwave, image: 'https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?w=200' },
    { name: 'Phone', id: 'phone', icon: Smartphone, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200' },
    { name: 'Printer', id: 'printer', icon: Printer, image: 'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=200' },
    { name: 'Radio', id: 'radio', icon: Radio, image: 'https://images.unsplash.com/photo-1558537348-c0f8e733989d?w=200' },
    { name: 'Refrigerator', id: 'refrigerator', icon: Refrigerator, image: 'https://images.unsplash.com/photo-1584286595398-a59f21d313f5?w=200' },
    { name: 'Speaker', id: 'speaker', icon: Speaker, image: 'https://images.unsplash.com/photo-1589003077984-894e133dabab?w=200' },
    { name: 'Tablet', id: 'tablet', icon: Tablet, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200' },
    { name: 'TV', id: 'tv', icon: Tv, image: 'https://images.unsplash.com/photo-1593359677879-a4bb92f829d1?w=200' },
    { name: 'Washing Machine', id: 'washing_machine', icon: WashingMachine, image: 'https://images.unsplash.com/photo-1626806787426-5910811b6325?w=200' },
    { name: 'Watch', id: 'watch', icon: Watch, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' },
    { name: 'Other', id: 'other', icon: PlusCircle, image: 'https://images.unsplash.com/photo-1555664424-778a1e5e1b48?w=200' }
];

export default function ItemDropdown({ onSelect }) {
    const [selected, setSelected] = useState(null);
    const [otherValue, setOtherValue] = useState('');

    const handleSelect = (item) => {
        setSelected(item);
        if (item.id === 'other') {
            onSelect({ ...item, name: otherValue || 'Other' });
        } else {
            onSelect(item);
        }
    };

    const handleOtherChange = (val) => {
        setOtherValue(val);
        if (selected?.id === 'other') {
            onSelect({ ...selected, name: val || 'Other' });
        }
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Select Item Category</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-60 overflow-y-auto p-1 custom-scrollbar">
                {items.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${selected?.id === item.id
                            ? 'border-green-500 bg-green-50 text-green-700 font-bold'
                            : 'border-gray-100 hover:border-gray-100/50 hover:bg-gray-50 text-gray-500'
                            }`}
                    >
                        <item.icon className="w-6 h-6 mb-2" />
                        <span className="text-[10px] font-semibold text-center leading-tight">{item.name}</span>
                    </button>
                ))}
            </div>

            {selected?.id === 'other' && (
                <div className="animate-in fade-in slide-in-from-top-2">
                    <label className="block text-xs font-bold text-gray-500 uppercase mb-2">Specify Category</label>
                    <input
                        type="text"
                        placeholder="Enter custom category name..."
                        value={otherValue}
                        onChange={(e) => handleOtherChange(e.target.value)}
                        className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:ring-2 focus:ring-green-500/20 focus:border-green-500 outline-none transition-all text-sm"
                        autoFocus
                    />
                </div>
            )}

            {selected && (
                <div className="mt-4 animate-in fade-in zoom-in-95 duration-300">
                    <p className="text-sm font-medium text-gray-500 mb-2">Selected Item Preview:</p>
                    <div className="relative h-32 w-full rounded-2xl overflow-hidden shadow-md border-4 border-white">
                        <img
                            src={selected.image}
                            alt={selected.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent flex items-end p-4">
                            <span className="text-white font-bold text-sm">
                                {selected.id === 'other' ? (otherValue || 'Other') : selected.name}
                            </span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
