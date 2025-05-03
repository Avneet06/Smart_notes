import React, { useState, useEffect } from 'react';
import Header from '../components/common/Header';
import NoteCard from '../components/common/NoteCard';
import { notesService } from '../services/notesService';
import { Search, Filter, Notebook } from 'lucide-react';

const Dashboard: React.FC = () => {
  const [notes, setNotes] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [allTags, setAllTags] = useState<string[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false); // State for dropdown visibility

  const loadNotes = async (reset = false) => {
    const newPage = reset ? 1 : page;
    
    if (reset) {
      setNotes([]);
      setPage(1);
    }
    
    try {
      setLoading(true);
      const response = await notesService.getNotes(newPage, searchTerm, selectedTag);
      
      const newNotes = response.notes;
      const uniqueTags = [...new Set(
        response.notes.flatMap(note => note.tags)
      )].filter(Boolean);
      
      setAllTags(prevTags => {
        const mergedTags = [...prevTags, ...uniqueTags];
        return [...new Set(mergedTags)];
      });
      
      if (reset) {
        setNotes(newNotes);
      } else {
        setNotes(prev => [...prev, ...newNotes]);
      }
      
      setHasMore(response.hasMore);
    } catch (err: any) {
      setError(err.message || 'Failed to load notes');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadNotes(true);
  }, [searchTerm, selectedTag]);

  const handleLoadMore = () => {
    setPage(prev => prev + 1);
    loadNotes();
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    loadNotes(true);
  };

  const handleTagFilter = (tag: string | null) => {
    setSelectedTag(tag);
    setIsDropdownOpen(false); // Close the dropdown when a tag is selected
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      
      <main className="flex-1 container mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-gray-900">My Notes</h1>
          <p className="text-gray-600 mt-1">Manage and organize your notes</p>
        </div>
        
        <div className="mb-6 flex flex-col sm:flex-row justify-between gap-4">
          <form onSubmit={handleSearch} className="w-full sm:w-auto">
            <div className="relative">
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Search notes by title or content"
                className="pl-10 pr-4 py-2 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent w-full md:w-80"
              />
              <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                <Search className="h-4 w-4 text-gray-400" />
              </div>
              <button type="submit" className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600">
                Go
              </button>
            </div>
          </form>
          
          {/* Tag Filter Dropdown */}
          <div className="relative inline-block">
            <button
              className="flex items-center btn-secondary"
              onClick={() => setIsDropdownOpen(!isDropdownOpen)} // Toggle dropdown visibility
            >
              <Filter className="h-4 w-4 mr-1" />
              {selectedTag ? `Tag: ${selectedTag}` : 'All Tags'}
            </button>
            
            {/* Show dropdown only if isDropdownOpen is true */}
            {isDropdownOpen && (
              <div className="absolute z-10 mt-2 w-56 rounded-lg bg-white shadow-lg border border-gray-100">
                <div className="py-1">
                  {/* "All Notes" Option */}
                  <button
                    className={`block px-4 py-2 text-sm w-full text-left ${
                      selectedTag === null ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                    onClick={() => handleTagFilter(null)}
                  >
                    All Notes
                  </button>

                  {/* Display tags */}
                  {allTags.map(tag => (
                    <button
                      key={tag}
                      className={`block px-4 py-2 text-sm w-full text-left ${
                        selectedTag === tag ? 'bg-gray-100 text-gray-900' : 'text-gray-700 hover:bg-gray-50'
                      }`}
                      onClick={() => handleTagFilter(tag)}
                    >
                      {tag}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
        
        {error && (
          <div className="mb-6 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {notes.length > 0 ? (
            notes.map(note => (
              <div key={note._id} className="animate-slide-up">
                <NoteCard note={note} />
              </div>
            ))
          ) : !loading ? (
            <div className="col-span-full flex flex-col items-center justify-center py-12 text-center">
              <div className="bg-gray-100 p-6 rounded-full mb-4">
                <Notebook className="h-12 w-12 text-gray-400" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-1">No notes found</h3>
              <p className="text-gray-600 mb-4 max-w-md">
                {searchTerm || selectedTag
                  ? "Try changing your search or filter criteria"
                  : "Get started by creating your first note"}
              </p>
            </div>
          ) : null}
        </div>
        
        {loading && (
          <div className="flex justify-center my-8">
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-600"></div>
          </div>
        )}
        
        {hasMore && notes.length > 0 && !loading && (
          <div className="flex justify-center mt-8">
            <button
              onClick={handleLoadMore}
              className="btn-secondary"
            >
              Load More
            </button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Dashboard;
