
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  Save, 
  X, 
  Upload, 
  Image as ImageIcon,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';
import { ReferenceImage, Section } from '../types';
import { SECTIONS, COMMON_TAGS } from '../constants';
import { saveReference } from '../lib/storage';

const AdminForm: React.FC<{ references?: ReferenceImage[], onSave: () => void }> = ({ references = [], onSave }) => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isEditing = !!id;

  const [formData, setFormData] = useState<Partial<ReferenceImage>>({
    title: '',
    customer: '',
    orderNumber: '',
    section: 'Door',
    tags: [],
    notes: '',
    image: { type: 'url', value: 'https://picsum.photos/800/600?industrial' }
  });

  const [newTag, setNewTag] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);

  useEffect(() => {
    if (isEditing && references.length > 0) {
      const existing = references.find(r => r.id === id);
      if (existing) {
        setFormData(existing);
      }
    }
  }, [id, isEditing, references]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const reference: ReferenceImage = {
      ...formData as ReferenceImage,
      id: formData.id || `ref-${Date.now()}`,
      createdAt: formData.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    saveReference(reference);
    onSave();
    setIsSuccess(true);
    setTimeout(() => {
      navigate(`/reference/${reference.id}`);
    }, 1500);
  };

  const addTag = () => {
    if (newTag && !formData.tags?.includes(newTag)) {
      setFormData({ ...formData, tags: [...(formData.tags || []), newTag] });
      setNewTag('');
    }
  };

  const removeTag = (tag: string) => {
    setFormData({ ...formData, tags: formData.tags?.filter(t => t !== tag) });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setFormData({
          ...formData,
          image: { type: 'base64', value: reader.result as string }
        });
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="max-w-4xl mx-auto animate-in slide-in-from-right-4 duration-300">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h2 className="text-3xl font-bold text-slate-900">{isEditing ? 'Edit Reference' : 'Add New Reference'}</h2>
          <p className="text-slate-500">Document a new wiring standard or update existing records.</p>
        </div>
        <button 
          onClick={() => navigate(-1)}
          className="p-2 text-slate-400 hover:text-slate-600 hover:bg-white rounded-full transition-all"
        >
          <X size={24} />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-schneider">
                <AlertCircle size={18} />
                Basic Information
              </h3>
              
              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Title</label>
                <input 
                  required
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-schneider focus:ring-2 focus:ring-schneider/10"
                  value={formData.title}
                  onChange={e => setFormData({ ...formData, title: e.target.value })}
                  placeholder="e.g. Side Terminal Routing - Gen 2"
                />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Customer</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-schneider focus:ring-2 focus:ring-schneider/10"
                    value={formData.customer}
                    onChange={e => setFormData({ ...formData, customer: e.target.value })}
                    placeholder="Customer Name"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold text-slate-400 uppercase">Order #</label>
                  <input 
                    required
                    type="text" 
                    className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-schneider focus:ring-2 focus:ring-schneider/10 font-mono"
                    value={formData.orderNumber}
                    onChange={e => setFormData({ ...formData, orderNumber: e.target.value })}
                    placeholder="ORD-XXX"
                  />
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Panel Section</label>
                <select 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-schneider focus:ring-2 focus:ring-schneider/10"
                  value={formData.section}
                  onChange={e => setFormData({ ...formData, section: e.target.value as Section })}
                >
                  {SECTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4">
              <h3 className="font-bold flex items-center gap-2 text-schneider">
                <CheckCircle2 size={18} />
                Standards & Tags
              </h3>
              
              <div className="space-y-3">
                <div className="flex flex-wrap gap-2 mb-2">
                  {formData.tags?.map(tag => (
                    <span key={tag} className="flex items-center gap-1 px-2 py-1 bg-schneider/10 text-schneider text-xs font-bold rounded-lg border border-schneider/20">
                      {tag}
                      <button type="button" onClick={() => removeTag(tag)} className="hover:text-red-500">
                        <X size={12} />
                      </button>
                    </span>
                  ))}
                </div>
                <div className="flex gap-2">
                  <input 
                    type="text" 
                    list="common-tags"
                    className="flex-1 px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-schneider"
                    value={newTag}
                    onChange={e => setNewTag(e.target.value)}
                    onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add a tag..."
                  />
                  <datalist id="common-tags">
                    {COMMON_TAGS.map(t => <option key={t} value={t} />)}
                  </datalist>
                  <button 
                    type="button"
                    onClick={addTag}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold rounded-lg transition-colors"
                  >
                    Add
                  </button>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Inspection Notes</label>
                <textarea 
                  rows={4}
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-schneider focus:ring-2 focus:ring-schneider/10 resize-none"
                  value={formData.notes}
                  onChange={e => setFormData({ ...formData, notes: e.target.value })}
                  placeholder="Describe the wiring configuration and any specific standards applied..."
                />
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm space-y-4 h-full flex flex-col">
              <h3 className="font-bold flex items-center gap-2 text-schneider">
                <ImageIcon size={18} />
                Reference Media
              </h3>
              
              <div className="flex-1 border-2 border-dashed border-slate-200 rounded-2xl p-4 flex flex-col items-center justify-center bg-slate-50 overflow-hidden min-h-[300px] relative">
                {formData.image?.value ? (
                  <div className="w-full h-full flex flex-col">
                    <img 
                      src={formData.image.value} 
                      alt="Preview" 
                      className="max-w-full max-h-full object-contain mx-auto"
                    />
                    <button 
                      type="button"
                      onClick={() => setFormData({ ...formData, image: { type: 'url', value: '' } })}
                      className="absolute top-2 right-2 p-1 bg-white/80 rounded-full shadow-md text-red-500"
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <div className="text-center space-y-4">
                    <Upload className="mx-auto text-slate-300" size={48} />
                    <div>
                      <p className="font-bold text-slate-500">Drop image here</p>
                      <p className="text-xs text-slate-400">or click to browse</p>
                    </div>
                  </div>
                )}
                <input 
                  type="file" 
                  accept="image/*"
                  className="absolute inset-0 opacity-0 cursor-pointer"
                  onChange={handleFileChange}
                />
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-400 uppercase">Image URL (Optional Alternative)</label>
                <input 
                  type="text" 
                  className="w-full px-4 py-2 bg-slate-50 border border-slate-200 rounded-lg outline-none focus:border-schneider"
                  value={formData.image?.type === 'url' ? formData.image.value : ''}
                  onChange={e => setFormData({ 
                    ...formData, 
                    image: { type: 'url', value: e.target.value } 
                  })}
                  placeholder="https://example.com/image.jpg"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-end gap-4 pb-12">
          <button 
            type="button" 
            onClick={() => navigate(-1)}
            className="px-6 py-3 font-bold text-slate-500 hover:text-slate-900 transition-colors"
          >
            Cancel
          </button>
          <button 
            type="submit"
            disabled={isSuccess}
            className={`
              flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-white shadow-lg transition-all
              ${isSuccess ? 'bg-schneider scale-95' : 'bg-schneider hover-bg-schneider-deep'}
            `}
          >
            {isSuccess ? (
              <>
                <CheckCircle2 size={20} />
                Saved Successfully
              </>
            ) : (
              <>
                <Save size={20} />
                {isEditing ? 'Update Reference' : 'Save Reference'}
              </>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

export default AdminForm;
