import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  import.meta.env.VITE_SUPABASE_URL,
  import.meta.env.VITE_SUPABASE_ANON_KEY
);

export const notesService = {
  async getNotes(page = 1, searchTerm = '', selectedTag: string | null = null) {
    const pageSize = 9;
    const start = (page - 1) * pageSize;
    const end = start + pageSize - 1;

    let query = supabase
      .from('notes')
      .select('*', { count: 'exact' })
      .order('created_at', { ascending: false })
      .range(start, end);

    if (searchTerm) {
      query = query.or(`title.ilike.%${searchTerm}%,content.ilike.%${searchTerm}%`);
    }

    if (selectedTag) {
      query = query.contains('tags', [selectedTag]);
    }

    const { data: notes, error, count } = await query;

    if (error) {
      throw new Error(error.message);
    }

    return {
      notes: notes || [],
      hasMore: count ? count > (page * pageSize) : false
    };
  },

  async getNoteById(id: string) {
    const { data: note, error } = await supabase
      .from('notes')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      throw new Error(error.message);
    }

    if (!note) {
      throw new Error('Note not found');
    }

    return note;
  },

  async createNote({ title, content, tags }: { title: string; content: string; tags: string[] }) {
    const { data: session } = await supabase.auth.getSession();
    
    if (!session?.session?.user) {
      throw new Error('You must be logged in to create notes');
    }

    const { data, error } = await supabase
      .from('notes')
      .insert([
        {
          title,
          content,
          tags,
          user_id: session.session.user.id
        }
      ])
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async updateNote(id: string, { title, content, tags }: { title: string; content: string; tags: string[] }) {
    const { data, error } = await supabase
      .from('notes')
      .update({ title, content, tags })
      .eq('id', id)
      .select()
      .single();

    if (error) {
      throw new Error(error.message);
    }

    return data;
  },

  async deleteNote(id: string) {
    const { error } = await supabase
      .from('notes')
      .delete()
      .eq('id', id);

    if (error) {
      throw new Error(error.message);
    }
  }
};