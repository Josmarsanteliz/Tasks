import { useState, useEffect } from 'react';
import { ThinkingOrb } from 'thinking-orbs';
import ErrorBoundary from './ErrorBoundary';
import { ShootingStars } from './ShootingStars';
import './App.css';

function App() {
  // Estados de Autenticación
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('operator');
  const [isRegistering, setIsRegistering] = useState(false);

  // Estados originales de tu app
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState([]);
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [tag, setTag] = useState('Frontend');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Cargar tareas desde SQLite cuando el usuario inicia sesión
 const fetchTasks = async () => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${user.id}`); // <-- Agregamos el /${user.id}
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error('Error al cargar tareas del backend:', error);
    }
  };

  useEffect(() => {
    if (user) {
      fetchTasks();
    }
  }, [user]);

  // Loader inicial estricto de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  // Manejar Login / Registro con el Backend de SQLite
  const handleAuth = async (e) => {
    e.preventDefault();
    const endpoint = isRegistering ? '/api/register' : '/api/login';
    
    try {
      const res = await fetch(`http://localhost:5000${endpoint}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.error || 'Ocurrió un error');
      
      setUser(data);
      setEmail('');
      setPassword('');
    } catch (err) {
      alert(err.message);
    }
  };

  const handleAddNote = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim() || !user) return;

    try {
      const res = await fetch('http://localhost:5000/api/tasks', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          title, 
          content, 
          priority, 
          tag, 
          date: 'Today',
          userId: user.id 
        }),
      });
      
      if (res.ok) {
        fetchTasks();
        setTitle('');
        setContent('');
        setIsModalOpen(false);
      }
    } catch (error) {
      console.error('Error al guardar la nota:', error);
    }
  };

  const handleDeleteNote = async (id) => {
    try {
      const res = await fetch(`http://localhost:5000/api/tasks/${id}`, {
        method: 'DELETE',
      });
      if (res.ok) {
        fetchTasks();
      }
    } catch (error) {
      console.error('Error al eliminar nota:', error);
    }
  };

  if (isLoading) {
    return (
      <div className="splash-screen">
        <div className="splash-content">
          <ErrorBoundary>
            <ThinkingOrb state="composing" size={64} theme="dark" />
          </ErrorBoundary>
          <h2>Cargando Workspace...</h2>
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
        </div>
      </div>
    );
  }

  // --- PANTALLA DE LOGIN / REGISTRO (Mantiene tu misma estética oscura) ---
  if (!user) {
    return (
      <div className="app-container" style={{ position: 'relative', zIndex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <ShootingStars />
        <div className="modal-card" style={{ width: '100%', maxWidth: '400px', padding: '30px' }}>
          <h2 style={{ textAlign: 'center', marginBottom: '20px', color: '#fff' }}>
            {isRegistering ? '📝 Registro' : '🔐 Iniciar Sesión'}
          </h2>
          <form onSubmit={handleAuth} className="note-form">
            <input
              type="email"
              placeholder="Correo electrónico..."
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <input
              type="password"
              placeholder="Contraseña..."
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            {isRegistering && (
              <select value={role} onChange={(e) => setRole(e.target.value)}>
                <option value="operator">Operator</option>
                <option value="admin">Admin</option>
              </select>
            )}
            <button type="submit" className="btn-submit" style={{ width: '100%', marginTop: '10px' }}>
              {isRegistering ? 'Registrarse' : 'Entrar'}
            </button>
          </form>
          <button 
            onClick={() => setIsRegistering(!isRegistering)} 
            style={{ background: 'none', border: 'none', color: '#ff7a00', marginTop: '15px', cursor: 'pointer', width: '100%', textAlign: 'center' }}
          >
            {isRegistering ? '¿Ya tienes cuenta? Inicia sesión' : '¿No tienes cuenta? Regístrate'}
          </button>
        </div>
      </div>
    );
  }

  // --- TU TABLERO ORIGINAL DE TASKIFY (Intacto) ---
  return (
    <div className="app-container" style={{ position: 'relative', zIndex: 1 }}>
      <ShootingStars />
      
      <header className="app-header">
        <div className="logo-area">
          <span className="logo-icon">🔥</span>
          <h1>Taskify Orange Dark</h1>
        </div>
        <div style={{ display: 'flex', gap: '15px', alignItems: 'center' }}>
          <span style={{ color: '#aaa', fontSize: '14px' }}>👤 {user.email}</span>
          <button onClick={() => setUser(null)} className="btn-cancel" style={{ padding: '8px 12px', fontSize: '12px' }}>
            Salir
          </button>
          <button onClick={() => setIsModalOpen(true)} className="btn-add">
            + Add task
          </button>
        </div>
      </header>

      {isModalOpen && (
        <div className="modal-overlay">
          <div className="modal-card">
            <h3>Nueva Tarea / Nota</h3>
            <form onSubmit={handleAddNote} className="note-form">
              <input
                type="text"
                placeholder="Título..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
              />
              <textarea
                placeholder="Descripción..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows="3"
              ></textarea>
              <div className="form-row">
                <select value={priority} onChange={(e) => setPriority(e.target.value)}>
                  <option value="High">High</option>
                  <option value="Medium">Medium</option>
                  <option value="Low">Low</option>
                </select>
                <input
                  type="text"
                  placeholder="Etiqueta..."
                  value={tag}
                  onChange={(e) => setTag(e.target.value)}
                />
              </div>
              <div className="modal-actions">
                <button type="button" onClick={() => setIsModalOpen(false)} className="btn-cancel">Cancelar</button>
                <button type="submit" className="btn-submit">Guardar</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="kanban-board">
        <div className="kanban-column">
          <div className="column-header">
            <h3>In Progress</h3>
            <span className="badge-count">{notes.length}</span>
          </div>

          <div className="cards-list">
            {notes.length === 0 ? (
              <p className="empty-text">No hay tareas activas.</p>
            ) : (
              notes.map((note) => (
                <div key={note.id} className="task-card">
                  <div className="card-top-badges">
                    <span className={`priority-badge ${note.priority ? note.priority.toLowerCase() : 'medium'}`}>
                      {note.priority}
                    </span>
                    <span className="time-badge">🕒 {note.date || 'Today'}</span>
                    <span className="tag-badge">{note.tag}</span>
                  </div>

                  <h4>{note.title}</h4>
                  <p>{note.content}</p>

                  <div className="card-footer">
                    <div className="avatar-group">
                      <span className="avatar">JS</span>
                    </div>
                    <div className="card-actions">
                      <button onClick={() => handleDeleteNote(note.id)} title="Eliminar" className="action-btn delete">
                        🗑️
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;