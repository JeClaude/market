import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  behavior?: 'smooth' | 'instant' | 'auto';
  delay?: number;
  offset?: number;
}

const ScrollToTop = ({ 
  behavior = 'smooth', 
  delay = 100,
  offset = 0 
}: ScrollToTopProps) => {
  const { pathname, hash } = useLocation();
  const prevPathname = useRef(pathname);

  useEffect(() => {
    // Check if it's a real navigation (not just hash change on same page)
    const isNewPage = prevPathname.current !== pathname;
    prevPathname.current = pathname;

    const scrollToTop = () => {
      window.scrollTo({
        top: 0,
        left: 0,
        behavior
      });
    };

    const scrollToElement = () => {
      const elementId = hash.replace('#', '');
      const element = document.getElementById(elementId);
      
      if (element) {
        const elementPosition = element.getBoundingClientRect().top + window.scrollY;
        const offsetPosition = elementPosition - offset;

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        });
      } else {
        // If element not found, scroll to top
        scrollToTop();
      }
    };

    // Handle scroll based on navigation type
    if (hash && !isNewPage) {
      // Same page with hash - smooth scroll to element
      setTimeout(scrollToElement, delay);
    } else if (hash && isNewPage) {
      // New page with hash - wait for page load then scroll to element
      setTimeout(scrollToElement, delay + 200);
    } else {
      // New page without hash - scroll to top
      setTimeout(scrollToTop, delay);
    }

    // Cleanup function
    return () => {
      // No cleanup needed for timeouts as they'll be cleared automatically
    };
  }, [pathname, hash, behavior, delay, offset]);

  return null;
};

export default ScrollToTop;