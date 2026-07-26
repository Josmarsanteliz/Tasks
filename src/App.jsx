import { useState, useEffect } from 'react';
import { ThinkingOrb } from 'thinking-orbs';
import ErrorBoundary from './ErrorBoundary';
import { ShootingStars } from './ShootingStars';
import './App.css';

function App() {
  const [isLoading, setIsLoading] = useState(true);
  const [notes, setNotes] = useState([
    { 
      id: 1, 
      title: 'User Flow', 
      content: 'Designing a dashboard involves creating a visual interface that...', 
      priority: 'High', 
      tag: 'UX Design', 
      date: '6:00 PM' 
    },
    { 
      id: 2, 
      title: 'Website Design', 
      content: 'Designing a Website involves creating a visual interface that...', 
      priority: 'Medium', 
      tag: 'Development', 
      date: 'Tomorrow' 
    }
  ]);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [tag, setTag] = useState('Frontend');
  const [isModalOpen, setIsModalOpen] = useState(false);

  // Loader inicial estricto de 3 segundos
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);
    return () => clearTimeout(timer);
  }, []);

  const handleAddNote = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) return;

    const newNote = {
      id: Date.now(),
      title,
      content,
      priority,
      tag,
      date: 'Today'
    };

    setNotes([newNote, ...notes]);
    setTitle('');
    setContent('');
    setIsModalOpen(false);
  };

  const handleDeleteNote = (id) => {
    setNotes(notes.filter(note => note.id !== id));
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

  return (
    <div className="app-container" style={{ position: 'relative', zIndex: 1 }}>
      <ShootingStars /> {/* Fondo de meteoritos en diagonal */}
      
      <header className="app-header">
        <div className="logo-area">
          <span className="logo-icon">🔥</span>
          <h1>Taskify Orange Dark</h1>
        </div>
        <button onClick={() => setIsModalOpen(true)} className="btn-add">
          + Add task
        </button>
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
                    <span className={`priority-badge ${note.priority.toLowerCase()}`}>
                      {note.priority}
                    </span>
                    <span className="time-badge">🕒 {note.date}</span>
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