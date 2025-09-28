import React, { useState, useRef } from 'react';
import { Person } from '../lib/database.types';
import { X, Upload, User, MapPin, Phone } from 'lucide-react';

interface PersonFormProps {
  person?: Person;
  onSubmit: (data: PersonFormData, photoFile?: File) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
  error?: string | null;
}

export interface PersonFormData {
  name: string;
  emergency_contact_name: string;
  emergency_contact_phone: string;
  address_street: string;
  address_city: string;
  address_state: string;
  address_postal_code: string;
  address_country: string;
}

export default function PersonForm({ person, onSubmit, onClose, loading = false, error }: PersonFormProps) {
  const [formData, setFormData] = useState<PersonFormData>({
    name: person?.name || '',
    emergency_contact_name: person?.emergency_contact_name || '',
    emergency_contact_phone: person?.emergency_contact_phone || '',
    address_street: person?.address_street || '',
    address_city: person?.address_city || '',
    address_state: person?.address_state || '',
    address_postal_code: person?.address_postal_code || '',
    address_country: person?.address_country || 'United States',
  });
  
  const [photoFile, setPhotoFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(person?.photo_url || null);
  const [errors, setErrors] = useState<Partial<PersonFormData>>({});
  const fileInputRef = useRef<HTMLInputElement>(null);

  const validateForm = (): boolean => {
    const newErrors: Partial<PersonFormData> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.emergency_contact_name.trim()) {
      newErrors.emergency_contact_name = 'Emergency contact name is required';
    }

    if (!formData.emergency_contact_phone.trim()) {
      newErrors.emergency_contact_phone = 'Emergency contact phone is required';
    } else if (!/^\+?[\d\s\-\(\)]+$/.test(formData.emergency_contact_phone)) {
      newErrors.emergency_contact_phone = 'Please enter a valid phone number';
    }

    if (!formData.address_street.trim()) {
      newErrors.address_street = 'Street address is required';
    }

    if (!formData.address_city.trim()) {
      newErrors.address_city = 'City is required';
    }

    if (!formData.address_state.trim()) {
      newErrors.address_state = 'State is required';
    }

    if (!formData.address_postal_code.trim()) {
      newErrors.address_postal_code = 'Postal code is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleInputChange = (field: keyof PersonFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: undefined }));
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setPhotoFile(file);
      const url = URL.createObjectURL(file);
      setPreviewUrl(url);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    try {
      await onSubmit(formData, photoFile || undefined);
      onClose();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-2xl font-semibold text-gray-900">
            {person ? 'Edit Person' : 'Add New Person'}
          </h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Photo Upload */}
          <div className="space-y-2">
            <label className="block text-sm font-medium text-gray-700">Photo</label>
            <div className="flex items-center space-x-4">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="h-20 w-20 rounded-full object-cover border-2 border-gray-200"
                />
              ) : (
                <div className="h-20 w-20 rounded-full bg-gray-200 flex items-center justify-center border-2 border-gray-200">
                  <User className="h-8 w-8 text-gray-400" />
                </div>
              )}
              
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
              >
                <Upload className="h-4 w-4" />
                <span>Upload Photo</span>
              </button>
              
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handlePhotoChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Personal Information */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <User className="h-5 w-5" />
              <span>Personal Information</span>
            </h3>
            
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700">
                Full Name *
              </label>
              <input
                type="text"
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange('name', e.target.value)}
                className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.name ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Enter full name"
              />
              {errors.name && <p className="mt-1 text-sm text-red-600">{errors.name}</p>}
            </div>
          </div>

          {/* Emergency Contact */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <Phone className="h-5 w-5" />
              <span>Emergency Contact</span>
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="emergency_contact_name" className="block text-sm font-medium text-gray-700">
                  Contact Name *
                </label>
                <input
                  type="text"
                  id="emergency_contact_name"
                  value={formData.emergency_contact_name}
                  onChange={(e) => handleInputChange('emergency_contact_name', e.target.value)}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.emergency_contact_name ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Contact name"
                />
                {errors.emergency_contact_name && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_name}</p>
                )}
              </div>
              
              <div>
                <label htmlFor="emergency_contact_phone" className="block text-sm font-medium text-gray-700">
                  Contact Phone *
                </label>
                <input
                  type="tel"
                  id="emergency_contact_phone"
                  value={formData.emergency_contact_phone}
                  onChange={(e) => handleInputChange('emergency_contact_phone', e.target.value)}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.emergency_contact_phone ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Phone number"
                />
                {errors.emergency_contact_phone && (
                  <p className="mt-1 text-sm text-red-600">{errors.emergency_contact_phone}</p>
                )}
              </div>
            </div>
          </div>

          {/* Address */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900 flex items-center space-x-2">
              <MapPin className="h-5 w-5" />
              <span>Address</span>
            </h3>
            
            <div>
              <label htmlFor="address_street" className="block text-sm font-medium text-gray-700">
                Street Address *
              </label>
              <input
                type="text"
                id="address_street"
                value={formData.address_street}
                onChange={(e) => handleInputChange('address_street', e.target.value)}
                className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                  errors.address_street ? 'border-red-300' : 'border-gray-300'
                }`}
                placeholder="Street address"
              />
              {errors.address_street && <p className="mt-1 text-sm text-red-600">{errors.address_street}</p>}
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label htmlFor="address_city" className="block text-sm font-medium text-gray-700">
                  City *
                </label>
                <input
                  type="text"
                  id="address_city"
                  value={formData.address_city}
                  onChange={(e) => handleInputChange('address_city', e.target.value)}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address_city ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="City"
                />
                {errors.address_city && <p className="mt-1 text-sm text-red-600">{errors.address_city}</p>}
              </div>
              
              <div>
                <label htmlFor="address_state" className="block text-sm font-medium text-gray-700">
                  State *
                </label>
                <input
                  type="text"
                  id="address_state"
                  value={formData.address_state}
                  onChange={(e) => handleInputChange('address_state', e.target.value)}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address_state ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="State"
                />
                {errors.address_state && <p className="mt-1 text-sm text-red-600">{errors.address_state}</p>}
              </div>
              
              <div>
                <label htmlFor="address_postal_code" className="block text-sm font-medium text-gray-700">
                  Postal Code *
                </label>
                <input
                  type="text"
                  id="address_postal_code"
                  value={formData.address_postal_code}
                  onChange={(e) => handleInputChange('address_postal_code', e.target.value)}
                  className={`mt-1 block w-full border rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    errors.address_postal_code ? 'border-red-300' : 'border-gray-300'
                  }`}
                  placeholder="Postal code"
                />
                {errors.address_postal_code && (
                  <p className="mt-1 text-sm text-red-600">{errors.address_postal_code}</p>
                )}
              </div>
            </div>
            
            <div>
              <label htmlFor="address_country" className="block text-sm font-medium text-gray-700">
                Country
              </label>
              <input
                type="text"
                id="address_country"
                value={formData.address_country}
                onChange={(e) => handleInputChange('address_country', e.target.value)}
                className="mt-1 block w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Country"
              />
            </div>
          </div>

          {error && (
            <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4">
              <p className="text-yellow-800 text-sm">{error}</p>
              <p className="text-yellow-700 text-xs mt-1">The person was saved, but photo upload failed.</p>
            </div>
          )}

          {/* Actions */}
          <div className="flex space-x-3 pt-6 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Saving...' : (person ? 'Update Person' : 'Create Person')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}