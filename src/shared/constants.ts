import type { Category, NewField } from './types';

export const CATEGORIES: { id: Category; label: string }[] = [
  { id: 'personal', label: 'Personal' },
  { id: 'financial', label: 'Financial' },
  { id: 'business', label: 'Business' },
  { id: 'documents', label: 'Documents' },
  { id: 'custom', label: 'Custom' }
];

export const CATEGORY_COLORS: Record<Category, string> = {
  personal: '#6366f1',
  financial: '#10b981',
  business: '#f59e0b',
  documents: '#ef4444',
  custom: '#8b5cf6'
};

/** Fields whose values should be partially masked in the popup list. */
export const SENSITIVE_SHORTCUTS = new Set(['!pan', '!aadhaar', '!accno', '!cin', '!gst']);

export const DEFAULT_HOTKEY = 'CommandOrControl+Shift+Space';

export const DEFAULT_PROFILE_NAME = 'Personal';

/** Seeded on first launch for the default profile. Values are left empty for the user to fill in. */
export const DEFAULT_FIELDS: Omit<NewField, 'profileId'>[] = [
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

export const IPC = {
  VAULT_DATA_UPDATED: 'vault:data-updated',
  HOTKEY_TRIGGERED: 'hotkey:triggered',

  GET_ALL_FIELDS: 'vault:get-all-fields',
  GET_PROFILES: 'vault:get-profiles',
  SET_ACTIVE_PROFILE: 'vault:set-active-profile',
  ADD_PROFILE: 'vault:add-profile',
  DELETE_PROFILE: 'vault:delete-profile',
  ADD_FIELD: 'vault:add-field',
  UPDATE_FIELD: 'vault:update-field',
  DELETE_FIELD: 'vault:delete-field',
  COPY_FIELD: 'vault:copy-field',
  GET_FILES: 'vault:get-files',
  ADD_FILE: 'vault:add-file',
  DELETE_FILE: 'vault:delete-file',
  PICK_FILE: 'vault:pick-file',
  EXPORT_VAULT: 'vault:export',
  IMPORT_VAULT: 'vault:import',

  SETTINGS_GET: 'settings:get',
  SETTINGS_SET: 'settings:set',

  OPEN_VAULT_MANAGER: 'app:open-vault-manager',
  OPEN_SETTINGS: 'app:open-settings',
  CLOSE_POPUP: 'app:close-popup',
  QUIT: 'app:quit',
  GET_APP_VERSION: 'app:get-version',
  GET_CAPABILITIES: 'app:get-capabilities'
} as const;
