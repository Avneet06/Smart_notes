import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import Header from '../components/common/Header';
import NoteForm from '../components/notes/NoteForm';
import Loader from '../components/common/Loader';
import { notesService } from '../services/notesService';

const EditNote: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [note, setNote] = useState<any | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNote = async () => {
      if (!id) return;
      
      try {
        const noteData = await notesService.getNoteById(id);
        setNote(noteData);
      } catch (err: any) {
        setError(err.message || 'Failed to load note');
      } finally {
        setLoading(false);
      }
    };

    fetchNote();
  }, [id]);

  const handleUpdateNote = async (values: { title: string; content: string; tags: string[] }) => {
    if (!id) return;
    return await notesService.updateNote(id, values);
  };

  const handleDeleteNote = async () => {
    if (!id) return;
    return await notesService.deleteNote(id);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <Loader />
      </div>
    );
  }

  if (error || !note) {
    return (
      <div className="min-h-screen bg-gray-50 flex flex-col">
        <Header />
        <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="p-4 bg-red-100 text-red-700 rounded-lg">
            {error || 'Note not found'}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Edit Note</h1>
          <p className="text-gray-600 mt-1">Update your note content or tags</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <NoteForm
            initialValues={{
              title: note.title,
              content: note.content,
              tags: note.tags,
            }}
            onSubmit={handleUpdateNote}
            isEdit={true}
            onDelete={handleDeleteNote}
          />
        </div>
      </main>
    </div>
  );
};

export default EditNote;