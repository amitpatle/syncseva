import { useState } from 'react';
import { Person } from '../../types';
import { Card, CardContent } from '../ui/Card';
import { Button } from '../ui/Button';
import { CreditCard as Edit, Trash2, ExternalLink, Copy, User, Heart } from 'lucide-react';

interface PersonCardProps {
  person: Person;
  onEdit: (person: Person) => void;
  onDelete: (id: string) => void;
}

export const PersonCard = ({ person, onEdit, onDelete }: PersonCardProps) => {
  const [copied, setCopied] = useState(false);
  
  const publicUrl = `${window.location.origin}/public/${person.public_link_id}`;

  const copyPublicLink = async () => {
    try {
      await navigator.clipboard.writeText(publicUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Failed to copy:', err);
    }
  };

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

  const getMedicalSummary = () => {
    const medical = person.medical_info as any;
    if (!medical) return null;
    
    const items = [];
    if (medical.blood_type) items.push(`Blood: ${medical.blood_type}`);
    if (medical.allergies?.length > 0) items.push(`${medical.allergies.length} allergies`);
    if (medical.medical_conditions?.length > 0) items.push(`${medical.medical_conditions.length} conditions`);
    if (medical.medications?.length > 0) items.push(`${medical.medications.length} medications`);
    
    return items.length > 0 ? items.join(' • ') : null;
  };
  return (
    <Card hover className="overflow-hidden">
      <div className="aspect-w-16 aspect-h-9 bg-gray-100">
        {person.photo_url ? (
          <img
            src={person.photo_url}
            alt={person.name}
            className="w-full h-48 object-cover"
          />
        ) : (
          <div className="w-full h-48 flex items-center justify-center bg-gradient-to-br from-blue-100 to-blue-200">
            <User className="w-16 h-16 text-blue-400" />
          </div>
        )}
      </div>
      
      <CardContent>
        <div className="space-y-3">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 truncate">
              {person.name}
            </h3>
            <p className="text-sm text-gray-600 mt-1">
              Emergency: {person.emergency_contact}
            </p>
          </div>
          
          <div className="text-sm text-gray-600">
            <p className="line-clamp-2">
              {formatAddress(person.address)}
            </p>
          </div>

          {getMedicalSummary() && (
            <div className="flex items-center text-sm text-red-600 bg-red-50 px-2 py-1 rounded">
              <Heart className="w-4 h-4 mr-1 flex-shrink-0" />
              <span className="truncate">{getMedicalSummary()}</span>
            </div>
          )}
          <div className="flex items-center justify-between pt-2 border-t border-gray-100">
            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={() => onEdit(person)}
              >
                <Edit className="w-4 h-4" />
              </Button>
              
              <Button
                size="sm"
                variant="danger"
                onClick={() => onDelete(person.id)}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            </div>

            <div className="flex space-x-2">
              <Button
                size="sm"
                variant="outline"
                onClick={copyPublicLink}
                title="Copy public link"
              >
                {copied ? '✓' : <Copy className="w-4 h-4" />}
              </Button>
              
              <Button
                size="sm"
                variant="outline"
                onClick={() => window.open(publicUrl, '_blank')}
                title="Open public link"
              >
                <ExternalLink className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};