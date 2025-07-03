"use client";

import { useState } from "react";
import { Plus, Trash2, Edit, X, Save, GripVertical, Eye, EyeOff, ArrowUp, ArrowDown } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { motion } from "framer-motion";

export interface FieldConfig {
  id: string;
  label: string;
  type: 'text' | 'email' | 'phone' | 'number' | 'select' | 'date' | 'textarea' | 'url' | 'boolean' | 'currency' | 'percentage';
  required?: boolean;
  options?: string[]; // For select fields
  placeholder?: string;
  visible?: boolean;
  order?: number;
  isCustom?: boolean; // To differentiate custom fields from system fields
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
  };
}

interface FieldEditorProps {
  fields: FieldConfig[];
  onFieldsChange: (fields: FieldConfig[]) => void;
  onClose: () => void;
}

export function FieldEditor({ fields, onFieldsChange, onClose }: FieldEditorProps) {
  const [editingField, setEditingField] = useState<FieldConfig | null>(null);
  const [newField, setNewField] = useState<Partial<FieldConfig>>({
    type: 'text',
    visible: true,
    required: false,
    isCustom: true
  });
  const [newOption, setNewOption] = useState("");
  const [editOption, setEditOption] = useState("");

  const fieldTypes = [
    { value: 'text', label: 'Text' },
    { value: 'email', label: 'Email' },
    { value: 'phone', label: 'Phone' },
    { value: 'number', label: 'Number' },
    { value: 'currency', label: 'Currency' },
    { value: 'percentage', label: 'Percentage' },
    { value: 'select', label: 'Dropdown' },
    { value: 'date', label: 'Date' },
    { value: 'textarea', label: 'Long Text' },
    { value: 'url', label: 'Website URL' },
    { value: 'boolean', label: 'Yes/No' }
  ];

  const handleAddField = () => {
    if (!newField.label) return;

    const field: FieldConfig = {
      id: newField.label.toLowerCase().replace(/\s+/g, '_'),
      label: newField.label,
      type: newField.type as any,
      required: newField.required,
      options: newField.options,
      placeholder: newField.placeholder,
      visible: true,
      order: fields.length + 1,
      isCustom: true,
      validation: newField.validation
    };

    onFieldsChange([...fields, field]);
    setNewField({
      type: 'text',
      visible: true,
      required: false,
      isCustom: true
    });
  };

  const handleUpdateField = (fieldId: string, updates: Partial<FieldConfig>) => {
    onFieldsChange(fields.map(field => 
      field.id === fieldId ? { ...field, ...updates } : field
    ));
  };

  const handleDeleteField = (fieldId: string) => {
    if (confirm('Are you sure you want to delete this field? This action cannot be undone.')) {
      onFieldsChange(fields.filter(field => field.id !== fieldId));
    }
  };

  const handleAddOption = () => {
    if (!newOption.trim()) return;
    
    const currentOptions = newField.options || [];
    setNewField({
      ...newField,
      options: [...currentOptions, newOption.trim()]
    });
    setNewOption("");
  };

  const handleRemoveOption = (index: number) => {
    const currentOptions = newField.options || [];
    setNewField({
      ...newField,
      options: currentOptions.filter((_, i) => i !== index)
    });
  };

  const handleEditAddOption = () => {
    if (!editOption.trim() || !editingField) return;
    
    const currentOptions = editingField.options || [];
    setEditingField({
      ...editingField,
      options: [...currentOptions, editOption.trim()]
    });
    setEditOption("");
  };

  const handleEditRemoveOption = (index: number) => {
    if (!editingField) return;
    
    const currentOptions = editingField.options || [];
    setEditingField({
      ...editingField,
      options: currentOptions.filter((_, i) => i !== index)
    });
  };

  const saveEditingField = () => {
    if (!editingField) return;
    
    handleUpdateField(editingField.id, editingField);
    setEditingField(null);
  };

  const toggleFieldVisibility = (fieldId: string) => {
    handleUpdateField(fieldId, { 
      visible: !fields.find(f => f.id === fieldId)?.visible 
    });
  };

  const moveField = (fieldId: string, direction: 'up' | 'down') => {
    const field = fields.find(f => f.id === fieldId);
    if (!field) return;

    const sortedFields = [...fields].sort((a, b) => (a.order || 0) - (b.order || 0));
    const currentIndex = sortedFields.findIndex(f => f.id === fieldId);
    
    if (direction === 'up' && currentIndex > 0) {
      const targetField = sortedFields[currentIndex - 1];
      handleUpdateField(fieldId, { order: targetField.order });
      handleUpdateField(targetField.id, { order: field.order });
    } else if (direction === 'down' && currentIndex < sortedFields.length - 1) {
      const targetField = sortedFields[currentIndex + 1];
      handleUpdateField(fieldId, { order: targetField.order });
      handleUpdateField(targetField.id, { order: field.order });
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background border border-border rounded-lg shadow-xl w-full max-w-6xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Field Management</h3>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Add New Field */}
            <div>
              <h4 className="text-md font-medium text-foreground mb-4">Add New Field</h4>
              <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/10">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Field Label *
                  </label>
                  <Input
                    value={newField.label || ''}
                    onChange={(e) => setNewField({ ...newField, label: e.target.value })}
                    placeholder="e.g., Customer ID, Lead Source"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Field Type *
                  </label>
                  <select
                    value={newField.type}
                    onChange={(e) => setNewField({ ...newField, type: e.target.value as any })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    {fieldTypes.map(type => (
                      <option key={type.value} value={type.value}>{type.label}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Placeholder Text
                  </label>
                  <Input
                    value={newField.placeholder || ''}
                    onChange={(e) => setNewField({ ...newField, placeholder: e.target.value })}
                    placeholder="Enter placeholder text"
                  />
                </div>

                {newField.type === 'select' && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Options
                    </label>
                    <div className="space-y-2">
                      {newField.options?.map((option, index) => (
                        <div key={index} className="flex items-center gap-2">
                          <Input value={option} readOnly className="flex-1" />
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => handleRemoveOption(index)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      ))}
                      <div className="flex items-center gap-2">
                        <Input
                          value={newOption}
                          onChange={(e) => setNewOption(e.target.value)}
                          placeholder="Add option"
                          onKeyPress={(e) => e.key === 'Enter' && handleAddOption()}
                        />
                        <Button onClick={handleAddOption} size="sm">
                          <Plus className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {(newField.type === 'number' || newField.type === 'currency' || newField.type === 'percentage') && (
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Min Value
                      </label>
                      <Input
                        type="number"
                        value={newField.validation?.min || ''}
                        onChange={(e) => setNewField({
                          ...newField,
                          validation: { ...newField.validation, min: parseInt(e.target.value) }
                        })}
                        placeholder="0"
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Max Value
                      </label>
                      <Input
                        type="number"
                        value={newField.validation?.max || ''}
                        onChange={(e) => setNewField({
                          ...newField,
                          validation: { ...newField.validation, max: parseInt(e.target.value) }
                        })}
                        placeholder="1000000"
                      />
                    </div>
                  </div>
                )}

                <div className="flex items-center gap-4">
                  <label className="flex items-center gap-2">
                    <input
                      type="checkbox"
                      checked={newField.required || false}
                      onChange={(e) => setNewField({ ...newField, required: e.target.checked })}
                      className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-border rounded"
                    />
                    <span className="text-sm text-foreground">Required field</span>
                  </label>
                </div>

                <Button 
                  onClick={handleAddField}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={!newField.label}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Field
                </Button>
              </div>
            </div>

            {/* Edit Field */}
            {editingField && (
              <div>
                <h4 className="text-md font-medium text-foreground mb-4">Edit Field</h4>
                <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/10">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Field Label *
                    </label>
                    <Input
                      value={editingField.label}
                      onChange={(e) => setEditingField({ ...editingField, label: e.target.value })}
                      placeholder="Field label"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Field Type
                    </label>
                    <select
                      value={editingField.type}
                      onChange={(e) => setEditingField({ ...editingField, type: e.target.value as any })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                      disabled={!editingField.isCustom}
                    >
                      {fieldTypes.map(type => (
                        <option key={type.value} value={type.value}>{type.label}</option>
                      ))}
                    </select>
                    {!editingField.isCustom && (
                      <p className="text-xs text-muted-foreground mt-1">System fields cannot change type</p>
                    )}
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Placeholder Text
                    </label>
                    <Input
                      value={editingField.placeholder || ''}
                      onChange={(e) => setEditingField({ ...editingField, placeholder: e.target.value })}
                      placeholder="Enter placeholder text"
                    />
                  </div>

                  {editingField.type === 'select' && (
                    <div>
                      <label className="text-sm font-medium text-foreground mb-2 block">
                        Options
                      </label>
                      <div className="space-y-2">
                        {editingField.options?.map((option, index) => (
                          <div key={index} className="flex items-center gap-2">
                            <Input value={option} readOnly className="flex-1" />
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => handleEditRemoveOption(index)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        ))}
                        <div className="flex items-center gap-2">
                          <Input
                            value={editOption}
                            onChange={(e) => setEditOption(e.target.value)}
                            placeholder="Add option"
                            onKeyPress={(e) => e.key === 'Enter' && handleEditAddOption()}
                          />
                          <Button onClick={handleEditAddOption} size="sm">
                            <Plus className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  )}

                  {(editingField.type === 'number' || editingField.type === 'currency' || editingField.type === 'percentage') && (
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Min Value
                        </label>
                        <Input
                          type="number"
                          value={editingField.validation?.min || ''}
                          onChange={(e) => setEditingField({
                            ...editingField,
                            validation: { ...editingField.validation, min: parseInt(e.target.value) }
                          })}
                          placeholder="0"
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium text-foreground mb-2 block">
                          Max Value
                        </label>
                        <Input
                          type="number"
                          value={editingField.validation?.max || ''}
                          onChange={(e) => setEditingField({
                            ...editingField,
                            validation: { ...editingField.validation, max: parseInt(e.target.value) }
                          })}
                          placeholder="1000000"
                        />
                      </div>
                    </div>
                  )}

                  <div className="flex items-center gap-4">
                    <label className="flex items-center gap-2">
                      <input
                        type="checkbox"
                        checked={editingField.required || false}
                        onChange={(e) => setEditingField({ ...editingField, required: e.target.checked })}
                        className="h-4 w-4 text-orange-500 focus:ring-orange-500 border-border rounded"
                      />
                      <span className="text-sm text-foreground">Required field</span>
                    </label>
                  </div>

                  <div className="flex gap-2">
                    <Button 
                      onClick={saveEditingField}
                      className="flex-1 bg-orange-500 hover:bg-orange-600 text-white"
                    >
                      <Save className="h-4 w-4 mr-2" />
                      Save Changes
                    </Button>
                    <Button 
                      variant="outline"
                      onClick={() => setEditingField(null)}
                    >
                      Cancel
                    </Button>
                  </div>
                </div>
              </div>
            )}

            {/* All Fields List */}
            <div>
              <h4 className="text-md font-medium text-foreground mb-4">All Fields</h4>
              <div className="space-y-2 max-h-[500px] overflow-y-auto">
                {fields.sort((a, b) => (a.order || 0) - (b.order || 0)).map((field, index) => (
                  <motion.div
                    key={field.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`flex items-center justify-between p-3 rounded-lg border ${
                      field.visible 
                        ? 'bg-muted/20 border-border/30' 
                        : 'bg-muted/10 border-border/20 opacity-50'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <GripVertical className="h-4 w-4 text-muted-foreground" />
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-medium text-foreground">{field.label}</span>
                          {!field.visible && (
                            <span className="text-xs px-2 py-1 bg-gray-500/20 text-gray-500 rounded">Hidden</span>
                          )}
                        </div>
                        <div className="text-xs text-muted-foreground">
                          {field.type} {field.required && '• Required'} {field.isCustom && '• Custom'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => toggleFieldVisibility(field.id)}
                        title={field.visible ? 'Hide field' : 'Show field'}
                      >
                        {field.visible ? <Eye className="h-3 w-3" /> : <EyeOff className="h-3 w-3" />}
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveField(field.id, 'up')}
                        disabled={index === 0}
                      >
                        <ArrowUp className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => moveField(field.id, 'down')}
                        disabled={index === fields.length - 1}
                      >
                        <ArrowDown className="h-3 w-3" />
                      </Button>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => setEditingField(field)}
                      >
                        <Edit className="h-3 w-3" />
                      </Button>
                      {field.isCustom && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleDeleteField(field.id)}
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      )}
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <div className="flex justify-end gap-3 p-6 border-t border-border">
          <Button variant="outline" onClick={onClose}>
            Done
          </Button>
        </div>
      </motion.div>
    </div>
  );
} 