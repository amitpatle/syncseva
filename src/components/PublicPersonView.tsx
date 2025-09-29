import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { Person } from '../lib/database.types';
import { supabase } from '../lib/supabase';
import { MapPin, Phone, User, Calendar } from 'lucide-react';

// Direct function to get person by share ID for public access
async function getPersonByShareId(shareId: string): Promise<Person | null> {
  try {
    const { data, error } = await supabase
      .from('persons')
      .select('*')
      .eq('public_share_id', shareId)
      .single();

    if (error) {
      console.error('Error fetching person:', error);
      return null;
    }

    return data;
  } catch (error) {
    console.error('Error in getPersonByShareId:', error);
    return null;
  }
}

export default function PublicPersonView() {
  const { shareId } = useParams<{ shareId: string }>();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    const fetchPerson = async () => {
      if (!shareId) {
        setNotFound(true);
        setLoading(false);
        return;
      }

      try {
        const data = await getPersonByShareId(shareId);
        if (data) {
          setPerson(data);
        } else {
          setNotFound(true);
        }
      } catch (error) {
        console.error('Error fetching person:', error);
        setNotFound(true);
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [shareId]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="mt-4 text-gray-600">Loading person information...</p>
        </div>
      </div>
    );
  }

  if (notFound || !person) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <User className="h-16 w-16 text-gray-300 mx-auto mb-4" />
          <h1 className="text-2xl font-bold text-gray-900 mb-2">Person Not Found</h1>
          <p className="text-gray-600">The person you're looking for doesn't exist or the link has expired.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="bg-white shadow-lg rounded-lg overflow-hidden">
          {/* Header */}
          <div className="bg-gradient-to-r from-blue-600 to-blue-700 px-6 py-8">
            <div className="text-center">
              <div className="mb-4">
                {person.photo_url ? (
                  <img
                    src={person.photo_url}
                    alt={person.name}
                    className="w-24 h-24 rounded-full mx-auto object-cover border-4 border-white shadow-lg"
                  />
                ) : (
                  <div className="w-24 h-24 rounded-full mx-auto bg-white shadow-lg flex items-center justify-center border-4 border-white">
                    <User className="h-12 w-12 text-blue-600" />
                  </div>
                )}
              </div>
              <h1 className="text-3xl font-bold text-white">{person.name}</h1>
              <p className="text-blue-100 mt-2">Contact Information</p>
            </div>
          </div>

          {/* Content */}
          <div className="p-6 space-y-6">
            {/* Emergency Contact */}
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-red-800 flex items-center space-x-2 mb-3">
                <Phone className="h-5 w-5" />
                <span>Emergency Contact</span>
              </h2>
              <div className="space-y-2">
                <p className="text-red-700">
                  <span className="font-medium">Name:</span> {person.emergency_contact_name}
                </p>
                <p className="text-red-700">
                  <span className="font-medium">Phone:</span> 
                  <a href={`tel:${person.emergency_contact_phone}`} className="ml-2 hover:underline">
                    {person.emergency_contact_phone}
                  </a>
                </p>
              </div>
            </div>

            {/* Address */}
            <div className="bg-gray-50 border border-gray-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-gray-800 flex items-center space-x-2 mb-3">
                <MapPin className="h-5 w-5" />
                <span>Address</span>
              </h2>
              <div className="text-gray-700">
                <p>{person.address_street}</p>
                <p>{person.address_city}, {person.address_state} {person.address_postal_code}</p>
                <p>{person.address_country}</p>
              </div>
            </div>

            {/* Additional Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h2 className="text-lg font-semibold text-blue-800 flex items-center space-x-2 mb-3">
                <Calendar className="h-5 w-5" />
                <span>Record Information</span>
              </h2>
              <p className="text-blue-700 text-sm">
                Last updated: {new Date(person.updated_at).toLocaleDateString('en-US', {
                  year: 'numeric',
                  month: 'long',
                  day: 'numeric',
                  hour: '2-digit',
                  minute: '2-digit'
                })}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="text-center mt-8">
          <p className="text-sm text-gray-500">
            This is a secure, read-only view of this person's contact information.
          </p>
        </div>
      </div>
    </div>
  );
}