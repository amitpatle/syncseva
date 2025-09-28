import React from 'react';
import { Person } from '../lib/database.types';
import { CreditCard as Edit2, Trash2, Share2, MapPin, Phone } from 'lucide-react';

interface PersonCardProps {
  person: Person;
  onEdit: (person: Person) => void;
  onDelete: (person: Person) => void;
  onShare: (person: Person) => void;
}

export default function PersonCard({ person, onEdit, onDelete, onShare }: PersonCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-shadow duration-200">
      <div className="aspect-w-16 aspect-h-12 bg-gray-200">
        {person.photo_url ? (
          <img
            src={person.photo_url}
            alt={person.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <div className="w-16 h-16 bg-blue-300 rounded-full flex items-center justify-center">
              <span className="text-2xl font-semibold text-blue-700">
                {person.name.charAt(0).toUpperCase()}
              </span>
            </div>
          </div>
        )}
      </div>
      
      <div className="p-6">
        <div className="mb-4">
          <h3 className="text-xl font-semibold text-gray-900 mb-2">{person.name}</h3>
          
          <div className="space-y-2 text-sm text-gray-600">
            <div className="flex items-start space-x-2">
              <MapPin className="h-4 w-4 mt-0.5 text-gray-400 flex-shrink-0" />
              <span>
                {person.address_street}, {person.address_city}, {person.address_state} {person.address_postal_code}
              </span>
            </div>
            
            <div className="flex items-center space-x-2">
              <Phone className="h-4 w-4 text-gray-400 flex-shrink-0" />
              <span>
                Emergency: {person.emergency_contact_name} ({person.emergency_contact_phone})
              </span>
            </div>
          </div>
        </div>
        
        <div className="flex space-x-2">
          <button
            onClick={() => onEdit(person)}
            className="flex-1 flex items-center justify-center space-x-1 px-3 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors text-sm"
          >
            <Edit2 className="h-4 w-4" />
            <span>Edit</span>
          </button>
          
          <button
            onClick={() => onShare(person)}
            className="flex items-center justify-center px-3 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
          >
            <Share2 className="h-4 w-4" />
          </button>
          
          <button
            onClick={() => onDelete(person)}
            className="flex items-center justify-center px-3 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
          >
            <Trash2 className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
}