import React, { useState } from 'react';
import { Person } from '../lib/database.types';
import { usePersons } from '../hooks/usePersons';
import PersonCard from './PersonCard';
import PersonForm, { PersonFormData } from './PersonForm';
import Pagination from './Pagination';
import ShareModal from './ShareModal';
import DeleteModal from './DeleteModal';
import { Plus, Search } from 'lucide-react';

export default function PersonDirectory() {
  const {
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
  } = usePersons();

  const [showForm, setShowForm] = useState(false);
  const [editingPerson, setEditingPerson] = useState<Person | null>(null);
  const [sharingPerson, setSharingPerson] = useState<Person | null>(null);
  const [deletingPerson, setDeletingPerson] = useState<Person | null>(null);
  const [formLoading, setFormLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const filteredPersons = persons.filter(person =>
    person.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.address_city.toLowerCase().includes(searchTerm.toLowerCase()) ||
    person.emergency_contact_name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleFormSubmit = async (data: PersonFormData, photoFile?: File) => {
    setFormLoading(true);
    setFormError(null);
    try {
      let photo_url = editingPerson?.photo_url || null;

      if (photoFile) {
        try {
          photo_url = await uploadPhoto(photoFile);
        } catch (uploadError) {
          // Allow form submission without photo if upload fails
          console.warn('Photo upload failed:', uploadError);
          setFormError(uploadError instanceof Error ? uploadError.message : 'Photo upload failed');
          // Continue with form submission without photo
        }
      }

      if (editingPerson) {
        await updatePerson(editingPerson.id, { ...data, photo_url });
      } else {
        await createPerson({ ...data, photo_url });
      }

      setShowForm(false);
      setEditingPerson(null);
      setFormError(null);
    } catch (error) {
      console.error('Error saving person:', error);
      setFormError(error instanceof Error ? error.message : 'Failed to save person');
    } finally {
      setFormLoading(false);
    }
  };

  const handleEdit = (person: Person) => {
    setEditingPerson(person);
    setShowForm(true);
  };

  const handleDelete = async (person: Person) => {
    try {
      await deletePerson(person.id);
      setDeletingPerson(null);
    } catch (error) {
      console.error('Error deleting person:', error);
    }
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setEditingPerson(null);
  };

  if (loading && persons.length === 0) {
    return (
      <div className="flex items-center justify-center min-h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading your directory...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 rounded-md p-4">
        <p className="text-red-700">Error loading persons: {error}</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between space-y-4 sm:space-y-0">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">My Directory</h1>
          <p className="mt-1 text-gray-600">
            {totalCount === 0 ? 'No people' : `${totalCount} ${totalCount === 1 ? 'person' : 'people'}`} in your directory
          </p>
        </div>
        
        <button
          onClick={() => setShowForm(true)}
          className="flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          <Plus className="h-5 w-5" />
          <span>Add Person</span>
        </button>
      </div>

      {/* Search */}
      {totalCount > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search by name, city, or emergency contact..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 block w-full border border-gray-300 rounded-md px-3 py-2 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
        </div>
      )}

      {/* Directory Grid */}
      {filteredPersons.length === 0 && totalCount === 0 ? (
        <div className="text-center py-12">
          <div className="w-24 h-24 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
            <Plus className="h-12 w-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No people yet</h3>
          <p className="text-gray-600 mb-4">Get started by adding your first person to the directory.</p>
          <button
            onClick={() => setShowForm(true)}
            className="inline-flex items-center space-x-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-5 w-5" />
            <span>Add Your First Person</span>
          </button>
        </div>
      ) : filteredPersons.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-gray-600">No people match your search.</p>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPersons.map((person) => (
              <PersonCard
                key={person.id}
                person={person}
                onEdit={handleEdit}
                onDelete={setDeletingPerson}
                onShare={setSharingPerson}
              />
            ))}
          </div>

          {!searchTerm && (
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={fetchPersons}
            />
          )}
        </>
      )}

      {/* Modals */}
      {showForm && (
        <PersonForm
          person={editingPerson || undefined}
          onSubmit={handleFormSubmit}
          onClose={handleCloseForm}
          loading={formLoading}
          error={formError}
        />
      )}

      {sharingPerson && (
        <ShareModal
          person={sharingPerson}
          onClose={() => setSharingPerson(null)}
        />
      )}

      {deletingPerson && (
        <DeleteModal
          person={deletingPerson}
          onConfirm={() => handleDelete(deletingPerson)}
          onCancel={() => setDeletingPerson(null)}
        />
      )}
    </div>
  );
}