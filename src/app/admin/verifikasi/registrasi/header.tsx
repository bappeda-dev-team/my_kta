import React, { useState } from 'react';

// Main App component
const HeaderRegistrasiKTA = () => {
  // State to track which button is currently active
  const [activeButton, setActiveButton] = useState('home'); // Default active to 'home' or a more general initial state

  // Function called when a navigation button is clicked
  const handleNavClick = (buttonName: any) => {
    setActiveButton(buttonName);
    // You can add further logic here, like routing to different pages
    console.log(`Navigated to: ${buttonName}`);
  };

  return (
    // Main container with flexbox styling for centering and a pleasant background
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-100 flex flex-col items-center justify-start py-8 px-4 sm:px-6 lg:px-8 font-sans">
      {/* Main application header */}
      <header className="w-full max-w-6xl bg-white shadow-xl rounded-2xl p-6 mb-12 border-b-4 border-purple-500">
        <div className="flex flex-col md:flex-row justify-between items-center">
          {/* Main Title/Logo */}

          {/* Navigation Menu */}
          <nav className="flex flex-wrap justify-center gap-4">
            {/* Home button (example) */}
            <button
              className={`px-6 py-3 rounded-xl font-semibold shadow-md transition duration-300 ease-in-out
                ${activeButton === 'home'
                  ? 'bg-blue-600 text-white transform scale-105 ring-2 ring-blue-500 ring-opacity-75'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300'
                }`}
              onClick={() => handleNavClick('home')}
            >
              Beranda
            </button>
          
            {/* "Pelaku Seni" button within the main navigation */}
            <button
              className={`px-6 py-3 rounded-xl font-semibold shadow-md transition duration-300 ease-in-out
                ${activeButton === 'pelakuSeni'
                  ? 'bg-purple-600 text-white transform scale-105 ring-2 ring-purple-500 ring-opacity-75'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300'
                }`}
              onClick={() => handleNavClick('pelakuSeni')}
            >
              Pelaku Seni
            </button>

            {/* "Organisasi" button within the main navigation */}
            <button
              className={`px-6 py-3 rounded-xl font-semibold shadow-md transition duration-300 ease-in-out
                ${activeButton === 'organisasi'
                  ? 'bg-purple-600 text-white transform scale-105 ring-2 ring-purple-500 ring-opacity-75'
                  : 'bg-gray-100 text-gray-800 hover:bg-gray-200 focus:ring-2 focus:ring-gray-300'
                }`}
              onClick={() => handleNavClick('organisasi')}
            >
              Organisasi
            </button>
          </nav>
        </div>
      </header>

      {/* Dynamic content based on active button (optional) */}
      <main className="w-full max-w-4xl bg-white shadow-lg rounded-xl p-8 text-center border-l-4 border-r-4 border-blue-400">
        {activeButton === 'home' && (
          <p className="text-gray-700 text-lg">
            Selamat datang di Sistem Pengajuan. Silakan pilih opsi di navigasi.
          </p>
        )}
        {activeButton === 'pengajuan' && (
          <p className="text-gray-700 text-lg">
            Halaman untuk pengajuan umum. Silakan pilih "Pelaku Seni" atau "Organisasi" untuk pengajuan spesifik.
          </p>
        )}
        {activeButton === 'pelakuSeni' && (
          <p className="text-gray-700 text-lg">
            Anda sedang melihat halaman pengajuan untuk <span className="font-bold text-purple-600">Pelaku Seni</span>.
            Formulir atau informasi terkait akan ditampilkan di sini.
          </p>
        )}
        {activeButton === 'organisasi' && (
          <p className="text-gray-700 text-lg">
            Anda sedang melihat halaman pengajuan untuk <span className="font-bold text-purple-600">Organisasi</span>.
            Formulir atau informasi terkait akan ditampilkan di sini.
          </p>
        )}
      </main>
    </div>
  );
};

export default HeaderRegistrasiKTA;
