import { FIELD_ICONS, DEFAULT_FIELD_ICON } from '../fieldIcons';
import { cn } from '../cn';

interface FieldIconProps {
  icon: string;
  size?: 'sm' | 'md' | 'lg';
  weight?: 'regular' | 'bold' | 'light';
  className?: string;
}

const SIZE_CLASS = { sm: 'h-3.5 w-3.5', md: 'h-4 w-4', lg: 'h-5 w-5' };

/** Renders a field's stored icon key as a Phosphor icon, falling back to the default (or legacy emoji) gracefully. */
export function FieldIcon({ icon, size = 'md', weight = 'regular', className }: FieldIconProps) {
  const IconComponent = FIELD_ICONS[icon] ?? FIELD_ICONS[DEFAULT_FIELD_ICON];
  return <IconComponent weight={weight} className={cn(SIZE_CLASS[size], className)} />;
}
