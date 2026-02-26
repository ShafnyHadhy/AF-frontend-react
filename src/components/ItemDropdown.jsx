import React, { useState } from 'react';
import { Smartphone, Monitor, Watch, Tablet, Camera, HardDrive } from 'lucide-react';

const items = [
    { name: 'Phone', id: 'phone', icon: Smartphone, image: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?w=200' },
    { name: 'Laptop', id: 'laptop', icon: Monitor, image: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=200' },
    { name: 'Watch', id: 'watch', icon: Watch, image: 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=200' },
    { name: 'Tablet', id: 'tablet', icon: Tablet, image: 'https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=200' },
    { name: 'Camera', id: 'camera', icon: Camera, image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=200' },
    { name: 'Accessories', id: 'accessories', icon: HardDrive, image: 'https://images.unsplash.com/photo-1541807084-5c52b6b3adef?w=200' }
];

export default function ItemDropdown({ onSelect }) {
    const [selected, setSelected] = useState(null);

    const handleSelect = (item) => {
        setSelected(item);
        onSelect(item);
    };

    return (
        <div className="space-y-4">
            <label className="block text-sm font-medium text-gray-700">Select Item Category</label>
            <div className="grid grid-cols-3 gap-2">
                {items.map((item) => (
                    <button
                        key={item.id}
                        type="button"
                        onClick={() => handleSelect(item)}
                        className={`flex flex-col items-center justify-center p-3 rounded-xl border-2 transition-all ${selected?.id === item.id
                                ? 'border-primary bg-primary/5 text-primary'
                                : 'border-gray-100 hover:border-gray-300 text-gray-500'
                            }`}
                    >
                        <item.icon className="w-6 h-6 mb-2" />
                        <span className="text-xs font-semibold">{item.name}</span>
                    </button>
                ))}
            </div>

            {selected && (
                <div className="mt-4 animate-in fade-in slide-in-from-top-2">
                    <p className="text-sm font-medium text-gray-500 mb-2">Selected Item Preview:</p>
                    <div className="relative h-40 w-full rounded-2xl overflow-hidden shadow-lg border-4 border-white">
                        <img
                            src={selected.image}
                            alt={selected.name}
                            className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent flex items-end p-4">
                            <span className="text-white font-bold">{selected.name}</span>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
