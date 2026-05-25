import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import SalesView from './components/salesview';
import AgentForm from './components/agentform';
import DashboardView from './DashboardView';
import {
    Users, Clock, Package, Wrench, FileText, Send, Gauge,
    CheckCircle2, Plus, ChevronDown, X, MapPin, Zap, LogOut, Search,
    LayoutDashboard, Menu, Trash2, Edit3, Sparkles, Save, MessageSquare,
    Banknote, CreditCard, ClipboardCheck, Mail, User, IndianRupee,
    Building2, Activity, FolderOpen, CheckSquare, AlertTriangle, Download
} from 'lucide-react';

// ─── STAGE DEFINITIONS ──────────────────────────────────────────────────────
const PRIMARY_STAGES = [
    { id: 'leads', label: 'Leads', icon: Users },
    { id: 'pending_loans', label: 'Pending Loans', icon: Clock },
    { id: 'material_procurement', label: 'Material Procurement', icon: Package },
    { id: 'installation', label: 'Installation', icon: Wrench },
    { id: 'post_installation_docs', label: 'Post-Installation Docs', icon: FileText },
    { id: 'pending_discom', label: 'Pending DISCOM Submissions', icon: Send },
    { id: 'meter_installation', label: 'Meter Installation', icon: Gauge },
    { id: 'system_commissioning', label: 'System Commissioning', icon: Zap },
    { id: 'meter_flag', label: 'Meter Flag', icon: MapPin },
    { id: 'discom_inspection', label: 'DISCOM Inspection', icon: ClipboardCheck },
    { id: 'completed', label: 'Projects Completed', icon: CheckCircle2 },
];

const SECONDARY_STAGES = [
    { id: 'subsidy_redeems', label: 'Subsidy Redeems Pending', icon: Banknote },
    { id: 'subsidy_disbursement', label: 'Subsidy Disbursement Pending', icon: Banknote },
    { id: 'second_payment', label: '2nd Payment', icon: CreditCard },
    { id: 'third_payment', label: '3rd Payment', icon: CreditCard },
    { id: 'pending_cheque', label: 'Pending Cheque', icon: Clock },
    { id: 'received_cheque', label: 'Received Cheque', icon: CheckCircle2 },
];

const FINANCIAL_TAGS = SECONDARY_STAGES;
const ALL_STAGES = [...PRIMARY_STAGES, ...SECONDARY_STAGES];

const STAGE_COLORS = {
    leads: 'bg-blue-100 text-blue-700',
    pending_loans: 'bg-yellow-100 text-yellow-700',
    material_procurement: 'bg-orange-100 text-orange-700',
    installation: 'bg-purple-100 text-purple-700',
    post_installation_docs: 'bg-pink-100 text-pink-700',
    pending_discom: 'bg-red-100 text-red-700',
    meter_installation: 'bg-indigo-100 text-indigo-700',
    system_commissioning: 'bg-cyan-100 text-cyan-700',
    meter_flag: 'bg-rose-100 text-rose-700',
    discom_inspection: 'bg-violet-100 text-violet-700',
    completed: 'bg-green-100 text-green-700',
    subsidy_redeems: 'bg-amber-100 text-amber-700',
    subsidy_disbursement: 'bg-lime-100 text-lime-700',
    second_payment: 'bg-teal-100 text-teal-700',
    third_payment: 'bg-emerald-100 text-emerald-700',
    pending_cheque: 'bg-gray-100 text-gray-700',
    received_cheque: 'bg-slate-100 text-slate-700',
};

const DEFAULT_PROJECT_CHECKLIST = [
    { id: 'kyc_docs', label: 'KYC Docs and Docs from PM Suryaghar portal', section: 'Pre-Installation', checked: false },
    { id: 'docs_sent_bank', label: 'Docs sent to the bank', section: 'Pre-Installation', checked: false },
    { id: 'serial_numbers', label: 'Serial numbers received', section: 'Post Installation', checked: false },
    { id: 'agreement_article7', label: 'Agreement on Article-7 100rs stamp', section: 'Post Installation', checked: false },
    { id: 'work_completion_portal', label: 'Work Completion from PM Surya Ghar portal', section: 'Post Installation', checked: false },
    { id: 'geo_tag_photos', label: 'Geo-Tag Photos of the site', section: 'Post Installation', checked: false },
    { id: 'net_meter_installation', label: 'Net-Meter Installation', section: 'Post Net-Meter Application', checked: false },
    { id: 'subsidy_redeem', label: "Subsidy Redeem from Customer Login", section: 'Post Net-Meter Application', checked: false },
    { id: 'all_payments_cleared', label: 'All payments cleared', section: 'Post Net-Meter Application', checked: false },
];

// ─── LOG ACTIVITY ─────────────────────────────────────────────────────────────
async function logActivity(userId, action, message, details = '') {
    try {
        await supabase.from('activity_log').insert({ user_id: userId, action, message, new_value: details });
    } catch (e) { console.error('Activity log error:', e); }
}

// ─── CUSTOMER CARD (WITH ALL DETAILS RESTORED) ────────────────────────────────
function CustomerCard({ customer, onSelect, onMoveStage }) {
    const [showStageMenu, setShowStageMenu] = useState(false);
    const dropdownRef = useRef(null);
    const financialTags = Array.isArray(customer.financial_tags) ? customer.financial_tags : [];

    useEffect(() => {
        const handleClick = (e) => { if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowStageMenu(false); };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, []);

    return (
        <div 
            className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow group" 
            onClick={() => onSelect(customer)}
        >
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800 text-base leading-tight group-hover:text-blue-600 transition-colors">
                    {customer.customer_name}
                </h3>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium ml-2 whitespace-nowrap">
                    {customer.quotation_number || customer.project_id || '–'}
                </span>
            </div>

            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
                <Zap className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span>{customer.capacity ? `${customer.capacity} kWp` : '–'} {customer.project_type || ''}</span>
            </div>

            <div className="flex justify-between items-center text-sm mb-2">
                <span className="flex items-center gap-1 text-gray-500 text-xs truncate max-w-[150px]">
                    <MapPin className="w-3 h-3 flex-shrink-0" /> {customer.location || '–'}
                </span>
                <span className="font-bold text-emerald-600">
                    {(customer.quoted_price || customer.quoted_amount)
                        ? `₹${Number(customer.quoted_price || customer.quoted_amount).toLocaleString('en-IN')}`
                        : '–'}
                </span>
            </div>

            {/* Financial Tag Badges */}
            {financialTags.length > 0 && (
                <div className="flex flex-wrap gap-1 mb-3">
                    {financialTags.map(tagId => {
                        const tag = FINANCIAL_TAGS.find(t => t.id === tagId);
                        if (!tag) return null;
                        return (
                            <span key={tagId} className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-tight ${STAGE_COLORS[tagId] || 'bg-gray-100'}`}>
                                {tag.label}
                            </span>
                        );
                    })}
                </div>
            )}

            {/* POC Name Indicator */}
            {(customer.poc_name || customer.poc) && (
                <div className="text-[10px] text-gray-400 mb-3 flex items-center gap-1">
                    <User size={10} /> POC: {customer.poc_name || customer.poc}
                </div>
            )}

            {/* Move to Stage Logic */}
            <div className="relative" ref={dropdownRef} onClick={e => e.stopPropagation()}>
                <button 
                    onClick={() => setShowStageMenu(!showStageMenu)}
                    className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-600 font-bold transition-all"
                >
                    <span>Move to Stage</span>
                    <ChevronDown className={`w-4 h-4 transition-transform ${showStageMenu ? 'rotate-180' : ''}`} />
                </button>
                
                {showStageMenu && (
                    <div className="absolute bottom-full left-0 right-0 mb-2 bg-white rounded-2xl shadow-2xl border border-gray-100 z-50 flex w-[480px] -translate-x-1/4 sm:translate-x-0 overflow-hidden">
                        <div className="flex-1 border-r border-gray-100 py-3 bg-white">
                            <p className="px-4 py-1 text-[10px] font-black text-blue-500 uppercase tracking-widest mb-1">Project Stages</p>
                            <div className="max-h-80 overflow-y-auto">
                                {PRIMARY_STAGES.map(s => (
                                    <button key={s.id} onClick={() => { onMoveStage(customer.id, { stage: s.id }); setShowStageMenu(false); }} 
                                        className={`w-full px-4 py-2 text-left text-xs font-bold hover:bg-blue-50 flex items-center gap-3 ${customer.stage === s.id ? 'text-blue-600 bg-blue-50' : 'text-gray-600'}`}>
                                        <s.icon size={14} /> {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="flex-1 py-3 bg-gray-50/50">
                            <p className="px-4 py-1 text-[10px] font-black text-emerald-600 uppercase tracking-widest mb-1">Financial Stages</p>
                            <div className="max-h-80 overflow-y-auto">
                                {SECONDARY_STAGES.map(s => (
                                    <button key={s.id} onClick={() => { onMoveStage(customer.id, { stage: s.id }); setShowStageMenu(false); }} 
                                        className={`w-full px-4 py-2 text-left text-xs font-bold hover:bg-emerald-50 flex items-center gap-3 ${customer.stage === s.id ? 'text-emerald-600 bg-emerald-50' : 'text-gray-600'}`}>
                                        <s.icon size={14} /> {s.label}
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── DETAIL MODAL (FULL VERSION) ──────────────────────────────────────────────
function CustomerDetailModal({ customer, onClose, onUpdate, onDelete, user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...customer });
    const [followUpText, setFollowUpText] = useState('');
    const isAdmin = user?.userType === 'admin';

    const handleSave = async () => {
        const updates = { ...editData };
        delete updates.id; delete updates.created_at;
        await onUpdate(customer.id, updates);
        setIsEditing(false);
    };

    const handleChecklistToggle = async (itemId) => {
        const list = (customer.project_checklist || DEFAULT_PROJECT_CHECKLIST).map(i => 
            i.id === itemId ? {...i, checked: !i.checked, checkedBy: user.name, checkedAt: new Date().toISOString()} : i
        );
        onUpdate(customer.id, { project_checklist: list });
    };

    const handleAddNote = async () => {
        if (!followUpText.trim()) return;
        const newNote = { id: Date.now(), text: followUpText, date: new Date().toISOString(), authorName: user.name };
        onUpdate(customer.id, { follow_ups: [...(customer.follow_ups || []), newNote] });
        setFollowUpText('');
    };

    const DetailItem = ({ label, value, isMoney = false }) => (
        <div className="bg-gray-50 p-3 rounded-xl border border-gray-100">
            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">{label}</p>
            <p className={`text-sm font-bold ${isMoney ? 'text-emerald-600' : 'text-gray-700'}`}>
                {isMoney && value ? `₹${Number(value).toLocaleString('en-IN')}` : (value || '–')}
            </p>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
            <div className="bg-white rounded-3xl shadow-2xl w-full max-w-2xl max-h-[92vh] overflow-hidden flex flex-col">
                <div className="bg-gray-900 p-6 flex justify-between items-center text-white shrink-0">
                    <div>
                        <h2 className="text-xl font-black">{customer.customer_name}</h2>
                        <p className="text-xs text-gray-400 font-bold tracking-widest uppercase">{customer.quotation_number || 'No ID'}</p>
                    </div>
                    <div className="flex gap-2">
                        {isAdmin && <button onClick={() => setIsEditing(!isEditing)} className="p-2 hover:bg-white/10 rounded-xl transition-colors"><Edit3 size={20}/></button>}
                        {isAdmin && <button onClick={() => onDelete(customer.id)} className="p-2 text-red-400 hover:bg-red-500/10 rounded-xl transition-colors"><Trash2 size={20}/></button>}
                        <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-xl"><X size={24}/></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-6 space-y-8">
                    {/* Stage Quick Switch */}
                    <section>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3">Project Status</h3>
                        <select 
                            value={customer.stage} 
                            onChange={e => onUpdate(customer.id, { stage: e.target.value })}
                            className="w-full p-3 bg-blue-50 border-none rounded-xl font-bold text-blue-700 text-sm outline-none ring-2 ring-blue-100"
                        >
                            <optgroup label="Primary Stages">
                                {PRIMARY_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </optgroup>
                            <optgroup label="Financial Stages">
                                {SECONDARY_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                            </optgroup>
                        </select>
                    </section>

                    {/* Customer Info */}
                    <section className="grid grid-cols-2 gap-3">
                        <DetailItem label="Contact Number" value={customer.phone} />
                        <DetailItem label="Capacity (kWp)" value={customer.capacity} />
                        <DetailItem label="Quoted Amount" value={customer.quoted_amount} isMoney />
                        <DetailItem label="POC / Agent" value={customer.poc_name || customer.poc} />
                        <div className="col-span-2"><DetailItem label="Project Location" value={customer.location} /></div>
                    </section>

                    {/* Payments */}
                    <section>
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-3 flex items-center gap-2"><CreditCard size={14}/> Payment Milestones</h3>
                        <div className="grid grid-cols-2 gap-2">
                            {customer.payment_1 && <DetailItem label="Payment 1" value={customer.payment_1} isMoney />}
                            {customer.payment_2 && <DetailItem label="Payment 2" value={customer.payment_2} isMoney />}
                        </div>
                    </section>

                    {/* Checklist */}
                    <section className="border-t pt-6">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><CheckSquare size={14}/> Technical Checklist</h3>
                        <div className="space-y-2">
                            {(customer.project_checklist || DEFAULT_PROJECT_CHECKLIST).map(item => (
                                <label key={item.id} className="flex items-start gap-4 p-3 hover:bg-gray-50 rounded-2xl cursor-pointer group transition-colors">
                                    <input type="checkbox" checked={item.checked} onChange={() => handleChecklistToggle(item.id)} className="mt-1 w-5 h-5 rounded-lg border-gray-300 text-blue-600 focus:ring-blue-500" />
                                    <div>
                                        <p className={`text-sm font-bold ${item.checked ? 'text-gray-300 line-through' : 'text-gray-700'}`}>{item.label}</p>
                                        {item.checkedAt && <p className="text-[9px] text-gray-400 mt-0.5">Checked by {item.checkedBy} on {new Date(item.checkedAt).toLocaleDateString()}</p>}
                                    </div>
                                </label>
                            ))}
                        </div>
                    </section>

                    {/* Notes/Activity */}
                    <section className="border-t pt-6">
                        <h3 className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-4 flex items-center gap-2"><MessageSquare size={14}/> Internal Notes</h3>
                        <div className="space-y-3 mb-4">
                            {(customer.follow_ups || []).slice().reverse().map(note => (
                                <div key={note.id} className="bg-gray-50 p-4 rounded-2xl border border-gray-100">
                                    <p className="text-sm font-medium text-gray-700">{note.text}</p>
                                    <p className="text-[10px] text-gray-400 mt-2 font-bold">{note.authorName} • {new Date(note.date).toLocaleString()}</p>
                                </div>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <input value={followUpText} onChange={e => setFollowUpText(e.target.value)} placeholder="Add a note..." className="flex-1 p-3 bg-gray-100 rounded-xl text-sm outline-none focus:ring-2 focus:ring-gray-200 font-medium" />
                            <button onClick={handleAddNote} className="p-3 bg-gray-900 text-white rounded-xl hover:bg-black transition-colors"><Send size={18}/></button>
                        </div>
                    </section>
                </div>
            </div>
        </div>
    );
}

// ─── DASHBOARD ───────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('dashboard');
    const [selectedStage, setSelectedStage] = useState('leads');
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showAddLead, setShowAddLead] = useState(false);

    const fetchData = async () => {
        setLoading(true);
        const { data } = await supabase.from('admin').select('*').order('created_at', { ascending: false });
        setCustomers(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchData(); }, []);

    const handleUpdate = async (id, updates) => {
        const { error } = await supabase.from('admin').update(updates).eq('id', id);
        if (!error) fetchData();
    };

    const handleDelete = async (id) => {
        if (!window.confirm("Are you sure you want to delete this customer?")) return;
        await supabase.from('admin').delete().eq('id', id);
        setSelectedCustomer(null);
        fetchData();
    };

    const stageCounts = ALL_STAGES.reduce((acc, s) => { acc[s.id] = customers.filter(c => c.stage === s.id).length; return acc; }, {});

    const filtered = customers.filter(c => {
        const s = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery || c.customer_name?.toLowerCase().includes(s) || c.quotation_number?.toLowerCase().includes(s) || c.phone?.includes(s);
        return matchesSearch && c.stage === selectedStage;
    });

    return (
        <div className="min-h-screen bg-gray-50 flex font-sans">
            {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            {/* SIDEBAR */}
            <aside className={`fixed inset-y-0 left-0 z-50 w-72 bg-white border-r flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-6 border-b flex justify-between items-center">
                    <img src="/Logo%20Ray2Volt%20Solar%20bgless.png" className="h-12" alt="Logo" />
                    <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}><X /></button>
                </div>
                
                <div className="flex-1 overflow-y-auto p-4 space-y-1">
                    <button onClick={() => { setCurrentView('dashboard'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-4 py-4 rounded-2xl text-sm font-black tracking-wide transition-all ${currentView === 'dashboard' ? 'bg-gray-900 text-white shadow-xl translate-x-1' : 'text-gray-500 hover:bg-gray-100'}`}>
                        <LayoutDashboard size={20} /> Dashboard
                    </button>

                    <p className="text-[10px] font-black text-gray-400 px-5 pt-8 pb-3 uppercase tracking-[0.2em]">Project Workflow</p>
                    {PRIMARY_STAGES.map(s => (
                        <button key={s.id} onClick={() => { setCurrentView('stages'); setSelectedStage(s.id); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black transition-all ${currentView === 'stages' && selectedStage === s.id ? 'bg-gray-900 text-white shadow-lg translate-x-1' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <s.icon size={18} />
                            <span className="flex-1 text-left">{s.label}</span>
                            {stageCounts[s.id] > 0 && <span className={`px-2 py-0.5 rounded-lg text-[10px] ${selectedStage === s.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>{stageCounts[s.id]}</span>}
                        </button>
                    ))}

                    <p className="text-[10px] font-black text-gray-400 px-5 pt-8 pb-3 uppercase tracking-[0.2em]">Financial Status</p>
                    {SECONDARY_STAGES.map(s => (
                        <button key={s.id} onClick={() => { setCurrentView('stages'); setSelectedStage(s.id); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-black transition-all ${currentView === 'stages' && selectedStage === s.id ? 'bg-gray-900 text-white shadow-lg translate-x-1' : 'text-gray-500 hover:bg-gray-50'}`}>
                            <s.icon size={18} />
                            <span className="flex-1 text-left">{s.label}</span>
                            {stageCounts[s.id] > 0 && <span className={`px-2 py-0.5 rounded-lg text-[10px] ${selectedStage === s.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-400'}`}>{stageCounts[s.id]}</span>}
                        </button>
                    ))}
                </div>

                <div className="p-4 border-t">
                    <button onClick={onLogout} className="w-full flex items-center gap-3 px-4 py-4 text-red-500 font-black rounded-2xl hover:bg-red-50 transition-colors">
                        <LogOut size={20} /> Logout
                    </button>
                </div>
            </aside>

            {/* MAIN CONTENT */}
            <main className="flex-1 lg:ml-72 flex flex-col min-h-screen">
                <header className="h-20 bg-white/80 backdrop-blur-md border-b px-8 flex items-center justify-between sticky top-0 z-40">
                    <div className="flex items-center gap-4">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-600"><Menu size={24}/></button>
                        <h1 className="text-xl font-black text-gray-800">
                            {currentView === 'dashboard' ? 'Business Overview' : ALL_STAGES.find(s => s.id === selectedStage)?.label}
                        </h1>
                    </div>
                    
                    <div className="flex items-center gap-4">
                        <div className="relative hidden md:block">
                            <Search className="absolute left-4 top-3 text-gray-400" size={18} />
                            <input 
                                placeholder="Search customers..." 
                                value={searchQuery} 
                                onChange={e => setSearchQuery(e.target.value)} 
                                className="pl-12 pr-6 py-3 bg-gray-100 rounded-2xl text-sm font-bold outline-none focus:ring-2 focus:ring-gray-200 transition-all w-72" 
                            />
                        </div>
                        <button onClick={() => setShowAddLead(true)} className="bg-gray-900 text-white px-6 py-3 rounded-2xl text-sm font-black flex items-center gap-2 hover:bg-black shadow-xl transition-all active:scale-95">
                            <Plus size={18}/> Add Lead
                        </button>
                    </div>
                </header>

                <div className="p-8">
                    {currentView === 'dashboard' ? (
                        <DashboardView customers={customers.map(c => ({ ...c, currentStage: c.stage }))} loading={loading} />
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                            {filtered.length > 0 ? filtered.map(c => (
                                <CustomerCard key={c.id} customer={c} onSelect={setSelectedCustomer} onMoveStage={handleUpdate} />
                            )) : (
                                <div className="col-span-full py-32 flex flex-col items-center justify-center text-gray-400 opacity-30">
                                    <Users size={64} className="mb-4" />
                                    <p className="text-lg font-black uppercase tracking-widest">No customers found</p>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </main>

            {/* MODALS */}
            {selectedCustomer && (
                <CustomerDetailModal 
                    customer={selectedCustomer} 
                    onClose={() => setSelectedCustomer(null)} 
                    onUpdate={handleUpdate} 
                    onDelete={handleDelete}
                    user={user}
                />
            )}
            {showAddLead && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[70] p-4">
                    <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8">
                        <h2 className="text-2xl font-black mb-6">Create New Lead</h2>
                        <div className="space-y-4 mb-8">
                            <input placeholder="Customer Name" className="w-full p-4 bg-gray-100 rounded-2xl outline-none font-bold" id="lead_name" />
                            <input placeholder="Phone Number" className="w-full p-4 bg-gray-100 rounded-2xl outline-none font-bold" id="lead_phone" />
                            <input placeholder="Capacity (kWp)" className="w-full p-4 bg-gray-100 rounded-2xl outline-none font-bold" id="lead_cap" />
                        </div>
                        <div className="flex gap-3">
                            <button onClick={() => setShowAddLead(false)} className="flex-1 py-4 font-black text-gray-500 rounded-2xl hover:bg-gray-50">Cancel</button>
                            <button onClick={async () => {
                                const data = {
                                    customer_name: document.getElementById('lead_name').value,
                                    phone: document.getElementById('lead_phone').value,
                                    capacity: document.getElementById('lead_cap').value,
                                    stage: 'leads',
                                    project_checklist: DEFAULT_PROJECT_CHECKLIST
                                };
                                await supabase.from('admin').insert(data);
                                setShowAddLead(false);
                                fetchData();
                            }} className="flex-1 py-4 bg-gray-900 text-white font-black rounded-2xl shadow-xl hover:bg-black">Add Lead</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── ROOT APP ────────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const handleLogin = async (e) => {
        e.preventDefault();
        const { data: authData, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return alert(error.message);
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', authData.user.id).single();
        onLogin({ id: authData.user.id, name: profile.name, userType: profile.user_type });
    };
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900 p-6">
            <form onSubmit={handleLogin} className="bg-white p-12 rounded-[40px] shadow-2xl w-full max-w-sm text-center">
                <img src="/Logo%20Ray2Volt%20Solar%20bgless.png" className="h-16 mx-auto mb-10" />
                <div className="space-y-4 mb-10">
                    <input type="email" placeholder="Email" className="w-full p-4 bg-gray-100 rounded-2xl outline-none font-bold text-center" onChange={e => setEmail(e.target.value)} />
                    <input type="password" placeholder="Password" className="w-full p-4 bg-gray-100 rounded-2xl outline-none font-bold text-center" onChange={e => setPassword(e.target.value)} />
                </div>
                <button className="w-full bg-gray-900 text-white py-4 rounded-2xl font-black text-lg shadow-xl hover:bg-black transition-all">SIGN IN</button>
            </form>
        </div>
    );
}

export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(({ data: { session } }) => {
            if (session) {
                supabase.from('profiles').select('*').eq('id', session.user.id).single()
                    .then(({ data: p }) => {
                        if (p) setUser({ id: session.user.id, name: p.name, userType: p.user_type });
                        setLoading(false);
                    });
            } else setLoading(false);
        });
    }, []);

    if (loading) return <div className="min-h-screen flex items-center justify-center bg-gray-900 text-white font-black text-2xl tracking-[0.3em]">RAY2VOLT</div>;
    return !user ? <LoginScreen onLogin={setUser} /> : <Dashboard user={user} onLogout={() => supabase.auth.signOut().then(() => setUser(null))} />;
}