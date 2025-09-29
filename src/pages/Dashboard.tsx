import { useState } from 'react';
import { usePerson } from '../hooks/usePerson';
import { Person } from '../types';
import { Header } from '../components/layout/Header';
import { PersonList } from '../components/persons/PersonList';
import { PersonForm } from '../components/persons/PersonForm';

export const Dashboard = () => {
  const { persons, loading, createPerson, updatePerson, deletePerson, refetch } = usePerson();
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);

  const handleCreateNew = () => {
    setEditingPerson(null);
    setIsFormOpen(true);
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setIsFormOpen(true);
  };

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this person entry?')) {
      try {
        await deletePerson(id);
        await refetch();
      } catch (err) {
        console.error('Failed to delete person:', err);
        alert('Failed to delete person');
      }
    }
  };

  const handleFormSubmit = async (data: any) => {
    try {
      if (editingPerson) {
        await updatePerson(editingPerson.id, data);
      } else {
        await createPerson(data);
      }
      setIsFormOpen(false);
      setEditingPerson(null);
      await refetch();
    } catch (err) {
      console.error('Form submission failed:', err);
      throw err;
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Header />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PersonList
          persons={persons}
          onEdit={handleEdit}
          onDelete={handleDelete}
          onCreateNew={handleCreateNew}
          loading={loading}
        />
      </main>

      <PersonForm
        isOpen={isFormOpen}
        onClose={() => {
          setIsFormOpen(false);
          setEditingPerson(null);
        }}
        onSubmit={handleFormSubmit}
        person={editingPerson}
        title={editingPerson ? 'Edit Person' : 'Add New Person'}
      />
    </div>
  );
};