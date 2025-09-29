export interface Person {
  id: string;
  name: string;
  photo_url?: string;
  emergency_contact: string;
  address: Address;
  medical_info: MedicalInfo;
  public_link_id: string;
  created_at: string;
  updated_at: string;
  user_id: string;
}

export interface Address {
  street: string;
  city: string;
  state: string;
  zip_code: string;
  country: string;
}

export interface MedicalInfo {
  blood_type?: string;
  allergies: string[];
  medical_conditions: string[];
  medications: Medication[];
  emergency_medical_info?: string;
  healthcare_provider?: HealthcareProvider;
  insurance_info?: InsuranceInfo;
  medical_notes?: string;
  date_of_birth?: string;
  height?: string;
  weight?: string;
  organ_donor?: boolean;
}

export interface Medication {
  name: string;
  dosage: string;
  frequency: string;
  prescribing_doctor?: string;
  notes?: string;
}

export interface HealthcareProvider {
  name: string;
  phone: string;
  address?: string;
  specialty?: string;
}

export interface InsuranceInfo {
  provider: string;
  policy_number: string;
  group_number?: string;
  contact_phone?: string;
}
export interface User {
  id: string;
  email: string;
  created_at: string;
}

export interface CreatePersonData {
  name: string;
  photo?: File;
  emergency_contact: string;
  address: Address;
  medical_info: MedicalInfo;
}

export interface UpdatePersonData {
  name?: string;
  photo?: File;
  emergency_contact?: string;
  address?: Address;
  medical_info?: MedicalInfo;
}

export interface AuthState {
  user: User | null;
  loading: boolean;
}

export interface PersonFormErrors {
  name?: string;
  emergency_contact?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    zip_code?: string;
    country?: string;
  };
  medical_info?: {
    blood_type?: string;
    allergies?: string;
    medical_conditions?: string;
    medications?: string;
    emergency_medical_info?: string;
    healthcare_provider?: {
      name?: string;
      phone?: string;
    };
    insurance_info?: {
      provider?: string;
      policy_number?: string;
    };
    date_of_birth?: string;
    height?: string;
    weight?: string;
  };
}