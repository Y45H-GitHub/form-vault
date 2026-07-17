/**
 * Renderer-only module: maps a field's stored `icon` string key to a Phosphor icon component.
 * Kept separate from constants.ts, which is also imported by the Electron main process — bundling
 * @phosphor-icons/react (ESM-only) into the main process's CJS bundle breaks at runtime.
 */
import {
  User,
  UserCircle,
  Baby,
  Cake,
  Phone,
  EnvelopeSimple,
  House,
  MapPin,
  IdentificationCard,
  Fingerprint,
  Password,
  Key,
  Lock,
  Bank,
  CreditCard,
  Wallet,
  CurrencyDollar,
  ArrowsLeftRight,
  QrCode,
  FileText,
  Certificate,
  Notebook,
  Briefcase,
  Buildings,
  Receipt,
  Globe,
  At,
  Link,
  Hash,
  Tag,
  Car,
  AirplaneTilt,
  FirstAid,
  Heartbeat,
  CalendarBlank,
  Clock,
  Star,
  type Icon
} from '@phosphor-icons/react';

export const FIELD_ICONS: Record<string, Icon> = {
  // Personal
  user: User,
  'user-circle': UserCircle,
  baby: Baby,
  cake: Cake,
  phone: Phone,
  envelope: EnvelopeSimple,
  house: House,
  'map-pin': MapPin,
  // Identity / Documents
  'id-card': IdentificationCard,
  fingerprint: Fingerprint,
  password: Password,
  key: Key,
  lock: Lock,
  // Financial
  bank: Bank,
  'credit-card': CreditCard,
  wallet: Wallet,
  currency: CurrencyDollar,
  transfer: ArrowsLeftRight,
  'qr-code': QrCode,
  // Documents / Business
  'file-text': FileText,
  certificate: Certificate,
  notebook: Notebook,
  briefcase: Briefcase,
  buildings: Buildings,
  receipt: Receipt,
  // Online
  globe: Globe,
  'at-sign': At,
  link: Link,
  hash: Hash,
  // Generic / Other
  tag: Tag,
  car: Car,
  airplane: AirplaneTilt,
  'first-aid': FirstAid,
  heartbeat: Heartbeat,
  calendar: CalendarBlank,
  clock: Clock,
  star: Star
};

export const DEFAULT_FIELD_ICON = 'tag';
