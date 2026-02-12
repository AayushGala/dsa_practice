import React from 'react';

const BottomNav = ({ activeTab, setActiveTab }) => {
  const tabs = [
    { id: 'home', label: 'Home', icon: '🏠' },
    { id: 'progress', label: 'Progress', icon: '📊' },
    { id: 'favorites', label: 'Favorites', icon: '⭐' },
    { id: 'settings', label: 'Settings', icon: '⚙️' },
  ];

  return (
    <nav
      style={{ 
        backgroundColor: 'rgba(10, 10, 10, 0.95)',
        borderTopColor: 'rgba(58, 58, 58, 0.3)',
        backdropFilter: 'blur(10px)'
      }}
      className="fixed bottom-0 left-0 right-0 border-t safe-area-inset-bottom"
    >
      <div className="flex justify-around items-center h-20 md:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full gap-1.5 transition-all duration-300 active:scale-95 ${
              activeTab === tab.id
                ? 'text-gray-200'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span className={`text-2xl transition-transform ${activeTab === tab.id ? 'scale-110' : ''}`}>{tab.icon}</span>
            <span className={`text-xs font-semibold ${activeTab === tab.id ? 'text-gray-200' : 'text-gray-400'}`}>{tab.label}</span>
            {activeTab === tab.id && (
              <div className="absolute bottom-1 w-1.5 h-1.5 rounded-full bg-gray-400"></div>
            )}
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
