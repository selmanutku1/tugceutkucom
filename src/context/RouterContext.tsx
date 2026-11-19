import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from 'react';

interface RouterState {
  pathname: string;
  hash: string;
}

interface RouterContextValue extends RouterState {
  navigate: (to: string) => void;
}

const RouterContext = createContext<RouterContextValue>({
  pathname: '/',
  hash: '',
  navigate: () => {},
});

function parseLocation(): RouterState {
  const rawPath = window.location.pathname || '/';
  const normalizedPath =
    rawPath.length > 1 && rawPath.endsWith('/') ? rawPath.slice(0, -1) : rawPath;
  return {
    pathname: normalizedPath,
    hash: window.location.hash || '',
  };
}

export function RouterProvider({ children }: { children: ReactNode }) {
  const [location, setLocation] = useState<RouterState>(() => parseLocation());

  useEffect(() => {
    const handlePopState = () => {
      setLocation(parseLocation());
    };
    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);
    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = useCallback((to: string) => {
    const [rawPath, rawHash] = to.split('#');
    const nextPath = rawPath || '/';
    const nextHash = rawHash ? `#${rawHash}` : '';
    const fullUrl = `${nextPath}${nextHash}`;

    if (window.location.pathname !== nextPath || window.location.hash !== nextHash) {
      window.history.pushState({}, '', fullUrl);
    }
    setLocation({ pathname: nextPath, hash: nextHash });

    if (!nextHash) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  }, []);

  return (
    <RouterContext.Provider value={{ ...location, navigate }}>
      {children}
    </RouterContext.Provider>
  );
}

export function useRouter() {
  return useContext(RouterContext);
}
