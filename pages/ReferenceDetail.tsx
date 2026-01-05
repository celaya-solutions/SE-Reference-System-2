
import React, { useMemo, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  ArrowLeft, 
  Edit3, 
  Trash2, 
  Calendar, 
  Hash, 
  Briefcase, 
  Layers, 
  Info,
  Sparkles,
  Loader2,
  CheckCircle2,
  AlertTriangle,
  XCircle
} from 'lucide-react';
import { ReferenceImage } from '../types';
import { deleteReference } from '../lib/storage';
import { auditWiringImage, AuditResult } from '../services/gemini';

const ReferenceDetail: React.FC<{ references: ReferenceImage[] }> = ({ references }) => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [isAuditing, setIsAuditing] = useState(false);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);

  const ref = useMemo(() => references.find(r => r.id === id), [references, id]);

  const related = useMemo(() => {
    if (!ref) return [];
    return references
      .filter(r => r.id !== ref.id && (r.customer === ref.customer || r.tags.some(t => ref.tags.includes(t))))
      .slice(0, 4);
  }, [references, ref]);

  if (!ref) {
    return (
      <div className="text-center py-20">
        <h3 className="text-xl font-bold">Reference not found</h3>
        <Link to="/library" className="text-schneider hover:underline mt-4 inline-block">Back to Library</Link>
      </div>
    );
  }

  const handleRunAudit = async () => {
    setIsAuditing(true);
    try {
      // For the demo, if it's a standard Lorem Picsum URL, we can't easily audit it with Gemini 
      // since Gemini needs the actual bytes. We'll use a placeholder logic if it's a URL, 
      // but the service is ready for real base64.
      const result = await auditWiringImage(
        ref.image.value, 
        ref.section, 
        "Routing consistency, bundling, label placement, bend radius, clearance."
      );
      setAuditResult(result);
    } catch (error) {
      console.error("Audit failed", error);
      alert("AI Audit failed. Ensure you have a valid image and API key.");
    } finally {
      setIsAuditing(false);
    }
  };

  const handleDelete = () => {
    if (window.confirm("Are you sure you want to delete this reference?")) {
      deleteReference(ref.id);
      navigate('/library');
      window.location.reload();
    }
  };

  const StatusIcon = ({ status }: { status: string }) => {
    if (status === 'Pass') return <CheckCircle2 className="text-schneider" size={24} />;
    if (status === 'Attention Required') return <AlertTriangle className="text-amber-500" size={24} />;
    return <XCircle className="text-red-500" size={24} />;
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-in fade-in zoom-in-95 duration-300">
      <div className="flex items-center justify-between">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
          <ArrowLeft size={20} />
          <span className="font-medium">Back</span>
        </button>
        <div className="flex gap-2">
          <button 
            onClick={handleRunAudit}
            disabled={isAuditing}
            className="flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors disabled:opacity-50"
          >
            {isAuditing ? <Loader2 className="animate-spin" size={18} /> : <Sparkles size={18} />}
            AI Wiring Audit
          </button>
          <Link 
            to={`/admin/edit/${ref.id}`}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-slate-700 hover:bg-slate-50 transition-colors"
          >
            <Edit3 size={18} />
            Edit
          </Link>
          <button 
            onClick={handleDelete}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-red-200 rounded-lg text-red-600 hover:bg-red-50 transition-colors"
          >
            <Trash2 size={18} />
            Delete
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          {auditResult && (
            <div className="bg-white border-2 border-schneider/20 rounded-3xl p-6 shadow-xl animate-in slide-in-from-top-4 duration-500">
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                  <StatusIcon status={auditResult.status} />
                  <div>
                    <h3 className="font-bold text-xl">AI Audit Result: {auditResult.status}</h3>
                    <p className="text-sm text-slate-500">Compliance Score: {auditResult.complianceScore}%</p>
                  </div>
                </div>
                <button onClick={() => setAuditResult(null)} className="text-slate-400 hover:text-slate-600">
                  <XCircle size={20} />
                </button>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Observations</h4>
                  <ul className="space-y-2">
                    {auditResult.observations.map((obs, i) => (
                      <li key={i} className="text-sm text-slate-600 flex gap-2">
                        <span className="text-schneider">•</span> {obs}
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="space-y-3">
                  <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Recommendations</h4>
                  <ul className="space-y-2">
                    {auditResult.recommendations.map((rec, i) => (
                      <li key={i} className="text-sm text-slate-600 flex gap-2">
                        <span className="text-schneider">→</span> {rec}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )}

          <div className="bg-white rounded-3xl overflow-hidden border border-slate-200 shadow-lg group relative">
            <img 
              src={ref.image.value} 
              alt={ref.title} 
              className="w-full h-auto max-h-[600px] object-contain bg-slate-50" 
            />
            <div className="absolute top-4 right-4 flex gap-2">
              {ref.tags.map(tag => (
                <span key={tag} className="bg-white/90 backdrop-blur px-3 py-1 rounded-full text-xs font-bold text-schneider shadow-sm">
                  #{tag}
                </span>
              ))}
            </div>
          </div>

          <div className="bg-white p-8 rounded-3xl border border-slate-200 shadow-sm">
            <h2 className="text-sm font-bold text-schneider uppercase tracking-widest mb-2">Technical Summary</h2>
            <h1 className="text-3xl font-bold text-slate-900 mb-6">{ref.title}</h1>
            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed">
              <p>{ref.notes}</p>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white p-6 rounded-3xl border border-slate-200 shadow-sm space-y-6">
            <h3 className="font-bold text-lg flex items-center gap-2">
              <Info size={20} className="text-schneider" />
              Metadata
            </h3>
            
            <div className="space-y-4">
              <div className="flex items-start gap-3">
                <Briefcase className="text-slate-400 mt-1" size={18} />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Customer</p>
                  <p className="font-medium text-slate-900">{ref.customer}</p>
                </div>
              </div>
              
              <div className="flex items-start gap-3">
                <Hash className="text-slate-400 mt-1" size={18} />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Order Number</p>
                  <p className="font-mono text-slate-900">{ref.orderNumber}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Layers className="text-slate-400 mt-1" size={18} />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Section</p>
                  <p className="font-medium text-slate-900">{ref.section}</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <Calendar className="text-slate-400 mt-1" size={18} />
                <div>
                  <p className="text-xs font-bold text-slate-400 uppercase">Added On</p>
                  <p className="font-medium text-slate-900">
                    {new Date(ref.createdAt).toLocaleDateString('en-US', { dateStyle: 'long' })}
                  </p>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <h3 className="font-bold flex items-center justify-between">
              <span>Related References</span>
              <Link to="/library" className="text-xs text-schneider">View All</Link>
            </h3>
            <div className="grid grid-cols-2 gap-4">
              {related.map(rel => (
                <Link 
                  to={`/reference/${rel.id}`} 
                  key={rel.id}
                  className="group"
                >
                  <div className="aspect-square bg-slate-100 rounded-2xl overflow-hidden border border-slate-200 mb-2">
                    <img 
                      src={rel.image.value} 
                      alt="" 
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" 
                    />
                  </div>
                  <p className="text-xs font-bold text-slate-900 line-clamp-1 group-hover:text-schneider transition-colors">
                    {rel.title}
                  </p>
                </Link>
              ))}
              {related.length === 0 && (
                <p className="text-xs text-slate-400 italic col-span-2 py-4">No similar references found.</p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReferenceDetail;
