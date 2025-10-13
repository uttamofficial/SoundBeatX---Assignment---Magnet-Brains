import { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { PageLoader } from './PageLoader';

export function RouteLoader() {
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const location = useLocation();

  useEffect(() => {
    // Show loader when route changes
    setLoading(true);
    setProgress(0);

    // Simulate progress
    const progressInterval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) return prev;
        return prev + 10;
      });
    }, 50);

    // Complete loading after minimum time
    const timer = setTimeout(() => {
      setProgress(100);
      setTimeout(() => {
        setLoading(false);
      }, 200);
    }, 600);

    return () => {
      clearTimeout(timer);
      clearInterval(progressInterval);
    };
  }, [location.pathname]);

  return (
    <>
      {/* Top Progress Bar */}
      {loading && (
        <div className="fixed top-0 left-0 right-0 z-[60] h-1 bg-red-100">
          <div
            className="h-full bg-gradient-to-r from-red-600 via-orange-500 to-yellow-500 transition-all duration-300 ease-out"
            style={{ width: `${progress}%` }}
          />
        </div>
      )}
      
      {/* Full Screen Loader */}
      <AnimatePresence mode="wait">
        {loading && <PageLoader />}
      </AnimatePresence>
    </>
  );
}
