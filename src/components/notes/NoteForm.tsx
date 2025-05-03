import React, { useState, FormEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { Trash2, Save, ArrowLeft, Tag as TagIcon } from 'lucide-react';

interface NoteFormProps {
  initialValues?: {
    title: string;
    content: string;
    tags: string[];
  };
  onSubmit: (values: { title: string; content: string; tags: string[] }) => Promise<void>;
  isEdit?: boolean;
  onDelete?: () => Promise<void>;
}

const NoteForm: React.FC<NoteFormProps> = ({
  initialValues = { title: '', content: '', tags: [] },
  onSubmit,
  isEdit = false,
  onDelete,
}) => {
  const [title, setTitle] = useState(initialValues.title);
  const [content, setContent] = useState(initialValues.content);
  const [tags, setTags] = useState<string[]>(initialValues.tags);
  const [tagInput, setTagInput] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const navigate = useNavigate();

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    
    try {
      await onSubmit({ title, content, tags });
      navigate('/dashboard');
    } catch (err: any) {
      setError(err.message || 'Failed to save note');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!onDelete) return;
    
    if (window.confirm('Are you sure you want to delete this note?')) {
      setLoading(true);
      try {
        await onDelete();
        navigate('/dashboard');
      } catch (err: any) {
        setError(err.message || 'Failed to delete note');
      } finally {
        setLoading(false);
      }
    }
  };

  const addTag = () => {
    if (tagInput.trim() && !tags.includes(tagInput.trim())) {
      setTags([...tags, tagInput.trim()]);
      setTagInput('');
    }
  };

  const removeTag = (indexToRemove: number) => {
    setTags(tags.filter((_, index) => index !== indexToRemove));
  };

  const handleTagKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addTag();
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto">
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-800 rounded-lg animate-fade-in">
          {error}
        </div>
      )}
      
      <div className="flex items-center justify-between mb-6">
        <button
          type="button"
          onClick={() => navigate(-1)}
          className="flex items-center text-gray-600 hover:text-gray-900"
        >
          <ArrowLeft className="h-4 w-4 mr-1" />
          Back
        </button>
        
        <div className="flex space-x-3">
          {isEdit && onDelete && (
            <button
              type="button"
              onClick={handleDelete}
              className="flex items-center px-4 py-2 text-red-600 bg-red-50 rounded-lg hover:bg-red-100 transition-colors"
              disabled={loading}
            >
              <Trash2 className="h-4 w-4 mr-1" />
              Delete
            </button>
          )}
          
          <button
            type="submit"
            className="btn-primary flex items-center"
            disabled={loading}
          >
            <Save className="h-4 w-4 mr-1" />
            {loading ? 'Saving...' : 'Save Note'}
          </button>
        </div>
      </div>
      
      <div className="mb-4">
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Note Title"
          className="input text-xl font-semibold"
          required
        />
      </div>
      
      <div className="mb-6">
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          placeholder="Start typing your note here..."
          className="input min-h-[300px]"
          required
        />
      </div>
      
      <div className="mb-6">
        <div className="flex items-center">
          <TagIcon className="h-4 w-4 mr-2 text-gray-500" />
          <label className="block text-sm font-medium text-gray-700">Tags</label>
        </div>
        
        <div className="mt-2 flex flex-wrap gap-2 mb-2">
          {tags.map((tag, index) => (
            <div key={index} className="tag-primary flex items-center">
              {tag}
              <button
                type="button"
                onClick={() => removeTag(index)}
                className="ml-1 text-primary-700 hover:text-primary-900"
              >
                &times;
              </button>
            </div>
          ))}
        </div>
        
        <div className="flex">
          <input
            type="text"
            value={tagInput}
            onChange={(e) => setTagInput(e.target.value)}
            onKeyDown={handleTagKeyDown}
            placeholder="Add a tag (press Enter)"
            className="input"
          />
          <button
            type="button"
            onClick={addTag}
            className="ml-2 btn-secondary"
          >
            Add
          </button>
        </div>
      </div>
    </form>
  );
};

export default NoteForm;