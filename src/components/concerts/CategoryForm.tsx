import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  Layers,
  Plus,
  Trash2,
  Sliders,
  Type,
  Hash,
  ListFilter,
  Calendar,
  Clock,
  CalendarClock,
  Radio,
  AlignLeft,
  CheckSquare
} from 'lucide-react';
import { EventCategory, DynamicFormField, DynamicFieldType } from '../../data/categoryData';

interface CategoryFormProps {
  initialData?: EventCategory | null;
  onSave: (categoryData: Partial<EventCategory>) => void;
  onCancel: () => void;
}

export const CategoryForm: React.FC<CategoryFormProps> = ({
  initialData,
  onSave,
  onCancel
}) => {
  const isEditing = Boolean(initialData);

  // Category details
  const [name, setName] = useState(initialData?.name || '');
  const [status, setStatus] = useState<'active' | 'inactive'>(initialData?.status || 'active');

  // Dynamic Fields list
  const [customFields, setCustomFields] = useState<DynamicFormField[]>(
    initialData?.customFields || []
  );

  // New field inputs: label, inputType, placeholder, required or not required
  const [newLabel, setNewLabel] = useState('');
  const [newType, setNewType] = useState<DynamicFieldType>('text');
  const [newPlaceholder, setNewPlaceholder] = useState('');
  const [newRequired, setNewRequired] = useState(false);
  const [newOptionsText, setNewOptionsText] = useState('');

  // Add field directly
  const handleAddField = () => {
    if (!newLabel.trim()) return;

    const parsedOptions =
      newType === 'select' || newType === 'radio'
        ? newOptionsText.split(',').map((s) => s.trim()).filter(Boolean)
        : undefined;

    const newField: DynamicFormField = {
      id: `field-${Date.now()}`,
      label: newLabel.trim(),
      name: newLabel.trim().toLowerCase().replace(/[^a-z0-9_]/g, '_'),
      type: newType,
      required: newRequired,
      placeholder: newPlaceholder.trim() || undefined,
      options: parsedOptions && parsedOptions.length > 0 ? parsedOptions : undefined
    };

    setCustomFields([...customFields, newField]);

    // Clear input
    setNewLabel('');
    setNewType('text');
    setNewPlaceholder('');
    setNewRequired(false);
    setNewOptionsText('');
  };

  const handleRemoveField = (id: string) => {
    setCustomFields(customFields.filter((f) => f.id !== id));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) return;

    onSave({
      name: name.trim(),
      status,
      customFields
    });
  };

  const getFieldTypeBadge = (type: DynamicFieldType) => {
    switch (type) {
      case 'text':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-slate-700 bg-slate-100 px-2.5 py-1 rounded-full font-semibold border border-slate-200">
            <Type className="w-3.5 h-3.5 text-slate-500" /> Text
          </span>
        );
      case 'textarea':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-indigo-700 bg-indigo-50 px-2.5 py-1 rounded-full font-semibold border border-indigo-200/80">
            <AlignLeft className="w-3.5 h-3.5 text-indigo-500" /> Long Text
          </span>
        );
      case 'number':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full font-semibold border border-purple-200/80">
            <Hash className="w-3.5 h-3.5 text-purple-500" /> Number
          </span>
        );
      case 'select':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-amber-700 bg-amber-50 px-2.5 py-1 rounded-full font-semibold border border-amber-200/80">
            <ListFilter className="w-3.5 h-3.5 text-amber-500" /> Dropdown
          </span>
        );
      case 'radio':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-rose-700 bg-rose-50 px-2.5 py-1 rounded-full font-semibold border border-rose-200/80">
            <Radio className="w-3.5 h-3.5 text-rose-500" /> Radio Choice
          </span>
        );
      case 'checkbox':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-emerald-700 bg-emerald-50 px-2.5 py-1 rounded-full font-semibold border border-emerald-200/80">
            <CheckSquare className="w-3.5 h-3.5 text-emerald-500" /> Yes / No
          </span>
        );
      case 'date':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-purple-700 bg-purple-50 px-2.5 py-1 rounded-full font-semibold border border-purple-200/80">
            <Calendar className="w-3.5 h-3.5 text-purple-500" /> Date
          </span>
        );
      case 'time':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-teal-700 bg-teal-50 px-2.5 py-1 rounded-full font-semibold border border-teal-200/80">
            <Clock className="w-3.5 h-3.5 text-teal-500" /> Time
          </span>
        );
      case 'datetime':
        return (
          <span className="inline-flex items-center gap-1.5 text-xs text-sky-700 bg-sky-50 px-2.5 py-1 rounded-full font-semibold border border-sky-200/80">
            <CalendarClock className="w-3.5 h-3.5 text-sky-500" /> Date & Time
          </span>
        );
    }
  };

  return (
    <div className="w-full space-y-4">
      {/* Header Bar */}
      <div className="rounded-lg border border-slate-200/90 bg-white p-5 shadow-2xs flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={onCancel}
            className="p-2 rounded-md border border-slate-200/90 text-slate-500 hover:text-slate-800 hover:bg-slate-50 transition-colors shadow-2xs cursor-pointer"
            title="Back to Categories"
          >
            <ArrowLeft className="w-4 h-4" />
          </button>
          <div>
            <h1 className="PageTitle">
              {isEditing ? `Edit Category: ${initialData?.name}` : 'Create New Event Category'}
            </h1>
            <p className="text-xs text-slate-500 mt-0.5">
              {isEditing
                ? 'Update classification name, live promoter status, and dynamic questionnaires.'
                : 'Configure concert category name, active visibility, and organizer dynamic prompts.'}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-md hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleSubmit}
            className="flex items-center gap-2 px-4 py-2 rounded-md text-xs font-semibold bg-purple-600 text-white hover:bg-purple-700 shadow-sm shadow-purple-200 transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Save Changes' : 'Save Category'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Section 1: Basic Information */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center gap-2 pb-3 border-b border-slate-100">
            <Layers className="w-4 h-4 text-purple-600" />
            <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Category Details</h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">
                Category Name <span className="text-rose-500">*</span>
              </label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Bollywood & Punjabi Live Concerts"
                className="w-full h-10 rounded-md border border-slate-200/90 bg-white hover:bg-slate-50 focus:bg-white px-3.5 py-2 text-xs sm:text-[13px] text-slate-800 placeholder:text-slate-400 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 font-medium"
                required
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-slate-700 mb-1.5">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value as any)}
                className="w-full h-10 rounded-md border border-slate-200/90 bg-white hover:bg-slate-50 focus:bg-white px-3.5 py-2 text-xs sm:text-[13px] text-slate-800 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 cursor-pointer font-medium"
              >
                <option value="active">Active (Visible for Organizers)</option>
                <option value="inactive">Inactive (Hidden)</option>
              </select>
            </div>
          </div>
        </div>

        {/* Section 2: Custom Form Fields */}
        <div className="rounded-xl border border-slate-200/90 bg-white p-5 sm:p-6 shadow-2xs space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-slate-100">
            <div className="flex items-center gap-2">
              <Sliders className="w-4 h-4 text-purple-600" />
              <div>
                <h2 className="text-xs font-semibold uppercase tracking-wider text-slate-700">Custom Event Dynamic Fields</h2>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  Configure dynamic questionnaires that organizers must answer when submitting concert events under this category.
                </p>
              </div>
            </div>
            {customFields.length > 0 && (
              <span className="px-2.5 py-1 rounded-full text-xs font-semibold bg-purple-50 text-purple-700 border border-purple-200/80">
                {customFields.length} {customFields.length === 1 ? 'Field' : 'Fields'}
              </span>
            )}
          </div>

          {/* Simple List of Added Fields */}
          {customFields.length > 0 ? (
            <div className="space-y-2.5">
              {customFields.map((field) => (
                <div
                  key={field.id}
                  className="flex items-center justify-between p-3.5 rounded-lg border border-slate-200/90 bg-slate-50/50 hover:bg-white hover:border-slate-300 transition-all shadow-2xs"
                >
                  <div className="flex items-center gap-3 min-w-0">
                    {getFieldTypeBadge(field.type)}
                    <div className="min-w-0">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-semibold text-slate-800 text-xs">{field.label}</span>
                        {field.required ? (
                          <span className="text-[10px] font-semibold text-rose-600 bg-rose-50 px-2 py-0.5 rounded-full border border-rose-200/80">
                            Required
                          </span>
                        ) : (
                          <span className="text-[10px] font-medium text-slate-500 bg-slate-100 px-2 py-0.5 rounded-full border border-slate-200">
                            Optional
                          </span>
                        )}
                      </div>
                      <div className="flex items-center gap-2 mt-0.5 text-[11px] text-slate-400">
                        {field.placeholder && (
                          <span>Placeholder: "{field.placeholder}"</span>
                        )}
                        {field.options && field.options.length > 0 && (
                          <span>Choices: {field.options.join(', ')}</span>
                        )}
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => handleRemoveField(field.id)}
                    className="p-1.5 rounded-md text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition-colors cursor-pointer shrink-0 ml-2"
                    title="Remove field"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="p-6 text-center rounded-lg border border-dashed border-slate-200 bg-slate-50/30">
              <p className="text-xs text-slate-500">
                No custom fields added yet. Add dynamic inputs below (e.g. Lead Artists, Show Language, Age Limit, Dress Code).
              </p>
            </div>
          )}

          {/* Clean & Simple Add Field Box */}
          <div className="p-4 sm:p-5 rounded-xl border border-slate-200/90 bg-slate-50/60 space-y-3.5">
            <span className="font-semibold text-slate-800 text-xs block">
              + Add Dynamic Form Prompt
            </span>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3.5 items-end">
              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">
                  Field Label <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="e.g. Lead Artists, Show Language"
                  className="w-full h-10 rounded-md border border-slate-200/90 bg-white hover:bg-slate-50 focus:bg-white px-3 py-2 text-xs text-slate-800 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Input Type</label>
                <select
                  value={newType}
                  onChange={(e) => setNewType(e.target.value as DynamicFieldType)}
                  className="w-full h-10 rounded-md border border-slate-200/90 bg-white hover:bg-slate-50 focus:bg-white px-3 py-2 text-xs text-slate-800 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 cursor-pointer"
                >
                  <option value="text">Text (Single line)</option>
                  <option value="textarea">Long Text (Paragraph)</option>
                  <option value="number">Number</option>
                  <option value="select">Dropdown Choice</option>
                  <option value="radio">Radio Buttons</option>
                  <option value="checkbox">Yes / No Checkbox</option>
                  <option value="date">Date</option>
                  <option value="time">Time</option>
                  <option value="datetime">Date & Time</option>
                </select>
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Placeholder</label>
                <input
                  type="text"
                  value={newPlaceholder}
                  onChange={(e) => setNewPlaceholder(e.target.value)}
                  placeholder="e.g. Enter artist names..."
                  className="w-full h-10 rounded-md border border-slate-200/90 bg-white hover:bg-slate-50 focus:bg-white px-3 py-2 text-xs text-slate-800 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-slate-700 mb-1">Requirement</label>
                <select
                  value={newRequired ? 'required' : 'optional'}
                  onChange={(e) => setNewRequired(e.target.value === 'required')}
                  className="w-full h-10 rounded-md border border-slate-200/90 bg-white hover:bg-slate-50 focus:bg-white px-3 py-2 text-xs text-slate-800 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10 cursor-pointer"
                >
                  <option value="optional">Optional</option>
                  <option value="required">Mandatory (Required)</option>
                </select>
              </div>

              {(newType === 'select' || newType === 'radio') && (
                <div className="sm:col-span-2 md:col-span-4">
                  <label className="block text-xs font-medium text-slate-700 mb-1">
                    {newType === 'radio' ? 'Radio Options (comma-separated)' : 'Dropdown Choices (comma-separated)'}
                  </label>
                  <input
                    type="text"
                    value={newOptionsText}
                    onChange={(e) => setNewOptionsText(e.target.value)}
                    placeholder={
                      newType === 'radio'
                        ? 'e.g. Seated Only, Standing Pit, Hybrid'
                        : 'e.g. Bollywood Playback, Punjabi Pop, Sufi & Ghazal'
                    }
                    className="w-full h-10 rounded-md border border-slate-200/90 bg-white hover:bg-slate-50 focus:bg-white px-3.5 py-2 text-xs text-slate-800 outline-none transition-all focus:border-purple-500 focus:ring-4 focus:ring-purple-500/10"
                  />
                </div>
              )}
            </div>

            <div className="flex justify-end pt-2">
              <button
                type="button"
                onClick={handleAddField}
                disabled={!newLabel.trim()}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed rounded-md transition-all cursor-pointer shadow-sm shadow-purple-200"
              >
                <Plus className="w-4 h-4" />
                <span>Add This Field</span>
              </button>
            </div>
          </div>
        </div>

        {/* Bottom Form Actions */}
        <div className="flex items-center justify-end gap-3 pt-2">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 text-xs font-semibold text-slate-700 bg-white border border-slate-200/90 rounded-md hover:bg-slate-50 transition-all cursor-pointer shadow-2xs"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-5 py-2 text-xs font-semibold text-white bg-purple-600 hover:bg-purple-700 shadow-sm shadow-purple-200 rounded-md transition-all cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>{isEditing ? 'Save Changes' : 'Save Category'}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default CategoryForm;
