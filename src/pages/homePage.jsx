import React from "react";
import { Route, Routes } from "react-router-dom";
import Header from "../components/header";
import Footer from "../components/footer";
import {
  MdOutlineRecycling,
  MdLaptopMac,
  MdOutlineBuild,
  MdOutlineEco,
  MdHistory,
  MdHandyman,
  MdQueryStats,
  MdShoppingBag,
  MdCheckCircle,
  MdEditNote,
  MdArrowForward,
  MdArrowOutward,
} from "react-icons/md";

export default function HomePage() {
  return (
    <div className="bg-[#f9f9fb] font-sans text-[#1a1c1d] antialiased">
      <Header />

      <div className="w-full h-full">
        <Routes path="/">
          <Route path="/" />
          <Route
            path="/services"
            element={<h1 className="text-3xl font-bold text-primary">Services Page</h1>}
          />
          <Route
            path="/providers"
            element={<h1 className="text-3xl font-bold text-primary">Providers Page</h1>}
          />
          <Route
            path="/impact"
            element={<h1 className="text-3xl font-bold text-primary">Impact Page</h1>}
          />
          <Route
            path="/*"
            element={<h1 className="text-3xl font-bold text-primary">404 Not Found</h1>}
          />
        </Routes>
      </div>

      <main>
        {/* Hero Section */}
        <section className="relative pb-10 overflow-hidden bg-[#f9f9fb]">
          <div className="max-w-7xl mx-auto px-8 grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <div className="z-10">
              
              <h1 className="font-headline text-4xl md:text-6xl font-extrabold text-[#1a1c1d] leading-tight tracking-tight">
                Track, repair and recycle
                <br />
                <span className="text-[#166534]">every product you own.</span>
              </h1>
              <p className="text-[#404940] text-sm md:text-lg max-w-xl mb-4 leading-relaxed">
                ReVolve keeps a simple record of each product you buy - from purchase to repair to
                certified recycling. No spreadsheets, no guesswork, just a clear view of what you
                own and how long it lasts.
              </p>
              <div className="flex flex-wrap items-center gap-3">
                <button className="rounded-xl bg-[#166534] px-7 py-3 font-semibold text-white shadow-md hover:bg-[#0d4428] hover:shadow-lg transition-all">
                  Get started in minutes
                </button>
                <button className="rounded-xl border border-[#cbd5d1] px-7 py-3 text-sm font-semibold text-[#1a1c1d] bg-white hover:bg-[#e8e8ea] transition-all">
                  View how it works
                </button>
              </div>
            </div>

            <div className="relative lg:h-150 flex items-center justify-center">
              {/* Dashboard Preview Card */}
              <div className="relative bg-white/70 backdrop-blur-md rounded-3xl shadow-xl p-8 w-full max-w-lg z-20 border border-white/40">
                <div className="flex items-center justify-between mb-8">
                  <h3 className="font-bold text-xl">Asset Lifecycle</h3>
                  <div className="flex gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500/40"></span>
                    <span className="w-3 h-3 rounded-full bg-[#4edea3]"></span>
                    <span className="w-3 h-3 rounded-full bg-[#004c22]/40"></span>
                  </div>
                </div>
                <div className="space-y-6">
                  <div className="bg-[#f3f3f5] p-4 rounded-2xl flex items-center gap-4">
                    <div className="w-12 h-12 rounded-xl bg-white flex items-center justify-center shadow-sm">
                      <MdLaptopMac className="text-[#004c22] text-2xl" />
                    </div>
                    <div className="flex-1">
                      <p className="text-xs font-bold text-[#004c22] uppercase tracking-wider">
                        MacBook Pro M2
                      </p>
                      <div className="w-full bg-[#e2e2e4] h-2 rounded-full mt-2 overflow-hidden">
                        <div className="bg-[#006c49] h-full w-3/4 rounded-full"></div>
                      </div>
                    </div>
                    <span className="text-xs font-bold text-[#006c49]">75% Healthy</span>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="bg-[#166534] p-4 rounded-2xl text-[#93e0a2]">
                      <MdOutlineBuild className="mb-2 text-xl" />
                      <p className="text-xs font-medium">Next Service</p>
                      <p className="font-bold text-white">Oct 12, 2024</p>
                    </div>
                    <div className="bg-[#6cf8bb] p-4 rounded-2xl text-[#00714d]">
                      <MdOutlineEco className="mb-2 text-xl" />
                      <p className="text-xs font-medium">CO2 Saved</p>
                      <p className="font-bold">14.2 kg</p>
                    </div>
                  </div>
                </div>
              </div>
              {/* Decorative Background Elements */}
              <div className="absolute -top-10 -right-10 w-64 h-64 bg-[#004c22]/10 rounded-full blur-3xl"></div>
              <div className="absolute -bottom-20 -left-20 w-80 h-80 bg-[#006c49]/10 rounded-full blur-3xl"></div>
            </div>
          </div>
        </section>

        {/* Feature Cards Bento Grid */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-8">
            <div className="mb-16">
              <h2 className="text-4xl font-extrabold mb-4">Your lifecycle, in one place</h2>
              <p className="text-[#404940] max-w-2xl">
                See where every product is in its journey - under warranty, due for a service, ready
                to be reused or sent for certified recycling.
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
              <div className="md:col-span-8 bg-[#f3f3f5] rounded-3xl p-10 flex flex-col justify-between group hover:bg-[#e8e8ea] transition-colors">
                <div>
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6">
                    <MdHistory className="text-[#004c22] text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Track product history</h3>
                  <p className="text-[#404940] max-w-md">
                    Keep purchase receipts, warranty details and repair records together so you
                    always know what was done, when and by whom.
                  </p>
                </div>
                <div className="w-full h-48 bg-zinc-200 rounded-2xl mt-8 opacity-60 group-hover:opacity-100 transition-opacity flex items-center justify-center italic text-zinc-500">
                  [Dashboard Illustration]
                </div>
              </div>

              <div className="md:col-span-4 bg-[#004c22] text-white rounded-3xl p-10 flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-white/10 rounded-2xl flex items-center justify-center mb-6">
                    <MdHandyman className="text-white text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Connect to repair centres</h3>
                  <p className="text-[#93e0a2]">
                    Find nearby, vetted providers, compare options and book repairs without long
                    email threads or phone calls.
                  </p>
                </div>
                <button className="mt-8 flex items-center gap-2 font-bold text-[#6ffbbe] hover:gap-4 transition-all">
                  Browse Network <MdArrowForward />
                </button>
              </div>

              <div className="md:col-span-4 bg-[#6cf8bb] text-[#002113] rounded-3xl p-10 flex flex-col justify-between">
                <div>
                  <div className="w-14 h-14 bg-white/20 rounded-2xl flex items-center justify-center mb-6">
                    <MdOutlineRecycling className="text-[#006c49] text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">Certified recycling</h3>
                  <p>
                    When an item really reaches end-of-life, request a pickup and send it to
                    certified facilities instead of landfill.
                  </p>
                </div>
              </div>

              <div className="md:col-span-8 bg-[#f3f3f5] rounded-3xl p-10 flex items-center gap-12 group hover:bg-[#e8e8ea] transition-colors">
                <div className="flex-1">
                  <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center shadow-md mb-6">
                    <MdQueryStats className="text-[#004c22] text-3xl" />
                  </div>
                  <h3 className="text-2xl font-bold mb-4">See your real impact</h3>
                  <p className="text-[#404940]">
                    Simple, honest numbers on how many products you saved, how much CO2 you avoided
                    and how much you kept out of landfill.
                  </p>
                </div>
                <div className="hidden lg:block w-1/3 aspect-square bg-white rounded-full p-8 shadow-lg relative">
                  <div className="w-full h-full border-12 border-[#004c22]/10 rounded-full flex items-center justify-center">
                    <div className="text-center">
                      <p className="text-3xl font-extrabold text-[#004c22]">-42%</p>
                      <p className="text-[10px] uppercase font-bold tracking-widest">Emissions</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Lifecycle Timeline */}
        <section className="py-24 bg-[#f3f3f5]">
          <div className="max-w-7xl mx-auto px-8">
            <div className="text-center mb-20">
              <h2 className="text-4xl font-extrabold mb-4">The Circular Journey</h2>
              <p className="text-[#404940] text-lg">From acquisition to rebirth, we manage every milestone.</p>
            </div>
            <div className="relative">
              <div className="absolute top-1/2 left-0 w-full h-0.5 bg-[#bfc9bd]/30 -translate-y-1/2 hidden md:block"></div>
              <div className="grid grid-cols-1 md:grid-cols-5 gap-8 relative z-10">
                {[
                  { icon: MdShoppingBag, label: "Purchase", desc: "Securely register new assets." },
                  { icon: MdCheckCircle, label: "Use", desc: "Daily monitoring and alerts." },
                  { icon: MdOutlineBuild, label: "Repair", desc: "Certified hardware life extension." },
                  { icon: MdEditNote, label: "Reuse", desc: "Refurbish and redeploy." },
                  { icon: MdOutlineRecycling, label: "Recycle", desc: "Material harvesting." },
                ].map((step, idx) => (
                  <div key={idx} className="text-center group">
                    <div className="w-16 h-16 bg-white rounded-full mx-auto flex items-center justify-center mb-6 shadow-md group-hover:bg-[#004c22] transition-colors border-4 border-[#f3f3f5]">
                      <step.icon className="text-[#004c22] group-hover:text-white text-2xl" />
                    </div>
                    <h4 className="font-bold mb-2">{step.label}</h4>
                    <p className="text-xs text-[#404940]">{step.desc}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* Provider Cards */}
        <section className="py-24 bg-white">
          <div className="max-w-7xl mx-auto px-8">
            <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-4">
              <div>
                <h2 className="text-4xl font-extrabold mb-4">Certified Partners</h2>
                <p className="text-[#404940]">Our curated network of repair and recycling professionals.</p>
              </div>
              <button className="text-[#004c22] font-bold flex items-center gap-2 hover:gap-3 transition-all">
                Apply to Join Network <MdArrowOutward />
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {/* Partner Card 1 */}
              <div className="bg-[#f9f9fb] rounded-2xl p-6 shadow-sm border border-[#bfc9bd]/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center shadow-inner">
                    <MdOutlineBuild className="text-2xl text-zinc-300" />
                  </div>
                  <div>
                    <h4 className="font-bold">TechRestore Pro</h4>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#006c49] animate-pulse"></span>
                      <span className="text-xs text-[#006c49] font-bold uppercase tracking-widest">
                        Certified Repair
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#404940] mb-6">
                  Specializing in enterprise-grade laptop and mobile hardware restoration since 2012.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-[#e8e8ea] rounded text-[10px] font-bold uppercase">
                    Genuine Parts
                  </span>
                  <span className="px-2 py-1 bg-[#e8e8ea] rounded text-[10px] font-bold uppercase">
                    90-Day Warranty
                  </span>
                </div>
              </div>

              {/* Partner Card 2 */}
              <div className="bg-[#f9f9fb] rounded-2xl p-6 shadow-sm border border-[#bfc9bd]/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
                    <MdOutlineRecycling className="text-2xl text-zinc-300" />
                  </div>
                  <div>
                    <h4 className="font-bold">EcoCycle Systems</h4>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#004c22] animate-pulse"></span>
                      <span className="text-xs text-[#004c22] font-bold uppercase tracking-widest">
                        Recycle Platinum
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#404940] mb-6">
                  Global leader in secure data destruction and high-yield material recovery services.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-[#e8e8ea] rounded text-[10px] font-bold uppercase">
                    Zero Landfill
                  </span>
                  <span className="px-2 py-1 bg-[#e8e8ea] rounded text-[10px] font-bold uppercase">
                    R2v3 Certified
                  </span>
                </div>
              </div>

              {/* Partner Card 3 */}
              <div className="bg-[#f9f9fb] rounded-2xl p-6 shadow-sm border border-[#bfc9bd]/10">
                <div className="flex items-center gap-4 mb-6">
                  <div className="w-14 h-14 bg-white rounded-xl flex items-center justify-center">
                    <MdHandyman className="text-2xl text-zinc-300" />
                  </div>
                  <div>
                    <h4 className="font-bold">OmniServe Global</h4>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#8f3e4c] animate-pulse"></span>
                      <span className="text-xs text-[#8f3e4c] font-bold uppercase tracking-widest">
                        Enterprise Support
                      </span>
                    </div>
                  </div>
                </div>
                <p className="text-sm text-[#404940] mb-6">
                  Comprehensive fleet management and onsite maintenance for large-scale deployments.
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="px-2 py-1 bg-[#e8e8ea] rounded text-[10px] font-bold uppercase">
                    Onsite Repair
                  </span>
                  <span className="px-2 py-1 bg-[#e8e8ea] rounded text-[10px] font-bold uppercase">
                    SLA Backed
                  </span>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Impact Stats */}
        <section className="py-24 bg-[#004c22] text-white">
          <div className="max-w-7xl mx-auto px-8">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-12 text-center">
              <div>
                <p className="text-6xl font-extrabold mb-4">1.2M+</p>
                <p className="text-[#8bd79b] text-lg font-medium">Products Saved</p>
                <p className="text-[#93e0a2]/60 text-sm mt-4">
                  Hardware lifespans extended through active monitoring and maintenance.
                </p>
              </div>
              <div>
                <p className="text-6xl font-extrabold mb-4">45k</p>
                <p className="text-[#8bd79b] text-lg font-medium">CO2 Avoided (Tons)</p>
                <p className="text-[#93e0a2]/60 text-sm mt-4">
                  Equivalent to taking 10,000 cars off the road for a full year.
                </p>
              </div>
              <div>
                <p className="text-6xl font-extrabold mb-4">890k</p>
                <p className="text-[#8bd79b] text-lg font-medium">Items Recycled</p>
                <p className="text-[#93e0a2]/60 text-sm mt-4">
                  Materials responsibly harvested and returned to the supply chain.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
