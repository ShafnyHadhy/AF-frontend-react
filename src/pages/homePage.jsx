import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import { useState } from "react";
import RepairRecycleForm from "../components/RepairRecycleForm";
import { Hammer, Recycle } from "lucide-react";

export default function HomePage() {
    const [isFormOpen, setIsFormOpen] = useState(false);

    return (
        <div className="w-full h-full relative">

            <Header />

            <Routes path="/">
                <Route path="/" element={<h1 className="text-3xl font-bold text-primary">Welcome to the Home Page</h1>} />
                <Route path="/products" element={<h1 className="text-3xl font-bold text-primary">Products Page</h1>} />
                <Route path="/about" element={<h1 className="text-3xl font-bold text-primary">About Page</h1>} />
                <Route path="/contact" element={<h1 className="text-3xl font-bold text-primary">Contact Page</h1>} />
                <Route path="/*" element={<h1 className="text-3xl font-bold text-primary">404 Not Found</h1>} />
            </Routes>

            {/* Quick Action Button */}
            <button
                onClick={() => setIsFormOpen(true)}
                className="fixed bottom-6 right-6 bg-primary text-white p-4 rounded-full shadow-2xl hover:scale-110 active:scale-95 transition-all z-40 group"
            >
                <div className="flex items-center gap-2">
                    <div className="flex -space-x-1">
                        <Hammer className="w-6 h-6" />
                        <Recycle className="w-6 h-6" />
                    </div>
                    <span className="max-w-0 overflow-hidden group-hover:max-w-xs transition-all duration-500 font-bold whitespace-nowrap">
                        Repair & Recycle
                    </span>
                </div>
            </button>

            {isFormOpen && <RepairRecycleForm onClose={() => setIsFormOpen(false)} />}
        </div>
    )
}