import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// This component's sole purpose is to scroll the window to the top on every route change.
export default function ScrollToTop() {
  // The `useLocation` hook returns the current location object (URL information).
  const { pathname } = useLocation();

  // The `useEffect` hook will run every time the `pathname` changes.
  useEffect(() => {
    // This command scrolls the window to the very top left of the page.
    window.scrollTo(0, 0);
  }, [pathname]); // The dependency array ensures this effect runs ONLY when the URL path changes.

  // This component does not render any visible HTML.
  return null;
}