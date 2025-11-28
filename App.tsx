import React, { useEffect, useState } from 'react';
import Header from './components/Header';
import NewsCard from './components/NewsCard';
import Newsletter from './components/Newsletter';
import SourceList from './components/SourceList';
import { fetchDailyNews } from './services/geminiService';
import { NewsItem, LoadingState } from './types';

const App: React.FC = () => {
  const [news, setNews] = useState<NewsItem[]>([]);
  const [loadingState, setLoadingState] = useState<LoadingState>(LoadingState.IDLE);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    const loadNews = async () => {
      setLoadingState(LoadingState.LOADING);
      try {
        const data = await fetchDailyNews();
        setNews(data);
        setLoadingState(LoadingState.SUCCESS);
      } catch (err) {
        console.error(err);
        setLoadingState(LoadingState.ERROR);
        setErrorMsg("Klarte ikke å hente nyhetene akkurat nå. Vennligst prøv igjen senere.");
      }
    };

    loadNews();
  }, []);

  return (
    <div className="min-h-screen bg-stone-50 font-sans text-stone-900 selection:bg-stone-200">
      <Header />

      <main className="container mx-auto px-4 max-w-3xl pb-20">
        
        {/* Loading State */}
        {loadingState === LoadingState.LOADING && (
          <div className="py-20 flex flex-col items-center justify-center space-y-4">
            <div className="w-12 h-12 border-4 border-gray-200 border-t-gray-800 rounded-full animate-spin"></div>
            <p className="text-gray-500 animate-pulse">Henter dagens overskrifter...</p>
          </div>
        )}

        {/* Error State */}
        {loadingState === LoadingState.ERROR && (
          <div className="py-12 text-center text-red-800 bg-red-50 rounded-sm border border-red-100 p-8">
            <p>{errorMsg}</p>
            <button 
              onClick={() => window.location.reload()}
              className="mt-4 underline hover:no-underline text-red-900"
            >
              Last inn på nytt
            </button>
          </div>
        )}

        {/* Content */}
        {loadingState === LoadingState.SUCCESS && (
          <div className="animate-fade-in-up">
            <div className="bg-white shadow-sm border border-gray-200 px-6 md:px-12 py-4 rounded-sm">
              {news.length === 0 ? (
                <p className="text-center py-10 text-gray-500">
                  Ingen store nyheter funnet for øyeblikket.
                </p>
              ) : (
                news.map((item, index) => (
                  <NewsCard key={index} item={item} />
                ))
              )}
            </div>
            
            {news.length > 0 && <SourceList sources={news[0].sources} />}
          </div>
        )}

        <Newsletter />

      </main>

      <footer className="border-t border-gray-200 py-8 text-center text-gray-400 text-sm">
        <p>&copy; {new Date().getFullYear()} Norsk Oversikt.</p>
        <p className="mt-2 text-xs">Drevet av Google Gemini. Innhold hentet fra offentlig tilgjengelige kilder.</p>
      </footer>
    </div>
  );
};

export default App;