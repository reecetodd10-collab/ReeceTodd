import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import Modal from '../shared/Modal';
import Button from '../shared/Button';

export default function AddNoteModal({ isOpen, onClose, onNoteAdded }) {
  const [content, setContent] = useState('');
  const [tag, setTag] = useState('other');

  const handleSave = () => {
    if (!content.trim()) return;

    try {
      const existing = JSON.parse(localStorage.getItem('aviera_notes') || '[]');
      const newNote = {
        id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
        date: new Date().toISOString(),
        content: content.trim(),
        tag: tag,
        relatedTo: null
      };
      
      existing.push(newNote);
      localStorage.setItem('aviera_notes', JSON.stringify(existing));
      
      setContent('');
      setTag('other');
      onNoteAdded();
    } catch (e) {
      console.error('Failed to save note:', e);
      alert('Failed to save note. Please try again.');
    }
  };

  const tags = [
    { value: 'workout', label: '💪 Workout' },
    { value: 'recovery', label: '😴 Recovery' },
    { value: 'supplement', label: '💊 Supplement' },
    { value: 'goal', label: '🎯 Goal' },
    { value: 'other', label: '📝 Other' }
  ];

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      title="Add Note"
      size="md"
    >
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-normal text-[var(--txt)] mb-2">
            Note
          </label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            placeholder="What's on your mind? Track your progress, thoughts, or reminders..."
            className="w-full min-h-[120px] p-3 bg-[var(--bg-elev-1)] border border-[var(--glass-border)] rounded-lg text-[var(--txt)] resize-none focus:outline-none focus:ring-2 focus:ring-[var(--acc)] focus:border-[var(--acc)]"
            maxLength={500}
          />
          <p className="text-xs text-[var(--txt-muted)] mt-1">
            {content.length}/500 characters
          </p>
        </div>

        <div>
          <label className="block text-sm font-normal text-[var(--txt)] mb-2">
            Tag (optional)
          </label>
          <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
            {tags.map((t) => (
              <button
                key={t.value}
                onClick={() => setTag(t.value)}
                className={`p-2 rounded-lg border transition ${
                  tag === t.value
                    ? 'bg-[var(--acc-light)] border-[var(--acc)] text-[var(--acc)]'
                    : 'bg-[var(--bg-elev-1)] border-[var(--glass-border)] text-[var(--txt)] hover:border-[var(--acc)]/30'
                }`}
              >
                <span className="text-sm">{t.label}</span>
              </button>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4">
          <Button
            variant="secondary"
            onClick={onClose}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            variant="primary"
            onClick={handleSave}
            className="flex-1"
            disabled={!content.trim()}
          >
            <FileText size={16} />
            Save Note
          </Button>
        </div>
      </div>
    </Modal>
  );
}

