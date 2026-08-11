import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Activity, ShieldCheck, Terminal, LogOut, CheckCircle2, ChevronRight, Fingerprint, Lock } from 'lucide-react';

export function Dashboard() {
  const [intent, setIntent] = useState('');
  const [workflow, setWorkflow] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const [focused, setFocused] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem('token')) {
      navigate('/login');
    }
  }, [navigate]);

  const handlePlan = async () => {
    setLoading(true);

    if (import.meta.env.VITE_API_URL) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/intents`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          },
          body: JSON.stringify({ description: intent }),
        });
        const data = await response.json();
        if (response.ok) {
          setWorkflow(data.plan);
        } else {
          console.error(data.error);
        }
      } catch (err) {
        console.error('Network error', err);
      } finally {
        setLoading(false);
      }
    } else {
      // Simulate backend planning
      setTimeout(() => {
        const mockPlanId = Math.random().toString(36).substring(7).toUpperCase();

        let action = 'Provision Resource';
        let target = intent;
        let risk = 'Low';

        const lowerIntent = intent.toLowerCase();
        if (lowerIntent.includes('s3') || lowerIntent.includes('bucket')) {
          action = 'Provision S3 Bucket';
          target = intent.replace(/provision/i, '').replace(/create/i, '').trim();
          risk = 'Medium';
        } else if (lowerIntent.includes('ec2') || lowerIntent.includes('instance')) {
          action = 'Launch EC2 Instance';
          target = intent.replace(/provision/i, '').replace(/launch/i, '').trim();
          risk = 'High';
        } else if (lowerIntent.includes('db') || lowerIntent.includes('database')) {
          action = 'Create Database';
          target = intent.replace(/create/i, '').replace(/database/i, '').trim();
          risk = 'Critical';
        }

        const mockPlan = {
          id: `PLN-${mockPlanId}`,
          db_id: mockPlanId,
          status: 'pending',
          riskLevel: risk,
          steps: [
            { id: 1, description: `Analyze natural language intent: "${intent}"`, icon: Terminal },
            { id: 2, description: `Compile execution graph for action: ${action}`, icon: Activity },
            { id: 3, description: `Target evaluation: ${target || 'default'}`, icon: CheckCircle2 },
            { id: 4, description: 'Dry run execution plan & policy check', icon: ShieldCheck }
          ]
        };

        setWorkflow(mockPlan);
        setLoading(false);
      }, 1500);
    }
  };

  const handleApprove = async () => {
    if (!workflow) return;
    setLoading(true);

    if (import.meta.env.VITE_API_URL && workflow.db_id) {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/intents/${workflow.db_id}/approve`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });
        if (response.ok) {
           setWorkflow({ ...workflow, status: 'completed' });
        }
      } catch (err) {
        console.error('Network error', err);
      } finally {
        setLoading(false);
      }
    } else {
      setTimeout(() => {
        setWorkflow({ ...workflow, status: 'completed' });
        setLoading(false);
      }, 2000);
    }
  };

  return (
    <div className="min-h-screen text-slate-100 bg-[#030712] relative overflow-hidden font-sans">
      {/* Dynamic Background */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-indigo-600/10 blur-[120px]" />
        <div className="absolute top-[40%] -right-[10%] w-[40vw] h-[40vw] rounded-full bg-emerald-600/10 blur-[120px]" />
        <div className="absolute -bottom-[20%] left-[20%] w-[60vw] h-[60vw] rounded-full bg-blue-600/10 blur-[150px]" />
      </div>

      <div className="container mx-auto px-6 py-20 relative z-10">
        <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }} className="max-w-4xl mx-auto space-y-12">
          
          {/* Header */}
          <header className="flex justify-between items-center bg-white/5 backdrop-blur-md border border-white/10 p-6 rounded-3xl shadow-2xl">
            <div className="flex items-center space-x-4">
              <div className="p-3 bg-indigo-500/20 rounded-2xl border border-indigo-500/30 text-indigo-400">
                <ShieldCheck size={28} />
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-white to-slate-400">GovernOS Control Plane</h1>
                <p className="text-sm text-slate-400 flex items-center mt-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 mr-2 animate-pulse" />
                  System Nominal
                </p>
              </div>
            </div>
            <button 
              onClick={() => { localStorage.removeItem('token'); navigate('/login'); }}
              className="flex items-center space-x-2 px-4 py-2 text-sm font-medium text-slate-300 hover:text-white bg-white/5 hover:bg-white/10 rounded-xl transition-all border border-white/5"
            >
              <LogOut size={16} />
              <span>Sign Out</span>
            </button>
          </header>

          {/* Input Section */}
          <section className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl relative group">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-purple-500/5 rounded-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <h2 className="text-xl font-semibold mb-6 flex items-center">
                <Sparkles className="mr-3 text-indigo-400" size={20} />
                Natural Language Intent
              </h2>
              <div className={`relative rounded-2xl transition-all duration-300 ${focused ? 'ring-2 ring-indigo-500/50 shadow-[0_0_30px_-5px_rgba(99,102,241,0.3)]' : 'ring-1 ring-white/10'}`}>
                <textarea
                  className="w-full bg-black/20 text-slate-100 p-5 rounded-2xl border-none focus:outline-none focus:ring-0 resize-none placeholder-slate-500 min-h-[120px] text-lg"
                  placeholder="e.g., Provision a highly-available PostgreSQL database in us-east-1..."
                  value={intent}
                  onChange={(e) => setIntent(e.target.value)}
                  onFocus={() => setFocused(true)}
                  onBlur={() => setFocused(false)}
                />
              </div>
              <div className="mt-6 flex justify-end">
                <button 
                  onClick={handlePlan} 
                  disabled={!intent || loading} 
                  className="relative overflow-hidden group bg-indigo-600 hover:bg-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed text-white px-8 py-3 rounded-xl font-semibold transition-all flex items-center space-x-2"
                >
                  <div className="absolute inset-0 w-full h-full bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full group-hover:animate-[shimmer_1.5s_infinite]" />
                  {loading ? (
                    <Activity className="animate-spin" size={18} />
                  ) : (
                    <Terminal size={18} />
                  )}
                  <span>{loading ? 'Compiling Graph...' : 'Generate Plan'}</span>
                </button>
              </div>
            </div>
          </section>

          {/* Workflow Visualization */}
          <AnimatePresence>
            {workflow && (
              <motion.section 
                initial={{ opacity: 0, height: 0, scale: 0.95 }} 
                animate={{ opacity: 1, height: 'auto', scale: 1 }} 
                exit={{ opacity: 0, height: 0 }}
                className="bg-white/5 backdrop-blur-2xl border border-white/10 p-8 rounded-3xl shadow-2xl"
              >
                <div className="flex justify-between items-start mb-8">
                  <div>
                    <h3 className="text-2xl font-bold mb-2">Compiled Execution Plan</h3>
                    <div className="flex items-center space-x-4 text-sm text-slate-400 font-mono">
                      <span className="flex items-center"><Fingerprint size={14} className="mr-1" /> {workflow.id}</span>
                      <span className="flex items-center"><Lock size={14} className="mr-1" /> Risk: <span className={`ml-1 font-bold ${workflow.riskLevel === 'Critical' ? 'text-rose-400' : workflow.riskLevel === 'High' ? 'text-orange-400' : 'text-emerald-400'}`}>{workflow.riskLevel}</span></span>
                    </div>
                  </div>
                  
                  <div className={`px-4 py-2 rounded-xl text-sm font-bold border backdrop-blur-md flex items-center shadow-lg
                    ${workflow.status === 'completed' 
                      ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20' 
                      : 'bg-amber-500/10 text-amber-400 border-amber-500/20 animate-pulse'}`}>
                    {workflow.status === 'completed' ? <CheckCircle2 size={16} className="mr-2" /> : <Activity size={16} className="mr-2" />}
                    {workflow.status.toUpperCase()}
                  </div>
                </div>

                <div className="space-y-4 mb-10 relative">
                  <div className="absolute left-6 top-6 bottom-6 w-px bg-gradient-to-b from-indigo-500/50 via-purple-500/50 to-transparent" />
                  
                  {workflow.steps.map((step: any, idx: number) => {
                    const StepIcon = step.icon || ChevronRight;
                    return (
                      <motion.div 
                        initial={{ opacity: 0, x: -20 }} 
                        animate={{ opacity: 1, x: 0 }} 
                        transition={{ delay: idx * 0.15 }}
                        key={step.id} 
                        className="relative z-10 flex items-center p-4 bg-black/20 rounded-2xl border border-white/5 hover:border-white/10 hover:bg-black/30 transition-all group"
                      >
                        <div className="w-12 h-12 flex-shrink-0 bg-indigo-500/10 border border-indigo-500/30 text-indigo-400 rounded-full flex items-center justify-center mr-4 group-hover:scale-110 transition-transform">
                          <StepIcon size={20} />
                        </div>
                        <span className="font-mono text-[15px] text-slate-200">{step.description}</span>
                      </motion.div>
                    );
                  })}
                </div>

                {workflow.status !== 'completed' && (
                  <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.8 }}>
                    <button 
                      onClick={handleApprove} 
                      disabled={loading} 
                      className="w-full relative overflow-hidden group bg-gradient-to-r from-emerald-600 to-teal-500 hover:from-emerald-500 hover:to-teal-400 disabled:opacity-50 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-[0_0_40px_-10px_rgba(16,185,129,0.4)] transition-all flex items-center justify-center space-x-3"
                    >
                      <div className="absolute inset-0 w-full h-full bg-[linear-gradient(45deg,transparent_25%,rgba(255,255,255,0.2)_50%,transparent_75%,transparent_100%)] bg-[length:250%_250%,100%_100%] animate-[shimmer_2s_infinite]" />
                      {loading ? (
                        <Activity className="animate-spin" size={24} />
                      ) : (
                        <ShieldCheck size={24} />
                      )}
                      <span>{loading ? 'Executing Securely...' : 'Approve & Execute Workflow'}</span>
                    </button>
                    <p className="text-center text-xs text-slate-500 mt-4">By approving, you authorize governOS to perform these actions via the execution agent.</p>
                  </motion.div>
                )}
              </motion.section>
            )}
          </AnimatePresence>
        </motion.div>
      </div>

      <style>{`
        @keyframes shimmer {
          0% { background-position: 200% 0; }
          100% { background-position: -200% 0; }
        }
      `}</style>
    </div>
  );
}
