import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Toaster } from 'react-hot-toast';
import { Publications } from './components/Publications';
import { BioSections } from './components/BioSections';
import { TeachingExperiences } from './components/TeachingExperiences';
import { Header } from './components/Header';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      retry: 1,
    },
  },
});

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-50">
        <Header />
        <main className="container mx-auto px-4 py-8 space-y-8">
          <BioSections />
          <Publications />
          <TeachingExperiences />
        </main>
        <Toaster position="top-right" />
      </div>
    </QueryClientProvider>
  );
}

export default App;