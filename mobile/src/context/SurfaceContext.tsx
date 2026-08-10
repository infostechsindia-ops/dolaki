import React, { createContext, useContext, useState, ReactNode } from 'react';
import { CommerceSurface, ColorPalette, getThemeForSurface } from '../constants/theme';

export interface SurfaceContextValue {
  surface: CommerceSurface;
  setSurface: (surface: CommerceSurface) => void;
  theme: ColorPalette;
}

const SurfaceContext = createContext<SurfaceContextValue | undefined>(undefined);

export function SurfaceProvider({ children, initialSurface = 'MARKETPLACE' }: { children: ReactNode; initialSurface?: CommerceSurface }) {
  const [surface, setSurface] = useState<CommerceSurface>(initialSurface);
  const theme = getThemeForSurface(surface);

  return (
    <SurfaceContext.Provider value={{ surface, setSurface, theme }}>
      {children}
    </SurfaceContext.Provider>
  );
}

export function useSurface(): SurfaceContextValue {
  const context = useContext(SurfaceContext);
  if (!context) {
    throw new Error('useSurface must be used within a SurfaceProvider');
  }
  return context;
}
