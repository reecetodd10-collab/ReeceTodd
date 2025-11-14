'use client';

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileText, Plus } from 'lucide-react';
import Link from 'next/link';
import GlassCard from '../shared/GlassCard';
import Button from '../shared/Button';
import AddNoteModal from './AddNoteModal';

const tagLabels = {
  workout: 'Workout',
  recovery: 'Recovery',
  supplement: 'Supplement',
  goal: 'Goal',
  other: 'Other'
};

const tagColors = {
  workout: 'bg-blue-500/20 text-blue-400 border-blue-500/30',
  recovery: 'bg-purple-500/20 text-purple-400 border-purple-500/30',
  supplement: 'bg-green-500/20 text-green-400 border-green-500/30',
  goal: 'bg-yellow-500/20 text-yellow-400 border-yellow-500/30',
  other: 'bg-gray-500/20 text-gray-400 border-gray-500/30'
};

export default function NotesWidget() {
  const [notes, setNotes] = useState([]);
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    loadNotes();
  }, []);

  const loadNotes = () => {
    if (typeof window === 'undefined') return;
    try {
      const saved = localStorage.getItem('aviera_notes');
      if (saved) {
        const parsed = JSON.parse(saved);
        // Sort by date (newest first) and take last 5
        const sorted = parsed.sort((a, b) => new Date(b.date) - new Date(a.date));
        setNotes(sorted.slice(0, 5));
      }
    } catch (e) {
      console.error('Failed to load notes:', e);
    }
  };

  const handleNoteAdded = () => {
    loadNotes();
    setShowAddModal(false);
  };

  const formatDate = (dateString) => {
    if (typeof window === 'undefined') return dateString; // SSR safety
    
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays === 1) return 'Yesterday';
    if (diffDays < 7) return `${diffDays}d ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
  };

  return (
    <>
      <GlassCard className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <FileText className="text-[var(--acc)]" size={20} />
            <h3 className="text-lg font-bold text-[var(--txt)]">Personal Notes</h3>
          </div>
          <Button
            variant="icon"
            onClick={() => setShowAddModal(true)}
            className="w-8 h-8"
          >
            <Plus size={16} />
          </Button>
        </div>

        {notes.length === 0 ? (
          <div className="text-center py-8">
            <FileText className="mx-auto mb-3 text-[var(--txt-muted)]" size={48} />
            <p className="text-[var(--txt-muted)] mb-4">No notes yet</p>
            <Button onClick={() => setShowAddModal(true)} variant="secondary" size="sm">
              <Plus size={16} />
              Add Your First Note
            </Button>
          </div>
        ) : (
          <div className="space-y-3">
            <AnimatePresence>
              {notes.map((note) => (
                <motion.div
                  key={note.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  className="p-3 bg-[var(--bg-elev-1)] rounded-lg border border-[var(--glass-border)] hover:border-[var(--acc)]/30 transition"
                >
                  <div className="flex items-start justify-between gap-2 mb-2">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-xs text-[var(--txt-muted)]">
                          {formatDate(note.date)}
                        </span>
                        {note.tag && (
                          <span className={`text-xs px-2 py-0.5 rounded-full border ${tagColors[note.tag] || tagColors.other}`}>
                            [{tagLabels[note.tag] || 'Other'}]
                          </span>
                        )}
                      </div>
                      <p className="text-sm text-[var(--txt)] whitespace-pre-wrap">
                        {note.content}
                      </p>
                    </div>
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            <Link
              href="/dashboard/notes"
              className="block text-center text-sm text-[var(--acc)] hover:underline pt-2"
            >
              View All Notes →
            </Link>
          </div>
        )}
      </GlassCard>

      <AddNoteModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onNoteAdded={handleNoteAdded}
      />
    </>
  );
}

