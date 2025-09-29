import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { Person, PersonInsert, PersonUpdate } from '../lib/database.types';
import { useAuth } from '../contexts/AuthContext';

const ITEMS_PER_PAGE = 12;

export function usePersons() {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const { user } = useAuth();

  const totalPages = Math.ceil(totalCount / ITEMS_PER_PAGE);

  const fetchPersons = async (page: number = 1) => {
    if (!user) return;

    setLoading(true);
    setError(null);

    try {
      const start = (page - 1) * ITEMS_PER_PAGE;
      const end = start + ITEMS_PER_PAGE - 1;

      const { data, error, count } = await supabase
        .from('persons')
        .select('*', { count: 'exact' })
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })
        .range(start, end);

      if (error) throw error;

      setPersons(data || []);
      setTotalCount(count || 0);
      setCurrentPage(page);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createPerson = async (personData: Omit<PersonInsert, 'user_id'>) => {
    if (!user) throw new Error('User not authenticated');

    const { data, error } = await supabase
      .from('persons')
      .insert({
        ...personData,
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;

    await fetchPersons(currentPage);
    return data;
  };

  const updatePerson = async (id: string, updates: PersonUpdate) => {
    const { data, error } = await supabase
      .from('persons')
      .update(updates)
      .eq('id', id)
      .eq('user_id', user?.id)
      .select()
      .single();

    if (error) throw error;

    await fetchPersons(currentPage);
    return data;
  };

  const deletePerson = async (id: string) => {
    const { error } = await supabase
      .from('persons')
      .delete()
      .eq('id', id)
      .eq('user_id', user?.id);

    if (error) throw error;

    await fetchPersons(currentPage);
  };

  const uploadPhoto = async (file: File): Promise<string> => {
    if (!user) throw new Error('User not authenticated');

    // Check if storage bucket exists, if not, return null to allow form submission without photo
    try {
      const { data: buckets, error: bucketsError } = await supabase.storage.listBuckets();
      if (bucketsError || !buckets?.some(bucket => bucket.name === 'person-photos')) {
        console.warn('Storage bucket "person-photos" not found. Photo upload skipped.');
        throw new Error('Photo storage is not configured. Please contact support or try again later.');
      }
    } catch (error) {
      throw new Error('Photo storage is not available. Please try again later.');
    }
    const fileExt = file.name.split('.').pop();
    const fileName = `${user.id}/${Date.now()}.${fileExt}`;

    try {
      const { error: uploadError } = await supabase.storage
        .from('person-photos')
        .upload(fileName, file);

      if (uploadError) throw uploadError;

      const { data } = supabase.storage
        .from('person-photos')
        .getPublicUrl(fileName);

      return data.publicUrl;
    } catch (error) {
      throw new Error('Failed to upload photo. Please try again.');
    }
  };

  useEffect(() => {
    if (user) {
      fetchPersons();
    }
  }, [user]);

  return {
    persons,
    loading,
    error,
    currentPage,
    totalPages,
    totalCount,
    fetchPersons,
    createPerson,
    updatePerson,
    deletePerson,
    uploadPhoto,
  };
}