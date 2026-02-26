import { Link } from "react-router-dom";

export default function Header() {
    return (
        <header className="sticky top-0 z-50 w-full border-b border-slate-200 bg-white/80 backdrop-blur-md dark:border-slate-800 dark:bg-[#111621]/80">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
                <div className="flex h-16 items-center justify-between">
                    <div className="flex items-center gap-2">
                    <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-[#2463eb] text-white">
                        <span className="material-symbols-outlined text-xl"></span>
                    </div>
                    <span className="text-xl font-bold tracking-tight text-slate-900 dark:text-white">
                        UseMeAgain
                    </span>
                    </div>

                    <nav className="hidden items-center gap-8 md:flex">
                        <Link
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-[#2463eb] dark:text-slate-300"
                            to="/"
                        >
                            How it Works
                        </Link>
                        <Link 
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-[#2463eb] dark:text-slate-300"
                            to="/my-products"
                        >
                            My Products
                        </Link>
                        <Link
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-[#2463eb] dark:text-slate-300"
                            to="/services"
                        >
                            Services
                        </Link>
                        <Link
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-[#2463eb] dark:text-slate-300"
                            to="/providers"
                        >
                            Providers
                        </Link>
                        <Link
                            className="text-sm font-medium text-slate-600 transition-colors hover:text-[#2463eb] dark:text-slate-300"
                            to="/impact"
                        >
                            Impact
                        </Link>
                    </nav>

                    <div className="flex items-center gap-3">
                        <Link to="/login" className="hidden rounded-lg px-4 py-2 text-sm font-semibold text-slate-700 transition-all hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-800 sm:block">
                            Login
                        </Link>
                        <Link to="/signup" className="rounded-lg bg-[#2463eb] px-5 py-2 text-sm font-semibold text-white shadow-sm transition-all hover:bg-blue-700">
                            Get Started
                        </Link>
                    </div>
                </div>
            </div>
        </header>
    )
}