import { useLayoutEffect } from 'react';
import { useLocation, useNavigationType } from 'react-router-dom';

// Persist scroll positions per pathname in-memory (can be switched to sessionStorage)
const positions: Record<string, number> = {};

export default function ScrollManager() {
  const location = useLocation();
  const navType = useNavigationType(); // 'POP' | 'PUSH' | 'REPLACE'

  // Save position before navigation (layout effect runs before paint)
  useLayoutEffect(() => {
    const handleBeforeUnload = () => {
      positions[location.pathname] = window.scrollY || 0;
    };

    // Save current position for this pathname
    positions[location.pathname] = window.scrollY || 0;

    return () => {
      // On unmount, save current scroll position
      positions[location.pathname] = window.scrollY || 0;
      window.removeEventListener('beforeunload', handleBeforeUnload);
    };
  }, [location.pathname]);

  useLayoutEffect(() => {
    // Ensure browser doesn't automatically restore scroll
    if ('scrollRestoration' in window.history) {
      try {
        window.history.scrollRestoration = 'manual';
      } catch (e) {
        // ignore
      }
    }

    // On POP (back/forward), restore saved position if available
    if (navType === 'POP') {
      const y = positions[location.pathname] ?? 0;
      window.scrollTo({ top: y, left: 0, behavior: 'auto' });
      return;
    }

    // On PUSH/REPLACE do NOT force scroll-to-top — keep current position
    // If you want to scroll to top for some routes, add logic here.
  }, [location.key, location.pathname, navType]);

  return null;
}
