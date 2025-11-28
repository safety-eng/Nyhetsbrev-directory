import React from 'react';

const Header: React.FC = () => {
  const today = new Date().toLocaleDateString('no-NO', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <header className="pt-12 pb-8 border-b border-gray-200 mb-8">
      <div className="container mx-auto px-4 max-w-3xl text-center">
        <h1 className="text-4xl md:text-5xl font-serif font-bold text-gray-900 tracking-tight mb-2">
          Norsk Oversikt
        </h1>
        <p className="text-sm md:text-base text-gray-500 font-sans uppercase tracking-widest">
          {today}
        </p>
      </div>
    </header>
  );
};

export default Header;