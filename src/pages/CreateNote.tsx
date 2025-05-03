import React from 'react';
import Header from '../components/common/Header';
import NoteForm from '../components/notes/NoteForm';
import { notesService } from '../services/notesService';

const CreateNote: React.FC = () => {
  const handleCreateNote = async (values: { title: string; content: string; tags: string[] }) => {
    return await notesService.createNote(values);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">Create New Note</h1>
          <p className="text-gray-600 mt-1">Add a new note to your collection</p>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <NoteForm onSubmit={handleCreateNote} />
        </div>
      </main>
    </div>
  );
};

export default CreateNote;