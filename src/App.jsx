import { useState } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Link, Route, ProtectedRoute } from './component/Router';

const Login = () => {
  const { login, isAuthenticated } = useAuth();
  const [form, setForm] = useState({ username: '', email: '', role: 'user' });

  const handleSubmit = (e) => {
    e.preventDefault();
    login({ ...form, registeredAt: new Date().toISOString() });
  };

  if (isAuthenticated) {
    return <p>Ya has iniciado sesión.</p>;
  }

  return (
    <div>
      <h1>Registro / Inicio de Sesión</h1>
      <form onSubmit={handleSubmit}>
        <input
          placeholder="Nombre de usuario"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          required
        /><br />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
        /><br />
        <select value={form.role} onChange={(e) => setForm({ ...form, role: e.target.value })}>
          <option value="user">Usuario</option>
          <option value="admin">Administrador</option>
        </select><br /><br />
        <button type="submit">Iniciar Sesión</button>
      </form>
    </div>
  );
};

const UserInfo = () => {
  const { user } = useAuth();
  return (
    <div style={{ background: '#e3f2fd', padding: '10px', borderRadius: '8px', marginBottom: '10px' }}>
      <strong>Usuario activo:</strong> {user.username} | <strong>Email:</strong> {user.email} | <strong>Rol:</strong> {user.role}
    </div>
  );
};

const Home = () => {
  const { logout, user } = useAuth();
  return (
    <div>
      <UserInfo />
      <h1>Bienvenido al Home (Protegido)</h1>
      <p>Has iniciado sesión como <strong>{user.username}</strong>.</p>
      <button onClick={logout}>Cerrar Sesión</button>
    </div>
  );
};

const About = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <div>
      <h1>Sobre Nosotros (Público)</h1>
      {isAuthenticated && <UserInfo />}
      <p>Esta página es pública y accesible por todos.</p>
    </div>
  );
};

export default function App() {
  return (
    <AuthProvider>
      <nav>
        <Link href="/login">Login</Link> | <Link href="/home">Home</Link> | <Link href="/about">About</Link>
      </nav>
      <hr />
      <Route path="/login"><Login /></Route>
      <Route path="/about"><About /></Route>
      <ProtectedRoute path="/home"><Home /></ProtectedRoute>
    </AuthProvider>
  );
}