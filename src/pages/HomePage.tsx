

import { useEffect } from 'react';

export default function HomePage() {
  useEffect(() => {
    document.body.style.scrollBehavior = 'smooth';
    return () => { document.body.style.scrollBehavior = ''; };
  }, []);

  // Smooth scroll for nav links
  useEffect(() => {
    const handler = (e) => {
      const href = e.target.getAttribute('href');
      if (href && href.startsWith('#')) {
        e.preventDefault();
        const el = document.querySelector(href);
        if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    };
    document.querySelectorAll('.nav-link').forEach(link => {
      link.addEventListener('click', handler);
    });
    return () => {
      document.querySelectorAll('.nav-link').forEach(link => {
        link.removeEventListener('click', handler);
      });
    };
  }, []);

  return (
    <div className="antialiased text-gray-800 bg-[#f7f9fc]">
      {/* Header & Navigation */}
      <header className="bg-white shadow-md sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 flex justify-between items-center">
          <div className="flex items-center space-x-2">
            {/* SyncSeva Icon (SVG) */}
            <svg className="w-8 h-8 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path>
            </svg>
            <span className="text-2xl font-extrabold text-gray-900">Sync<span className="text-blue-500">Seva</span></span>
          </div>
          <nav className="hidden md:flex space-x-6 font-medium">
            <a href="#home" className="nav-link text-gray-600 hover:text-blue-500 transition duration-300">Home</a>
            <a href="#how-it-works" className="nav-link text-gray-600 hover:text-blue-500 transition duration-300">How It Works</a>
            <a href="#features" className="nav-link text-gray-600 hover:text-blue-500 transition duration-300">Features</a>
            <a href="#contact" className="nav-link text-gray-600 hover:text-blue-500 transition duration-300">Contact</a>
          </nav>
          <a href="/dashboard" className="hidden sm:inline-block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-300 shadow-lg hover:shadow-xl">Get Started</a>
        </div>
      </header>

      {/* Hero Section */}
      <section id="home" className="bg-gradient-to-br from-blue-900 to-blue-500 text-white pt-16 pb-24 sm:pt-24 sm:pb-32 hero-background">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h1 className="text-4xl sm:text-6xl font-extrabold leading-tight mb-4">
            Secure Every Devotee. <br className="hidden sm:inline" /> Instant ID for Mega Events.
          </h1>
          <p className="text-xl sm:text-2xl font-light opacity-90 mb-8 max-w-3xl mx-auto">
            Introducing SyncSeva, the durable Tyvek band with integrated QR code technology, designed for rapid identification of missing persons at the Mahakumbh.
          </p>
          <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-6">
            <a href="#how-it-works" className="nav-link inline-flex items-center justify-center bg-white text-blue-500 font-bold py-3 px-8 rounded-xl transition duration-300 hover:ring-4 ring-white/50 text-lg shadow-lg">
              Discover Security
            </a>
            <a href="/dashboard" className="inline-flex items-center justify-center border-2 border-white text-white font-semibold py-3 px-8 rounded-xl transition duration-300 hover:bg-white/10 text-lg">Get Started</a>
          </div>
          <div className="mt-16">
            <img src="https://placehold.co/600x300/3b82f6/ffffff?text=SyncSeva+QR+Band+Mockup" alt="Illustration of a Tyvek wristband with a QR code" className="mx-auto rounded-xl shadow-2xl transition duration-500 hover:scale-[1.03] w-full max-w-sm sm:max-w-lg object-cover" />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-16 sm:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center mb-4 text-gray-900">How SyncSeva Protects</h2>
          <p className="text-xl text-center text-gray-600 mb-16 max-w-3xl mx-auto">
            Simple, robust, and immediate. Our system bridges the gap between the lost and their loved ones in high-density environments.
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            <div className="text-center p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full inline-flex items-center justify-center mx-auto mb-4 font-bold text-xl">1</div>
              <h3 className="text-2xl font-semibold mb-3">Secure Registration</h3>
              <p className="text-gray-600">Each attendee is issued a durable, non-transferable Tyvek band linked to their profile (emergency contact, medical notes) in our secure database.</p>
            </div>
            <div className="text-center p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full inline-flex items-center justify-center mx-auto mb-4 font-bold text-xl">2</div>
              <h3 className="text-2xl font-semibold mb-3">Instant QR Scan</h3>
              <p className="text-gray-600">If a person is found alone or lost, authorized personnel instantly scan the band's QR code using a standard smartphone.</p>
            </div>
            <div className="text-center p-6 rounded-xl shadow-lg hover:shadow-xl transition duration-300 border border-gray-100">
              <div className="w-12 h-12 bg-blue-500/10 text-blue-500 rounded-full inline-flex items-center justify-center mx-auto mb-4 font-bold text-xl">3</div>
              <h3 className="text-2xl font-semibold mb-3">Rapid Reunion</h3>
              <p className="text-gray-600">The scan provides the emergency contact details, enabling immediate, private, and efficient coordination for a safe reunion.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16 sm:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-4xl font-extrabold text-center mb-12 text-gray-900">Built for Scale and Reliability</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500 transform hover:scale-[1.02] transition duration-300">
              <div className="text-3xl text-blue-500 mb-3">🛡</div>
              <h3 className="text-xl font-semibold mb-2">Extreme Durability</h3>
              <p className="text-gray-600">Made from Tyvek, the band is water-proof, tear-resistant, and can withstand harsh weather conditions typical of a large outdoor gathering.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500 transform hover:scale-[1.02] transition duration-300">
              <div className="text-3xl text-blue-500 mb-3">📱</div>
              <h3 className="text-xl font-semibold mb-2">Scan & Go Technology</h3>
              <p className="text-gray-600">High-contrast, high-readability QR codes ensure fast and accurate scanning even under suboptimal lighting and with older devices.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500 transform hover:scale-[1.02] transition duration-300">
              <div className="text-3xl text-blue-500 mb-3">🔒</div>
              <h3 className="text-xl font-semibold mb-2">Privacy Focused</h3>
              <p className="text-gray-600">No personal data is stored on the band. The QR code links to a secure, encrypted portal accessible only by authorized officials.</p>
            </div>
            <div className="bg-white p-6 rounded-xl shadow-md border-t-4 border-blue-500 transform hover:scale-[1.02] transition duration-300">
              <div className="text-3xl text-blue-500 mb-3">📶</div>
              <h3 className="text-xl font-semibold mb-2">Minimal Connectivity</h3>
              <p className="text-gray-600">Designed to be minimally reliant on network infrastructure, ensuring functionality even in congested or poor signal areas.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer id="contact" className="bg-gray-900 text-white py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 grid grid-cols-1 md:grid-cols-3 gap-8 text-center md:text-left">
          <div>
            <span className="text-3xl font-extrabold text-white">Sync<span className="text-blue-500">Seva</span></span>
            <p className="mt-4 text-gray-400 text-sm max-w-xs">
              Committed to safety and efficiency, we ensure peace of mind for event organizers and attendees across large-scale gatherings.
            </p>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-500">Quick Links</h4>
            <ul className="space-y-2 text-gray-400">
              <li><a href="#home" className="nav-link hover:text-white transition duration-200">Home</a></li>
              <li><a href="#how-it-works" className="nav-link hover:text-white transition duration-200">How It Works</a></li>
              <li><a href="#features" className="nav-link hover:text-white transition duration-200">Our Technology</a></li>
            </ul>
          </div>
          <div>
            <h4 className="text-lg font-semibold mb-4 text-blue-500">Get In Touch</h4>
            <p className="text-gray-400">
              Email: <a href="mailto:info@syncseva.app" className="hover:text-white transition duration-200">info@syncseva.app</a>
            </p>
            <p className="text-gray-400">
              Phone: <a href="tel:+919876543210" className="hover:text-white transition duration-200">+91 9876 543 210</a>
            </p>
            <p className="mt-4 text-gray-500 text-sm">
              © 2025 SyncSeva. All rights reserved.
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
}
