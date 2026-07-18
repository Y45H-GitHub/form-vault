import type { NewField } from './types';

export interface FieldTemplate {
  id: string;
  name: string;
  description: string;
  fields: Omit<NewField, 'profileId'>[];
}

const indianEssentials: Omit<NewField, 'profileId'>[] = [
  { category: 'personal', label: 'Full Name', value: '', fieldType: 'text', shortcut: '!name', icon: 'user', sortOrder: 0 },
  { category: 'personal', label: 'Date of Birth', value: '', fieldType: 'date', shortcut: '!dob', icon: 'cake', sortOrder: 1 },
  { category: 'personal', label: 'PAN Number', value: '', fieldType: 'text', shortcut: '!pan', icon: 'id-card', sortOrder: 2 },
  { category: 'personal', label: 'Aadhaar Number', value: '', fieldType: 'text', shortcut: '!aadhaar', icon: 'id-card', sortOrder: 3 },
  { category: 'personal', label: 'Mobile', value: '', fieldType: 'text', shortcut: '!mobile', icon: 'phone', sortOrder: 4 },
  { category: 'personal', label: 'Email', value: '', fieldType: 'text', shortcut: '!email', icon: 'envelope', sortOrder: 5 },
  { category: 'personal', label: "Father's Name", value: '', fieldType: 'text', shortcut: '!fname', icon: 'user', sortOrder: 6 },
  { category: 'personal', label: 'Address', value: '', fieldType: 'multiline', shortcut: '!addr', icon: 'house', sortOrder: 7 },
  { category: 'personal', label: 'Pincode', value: '', fieldType: 'text', shortcut: '!pin', icon: 'map-pin', sortOrder: 8 },

  { category: 'financial', label: 'Bank Name', value: '', fieldType: 'text', shortcut: '!bankname', icon: 'bank', sortOrder: 0 },
  { category: 'financial', label: 'Account Number', value: '', fieldType: 'text', shortcut: '!accno', icon: 'credit-card', sortOrder: 1 },
  { category: 'financial', label: 'IFSC Code', value: '', fieldType: 'text', shortcut: '!ifsc', icon: 'bank', sortOrder: 2 },
  { category: 'financial', label: 'UPI ID', value: '', fieldType: 'text', shortcut: '!upi', icon: 'qr-code', sortOrder: 3 },

  { category: 'business', label: 'GST Number', value: '', fieldType: 'text', shortcut: '!gst', icon: 'receipt', sortOrder: 0 },
  { category: 'business', label: 'Company Name', value: '', fieldType: 'text', shortcut: '!company', icon: 'buildings', sortOrder: 1 },
  { category: 'business', label: 'CIN', value: '', fieldType: 'text', shortcut: '!cin', icon: 'receipt', sortOrder: 2 }
];

const minimal: Omit<NewField, 'profileId'>[] = [
  { category: 'personal', label: 'Full Name', value: '', fieldType: 'text', shortcut: '!name', icon: 'user', sortOrder: 0 },
  { category: 'personal', label: 'Email', value: '', fieldType: 'text', shortcut: '!email', icon: 'envelope', sortOrder: 1 },
  { category: 'personal', label: 'Mobile', value: '', fieldType: 'text', shortcut: '!mobile', icon: 'phone', sortOrder: 2 }
];

export const FIELD_TEMPLATES: FieldTemplate[] = [
  {
    id: 'indian-essentials',
    name: 'Indian essentials',
    description: 'PAN, Aadhaar, GST, bank details, and the personal info Indian forms ask for most.',
    fields: indianEssentials
  },
  {
    id: 'minimal',
    name: 'Minimal',
    description: 'Just the basics - name, email, and mobile number. Add more as you go.',
    fields: minimal
  }
];
