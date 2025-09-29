import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { usePerson } from '../hooks/usePerson';
import { Person } from '../types';
import { Card, CardContent } from '../components/ui/Card';
import { QRSection } from '../components/persons/QRSection';
import { MapPin, Phone, User, Heart, Calendar, Ruler, Weight, Droplet, AlertTriangle, Pill, Shield, FileText } from 'lucide-react';

export const PublicPersonView = () => {
  const { linkId } = useParams<{ linkId: string }>();
  const { getPersonByPublicLink } = usePerson();
  const [person, setPerson] = useState<Person | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchPerson = async () => {
      if (!linkId) {
        setError('Invalid link');
        setLoading(false);
        return;
      }

      try {
        const personData = await getPersonByPublicLink(linkId);
        if (!personData) {
          setError('Person not found');
        } else {
          setPerson(personData);
        }
      } catch (err) {
        setError('Failed to load person data');
      } finally {
        setLoading(false);
      }
    };

    fetchPerson();
  }, [linkId, getPersonByPublicLink]);

  const formatAddress = (address: any) => {
    if (typeof address === 'string') {
      try {
        address = JSON.parse(address);
      } catch {
        return address;
      }
    }
    return `${address.street}, ${address.city}, ${address.state} ${address.zip_code}, ${address.country}`;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (error || !person) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <Card className="max-w-md mx-auto">
          <CardContent className="text-center py-8">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {error || 'Person Not Found'}
            </h2>
            <p className="text-gray-600">
              The person entry you're looking for doesn't exist or has been removed.
            </p>
          </CardContent>
        </Card>
      </div>
    );
  }

  const medical = person.medical_info as any;
  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <Card className="overflow-hidden">
          <div className="aspect-w-16 aspect-h-9 bg-gray-100">
            {person.photo_url ? (
              <img
                src={person.photo_url}
                alt={person.name}
                className="w-full h-64 object-cover"
              />
            ) : (
              <div className="w-full h-64 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
                <User className="w-24 h-24 text-blue-400" />
              </div>
            )}
          </div>
          <CardContent className="p-8">
            <div className="space-y-6">
              {/* QR Code Section */}
              <div className="flex justify-center">
                <QRSection value={`${window.location.origin}/public/${person.public_link_id}`} />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                  {person.name}
                </h1>
                <p className="text-sm text-gray-500">
                  Person Entry
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex items-start space-x-3">
                  <Phone className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Emergency Contact</h3>
                    <p className="text-gray-600">{person.emergency_contact}</p>
                  </div>
                </div>

                <div className="flex items-start space-x-3 md:col-span-2">
                  <MapPin className="w-5 h-5 text-blue-600 mt-0.5" />
                  <div>
                    <h3 className="font-medium text-gray-900">Address</h3>
                    <p className="text-gray-600">{formatAddress(person.address)}</p>
                  </div>
                </div>
              </div>

              {/* Medical Information Section */}
              {medical && (
                <div className="border-t pt-8">
                  <div className="flex items-center mb-6">
                    <Heart className="w-6 h-6 text-red-600 mr-2" />
                    <h2 className="text-2xl font-bold text-gray-900">Medical Information</h2>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Basic Medical Info */}
                    {medical.date_of_birth && (
                      <div className="flex items-start space-x-3">
                        <Calendar className="w-5 h-5 text-blue-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Date of Birth</h3>
                          <p className="text-gray-600">{formatDate(medical.date_of_birth)}</p>
                        </div>
                      </div>
                    )}

                    {medical.blood_type && (
                      <div className="flex items-start space-x-3">
                        <Droplet className="w-5 h-5 text-red-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Blood Type</h3>
                          <p className="text-gray-600">{medical.blood_type}</p>
                        </div>
                      </div>
                    )}

                    {medical.height && (
                      <div className="flex items-start space-x-3">
                        <Ruler className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Height</h3>
                          <p className="text-gray-600">{medical.height}</p>
                        </div>
                      </div>
                    )}

                    {medical.weight && (
                      <div className="flex items-start space-x-3">
                        <Weight className="w-5 h-5 text-green-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Weight</h3>
                          <p className="text-gray-600">{medical.weight}</p>
                        </div>
                      </div>
                    )}

                    {medical.organ_donor && (
                      <div className="flex items-start space-x-3">
                        <Heart className="w-5 h-5 text-pink-600 mt-0.5" />
                        <div>
                          <h3 className="font-medium text-gray-900">Organ Donor</h3>
                          <p className="text-gray-600">Yes</p>
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Allergies */}
                  {medical.allergies && medical.allergies.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center mb-3">
                        <AlertTriangle className="w-5 h-5 text-yellow-600 mr-2" />
                        <h3 className="font-medium text-gray-900">Allergies</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {medical.allergies.filter((allergy: string) => allergy.trim()).map((allergy: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-yellow-100 text-yellow-800 rounded-full text-sm">
                            {allergy}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medical Conditions */}
                  {medical.medical_conditions && medical.medical_conditions.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center mb-3">
                        <FileText className="w-5 h-5 text-orange-600 mr-2" />
                        <h3 className="font-medium text-gray-900">Medical Conditions</h3>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {medical.medical_conditions.filter((condition: string) => condition.trim()).map((condition: string, index: number) => (
                          <span key={index} className="px-3 py-1 bg-orange-100 text-orange-800 rounded-full text-sm">
                            {condition}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Medications */}
                  {medical.medications && medical.medications.length > 0 && (
                    <div className="mt-6">
                      <div className="flex items-center mb-3">
                        <Pill className="w-5 h-5 text-purple-600 mr-2" />
                        <h3 className="font-medium text-gray-900">Current Medications</h3>
                      </div>
                      <div className="space-y-3">
                        {medical.medications.filter((med: any) => med.name?.trim()).map((medication: any, index: number) => (
                          <div key={index} className="bg-purple-50 p-4 rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="font-medium text-purple-900">{medication.name}</h4>
                              <span className="text-sm text-purple-700">{medication.dosage}</span>
                            </div>
                            <p className="text-sm text-purple-700 mb-1">Frequency: {medication.frequency}</p>
                            {medication.prescribing_doctor && (
                              <p className="text-sm text-purple-600">Prescribed by: {medication.prescribing_doctor}</p>
                            )}
                            {medication.notes && (
                              <p className="text-sm text-purple-600 mt-2">{medication.notes}</p>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Emergency Medical Info */}
                  {medical.emergency_medical_info && (
                    <div className="mt-6">
                      <div className="flex items-center mb-3">
                        <AlertTriangle className="w-5 h-5 text-red-600 mr-2" />
                        <h3 className="font-medium text-gray-900">Emergency Medical Information</h3>
                      </div>
                      <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                        <p className="text-red-800">{medical.emergency_medical_info}</p>
                      </div>
                    </div>
                  )}

                  {/* Healthcare Provider */}
                  {medical.healthcare_provider && (medical.healthcare_provider.name || medical.healthcare_provider.phone) && (
                    <div className="mt-6">
                      <div className="flex items-center mb-3">
                        <Shield className="w-5 h-5 text-blue-600 mr-2" />
                        <h3 className="font-medium text-gray-900">Healthcare Provider</h3>
                      </div>
                      <div className="bg-blue-50 p-4 rounded-lg">
                        {medical.healthcare_provider.name && (
                          <p className="font-medium text-blue-900 mb-1">{medical.healthcare_provider.name}</p>
                        )}
                        {medical.healthcare_provider.specialty && (
                          <p className="text-blue-700 mb-1">{medical.healthcare_provider.specialty}</p>
                        )}
                        {medical.healthcare_provider.phone && (
                          <p className="text-blue-700 mb-1">Phone: {medical.healthcare_provider.phone}</p>
                        )}
                        {medical.healthcare_provider.address && (
                          <p className="text-blue-700">{medical.healthcare_provider.address}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Insurance Information */}
                  {medical.insurance_info && (medical.insurance_info.provider || medical.insurance_info.policy_number) && (
                    <div className="mt-6">
                      <div className="flex items-center mb-3">
                        <Shield className="w-5 h-5 text-green-600 mr-2" />
                        <h3 className="font-medium text-gray-900">Insurance Information</h3>
                      </div>
                      <div className="bg-green-50 p-4 rounded-lg">
                        {medical.insurance_info.provider && (
                          <p className="font-medium text-green-900 mb-1">{medical.insurance_info.provider}</p>
                        )}
                        {medical.insurance_info.policy_number && (
                          <p className="text-green-700 mb-1">Policy: {medical.insurance_info.policy_number}</p>
                        )}
                        {medical.insurance_info.group_number && (
                          <p className="text-green-700 mb-1">Group: {medical.insurance_info.group_number}</p>
                        )}
                        {medical.insurance_info.contact_phone && (
                          <p className="text-green-700">Contact: {medical.insurance_info.contact_phone}</p>
                        )}
                      </div>
                    </div>
                  )}

                  {/* Additional Medical Notes */}
                  {medical.medical_notes && (
                    <div className="mt-6">
                      <div className="flex items-center mb-3">
                        <FileText className="w-5 h-5 text-gray-600 mr-2" />
                        <h3 className="font-medium text-gray-900">Additional Medical Notes</h3>
                      </div>
                      <div className="bg-gray-50 p-4 rounded-lg">
                        <p className="text-gray-700 whitespace-pre-wrap">{medical.medical_notes}</p>
                      </div>
                    </div>
                  )}
                </div>
              )}
              <div className="border-t pt-6">
                <p className="text-xs text-gray-400 text-center">
                  This is a public view of a person entry. 
                  Created on {new Date(person.created_at).toLocaleDateString()}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};