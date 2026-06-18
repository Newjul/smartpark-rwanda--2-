import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { 
  MapPin, 
  Car, 
  Navigation, 
  Target, 
  Rocket, 
  ShieldCheck, 
  ArrowRight, 
  Menu, 
  X,
  ParkingCircle,
  Clock,
  Smartphone,
  DollarSign,
  Info
} from 'lucide-react';
import { PARKING_SLOTS } from './constants';
import { ParkingSlot } from './types';

type Page = 'home' | 'portal';

// The id of the single slot whose availability is fetched live from the backend API.
// This used to be labeled "Kigali Heights" in the API/older code; it now corresponds
// to "UR CST Parking" in PARKING_SLOTS, but the id has stayed "1" on both sides.
const LIVE_SLOT_ID = '1';

export default function App() {
  const [currentPage, setCurrentPage] = useState<Page>('home');
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [selectedSlot, setSelectedSlot] = useState<ParkingSlot | null>(null);
  const [slots, setSlots] = useState<ParkingSlot[]>(PARKING_SLOTS);
  // True until the first fetch attempt (success OR failure) has completed.
  // While true, the live slot's numbers are hidden behind a skeleton instead of
  // showing the static default from constants.ts.
  const [isLiveDataLoading, setIsLiveDataLoading] = useState(true);

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await fetch('https://connecttopark.onrender.com/api/parking/status');
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();

        let fetchedAvailable: number | null = null;

        if (data) {
          if (Array.isArray(data)) {
            const liveSlotData = data.find(item =>
              item && typeof item === 'object' && String(item.id) === LIVE_SLOT_ID
            );
            if (liveSlotData) {
              if (typeof liveSlotData.availableSlots === 'number') fetchedAvailable = liveSlotData.availableSlots;
              else if (typeof liveSlotData.available === 'number') fetchedAvailable = liveSlotData.available;
              else if (typeof liveSlotData.slots_available === 'number') fetchedAvailable = liveSlotData.slots_available;
            }
          } else if (typeof data === 'object') {
            if (typeof data.availableSlots === 'number') fetchedAvailable = data.availableSlots;
            else if (typeof data.available === 'number') fetchedAvailable = data.available;
            else if (typeof data.slots_available === 'number') fetchedAvailable = data.slots_available;
            else if (data.slots && typeof data.slots === 'object') {
              const nested = data.slots[LIVE_SLOT_ID];
              if (nested && typeof nested === 'object') {
                if (typeof nested.availableSlots === 'number') fetchedAvailable = nested.availableSlots;
                else if (typeof nested.available === 'number') fetchedAvailable = nested.available;
              }
            } else {
              for (const key of Object.keys(data)) {
                if (key === LIVE_SLOT_ID && typeof data[key] === 'object' && data[key] !== null) {
                  const nested = data[key];
                  if (typeof nested.availableSlots === 'number') fetchedAvailable = nested.availableSlots;
                  else if (typeof nested.available === 'number') fetchedAvailable = nested.available;
                }
              }
            }
          } else if (typeof data === 'number') {
            fetchedAvailable = data;
          }
        }

        if (fetchedAvailable !== null && !isNaN(fetchedAvailable)) {
          setSlots(prevSlots =>
            prevSlots.map(slot =>
              slot.id === LIVE_SLOT_ID
                ? { ...slot, availableSlots: fetchedAvailable! }
                : slot
            )
          );
        }
      } catch (err) {
        console.error('Error fetching parking status:', err);
      } finally {
        setIsLiveDataLoading(false);
      }
    };

    fetchStatus();
    const interval = setInterval(fetchStatus, 8000);
    return () => clearInterval(interval);
  }, []);

  const currentModalSlot = selectedSlot ? slots.find(s => s.id === selectedSlot.id) || selectedSlot : null;

  const navigateTo = (page: Page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
    setIsMenuOpen(false);
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center cursor-pointer" onClick={() => navigateTo('home')}>
              <ParkingCircle className="h-8 w-8 text-blue-600" />
              <span className="ml-2 text-xl font-bold tracking-tight text-slate-900">ConnectToPark <span className="text-blue-600">Rwanda</span></span>
            </div>
            
            {/* Desktop Nav */}
            <div className="hidden md:flex items-center space-x-8">
              <button onClick={() => navigateTo('home')} className="text-sm font-medium hover:text-blue-600 transition-colors">Home</button>
              <button onClick={() => navigateTo('home')} className="text-sm font-medium hover:text-blue-600 transition-colors">About</button>
              <button 
                onClick={() => navigateTo('portal')}
                className="bg-blue-600 text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-blue-700 transition-all shadow-lg shadow-blue-200"
              >
                Find Parking
              </button>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden">
              <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="p-2">
                {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Nav */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div 
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-white border-b border-slate-200 overflow-hidden"
            >
              <div className="px-4 pt-2 pb-6 space-y-2">
                <button onClick={() => navigateTo('home')} className="block w-full text-left px-3 py-2 text-base font-medium hover:bg-slate-50 rounded-md">Home</button>
                <button onClick={() => navigateTo('home')} className="block w-full text-left px-3 py-2 text-base font-medium hover:bg-slate-50 rounded-md">About</button>
                <button 
                  onClick={() => navigateTo('portal')}
                  className="block w-full text-center bg-blue-600 text-white px-3 py-3 rounded-md text-base font-semibold"
                >
                  Find Parking Now
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>

      <main className="pt-16">
        <AnimatePresence mode="wait">
          {currentPage === 'home' ? (
            <motion.div
              key="home"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
            >
              {/* Hero Section */}
              <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                  <div className="text-center max-w-3xl mx-auto">
                    <motion.div
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      transition={{ delay: 0.2 }}
                      className="inline-flex items-center px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-xs font-bold uppercase tracking-wider mb-6"
                    >
                      <Smartphone className="w-3 h-3 mr-2" />
                      Smart Urban Mobility
                    </motion.div>
                    <h1 className="text-5xl lg:text-7xl font-extrabold text-slate-900 tracking-tight mb-8 leading-tight">
                      Parking Made <span className="text-blue-600">Simple</span> in Kigali.
                    </h1>
                    <p className="text-xl text-slate-600 mb-10 leading-relaxed">
                      Experience the future of urban parking. Find, reserve, and navigate to available parking slots across Rwanda's major cities in real-time.
                    </p>
                    <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
                      <button 
                        onClick={() => navigateTo('portal')}
                        className="w-full sm:w-auto px-8 py-4 bg-blue-600 text-white rounded-2xl font-bold text-lg hover:bg-blue-700 transition-all shadow-xl shadow-blue-200 flex items-center justify-center group"
                      >
                        Get a parking slot now
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </button>
                      <button className="w-full sm:w-auto px-8 py-4 bg-white text-slate-700 border border-slate-200 rounded-2xl font-bold text-lg hover:bg-slate-50 transition-all">
                        Learn More
                      </button>
                    </div>
                  </div>
                </div>
                
                {/* Background Decoration */}
                <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 opacity-10 pointer-events-none">
                  <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-blue-400 rounded-full blur-3xl animate-pulse"></div>
                  <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-600 rounded-full blur-3xl animate-pulse delay-700"></div>
                </div>
              </section>

              {/* Aim, Mission, Goals Section */}
              <section className="py-24 bg-white">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    {/* Aim */}
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="p-8 rounded-3xl bg-slate-50 border border-slate-100"
                    >
                      <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-100">
                        <Rocket className="text-white w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Our Aim</h3>
                      <p className="text-slate-600 leading-relaxed">
                        Revolutionizing parking in Rwanda through smart technology, making urban navigation effortless and stress-free for every driver.
                      </p>
                    </motion.div>

                    {/* Mission */}
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="p-8 rounded-3xl bg-slate-50 border border-slate-100"
                    >
                      <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-100">
                        <Target className="text-white w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Our Mission</h3>
                      <p className="text-slate-600 leading-relaxed">
                        To provide seamless, efficient, and accessible parking solutions for all Rwandans, leveraging IoT and real-time data analytics.
                      </p>
                    </motion.div>

                    {/* Goals */}
                    <motion.div 
                      whileHover={{ y: -5 }}
                      className="p-8 rounded-3xl bg-slate-50 border border-slate-100"
                    >
                      <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg shadow-blue-100">
                        <ShieldCheck className="text-white w-7 h-7" />
                      </div>
                      <h3 className="text-2xl font-bold mb-4">Our Goals</h3>
                      <p className="text-slate-600 leading-relaxed">
                        Reduce traffic congestion, optimize space usage, and enhance urban mobility across Kigali and beyond through intelligent infrastructure.
                      </p>
                    </motion.div>
                  </div>
                </div>
              </section>

              {/* Features Section */}
              <section className="py-24">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                  <div className="flex flex-col lg:flex-row items-center gap-16">
                    <div className="lg:w-1/2">
                      <h2 className="text-4xl font-bold mb-6 leading-tight">Why Choose ConnectToPark?</h2>
                      <div className="space-y-6">
                        {[
                          { icon: <Clock className="w-6 h-6 text-blue-600" />, title: "Real-time Updates", desc: "Get instant information on available slots as they open up." },
                          { icon: <MapPin className="w-6 h-6 text-blue-600" />, title: "Precise Navigation", desc: "Direct integration with Google Maps for turn-by-turn directions." },
                          { icon: <Car className="w-6 h-6 text-blue-600" />, title: "Secure Parking", desc: "Verified parking locations with security monitoring." }
                        ].map((item, i) => (
                          <div key={i} className="flex items-start gap-4">
                            <div className="mt-1 p-2 bg-blue-50 rounded-lg">{item.icon}</div>
                            <div>
                              <h4 className="font-bold text-lg">{item.title}</h4>
                              <p className="text-slate-600">{item.desc}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div className="lg:w-1/2">
                      <div className="relative">
                        <img 
                          src="https://images.unsplash.com/photo-1506521781263-d8422e82f27a?auto=format&fit=crop&q=80&w=1000" 
                          alt="Smart Parking" 
                          className="rounded-3xl shadow-2xl"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute -bottom-6 -left-6 bg-white p-6 rounded-2xl shadow-xl border border-slate-100 hidden sm:block">
                          <div className="flex items-center gap-4">
                            <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center">
                              <Car className="text-green-600 w-6 h-6" />
                            </div>
                            <div>
                              <p className="text-sm text-slate-500 font-medium">Available Now</p>
                              <p className="text-xl font-bold">150+ Slots</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </section>
            </motion.div>
          ) : (
            <motion.div
              key="portal"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12"
            >
              <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 gap-6">
                <div>
                  <button 
                    onClick={() => navigateTo('home')}
                    className="text-blue-600 font-semibold mb-4 flex items-center hover:underline"
                  >
                    ← Back to Home
                  </button>
                  <h2 className="text-4xl font-extrabold tracking-tight">Available Parking Slots</h2>
                  <p className="text-slate-600 mt-2">Real-time availability across Kigali's major hubs.</p>
                </div>
                <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl border border-slate-200 shadow-sm">
                  <div className={`w-2 h-2 rounded-full ${isLiveDataLoading ? 'bg-amber-500' : 'bg-green-500'} animate-pulse`}></div>
                  <span className="text-sm font-medium text-slate-600">
                    {isLiveDataLoading ? 'Connecting to live data...' : 'Live Updates Enabled'}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {slots.map((slot) => {
                  const showSkeleton = slot.id === LIVE_SLOT_ID && isLiveDataLoading;

                  return (
                    <motion.div
                      key={slot.id}
                      layout
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      whileHover={{ y: -8 }}
                      onClick={() => setSelectedSlot(slot)}
                      className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-sm hover:shadow-xl transition-all cursor-pointer group"
                    >
                      <div className="h-48 relative overflow-hidden">
                        <img 
                          src={slot.image} 
                          alt={slot.name} 
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-4 right-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold shadow-sm">
                          {slot.totalSlots} Total Slots
                        </div>
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <span className="bg-white text-slate-900 px-4 py-2 rounded-full text-sm font-bold shadow-lg">View Details</span>
                        </div>
                      </div>
                      <div className="p-6">
                        <div className="flex justify-between items-start mb-4">
                          <div>
                            <h3 className="text-xl font-bold text-slate-900">{slot.name}</h3>
                            <div className="flex items-center text-slate-500 text-sm mt-1">
                              <MapPin className="w-3 h-3 mr-1" />
                              {slot.address}
                            </div>
                          </div>
                          {showSkeleton ? (
                            <div className="w-28 h-7 rounded-lg bg-slate-100 animate-pulse" />
                          ) : (
                            <div className={`px-3 py-1 rounded-lg text-sm font-bold ${
                              slot.availableSlots > 10 ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                            }`}>
                              {slot.availableSlots} Available
                            </div>
                          )}
                        </div>

                        <div className="w-full bg-slate-100 h-2 rounded-full mb-6 overflow-hidden">
                          {showSkeleton ? (
                            <div className="h-full w-full bg-slate-200 animate-pulse rounded-full" />
                          ) : (
                            <motion.div 
                              initial={{ width: 0 }}
                              animate={{ width: `${(slot.availableSlots / slot.totalSlots) * 100}%` }}
                              className={`h-full rounded-full ${
                                slot.availableSlots > 10 ? 'bg-green-500' : 'bg-orange-500'
                              }`}
                            />
                          )}
                        </div>

                        <div className="flex items-center gap-3">
                          <a 
                            href={slot.googleMapsUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            onClick={(e) => e.stopPropagation()}
                            className="flex-1 bg-slate-900 text-white py-3 rounded-xl font-bold flex items-center justify-center hover:bg-slate-800 transition-all group/btn"
                          >
                            <Navigation className="w-4 h-4 mr-2 group-hover/btn:rotate-12 transition-transform" />
                            Directions
                          </a>
                          <button 
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedSlot(slot);
                            }}
                            className="p-3 bg-blue-50 text-blue-600 rounded-xl hover:bg-blue-100 transition-all"
                          >
                            <Info className="w-5 h-5" />
                          </button>
                        </div>
                      </div>
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </main>

      {/* Modal */}
      <AnimatePresence>
        {selectedSlot && currentModalSlot && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSlot(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-sm"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              className="relative bg-white w-full max-w-lg rounded-3xl overflow-hidden shadow-2xl"
            >
              <div className="h-56 relative">
                <img 
                  src={currentModalSlot.image} 
                  alt={currentModalSlot.name} 
                  className="w-full h-full object-cover"
                  referrerPolicy="no-referrer"
                />
                <button 
                  onClick={() => setSelectedSlot(null)}
                  className="absolute top-4 right-4 p-2 bg-white/90 backdrop-blur rounded-full shadow-lg hover:bg-white transition-all"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
              <div className="p-8">
                <div className="flex justify-between items-start mb-6">
                  <div>
                    <h3 className="text-3xl font-extrabold text-slate-900">{currentModalSlot.name}</h3>
                    <p className="text-slate-500 flex items-center mt-1">
                      <MapPin className="w-4 h-4 mr-1" />
                      {currentModalSlot.address}
                    </p>
                  </div>
                  {currentModalSlot.id === LIVE_SLOT_ID && isLiveDataLoading ? (
                    <div className="w-32 h-9 rounded-xl bg-slate-100 animate-pulse" />
                  ) : (
                    <div className={`px-4 py-2 rounded-xl text-sm font-bold ${
                      currentModalSlot.availableSlots > 10 ? 'bg-green-50 text-green-700' : 'bg-orange-50 text-orange-700'
                    }`}>
                      {currentModalSlot.availableSlots} / {currentModalSlot.totalSlots} Slots
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-2 gap-4 mb-8">
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center text-blue-600 mb-2">
                      <Clock className="w-4 h-4 mr-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">Operating Hours</span>
                    </div>
                    <p className="font-bold text-slate-800">{currentModalSlot.operatingHours}</p>
                  </div>
                  <div className="p-4 bg-slate-50 rounded-2xl border border-slate-100">
                    <div className="flex items-center text-blue-600 mb-2">
                      <DollarSign className="w-4 h-4 mr-2" />
                      <span className="text-xs font-bold uppercase tracking-wider">Pricing</span>
                    </div>
                    <p className="font-bold text-slate-800">{currentModalSlot.pricing}</p>
                  </div>
                </div>

                <div className="flex gap-4">
                  <a 
                    href={currentModalSlot.googleMapsUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex-1 bg-blue-600 text-white py-4 rounded-2xl font-bold flex items-center justify-center hover:bg-blue-700 transition-all shadow-lg shadow-blue-100"
                  >
                    <Navigation className="w-5 h-5 mr-2" />
                    Navigate Now
                  </a>
                  <button 
                    onClick={() => setSelectedSlot(null)}
                    className="px-6 py-4 bg-slate-100 text-slate-700 rounded-2xl font-bold hover:bg-slate-200 transition-all"
                  >
                    Close
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Footer */}
      <footer className="bg-slate-900 text-white py-12 mt-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-8">
            <div className="flex items-center">
              <ParkingCircle className="h-8 w-8 text-blue-400" />
              <span className="ml-2 text-xl font-bold tracking-tight">ConnectToPark Rwanda</span>
            </div>
            <div className="flex space-x-8 text-slate-400 text-sm">
              <a href="#" className="hover:text-white transition-colors">Privacy Policy</a>
              <a href="#" className="hover:text-white transition-colors">Terms of Service</a>
              <a href="#" className="hover:text-white transition-colors">Contact Us</a>
            </div>
            <div className="text-slate-500 text-sm">
              © 2026 ConnectToPark Rwanda. All rights reserved.
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}