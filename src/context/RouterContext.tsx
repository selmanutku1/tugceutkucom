import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react';

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

function normalizePath(rawPath: string): string {
  const withoutQuery = rawPath.split('?')[0] || '/';
  let decoded = withoutQuery;
  try {
    decoded = decodeURIComponent(withoutQuery);
  } catch {
    decoded = withoutQuery;
  }
  const trimmed = decoded.replace(/\/+$/, '');
  if (!trimmed || trimmed === '/index.html') return '/';
  const lower = trimmed.toLowerCase();
  return lower.startsWith('/') ? lower : `/${lower}`;
}

function parseLocation(): RouterState {
  const rawPath = window.location.pathname || '/';
  return {
    pathname: normalizePath(rawPath),
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
    const nextPath = normalizePath(rawPath || '/');
    const nextHash = rawHash ? `#${rawHash}` : '';
    const fullUrl = `${nextPath}${nextHash}`;
    const currentPath = normalizePath(window.location.pathname);
    const isSamePath = currentPath === nextPath;

    if (!isSamePath || window.location.hash !== nextHash) {
      window.history.pushState({}, '', fullUrl);
    }
    setLocation({ pathname: nextPath, hash: nextHash });

    // For route changes, scroll reset happens inside AnimatePresence onExitComplete
    // so the exiting page never jumps upward mid-transition.
    if (isSamePath && !nextHash) {
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
