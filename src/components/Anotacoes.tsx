import React, { useState, useRef, useMemo } from 'react';
import { Notebook, Search, Trash2, Edit2, Bold, Italic, List as ListIcon, Maximize2, Tag, ChevronDown, CheckCircle2 } from 'lucide-react';
import { useData } from '../lib/useData';

const CATEGORIES = ['Geral', 'Matemática', 'Biologia', 'Química', 'Física', 'Português', 'Humanas', 'Redação'];

export function Anotacoes() {
  const { notes, addNote, updateNote, deleteNote } = useData();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  
  const [isEditing, setIsEditing] = useState(false);
  const [currentNoteId, setCurrentNoteId] = useState<string | null>(null);
  const [noteText, setNoteText] = useState('');
  const [noteCategory, setNoteCategory] = useState('Geral');
  
  const [viewingNote, setViewingNote] = useState<any>(null);
  const [showToast, setShowToast] = useState(false);
  
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const filteredNotes = useMemo(() => {
    return (notes || []).filter(note => {
      const matchesSearch = note.text?.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCat = selectedCategory === 'Todas' || note.category === selectedCategory;
      return matchesSearch && matchesCat;
    });
  }, [notes, searchTerm, selectedCategory]);

  const triggerToast = () => {
    setShowToast(true);
    setTimeout(() => setShowToast(false), 3000);
  };

  const handleSave = async () => {
    if (!noteText.trim()) return;
    
    if (isEditing && currentNoteId) {
      await updateNote(currentNoteId, { text: noteText, category: noteCategory });
    } else {
      await addNote({ text: noteText, category: noteCategory });
    }
    
    setNoteText('');
    setNoteCategory('Geral');
    setIsEditing(false);
    setCurrentNoteId(null);
    triggerToast();
  };

  const handleEdit = (note: any) => {
    setNoteText(note.text);
    setNoteCategory(note.category || 'Geral');
    setCurrentNoteId(note.id);
    setIsEditing(true);
    setViewingNote(null);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Tem certeza que deseja excluir esta anotação?')) {
      await deleteNote(id);
      if (viewingNote?.id === id) setViewingNote(null);
    }
  };

  const insertFormat = (prefix: string, suffix: string = '') => {
    const area = textareaRef.current;
    if (!area) return;
    const start = area.selectionStart;
    const end = area.selectionEnd;
    const text = area.value;
    const before = text.substring(0, start);
    const selected = text.substring(start, end);
    const after = text.substring(end, text.length);
    
    const newText = before + prefix + selected + suffix + after;
    setNoteText(newText);
    
    setTimeout(() => {
      area.focus();
      area.setSelectionRange(start + prefix.length, end + prefix.length);
    }, 0);
  };

  return (
    <div className="p-6 md:p-8 flex-1 flex flex-col md:flex-row gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500 max-w-7xl mx-auto w-full">
      
      {/* Visual Feedback Toast */}
      {showToast && (
        <div className="fixed top-6 right-6 z-50 bg-success text-white px-4 py-3 rounded-lg shadow-xl font-bold flex items-center gap-2 animate-in slide-in-from-top-4 fade-in">
          <CheckCircle2 className="w-5 h-5" /> Salvo com sucesso!
        </div>
      )}

      {/* View Note Modal / Overlay */}
      {viewingNote && (
        <div className="fixed inset-0 z-40 bg-background/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-card border border-border w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[85vh] animate-in zoom-in-95">
             <div className="flex justify-between items-center p-5 border-b border-border bg-surface">
                <div>
                  <div className="text-[10px] uppercase font-bold tracking-widest text-primary mb-1">
                    {viewingNote.category || 'Geral'}
                  </div>
                  <div className="text-xs text-gray-400">
                    {new Date(viewingNote.createdAt).toLocaleString('pt-BR')}
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(viewingNote)} className="p-2 bg-surface hover:bg-white/10 text-gray-300 rounded transition-colors"><Edit2 className="w-4 h-4" /></button>
                  <button onClick={() => handleDelete(viewingNote.id)} className="p-2 bg-surface hover:bg-red-500/20 text-red-400 rounded transition-colors"><Trash2 className="w-4 h-4" /></button>
                  <button onClick={() => setViewingNote(null)} className="p-2 bg-surface hover:bg-white/10 text-gray-300 rounded font-bold px-4">Fechar</button>
                </div>
             </div>
             <div className="p-6 overflow-y-auto whitespace-pre-wrap text-gray-200 leading-relaxed text-sm">
                {viewingNote.text}
             </div>
          </div>
        </div>
      )}

      {/* LEFT COLUMN: Editor */}
      <div className="w-full md:w-2/5 xl:w-1/3 flex flex-col gap-4">
        
        <div className="bg-card rounded-xl p-5 border border-border tracking-tight shadow-md flex items-center gap-3">
          <Notebook className="w-6 h-6 text-primary" />
          <h2 className="text-xl font-bold text-white leading-none">Bloco de Notas</h2>
        </div>

        <div className="bg-card rounded-xl border border-border p-4 shadow-sm flex flex-col flex-1 min-h-[400px]">
          
          <div className="flex justify-between items-center mb-3">
             <h3 className="font-bold text-sm text-gray-300 uppercase tracking-widest">
               {isEditing ? 'Editando Nota' : 'Nova Anotação'}
             </h3>
             {isEditing && (
               <button onClick={() => { setIsEditing(false); setNoteText(''); setCurrentNoteId(null); }} className="text-[10px] text-gray-500 hover:text-primary transition-colors">
                 Cancelar Edição
               </button>
             )}
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            <select 
              value={noteCategory} 
              onChange={e => setNoteCategory(e.target.value)}
              className="bg-surface text-gray-200 text-xs border border-border rounded px-3 py-1.5 focus:outline-none focus:border-primary cursor-pointer font-medium"
            >
              {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
            </select>

            <div className="flex bg-surface border border-border rounded overflow-hidden">
               <button onClick={() => insertFormat('**', '**')} className="px-3 hover:bg-white/5 text-gray-400 hover:text-gray-200 transition-colors border-r border-border" title="Negrito"><Bold className="w-3 h-3" /></button>
               <button onClick={() => insertFormat('*', '*')} className="px-3 hover:bg-white/5 text-gray-400 hover:text-gray-200 transition-colors border-r border-border" title="Itálico"><Italic className="w-3 h-3" /></button>
               <button onClick={() => insertFormat('\n- ')} className="px-3 hover:bg-white/5 text-gray-400 hover:text-gray-200 transition-colors" title="Lista"><ListIcon className="w-3 h-3" /></button>
            </div>
          </div>

          <textarea
            ref={textareaRef}
            value={noteText}
            onChange={e => setNoteText(e.target.value)}
            onKeyDown={(e) => {
              if (e.ctrlKey || e.metaKey) {
                if (e.key === 'b') {
                  e.preventDefault();
                  insertFormat('**', '**');
                } else if (e.key === 'i') {
                  e.preventDefault();
                  insertFormat('*', '*');
                }
              }
            }}
            placeholder="Digite algo importante..."
            className="flex-1 w-full bg-surface border border-border rounded-lg p-3 text-sm text-gray-200 placeholder:text-gray-600 focus:outline-none focus:border-primary resize-none leading-relaxed font-serif"
          />

          <button 
            onClick={handleSave}
            disabled={!noteText.trim()}
            className="mt-4 w-full bg-primary hover:bg-blue-600 text-white font-bold py-2.5 rounded-lg transition-all disabled:opacity-50 flex items-center justify-center gap-2 text-sm shadow-md"
          >
            <CheckCircle2 className="w-4 h-4" /> {isEditing ? 'Salvar Edição' : 'Salvar Nota'}
          </button>
          
        </div>
      </div>

      {/* RIGHT COLUMN: List */}
      <div className="flex-1 flex flex-col gap-4 min-h-[400px]">
        {/* Filters */}
        <div className="bg-card rounded-xl border border-border p-4 shadow-sm flex flex-col sm:flex-row gap-3">
           <div className="flex-1 relative">
             <Search className="w-4 h-4 text-gray-500 absolute left-3 top-1/2 -translate-y-1/2" />
             <input 
               type="text" 
               placeholder="Pesquisar nas anotações..." 
               value={searchTerm}
               onChange={e => setSearchTerm(e.target.value)}
               className="w-full bg-surface border border-border rounded-lg pl-9 pr-3 py-2 text-sm text-gray-200 focus:outline-none focus:border-primary"
             />
           </div>
           <div className="relative shrink-0 flex items-center bg-surface border border-border rounded-lg px-3">
             <Tag className="w-4 h-4 text-gray-500 mr-2" />
             <select 
               value={selectedCategory} 
               onChange={e => setSelectedCategory(e.target.value)}
               className="bg-transparent text-gray-200 text-sm focus:outline-none appearance-none pr-8 cursor-pointer py-2"
             >
               <option value="Todas">Todas as matérias</option>
               {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
             </select>
             <ChevronDown className="w-3 h-3 text-gray-500 absolute right-3 pointer-events-none" />
           </div>
        </div>

        {/* Notes Grid/List */}
        <div className="flex-1 overflow-y-auto pr-2 space-y-4 pb-10">
           {filteredNotes.length === 0 ? (
             <div className="h-full flex flex-col items-center justify-center p-8 text-center text-gray-500 border-2 border-dashed border-border rounded-xl">
               <Notebook className="w-12 h-12 mb-3 opacity-20" />
               <p className="text-sm">Nenhuma nota encontrada.</p>
             </div>
           ) : (
             filteredNotes.map(note => (
               <div key={note.id} className="bg-card rounded-xl border border-border p-5 hover:border-primary/50 transition-colors group flex flex-col shadow-sm">
                  <div className="flex justify-between items-start mb-3">
                     <span className="text-[10px] bg-primary/10 text-primary border border-primary/20 px-2 py-0.5 rounded font-bold uppercase tracking-widest">{note.category || 'Geral'}</span>
                     <span className="text-xs text-gray-500 font-mono">{new Date(note.createdAt).toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' })}</span>
                  </div>
                  
                  <div className="text-sm text-gray-300 leading-relaxed mb-4 line-clamp-3 whitespace-pre-wrap flex-1">
                    {note.text}
                  </div>
                  
                  <div className="flex justify-between items-center pt-3 border-t border-border opacity-60 group-hover:opacity-100 transition-opacity">
                     <button onClick={() => setViewingNote(note)} className="text-xs font-bold text-gray-300 hover:text-white flex items-center gap-1 transition-colors">
                       <Maximize2 className="w-3.5 h-3.5" /> Ver completa
                     </button>
                     <div className="flex gap-3">
                       <button onClick={() => handleEdit(note)} className="text-xs font-bold text-gray-400 hover:text-primary transition-colors flex items-center gap-1">
                         <Edit2 className="w-3.5 h-3.5" /> Editar
                       </button>
                       <button onClick={() => handleDelete(note.id)} className="text-xs font-bold text-gray-400 hover:text-red-400 transition-colors flex items-center gap-1">
                         <Trash2 className="w-3.5 h-3.5" /> Excluir
                       </button>
                     </div>
                  </div>
               </div>
             ))
           )}
        </div>
      </div>

    </div>
  );
}
