import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';

export const Link = ({ href, children }) => {
  const onClick = (e) => {
    if (e.metaKey || e.ctrlKey) return;
    e.preventDefault();
    window.history.pushState({}, "", href);
    window.dispatchEvent(new PopStateEvent("popstate"));
  };
  return <a href={href} onClick={onClick} style={{ margin: '0 10px' }}>{children}</a>;
};

export const Route = ({ path, children }) => {
  const [currentPath, setCurrentPath] = useState(window.location.pathname);
  useEffect(() => {
    const onLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", onLocationChange);
    return () => window.removeEventListener("popstate", onLocationChange);
  }, []);
  return currentPath === path ? children : null;
};

export const ProtectedRoute = ({ path, children }) => {
  const { isAuthenticated } = useAuth();
  const [currentPath, setCurrentPath] = useState(window.location.pathname);

  useEffect(() => {
    const onLocationChange = () => setCurrentPath(window.location.pathname);
    window.addEventListener("popstate", onLocationChange);
    return () => window.removeEventListener("popstate", onLocationChange);
  }, []);

  if (currentPath !== path) return null;
  // Si no está logueado, protegemos la ruta
  return isAuthenticated ? children : <div style={{padding: '20px'}}><h2>Acceso Denegado</h2><Link href="/login">Ir al Login</Link></div>;
};