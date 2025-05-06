import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteList from '../components/notes/NoteList';
import { api } from '../services/api.service';
import CreateNote from '../pages/CreateNote';

const NotesListPage = () => {
  const [notes, setNotes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchNotes();
  }, []);

  const fetchNotes = async () => {
    try {
      const response = await api.get('/notes');
      setNotes(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleDelete = async (noteId) => {
    try {
      await api.delete(`/notes/${noteId}`);
      fetchNotes();
    } catch (err) {
      console.error("Delete failed:", err);
    }
  };

  return (
    <div>
      <button
        onClick={() => navigate('/notes/new')}
        style={{
          padding: '10px 20px',
          backgroundColor: '#007bff',
          color: 'white',
          border: 'none',
          borderRadius: '4px',
          cursor: 'pointer',
          marginBottom: '20px'
        }}
      >
        Create Note
      </button>
      <NoteList notes={notes} onDelete={handleDelete} />
    </div>
  );
};

export default NotesListPage;
