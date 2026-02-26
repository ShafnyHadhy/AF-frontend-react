export default function Header() {
    return (
        <div className="w-full h-16 bg-primary text-white flex flex-row items-center justify-between px-10 border-b border-primary/20 backdrop-blur-md sticky top-0 z-50">

            <h1 className="text-2xl font-bold tracking-tight">Eco-Revive</h1>

            <div className="flex flex-row gap-8 font-medium">
                <a href="/" className="text-white hover:text-secondary transition-colors">Home</a>
                <a href="/products" className="text-white hover:text-secondary transition-colors">Products</a>
                <a href="/admin" className="text-white hover:text-secondary transition-colors">Admin</a>
                <a href="/provider" className="text-white hover:text-secondary transition-colors">Provider</a>
            </div>

            <div>
                <a href="/login" className="text-white hover:bg-white hover:text-primary px-6 py-2 rounded-xl bg-white/10 border border-white/20 transition-all font-bold">Login</a>
            </div>
        </div>
    )
}