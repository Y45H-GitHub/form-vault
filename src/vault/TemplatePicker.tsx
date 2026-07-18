import { Check, FileText, Sparkle } from '@phosphor-icons/react';
import { FIELD_TEMPLATES, type FieldTemplate } from '../shared/fieldTemplates';

interface TemplatePickerProps {
  profileName: string;
  onChooseTemplate: (template: FieldTemplate) => void;
  onStartBlank: () => void;
}

export function TemplatePicker({ profileName, onChooseTemplate, onStartBlank }: TemplatePickerProps) {
  return (
    <div className="relative mx-auto flex max-w-2xl flex-col items-center px-6 py-16 text-center">
      <div className="pointer-events-none absolute inset-0 -z-10 grid-bg opacity-40" aria-hidden="true" />

      <div className="mb-5 flex h-12 w-12 items-center justify-center rounded-card bg-accent-subtle">
        <Sparkle weight="regular" className="h-5 w-5 text-accent" />
      </div>
      <h2 className="text-heading text-ink">Set up &ldquo;{profileName}&rdquo;</h2>
      <p className="mt-2 max-w-md text-label text-ink-muted">
        Pick a starting point. You can rename, remove, or add fields at any time — this just saves you the typing.
      </p>

      <div className="mt-8 grid w-full gap-3 sm:grid-cols-2">
        {FIELD_TEMPLATES.map((template) => (
          <button
            key={template.id}
            onClick={() => onChooseTemplate(template)}
            className="group flex flex-col items-start gap-2 rounded-card border border-stroke bg-card p-5 text-left transition-colors duration-fast hover:border-accent/40 hover:bg-hover"
          >
            <span className="flex h-8 w-8 items-center justify-center rounded-control bg-accent-subtle text-accent">
              <FileText weight="regular" className="h-4 w-4" />
            </span>
            <span className="text-body font-medium text-ink">{template.name}</span>
            <span className="text-label text-ink-muted">{template.description}</span>
            <span className="mt-1 text-caption text-ink-muted">{template.fields.length} fields</span>
          </button>
        ))}
      </div>

      <button
        onClick={onStartBlank}
        className="mt-6 flex items-center gap-1.5 text-label text-ink-muted transition-colors duration-fast hover:text-ink"
      >
        <Check weight="regular" className="h-3.5 w-3.5" />
        Start blank instead
      </button>
    </div>
  );
}
