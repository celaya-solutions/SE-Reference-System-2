
import React from 'react';
import { 
  ShieldCheck, 
  Ruler, 
  Tag, 
  Zap, 
  Waves, 
  Maximize, 
  ArrowRight,
  // Added missing Leaf import
  Leaf
} from 'lucide-react';

const StandardItem: React.FC<{ 
  icon: React.ReactNode; 
  title: string; 
  rule: string; 
  why: string; 
}> = ({ icon, title, rule, why }) => (
  <div className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm flex gap-6 hover:border-schneider/50 transition-colors">
    <div className="p-3 bg-schneider/10 text-schneider rounded-xl h-fit">
      {icon}
    </div>
    <div className="space-y-2">
      <h4 className="text-lg font-bold text-slate-900">{title}</h4>
      <p className="text-slate-600 leading-relaxed font-medium">
        <span className="text-schneider">Rule: </span>{rule}
      </p>
      <div className="pt-2">
        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Impact</p>
        <p className="text-sm text-slate-500 italic">{why}</p>
      </div>
    </div>
  </div>
);

const Standards: React.FC = () => {
  const categories = [
    {
      title: "Routing Consistency",
      icon: <Maximize size={24} />,
      rule: "Wires must follow perpendicular paths. No diagonal routing across open spaces.",
      why: "Ensures easy tracing during maintenance and maximizes internal airflow for cooling."
    },
    {
      title: "Bundling & Tie Spacing",
      icon: <Waves size={24} />,
      rule: "Bundles should be secured every 4-6 inches (100-150mm).",
      why: "Prevents vibration damage and keeps wiring organized during shipping and transit."
    },
    {
      title: "Label Placement",
      icon: <Tag size={24} />,
      rule: "Labels must be oriented identically, readable from the front, and within 1 inch of terminals.",
      why: "Reduces diagnostic time by 40% and prevents costly wiring errors during rework."
    },
    {
      title: "Bend Radius",
      icon: <Ruler size={24} />,
      rule: "Minimum bend radius must be 4x the outer diameter of the wire/cable.",
      why: "Prevents stress cracks in insulation and maintains electrical integrity of high-current paths."
    },
    {
      title: "Clearance & Separation",
      icon: <Zap size={24} />,
      rule: "Maintain at least 2 inches of separation between high-voltage power and low-voltage signal lines.",
      why: "Crucial for preventing Electromagnetic Interference (EMI) and maintaining safety standards."
    },
    {
      title: "Mesh Guard Rules",
      icon: <ShieldCheck size={24} />,
      rule: "Any exposed copper or active components must have 100% mesh coverage.",
      why: "Ensures IP20 safety rating and protects personnel from accidental contact."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in duration-500">
      <div className="text-center space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-schneider/10 text-schneider text-xs font-bold rounded-full uppercase tracking-widest">
          <ShieldCheck size={14} />
          Quality & Safety
        </div>
        <h2 className="text-4xl font-bold text-slate-900 tracking-tight">Wiring Standards Checklist</h2>
        <p className="text-slate-500 max-w-xl mx-auto">
          Operational excellence in panel wiring directly contributes to our sustainability goals by reducing rework and extending component life.
        </p>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {categories.map((cat, idx) => (
          <StandardItem 
            key={idx}
            icon={cat.icon}
            title={cat.title}
            rule={cat.rule}
            why={cat.why}
          />
        ))}
      </div>

      <div className="bg-slate-900 text-white p-8 rounded-3xl relative overflow-hidden">
        <div className="relative z-10 space-y-4 max-w-lg">
          <h3 className="text-2xl font-bold">Standard Certification</h3>
          <p className="text-slate-400">
            All documented references in this library must adhere to these standards. If a deviation is required by customer specifications, it must be explicitly noted in the "Notes" section.
          </p>
          <button className="flex items-center gap-2 text-schneider font-bold group">
            Download Full Documentation <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
        <div className="absolute top-0 right-0 w-64 h-full bg-gradient-to-l from-schneider/20 to-transparent pointer-events-none" />
        <Leaf className="absolute -bottom-8 -right-8 text-white/5" size={240} />
      </div>
    </div>
  );
};

export default Standards;
