import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import { BiArrowToRight } from "react-icons/bi";

export default function HomePage() {
  return (
    <div className="bg-[#f6f6f8] text-slate-900 font-[Inter,sans-serif] dark:bg-[#111621] dark:text-slate-100">
      <Header />

      <div className="w-full h-full">
        <Routes path="/">
          <Route path="/" />
          <Route
            path="/services"
            element={
              <h1 className="text-3xl font-bold text-primary">Services Page</h1>
            }
          />
          <Route
            path="/providers"
            element={
              <h1 className="text-3xl font-bold text-primary">
                Providers Page
              </h1>
            }
          />
          <Route
            path="/impact"
            element={
              <h1 className="text-3xl font-bold text-primary">Impact Page</h1>
            }
          />
          <Route
            path="/*"
            element={
              <h1 className="text-3xl font-bold text-primary">404 Not Found</h1>
            }
          />
        </Routes>
      </div>

      {/* Hero Section */}
      <section className="relative overflow-hidden pb-20 lg:pb-32 pt-10 lg:pt-20">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(45rem_50rem_at_top,var(--color-blue-50),white)] dark:bg-none" />
        <div className="mx-auto max-w-7xl px-4 text-center sm:px-6 lg:px-8">

          <h1 className="mx-auto max-w-4xl text-4xl font-extrabold leading-[1.1] tracking-tight text-slate-900 dark:text-white sm:text-6xl">
            Extend the Life of Your Products.{" "}
            <span className="text-[#2463eb]">Repair. Reuse. Recycle.</span>
          </h1>

          <p className="mx-auto mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300">
            Connect with trusted repair centers and certified recyclers near
            you. Reduce waste and contribute to a circular economy with ease.
          </p>

          <div className="mt-10 flex items-center justify-center gap-x-6 mb-30">
            <button className="rounded-lg bg-[#2463eb] px-8 py-4 text-base font-semibold text-white shadow-lg transition-all hover:bg-blue-700 focus-visible:outline focus-visible:outline-offset-2 focus-visible:outline-[#2463eb]">
              Get Started for Free
            </button>

            <button className="flex items-center gap-2 text-base font-semibold leading-6 text-slate-900 transition-all hover:gap-3 dark:text-white">
              View Demo
              <span aria-hidden="true" className="material-symbols-outlined">
                <BiArrowToRight className="text-white" />
              </span>
            </button>
          </div>

          <div className="relative mt-16 sm:mt-24">
            <div className="mx-auto max-w-5xl rounded-xl bg-slate-900/5 p-2 ring-1 ring-inset ring-slate-900/10 dark:bg-white/5 lg:rounded-2xl lg:p-4">
              <div
                className="flex aspect-video w-full items-center justify-center rounded-lg border border-white/20 bg-linear-to-br from-[#2463eb]/20 to-[#10b981]/20 dark:border-white/10"
                aria-label="Platform Dashboard Preview"
              >
                <div className="text-center">
                  <span className="material-symbols-outlined text-6xl text-[#2463eb]/40">
                    dashboard_customize
                  </span>
                  <p className="mt-2 font-medium text-slate-400 dark:text-slate-500">
                    Platform Dashboard Preview
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="bg-white py-24 dark:bg-[#111621]" id="how-it-works">
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-16 text-center">
            <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white sm:text-4xl">
              How It Works
            </h2>
            <p className="mt-4 text-slate-600 dark:text-slate-400">
              Three simple steps to start your circular journey.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
            {/* Step 1 */}
            <div className="group relative rounded-xl border border-transparent bg-[#f6f6f8] p-8 transition-all hover:border-[#2463eb]/20 hover:shadow-xl dark:bg-slate-800/50">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#2463eb] text-white shadow-lg shadow-[#2463eb]/20">
                <span className="material-symbols-outlined"> </span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                Add Product
              </h3>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Register your devices or goods easily on our secure platform.
                Keep track of warranties and service history in one place.
              </p>
            </div>

            {/* Step 2 */}
            <div className="group relative rounded-xl border border-transparent bg-[#f6f6f8] p-8 transition-all hover:border-[#2463eb]/20 hover:shadow-xl dark:bg-slate-800/50">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-[#10b981] text-white shadow-lg shadow-[#10b981]/20">
                <span className="material-symbols-outlined"> </span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                Request Action
              </h3>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                Choose between professional repair or eco-friendly recycling
                services. Get instant quotes from verified local experts.
              </p>
            </div>

            {/* Step 3 */}
            <div className="group relative rounded-xl border border-transparent bg-[#f6f6f8] p-8 transition-all hover:border-[#2463eb]/20 hover:shadow-xl dark:bg-slate-800/50">
              <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-lg bg-blue-500 text-white shadow-lg shadow-blue-500/20">
                <span className="material-symbols-outlined"></span>
              </div>
              <h3 className="mb-3 text-xl font-bold text-slate-900 dark:text-white">
                Track Impact
              </h3>
              <p className="leading-relaxed text-slate-600 dark:text-slate-400">
                See your CO2 savings and waste reduction in real-time
                dashboards. Share your progress with your community.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Services Section */}
      <section
        className="bg-[#f6f6f8] py-24 dark:bg-[#111621]/50"
        id="services"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
            {/* Repair Services */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-10 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#2463eb]/10 text-[#2463eb]">
                  <span className="material-symbols-outlined text-3xl"></span>
                </div>
                <h3 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
                  Repair Services
                </h3>
                <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-400">
                  Don't toss it, fix it. We connect you with vetted specialists
                  for all your belongings. Our network includes experts in
                  electronics, clothing, and furniture restoration.
                </p>
                <ul className="mb-10 space-y-4">
                  <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[#2463eb]"></span>{" "}
                    Electronics &amp; Appliances
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[#2463eb]"></span>{" "}
                    Fashion &amp; Footwear
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[#2463eb]"></span>{" "}
                    Furniture &amp; Home Goods
                  </li>
                </ul>
              </div>
              <button className="w-full rounded-lg bg-[#2463eb] py-4 font-bold text-white transition-colors hover:bg-blue-700">
                Find a Repair Shop
              </button>
            </div>

            {/* Recycling Services */}
            <div className="flex flex-col justify-between rounded-2xl border border-slate-200 bg-white p-10 shadow-sm dark:border-slate-700 dark:bg-slate-800">
              <div>
                <div className="mb-6 flex h-14 w-14 items-center justify-center rounded-xl bg-[#10b981]/10 text-[#10b981]">
                  <span className="material-symbols-outlined text-3xl"></span>
                </div>
                <h3 className="mb-4 text-3xl font-bold text-slate-900 dark:text-white">
                  Recycling Services
                </h3>
                <p className="mb-8 leading-relaxed text-slate-600 dark:text-slate-400">
                  When a product reaches its end, ensure it returns to the loop.
                  We partner with certified facilities to handle your materials
                  responsibly and sustainably.
                </p>
                <ul className="mb-10 space-y-4">
                  <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[#10b981]"></span>{" "}
                    Certified E-waste Handling
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[#10b981]"></span>{" "}
                    Plastic &amp; Metal Recovery
                  </li>
                  <li className="flex items-center gap-3 text-slate-700 dark:text-slate-300">
                    <span className="material-symbols-outlined text-[#10b981]"></span>{" "}
                    Textile Recycling Programs
                  </li>
                </ul>
              </div>
              <button className="w-full rounded-lg bg-[#10b981] py-4 font-bold text-white transition-colors hover:bg-emerald-600">
                Locate Recyclers
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Providers */}
      <section
        className="overflow-hidden bg-white py-24 dark:bg-[#111621]"
        id="providers"
      >
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mb-12 flex flex-col gap-6 md:flex-row md:items-end md:justify-between">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-slate-900 dark:text-white">
                Featured Providers
              </h2>
              <p className="mt-2 text-slate-600 dark:text-slate-400">
                Certified local businesses trusted by our community.
              </p>
            </div>

            <a
              className="flex items-center gap-1 font-semibold text-[#2463eb] hover:underline"
              href="#"
            >
              View all partners{" "}
              <span className="material-symbols-outlined text-sm"></span>
            </a>
          </div>

          <div className="no-scrollbar flex gap-6 overflow-x-auto pb-8 snap-x">
            {/* Provider Card 1 */}
            <div className="min-w-[320px] snap-start rounded-xl border border-slate-200 bg-[#f6f6f8] p-6 dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-100 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-700">
                  <span className="material-symbols-outlined text-[#2463eb]"></span>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  Repair
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                TechMend Solutions
              </h4>
              <p className="mb-4 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-sm">
                  location_on
                </span>{" "}
                Downtown District
              </p>
              <div className="flex items-center gap-4 border-t border-slate-200 py-3 dark:border-slate-700">
                <div className="flex items-center text-amber-500">
                  <span className="material-symbols-outlined text-sm">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm">
                    star_half
                  </span>
                  <span className="ml-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                    4.8
                  </span>
                </div>
                <span className="text-xs text-slate-400">120+ orders</span>
              </div>
            </div>

            {/* Provider Card 2 */}
            <div className="min-w-[320px] snap-start rounded-xl border border-slate-200 bg-[#f6f6f8] p-6 dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-100 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-700">
                  <span className="material-symbols-outlined text-[#10b981]"></span>
                </div>
                <span className="rounded-full bg-emerald-100 px-3 py-1 text-xs font-bold uppercase text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300">
                  Recycler
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                GreenCycle Hub
              </h4>
              <p className="mb-4 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-sm">
                  location_on
                </span>{" "}
                Industrial Park East
              </p>
              <div className="flex items-center gap-4 border-t border-slate-200 py-3 dark:border-slate-700">
                <div className="flex items-center text-amber-500">
                  <span className="material-symbols-outlined text-sm">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm">
                    star
                  </span>
                  <span className="ml-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                    5.0
                  </span>
                </div>
                <span className="text-xs text-slate-400">450+ orders</span>
              </div>
            </div>

            {/* Provider Card 3 */}
            <div className="min-w-[320px] snap-start rounded-xl border border-slate-200 bg-[#f6f6f8] p-6 dark:border-slate-700 dark:bg-slate-800">
              <div className="mb-4 flex items-start justify-between">
                <div className="flex h-12 w-12 items-center justify-center rounded-lg border border-slate-100 bg-white shadow-sm dark:border-slate-600 dark:bg-slate-700">
                  <span className="material-symbols-outlined text-[#2463eb]"></span>
                </div>
                <span className="rounded-full bg-blue-100 px-3 py-1 text-xs font-bold uppercase text-blue-700 dark:bg-blue-900/30 dark:text-blue-300">
                  Repair
                </span>
              </div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white">
                ThreadBound Artisans
              </h4>
              <p className="mb-4 flex items-center gap-1 text-sm text-slate-500 dark:text-slate-400">
                <span className="material-symbols-outlined text-sm">
                  location_on
                </span>{" "}
                North District
              </p>
              <div className="flex items-center gap-4 border-t border-slate-200 py-3 dark:border-slate-700">
                <div className="flex items-center text-amber-500">
                  <span className="material-symbols-outlined text-sm">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm">
                    star
                  </span>
                  <span className="material-symbols-outlined text-sm">
                    star_half
                  </span>
                  <span className="ml-1 text-xs font-bold text-slate-700 dark:text-slate-300">
                    4.7
                  </span>
                </div>
                <span className="text-xs text-slate-400">85+ orders</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section
        className="relative overflow-hidden bg-slate-900 py-24 text-white"
        id="impact"
      >
        <div className="absolute inset-0 bg-[#2463eb]/10 opacity-50" />
        <div className="relative z-10 mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <div className="mx-auto mb-16 max-w-3xl text-center">
            <h2 className="mb-4 text-3xl font-bold tracking-tight sm:text-4xl">
              Join the Circular Movement
            </h2>
            <p className="text-lg text-slate-400">
              Our collective effort is making a real difference. See how we're
              reshaping the future together.
            </p>
          </div>

          <div className="grid grid-cols-1 gap-12 text-center sm:grid-cols-3">
            <div>
              <p className="mb-2 text-5xl font-black tracking-tight text-white">
                50,000+
              </p>
              <p className="text-sm font-bold uppercase tracking-wider text-[#2463eb]">
                Successful Repairs
              </p>
              <p className="mt-4 text-sm text-slate-400">
                Items saved from landfill through local craftsmen.
              </p>
            </div>
            <div>
              <p className="mb-2 text-5xl font-black tracking-tight text-white">
                120 Tons
              </p>
              <p className="text-sm font-bold uppercase tracking-wider text-[#10b981]">
                Items Recycled
              </p>
              <p className="mt-4 text-sm text-slate-400">
                Materials successfully recovered and reused.
              </p>
            </div>
            <div>
              <p className="mb-2 text-5xl font-black tracking-tight text-white">
                30%
              </p>
              <p className="text-sm font-bold uppercase tracking-wider text-blue-400">
                Waste Reduced
              </p>
              <p className="mt-4 text-sm text-slate-400">
                Average reduction in local household waste.
              </p>
            </div>
          </div>

          <div className="mt-20 flex justify-center">
            <div className="flex w-full max-w-2xl flex-col items-center gap-6 rounded-2xl border border-white/10 bg-white/5 p-8 backdrop-blur-sm md:flex-row">
              <div className="flex-1 text-center md:text-left">
                <h4 className="mb-1 text-xl font-bold">
                  Ready to start tracking?
                </h4>
                <p className="text-sm text-slate-400">
                  Set up your sustainability dashboard today.
                </p>
              </div>
              <button className="whitespace-nowrap rounded-lg bg-[#2463eb] px-8 py-3 font-bold text-white transition-all hover:bg-blue-700">
                Join Circularly
              </button>
            </div>
          </div>
        </div>
      </section>

      <Footer />

      {/* Optional: Tailwind scrollbar hide helper */}
      <style>{`
        .no-scrollbar::-webkit-scrollbar { display: none; }
        .no-scrollbar { -ms-overflow-style: none; scrollbar-width: none; }
      `}</style>
    </div>
  );
}
