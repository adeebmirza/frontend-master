import React from 'react';
import Header from '../components/Header';

const MainLayout = ({ children, showHeader }) => {
  return (
    <div className="min-h-screen">
      {showHeader && <Header />}
      <main className={`container mx-auto px-4 ${showHeader ? 'pt-16' : ''}`}>
        {children}
      </main>
    </div>
  );
};

export default MainLayout;
