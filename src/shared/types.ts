export type Category = 'personal' | 'financial' | 'documents' | 'business' | 'custom';

export type FieldType = 'text' | 'number' | 'date' | 'multiline' | 'file_path';

export interface Profile {
  id: string;
  name: string;
  icon: string;
  color: string;
  isDefault: boolean;
  createdAt: string;
}

export interface Field {
  id: string;
  profileId: string;
  category: Category;
  label: string;
  value: string;
  fieldType: FieldType;
  shortcut: string | null;
  icon: string;
  sortOrder: number;
  createdAt: string;
  updatedAt: string;
}

export interface FileRef {
  id: string;
  profileId: string;
  label: string;
  filePath: string;
  fileType: string | null;
  createdAt: string;
}

export interface NewField {
  profileId: string;
  category: Category;
  label: string;
  value: string;
  fieldType: FieldType;
  shortcut?: string | null;
  icon?: string;
  sortOrder?: number;
}

export interface UpdateField {
  id: string;
  category?: Category;
  label?: string;
  value?: string;
  fieldType?: FieldType;
  shortcut?: string | null;
  icon?: string;
  sortOrder?: number;
}

export interface NewProfile {
  name: string;
  icon?: string;
  color?: string;
}

export interface AppSettings {
  hotkey: string;
  launchAtStartup: boolean;
  activeProfileId: string | null;
}

export type SettingsKey = keyof AppSettings;

export interface VaultExport {
  version: number;
  exportedAt: string;
  profiles: Profile[];
  fields: Field[];
}
