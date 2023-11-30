import { useState, useEffect } from 'react';
import { Breakpoints } from '../enums';

export const useBreakpoint = () => {

  const [breakpoint, setBreakpoint] = useState<Breakpoints>(Breakpoints.XS);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 576) setBreakpoint(Breakpoints.XS);
      else if (window.innerWidth < 768) setBreakpoint(Breakpoints.SM);
      else if (window.innerWidth < 992) setBreakpoint(Breakpoints.MD);
      else if (window.innerWidth < 1200) setBreakpoint(Breakpoints.LG);
      else if (window.innerWidth < 1400) setBreakpoint(Breakpoints.XL);
      else setBreakpoint(Breakpoints.XL);
    };
    
    window.addEventListener('resize', handleResize);
    
    handleResize();

    return () => window.removeEventListener('resize', handleResize);

  }, []);

  return breakpoint;
}