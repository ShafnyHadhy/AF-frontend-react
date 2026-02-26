import { Link } from "react-router-dom";

export default function Header() {
    return (
        <div className="w-full h-16 bg-primary text-zinc-900 flex flex-row items-center justify-between px-10 border-b border-primary/20">

            <div className="flex items-center gap-2">
                <div className="w-8 h-8 bg-zinc-900 rounded flex items-center justify-center">
                    <span className="material-icons text-primary text-sm">inventory_2</span>
                </div>
                <h1 className="text-xl font-bold tracking-tight">EcoCycle Pro</h1>
            </div>

            <div className="flex flex-row gap-8 items-center">
                <Link to="/" className="text-zinc-800 hover:text-zinc-600 font-bold text-sm transition-colors">Home</Link>
                <Link to="/marketplace" className="text-zinc-800 hover:text-zinc-600 font-bold text-sm transition-colors">Marketplace</Link>
                <Link to="/my-products" className="text-zinc-800 hover:text-zinc-600 font-bold text-sm transition-colors">My Products</Link>
                <Link to="/about" className="text-zinc-800 hover:text-zinc-600 font-bold text-sm transition-colors">About</Link>
                <Link to="/login" className="bg-zinc-900 text-white px-5 py-2 rounded-lg font-bold text-sm hover:bg-zinc-800 transition-all shadow-md active:scale-95">Login</Link>
            </div>
        </div>
    )
}