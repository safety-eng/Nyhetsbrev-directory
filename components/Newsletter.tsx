import React, { useState } from 'react';

const Newsletter: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'IDLE' | 'SUCCESS'>('IDLE');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Mock API call
    setTimeout(() => {
      setStatus('SUCCESS');
      setEmail('');
    }, 500);
  };

  return (
    <div className="bg-white border border-gray-200 p-8 md:p-12 my-12 text-center rounded-sm">
      <h3 className="font-serif text-2xl text-gray-900 mb-4">
        Hold deg oppdatert
      </h3>
      <p className="text-gray-600 mb-6 max-w-md mx-auto leading-relaxed">
        Få dagens viktigste saker oppsummert rett i innboksen din hver morgen kl. 07:00.
      </p>

      {status === 'SUCCESS' ? (
        <div className="p-4 bg-green-50 text-green-800 text-sm animate-fade-in">
          Takk! Du er nå påmeldt nyhetsbrevet.
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
          <input
            type="email"
            required
            placeholder="Din e-postadresse"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 focus:outline-none focus:border-gray-400 focus:ring-0 transition-colors rounded-sm"
          />
          <button
            type="submit"
            className="px-6 py-3 bg-gray-900 text-white font-medium hover:bg-gray-800 transition-colors rounded-sm tracking-wide text-sm"
          >
            Abonner
          </button>
        </form>
      )}
      <p className="text-xs text-gray-400 mt-4">
        Vi spammer ikke. Meld deg av når som helst.
      </p>
    </div>
  );
};

export default Newsletter;