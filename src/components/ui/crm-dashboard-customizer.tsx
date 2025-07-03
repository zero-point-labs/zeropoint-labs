"use client";

import { useState } from "react";
import { Save, X, Plus, Trash2, Calculator } from "lucide-react";
import { Button } from "./button";
import { Input } from "./input";
import { motion } from "framer-motion";
import * as Icons from "lucide-react";

export interface DashboardCardConfig {
  id: string;
  label: string;
  field?: string; // Which field to aggregate
  calculation: 'count' | 'sum' | 'average' | 'custom';
  filter?: {
    field: string;
    operator: 'equals' | 'not_equals' | 'contains' | 'greater_than' | 'less_than';
    value: any;
  };
  icon: string;
  color: string;
  order: number;
  visible: boolean;
  customFormula?: string;
}

interface DashboardCustomizerProps {
  cards: DashboardCardConfig[];
  fields: any[];
  onCardsChange: (cards: DashboardCardConfig[]) => void;
  onClose: () => void;
}

const iconOptions = [
  'Users', 'UserPlus', 'UserCheck', 'Building', 'DollarSign', 'TrendingUp', 
  'TrendingDown', 'BarChart3', 'PieChart', 'Activity', 'Target', 'Award',
  'Star', 'Heart', 'ThumbsUp', 'Calendar', 'Clock', 'CheckCircle',
  'AlertCircle', 'Info', 'HelpCircle', 'Mail', 'Phone', 'Globe'
];

const colorOptions = [
  { value: 'from-blue-400 to-blue-600', label: 'Blue' },
  { value: 'from-green-400 to-green-600', label: 'Green' },
  { value: 'from-purple-400 to-purple-600', label: 'Purple' },
  { value: 'from-orange-400 to-orange-600', label: 'Orange' },
  { value: 'from-red-400 to-red-600', label: 'Red' },
  { value: 'from-yellow-400 to-yellow-600', label: 'Yellow' },
  { value: 'from-pink-400 to-pink-600', label: 'Pink' },
  { value: 'from-indigo-400 to-indigo-600', label: 'Indigo' }
];

export function DashboardCustomizer({ cards, fields, onCardsChange, onClose }: DashboardCustomizerProps) {
  const [editingCard, setEditingCard] = useState<DashboardCardConfig | null>(null);
  const [newCard, setNewCard] = useState<Partial<DashboardCardConfig>>({
    calculation: 'count',
    icon: 'Users',
    color: 'from-blue-400 to-blue-600',
    visible: true
  });

  const handleAddCard = () => {
    if (!newCard.label) return;

    const card: DashboardCardConfig = {
      id: newCard.label.toLowerCase().replace(/\s+/g, '_'),
      label: newCard.label,
      field: newCard.field,
      calculation: newCard.calculation as any,
      filter: newCard.filter,
      icon: newCard.icon || 'Users',
      color: newCard.color || 'from-blue-400 to-blue-600',
      order: cards.length + 1,
      visible: true,
      customFormula: newCard.customFormula
    };

    onCardsChange([...cards, card]);
    setNewCard({
      calculation: 'count',
      icon: 'Users',
      color: 'from-blue-400 to-blue-600',
      visible: true
    });
  };

  const handleUpdateCard = (cardId: string, updates: Partial<DashboardCardConfig>) => {
    onCardsChange(cards.map(card => 
      card.id === cardId ? { ...card, ...updates } : card
    ));
  };

  const handleDeleteCard = (cardId: string) => {
    if (confirm('Are you sure you want to delete this card?')) {
      onCardsChange(cards.filter(card => card.id !== cardId));
    }
  };

  const getIconComponent = (iconName: string) => {
    const Icon = Icons[iconName as keyof typeof Icons] as any;
    return Icon ? <Icon className="h-4 w-4" /> : <Icons.HelpCircle className="h-4 w-4" />;
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-background border border-border rounded-lg shadow-xl w-full max-w-5xl max-h-[90vh] overflow-hidden flex flex-col"
      >
        <div className="flex items-center justify-between p-6 border-b border-border">
          <h3 className="text-lg font-semibold text-foreground">Dashboard Card Customization</h3>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex-1 overflow-y-auto p-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Add New Card */}
            <div>
              <h4 className="text-md font-medium text-foreground mb-4">Add New Dashboard Card</h4>
              <div className="space-y-4 p-4 border border-border rounded-lg bg-muted/10">
                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Card Label *
                  </label>
                  <Input
                    value={newCard.label || ''}
                    onChange={(e) => setNewCard({ ...newCard, label: e.target.value })}
                    placeholder="e.g., High Value Customers"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Calculation Type *
                  </label>
                  <select
                    value={newCard.calculation}
                    onChange={(e) => setNewCard({ ...newCard, calculation: e.target.value as any })}
                    className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                  >
                    <option value="count">Count</option>
                    <option value="sum">Sum</option>
                    <option value="average">Average</option>
                    <option value="custom">Custom Formula</option>
                  </select>
                </div>

                {(newCard.calculation === 'sum' || newCard.calculation === 'average') && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Field to Calculate
                    </label>
                    <select
                      value={newCard.field || ''}
                      onChange={(e) => setNewCard({ ...newCard, field: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">Select a field</option>
                      {fields.filter(f => f.type === 'number' || f.type === 'currency').map(field => (
                        <option key={field.id} value={field.id}>{field.label}</option>
                      ))}
                    </select>
                  </div>
                )}

                {newCard.calculation === 'custom' && (
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Custom Formula
                    </label>
                    <Input
                      value={newCard.customFormula || ''}
                      onChange={(e) => setNewCard({ ...newCard, customFormula: e.target.value })}
                      placeholder="e.g., {active_count} / {total_count} * 100"
                    />
                    <p className="text-xs text-muted-foreground mt-1">
                      Use field IDs in curly braces: {'{field_id}'}
                    </p>
                  </div>
                )}

                <div>
                  <label className="text-sm font-medium text-foreground mb-2 block">
                    Filter (Optional)
                  </label>
                  <div className="space-y-2">
                    <select
                      value={newCard.filter?.field || ''}
                      onChange={(e) => setNewCard({
                        ...newCard,
                        filter: e.target.value ? { ...newCard.filter, field: e.target.value } as any : undefined
                      })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      <option value="">No filter</option>
                      {fields.map(field => (
                        <option key={field.id} value={field.id}>{field.label}</option>
                      ))}
                    </select>

                    {newCard.filter?.field && (
                      <>
                        <select
                          value={newCard.filter.operator || 'equals'}
                          onChange={(e) => setNewCard({
                            ...newCard,
                            filter: { ...newCard.filter!, operator: e.target.value as any }
                          })}
                          className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                        >
                          <option value="equals">Equals</option>
                          <option value="not_equals">Not Equals</option>
                          <option value="contains">Contains</option>
                          <option value="greater_than">Greater Than</option>
                          <option value="less_than">Less Than</option>
                        </select>

                        <Input
                          value={newCard.filter.value || ''}
                          onChange={(e) => setNewCard({
                            ...newCard,
                            filter: { ...newCard.filter!, value: e.target.value }
                          })}
                          placeholder="Filter value"
                        />
                      </>
                    )}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Icon
                    </label>
                    <select
                      value={newCard.icon}
                      onChange={(e) => setNewCard({ ...newCard, icon: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {iconOptions.map(icon => (
                        <option key={icon} value={icon}>{icon}</option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label className="text-sm font-medium text-foreground mb-2 block">
                      Color
                    </label>
                    <select
                      value={newCard.color}
                      onChange={(e) => setNewCard({ ...newCard, color: e.target.value })}
                      className="w-full px-3 py-2 border border-border rounded-md bg-background text-foreground focus:outline-none focus:ring-2 focus:ring-orange-500"
                    >
                      {colorOptions.map(color => (
                        <option key={color.value} value={color.value}>{color.label}</option>
                      ))}
                    </select>
                  </div>
                </div>

                <Button 
                  onClick={handleAddCard}
                  className="w-full bg-orange-500 hover:bg-orange-600 text-white"
                  disabled={!newCard.label}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Card
                </Button>
              </div>
            </div>

            {/* Existing Cards */}
            <div>
              <h4 className="text-md font-medium text-foreground mb-4">Dashboard Cards</h4>
              <div className="space-y-2">
                {cards.map((card, index) => (
                  <motion.div
                    key={card.id}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/20 border border-border/30"
                  >
                    <div className="flex items-center gap-3">
                      <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${card.color} flex items-center justify-center`}>
                        {getIconComponent(card.icon)}
                      </div>
                      <div>
                        <span className="text-sm font-medium text-foreground">{card.label}</span>
                        <div className="text-xs text-muted-foreground">
                          {card.calculation} {card.field && `• ${card.field}`}
                          {card.filter && ' • Filtered'}
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleDeleteCard(card.id)}
                        className="text-red-500 hover:text-red-600"
                      >
                        <Trash2 className="h-3 w-3" />
                      </Button>
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