import { useState, useRef } from 'react';
import { Person, CreatePersonData, UpdatePersonData, PersonFormErrors, Medication } from '../../types';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Upload, X, Plus, Trash2 } from 'lucide-react';

interface PersonFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: CreatePersonData | UpdatePersonData) => Promise<void>;
  person?: Person | null;
  title: string;
}

export const PersonForm = ({ isOpen, onClose, onSubmit, person, title }: PersonFormProps) => {
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<PersonFormErrors>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(
    person?.photo_url || null
  );
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [formData, setFormData] = useState({
    name: person?.name || '',
    emergency_contact: person?.emergency_contact || '',
    address: {
      street: (person?.address as any)?.street || '',
      city: (person?.address as any)?.city || '',
      state: (person?.address as any)?.state || '',
      zip_code: (person?.address as any)?.zip_code || '',
      country: (person?.address as any)?.country || '',
    },
    medical_info: {
      blood_type: (person?.medical_info as any)?.blood_type || '',
      allergies: (person?.medical_info as any)?.allergies || [],
      medical_conditions: (person?.medical_info as any)?.medical_conditions || [],
      medications: (person?.medical_info as any)?.medications || [],
      emergency_medical_info: (person?.medical_info as any)?.emergency_medical_info || '',
      healthcare_provider: {
        name: (person?.medical_info as any)?.healthcare_provider?.name || '',
        phone: (person?.medical_info as any)?.healthcare_provider?.phone || '',
        address: (person?.medical_info as any)?.healthcare_provider?.address || '',
        specialty: (person?.medical_info as any)?.healthcare_provider?.specialty || '',
      },
      insurance_info: {
        provider: (person?.medical_info as any)?.insurance_info?.provider || '',
        policy_number: (person?.medical_info as any)?.insurance_info?.policy_number || '',
        group_number: (person?.medical_info as any)?.insurance_info?.group_number || '',
        contact_phone: (person?.medical_info as any)?.insurance_info?.contact_phone || '',
      },
      medical_notes: (person?.medical_info as any)?.medical_notes || '',
      date_of_birth: (person?.medical_info as any)?.date_of_birth || '',
      height: (person?.medical_info as any)?.height || '',
      weight: (person?.medical_info as any)?.weight || '',
      organ_donor: (person?.medical_info as any)?.organ_donor || false,
    },
    photo: null as File | null,
  });

  const validateForm = (): PersonFormErrors => {
    const newErrors: PersonFormErrors = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }

    if (!formData.emergency_contact.trim()) {
      newErrors.emergency_contact = 'Emergency contact is required';
    }

    const addressErrors: any = {};
    if (!formData.address.street.trim()) addressErrors.street = 'Street is required';
    if (!formData.address.city.trim()) addressErrors.city = 'City is required';
    if (!formData.address.state.trim()) addressErrors.state = 'State is required';
    if (!formData.address.zip_code.trim()) addressErrors.zip_code = 'ZIP code is required';
    if (!formData.address.country.trim()) addressErrors.country = 'Country is required';

    if (Object.keys(addressErrors).length > 0) {
      newErrors.address = addressErrors;
    }

    return newErrors;
  };

  const addAllergy = () => {
    setFormData(prev => ({
      ...prev,
      medical_info: {
        ...prev.medical_info,
        allergies: [...prev.medical_info.allergies, '']
      }
    }));
  };

  const removeAllergy = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medical_info: {
        ...prev.medical_info,
  allergies: prev.medical_info.allergies.filter((_: string, i: number) => i !== index)
      }
    }));
  };

  const updateAllergy = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      medical_info: {
        ...prev.medical_info,
  allergies: prev.medical_info.allergies.map((allergy: string, i: number) => i === index ? value : allergy)
      }
    }));
  };

  const addMedicalCondition = () => {
    setFormData(prev => ({
      ...prev,
      medical_info: {
        ...prev.medical_info,
        medical_conditions: [...prev.medical_info.medical_conditions, '']
      }
    }));
  };

  const removeMedicalCondition = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medical_info: {
        ...prev.medical_info,
  medical_conditions: prev.medical_info.medical_conditions.filter((_: string, i: number) => i !== index)
      }
    }));
  };

  const updateMedicalCondition = (index: number, value: string) => {
    setFormData(prev => ({
      ...prev,
      medical_info: {
        ...prev.medical_info,
  medical_conditions: prev.medical_info.medical_conditions.map((condition: string, i: number) => i === index ? value : condition)
      }
    }));
  };

  const addMedication = () => {
    setFormData(prev => ({
      ...prev,
      medical_info: {
        ...prev.medical_info,
        medications: [...prev.medical_info.medications, { name: '', dosage: '', frequency: '', prescribing_doctor: '', notes: '' }]
      }
    }));
  };

  const removeMedication = (index: number) => {
    setFormData(prev => ({
      ...prev,
      medical_info: {
        ...prev.medical_info,
  medications: prev.medical_info.medications.filter((_: Medication, i: number) => i !== index)
      }
    }));
  };

  const updateMedication = (index: number, field: keyof Medication, value: string) => {
    setFormData(prev => ({
      ...prev,
      medical_info: {
        ...prev.medical_info,
  medications: prev.medical_info.medications.map((med: Medication, i: number) =>
          i === index ? { ...med, [field]: value } : med
        )
      }
    }));
  };
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) { // 5MB limit
        alert('File size must be less than 5MB');
        return;
      }

      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }

      setFormData(prev => ({ ...prev, photo: file }));
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        setPhotoPreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const validationErrors = validateForm();
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }

    setLoading(true);
    setErrors({});

    try {
      const submitData: CreatePersonData | UpdatePersonData = {
        name: formData.name,
        emergency_contact: formData.emergency_contact,
        address: formData.address,
        medical_info: formData.medical_info,
        ...(formData.photo && { photo: formData.photo }),
      };

      await onSubmit(submitData);
      onClose();
    } catch (err) {
      console.error('Form submission error:', err);
    } finally {
      setLoading(false);
    }
  };

  const removePhoto = () => {
    setFormData(prev => ({ ...prev, photo: null }));
    setPhotoPreview(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size="xl">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="md:col-span-2">
            <Input
              label="Full Name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              error={errors.name}
              placeholder="Enter full name"
              required
            />
          </div>

          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Photo
            </label>
            
            {photoPreview ? (
              <div className="relative inline-block">
                <img
                  src={photoPreview}
                  alt="Preview"
                  className="w-32 h-32 object-cover rounded-lg border border-gray-300"
                />
                <button
                  type="button"
                  onClick={removePhoto}
                  className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            ) : (
              <div
                onClick={() => fileInputRef.current?.click()}
                className="w-32 h-32 border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
              >
                <Upload className="w-8 h-8 text-gray-400" />
                <span className="text-sm text-gray-500 mt-2">Upload Photo</span>
              </div>
            )}
            
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileChange}
              className="hidden"
            />
            <p className="text-xs text-gray-500 mt-1">Max 5MB, JPG/PNG</p>
          </div>

          <div className="md:col-span-2">
            <Input
              label="Emergency Contact"
              value={formData.emergency_contact}
              onChange={(e) => setFormData(prev => ({ ...prev, emergency_contact: e.target.value }))}
              error={errors.emergency_contact}
              placeholder="Phone number or email"
              required
            />
          </div>

          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-4">Address</h4>
          </div>

          <div className="md:col-span-2">
            <Input
              label="Street Address"
              value={formData.address.street}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                address: { ...prev.address, street: e.target.value }
              }))}
              error={errors.address?.street}
              placeholder="123 Main St"
              required
            />
          </div>

          <Input
            label="City"
            value={formData.address.city}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              address: { ...prev.address, city: e.target.value }
            }))}
            error={errors.address?.city}
            placeholder="City"
            required
          />

          <Input
            label="State/Province"
            value={formData.address.state}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              address: { ...prev.address, state: e.target.value }
            }))}
            error={errors.address?.state}
            placeholder="State"
            required
          />

          <Input
            label="ZIP/Postal Code"
            value={formData.address.zip_code}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              address: { ...prev.address, zip_code: e.target.value }
            }))}
            error={errors.address?.zip_code}
            placeholder="12345"
            required
          />

          <Input
            label="Country"
            value={formData.address.country}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              address: { ...prev.address, country: e.target.value }
            }))}
            error={errors.address?.country}
            placeholder="Country"
            required
          />
        </div>
          {/* Medical Information Section */}
          <div className="md:col-span-2">
            <h4 className="text-lg font-medium text-gray-900 mb-4 border-t pt-6">Medical Information</h4>
          </div>

          <Input
            label="Date of Birth"
            type="date"
            value={formData.medical_info.date_of_birth}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              medical_info: { ...prev.medical_info, date_of_birth: e.target.value }
            }))}
            placeholder="YYYY-MM-DD"
          />

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">Blood Type</label>
            <select
              value={formData.medical_info.blood_type}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                medical_info: { ...prev.medical_info, blood_type: e.target.value }
              }))}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Select blood type</option>
              <option value="A+">A+</option>
              <option value="A-">A-</option>
              <option value="B+">B+</option>
              <option value="B-">B-</option>
              <option value="AB+">AB+</option>
              <option value="AB-">AB-</option>
              <option value="O+">O+</option>
              <option value="O-">O-</option>
            </select>
          </div>

          <Input
            label="Height"
            value={formData.medical_info.height}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              medical_info: { ...prev.medical_info, height: e.target.value }
            }))}
            placeholder={'e.g., 5\'10" or 178 cm'}
          />

          <Input
            label="Weight"
            value={formData.medical_info.weight}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              medical_info: { ...prev.medical_info, weight: e.target.value }
            }))}
            placeholder="e.g., 150 lbs or 68 kg"
          />

          <div className="md:col-span-2">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="organ_donor"
                checked={formData.medical_info.organ_donor}
                onChange={(e) => setFormData(prev => ({
                  ...prev,
                  medical_info: { ...prev.medical_info, organ_donor: e.target.checked }
                }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="organ_donor" className="ml-2 block text-sm text-gray-900">
                Organ Donor
              </label>
            </div>
          </div>

          {/* Allergies */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Allergies</label>
              <Button type="button" size="sm" variant="outline" onClick={addAllergy}>
                <Plus className="w-4 h-4 mr-1" />
                Add Allergy
              </Button>
            </div>
            <div className="space-y-2">
              {formData.medical_info.allergies.map((allergy: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={allergy}
                    onChange={(e) => updateAllergy(index, e.target.value)}
                    placeholder="Enter allergy"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    onClick={() => removeAllergy(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Medical Conditions */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Medical Conditions</label>
              <Button type="button" size="sm" variant="outline" onClick={addMedicalCondition}>
                <Plus className="w-4 h-4 mr-1" />
                Add Condition
              </Button>
            </div>
            <div className="space-y-2">
              {formData.medical_info.medical_conditions.map((condition: string, index: number) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={condition}
                    onChange={(e) => updateMedicalCondition(index, e.target.value)}
                    placeholder="Enter medical condition"
                    className="flex-1"
                  />
                  <Button
                    type="button"
                    size="sm"
                    variant="danger"
                    onClick={() => removeMedicalCondition(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              ))}
            </div>
          </div>

          {/* Medications */}
          <div className="md:col-span-2">
            <div className="flex items-center justify-between mb-2">
              <label className="block text-sm font-medium text-gray-700">Medications</label>
              <Button type="button" size="sm" variant="outline" onClick={addMedication}>
                <Plus className="w-4 h-4 mr-1" />
                Add Medication
              </Button>
            </div>
            <div className="space-y-4">
              {formData.medical_info.medications.map((medication: Medication, index: number) => (
                <div key={index} className="border border-gray-200 rounded-lg p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <h5 className="text-sm font-medium text-gray-900">Medication {index + 1}</h5>
                    <Button
                      type="button"
                      size="sm"
                      variant="danger"
                      onClick={() => removeMedication(index)}
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <Input
                      label="Medication Name"
                      value={medication.name}
                      onChange={(e) => updateMedication(index, 'name', e.target.value)}
                      placeholder="Enter medication name"
                    />
                    <Input
                      label="Dosage"
                      value={medication.dosage}
                      onChange={(e) => updateMedication(index, 'dosage', e.target.value)}
                      placeholder="e.g., 10mg"
                    />
                    <Input
                      label="Frequency"
                      value={medication.frequency}
                      onChange={(e) => updateMedication(index, 'frequency', e.target.value)}
                      placeholder="e.g., Twice daily"
                    />
                    <Input
                      label="Prescribing Doctor"
                      value={medication.prescribing_doctor || ''}
                      onChange={(e) => updateMedication(index, 'prescribing_doctor', e.target.value)}
                      placeholder="Doctor's name"
                    />
                  </div>
                  <Input
                    label="Notes"
                    value={medication.notes || ''}
                    onChange={(e) => updateMedication(index, 'notes', e.target.value)}
                    placeholder="Additional notes about this medication"
                  />
                </div>
              ))}
            </div>
          </div>

          {/* Emergency Medical Information */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Emergency Medical Information</label>
            <textarea
              value={formData.medical_info.emergency_medical_info}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                medical_info: { ...prev.medical_info, emergency_medical_info: e.target.value }
              }))}
              rows={3}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Critical medical information for emergency responders"
            />
          </div>

          {/* Healthcare Provider */}
          <div className="md:col-span-2">
            <h5 className="text-md font-medium text-gray-900 mb-3">Healthcare Provider</h5>
          </div>

          <Input
            label="Provider Name"
            value={formData.medical_info.healthcare_provider.name}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              medical_info: {
                ...prev.medical_info,
                healthcare_provider: { ...prev.medical_info.healthcare_provider, name: e.target.value }
              }
            }))}
            placeholder="Doctor or clinic name"
          />

          <Input
            label="Provider Phone"
            value={formData.medical_info.healthcare_provider.phone}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              medical_info: {
                ...prev.medical_info,
                healthcare_provider: { ...prev.medical_info.healthcare_provider, phone: e.target.value }
              }
            }))}
            placeholder="Phone number"
          />

          <Input
            label="Specialty"
            value={formData.medical_info.healthcare_provider.specialty}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              medical_info: {
                ...prev.medical_info,
                healthcare_provider: { ...prev.medical_info.healthcare_provider, specialty: e.target.value }
              }
            }))}
            placeholder="e.g., Family Medicine, Cardiology"
          />

          <div className="md:col-span-2">
            <Input
              label="Provider Address"
              value={formData.medical_info.healthcare_provider.address}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                medical_info: {
                  ...prev.medical_info,
                  healthcare_provider: { ...prev.medical_info.healthcare_provider, address: e.target.value }
                }
              }))}
              placeholder="Healthcare provider address"
            />
          </div>

          {/* Insurance Information */}
          <div className="md:col-span-2">
            <h5 className="text-md font-medium text-gray-900 mb-3">Insurance Information</h5>
          </div>

          <Input
            label="Insurance Provider"
            value={formData.medical_info.insurance_info.provider}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              medical_info: {
                ...prev.medical_info,
                insurance_info: { ...prev.medical_info.insurance_info, provider: e.target.value }
              }
            }))}
            placeholder="Insurance company name"
          />

          <Input
            label="Policy Number"
            value={formData.medical_info.insurance_info.policy_number}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              medical_info: {
                ...prev.medical_info,
                insurance_info: { ...prev.medical_info.insurance_info, policy_number: e.target.value }
              }
            }))}
            placeholder="Policy number"
          />

          <Input
            label="Group Number"
            value={formData.medical_info.insurance_info.group_number}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              medical_info: {
                ...prev.medical_info,
                insurance_info: { ...prev.medical_info.insurance_info, group_number: e.target.value }
              }
            }))}
            placeholder="Group number (if applicable)"
          />

          <Input
            label="Insurance Contact Phone"
            value={formData.medical_info.insurance_info.contact_phone}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              medical_info: {
                ...prev.medical_info,
                insurance_info: { ...prev.medical_info.insurance_info, contact_phone: e.target.value }
              }
            }))}
            placeholder="Insurance contact number"
          />

          {/* Medical Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">Additional Medical Notes</label>
            <textarea
              value={formData.medical_info.medical_notes}
              onChange={(e) => setFormData(prev => ({
                ...prev,
                medical_info: { ...prev.medical_info, medical_notes: e.target.value }
              }))}
              rows={4}
              className="block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              placeholder="Any additional medical information, special instructions, or notes"
            />
          </div>

        <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={loading}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            loading={loading}
          >
            {person ? 'Update' : 'Create'} Person
          </Button>
        </div>
      </form>
    </Modal>
  );
};