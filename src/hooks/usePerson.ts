import { useState, useEffect } from 'react';
import { supabase, generatePublicLinkId } from '../lib/supabase';
import { Person, CreatePersonData, UpdatePersonData } from '../types';

export const usePerson = () => {
  const [persons, setPersons] = useState<Person[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchPersons = async (page = 1, limit = 10) => {
    try {
      setLoading(true);
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      const from = (page - 1) * limit;
      const to = from + limit - 1;

      const { data, error } = await supabase
        .from('persons')
        .select('*')
        .eq('user_id', user.id)
        .range(from, to)
        .order('created_at', { ascending: false });

      if (error) throw error;
      setPersons(data || []);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'An error occurred');
    } finally {
      setLoading(false);
    }
  };

  const createPerson = async (personData: CreatePersonData): Promise<Person> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let photoUrl = '';
    
    // Upload photo if provided
    if (personData.photo) {
      const fileExt = personData.photo.name.split('.').pop();
      const fileName = `${user.id}/${generatePublicLinkId()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('person-photos')
        .upload(fileName, personData.photo);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('person-photos')
        .getPublicUrl(uploadData.path);
        
      photoUrl = publicUrl;
    }

    const { data, error } = await supabase
      .from('persons')
      .insert({
        name: personData.name,
        photo_url: photoUrl,
        emergency_contact: personData.emergency_contact,
        address: personData.address,
        public_link_id: generatePublicLinkId(),
        user_id: user.id,
      })
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const updatePerson = async (id: string, personData: UpdatePersonData): Promise<Person> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    let photoUrl: string | undefined;
    
    // Upload new photo if provided
    if (personData.photo) {
      const fileExt = personData.photo.name.split('.').pop();
      const fileName = `${user.id}/${generatePublicLinkId()}.${fileExt}`;
      
      const { data: uploadData, error: uploadError } = await supabase.storage
        .from('person-photos')
        .upload(fileName, personData.photo);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('person-photos')
        .getPublicUrl(uploadData.path);
        
      photoUrl = publicUrl;
    }

    const updateData: any = {
      ...(personData.name !== undefined && { name: personData.name }),
      ...(personData.emergency_contact !== undefined && { emergency_contact: personData.emergency_contact }),
      ...(personData.address !== undefined && { address: personData.address }),
      ...(photoUrl && { photo_url: photoUrl }),
      updated_at: new Date().toISOString(),
    };

    const { data, error } = await supabase
      .from('persons')
      .update(updateData)
      .eq('id', id)
      .eq('user_id', user.id)
      .select()
      .single();

    if (error) throw error;
    return data;
  };

  const deletePerson = async (id: string): Promise<void> => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) throw new Error('Not authenticated');

    const { error } = await supabase
      .from('persons')
      .delete()
      .eq('id', id)
      .eq('user_id', user.id);

    if (error) throw error;
  };

  const getPersonByPublicLink = async (publicLinkId: string): Promise<Person | null> => {
    const { data, error } = await supabase
      .from('persons')
      .select('*')
      .eq('public_link_id', publicLinkId)
      .single();

    if (error) return null;
    return data;
  };

  useEffect(() => {
    fetchPersons();
  }, []);

  return {
    persons,
    loading,
    error,
    fetchPersons,
    createPerson,
    updatePerson,
    deletePerson,
    getPersonByPublicLink,
    refetch: fetchPersons,
  };
};