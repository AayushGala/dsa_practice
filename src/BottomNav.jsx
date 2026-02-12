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
      style={{ backgroundColor: 'var(--color-dark-card)', borderTopColor: 'var(--color-dark-border)' }}
      className="fixed bottom-0 left-0 right-0 border-t safe-area-inset-bottom"
    >
      <div className="flex justify-around items-center h-16 md:hidden">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex flex-col items-center justify-center w-full h-full gap-1 transition-colors active:opacity-75 ${
              activeTab === tab.id
                ? 'text-blue-400'
                : 'text-gray-400 hover:text-gray-300'
            }`}
          >
            <span className="text-xl">{tab.icon}</span>
            <span className="text-xs font-medium">{tab.label}</span>
          </button>
        ))}
      </div>
    </nav>
  );
};

export default BottomNav;
