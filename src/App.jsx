import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import AgentForm from './components/agentform';
import {
    Users, Clock, Package, Wrench, FileText, Send, Gauge,
    CheckCircle2, Plus, ChevronDown, X, MapPin, Zap, LogOut, Search,
    LayoutDashboard, Menu, Trash2, Edit3, Sparkles, Save, MessageSquare,
    Banknote, CreditCard, ClipboardCheck, Mail, User, IndianRupee,
    Building2, Activity, FolderOpen, CheckSquare, AlertTriangle, Download,
    UserCog, Sun, TrendingUp, Wallet, ChevronRight, History,
    ShieldCheck, Eye, EyeOff, RefreshCw, ShoppingCart, Hash, Calendar,
    Tag
} from 'lucide-react';

// ─── STAGE DEFINITIONS ─────────────────────────────────────────────────────────
// Stage IDs now match backend casing exactly
const PRIMARY_STAGES = [
    { id: 'Leads', label: 'Leads', icon: Users },
    { id: 'Pending Loans', label: 'Pending Loans/Advances', icon: Clock },
    { id: 'Material Procurement', label: 'Material Procurement', icon: Package },
    { id: 'Pending Installation', label: 'Pending Installation', icon: Wrench },
    { id: 'Post Installation Docs', label: 'Post-Installation Docs', icon: FileText },
    { id: 'Pending DISCOM', label: 'DISCOM Submissions', icon: Send },
    { id: 'Meter Installation', label: 'Meter Installation', icon: Gauge },
    { id: 'System Commissioning', label: 'System Commissioning', icon: Zap },
    { id: 'Meter Flag', label: 'Meter Flag', icon: MapPin },
    { id: 'DISCOM Inspection', label: 'DISCOM Inspection', icon: ClipboardCheck },
    { id: 'Completed', label: 'Completed', icon: CheckCircle2 },
];

const FINANCIAL_TAGS = [
    { id: 'Subsidy Redeems Pending', label: 'Subsidy Redeems Pending', icon: Banknote },
    { id: 'Subsidy Disbursement Pending', label: 'Subsidy Disbursement Pending', icon: Banknote },
    { id: '2nd Payment', label: '2nd Payment', icon: CreditCard },
    { id: '3rd Payment', label: '3rd Payment', icon: CreditCard },
    { id: 'Pending Cheque', label: 'Pending Cheque', icon: Clock },
    { id: 'Received Cheque', label: 'Received Cheque', icon: CheckCircle2 },
];

const STAGE_THEMES = {
    'Leads': 'bg-amber-50 text-amber-700 border-amber-200',
    'Pending Loans': 'bg-orange-50 text-orange-700 border-orange-200',
    'Pending Installation': 'bg-yellow-50 text-yellow-800 border-yellow-200',
    'Completed': 'bg-emerald-50 text-emerald-700 border-emerald-200',
    'Subsidy Redeems Pending': 'bg-rose-50 text-rose-700 border-rose-200',
    '2nd Payment': 'bg-blue-50 text-blue-700 border-blue-200',
    '3rd Payment': 'bg-indigo-50 text-indigo-700 border-indigo-200',
    'Subsidy Disbursement Pending': 'bg-lime-50 text-lime-700 border-lime-200',
    'Pending Cheque': 'bg-gray-50 text-gray-700 border-gray-200',
    'Received Cheque': 'bg-slate-50 text-slate-700 border-slate-200',
};

const FINANCIAL_TAG_COLORS = {
    'Subsidy Redeems Pending': { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', dot: 'bg-rose-400' },
    'Subsidy Disbursement Pending': { bg: 'bg-lime-50', text: 'text-lime-700', border: 'border-lime-200', dot: 'bg-lime-400' },
    '2nd Payment': { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', dot: 'bg-blue-400' },
    '3rd Payment': { bg: 'bg-indigo-50', text: 'text-indigo-700', border: 'border-indigo-200', dot: 'bg-indigo-400' },
    'Pending Cheque': { bg: 'bg-gray-50', text: 'text-gray-700', border: 'border-gray-200', dot: 'bg-gray-400' },
    'Received Cheque': { bg: 'bg-emerald-50', text: 'text-emerald-700', border: 'border-emerald-200', dot: 'bg-emerald-400' },
};

const DEFAULT_PROJECT_CHECKLIST = [
    { id: 'kyc_docs', label: 'KYC Docs and Docs from PM Suryaghar Mufti Bijili Yojana portal and Digital approval from Janasamarth site', section: 'Pre-Installation', checked: false },
    { id: 'docs_sent_bank', label: 'Docs sent to the bank', section: 'Pre-Installation', checked: false },
    { id: 'serial_numbers', label: 'Serial numbers received', section: 'Post Installation Documentation', checked: false },
    { id: 'agreement_article7', label: 'Agreement on Article-7 100rs stamp', section: 'Post Installation Documentation', checked: false },
    { id: 'signed_agreement', label: 'Signed Agreement', section: 'Post Installation Documentation', checked: false },
    { id: 'self_declaration', label: 'Self Declaration', section: 'Post Installation Documentation', checked: false },
    { id: 'work_completion_portal', label: 'Work Completion from PM Surya Ghar portal', section: 'Post Installation Documentation', checked: false },
    { id: 'geo_tag_photos', label: 'Geo-Tag Photos of the site', section: 'Post Installation Documentation', checked: false },
    { id: 'dcr_certificate', label: 'DCR Certificate', section: 'Post Installation Documentation', checked: false },
    { id: 'panel_inverter_warranty', label: 'Panel and Inverter Warranty', section: 'Post Installation Documentation', checked: false },
    { id: 'undertaking_declaration', label: 'Undertaking/Self-Declaration', section: 'Post Installation Documentation', checked: false },
    { id: 'work_completion_report', label: 'Work Completion report', section: 'Post Installation Documentation', checked: false },
    { id: 'net_metering_request', label: 'Net-Metering service request from DISCOM website', section: 'Post Installation Documentation', checked: false },
    { id: 'discom_charges_slip', label: 'Pay Estimated and Demand charges slip from DISCOM website', section: 'Post Installation Documentation', checked: false },
    { id: 'application_form_annexure', label: 'Application Form [Annexure-1 / Net-Meter Application Form]', section: 'Post Installation Documentation', checked: false },
    { id: 'submit_docs_discom', label: 'Submitting the documents at DISCOM', section: 'Post Net-Meter Application', checked: false },
    { id: 'net_meter_installation', label: 'Net-Meter Installation', section: 'Post Net-Meter Application', checked: false },
    { id: 'discom_inspection_item', label: 'DISCOM Inspection & Project Commissioning', section: 'Post Net-Meter Application', checked: false },
    { id: 'subsidy_redeem', label: "Subsidy Redeem from the Customer's login", section: 'Post Net-Meter Application', checked: false },
    { id: 'subsidy_disbursed', label: 'Subsidy Disbursed', section: 'Post Net-Meter Application', checked: false },
    { id: 'all_payments_cleared', label: 'All payments cleared', section: 'Post Net-Meter Application', checked: false },
    { id: 'warranty_service_card', label: 'Warranty and service card', section: 'Post Net-Meter Application', checked: false },
];



function normalizeChecklist(rawChecklist) {
    let storedChecklist = [];
    if (Array.isArray(rawChecklist)) {
        storedChecklist = rawChecklist;
    } else if (typeof rawChecklist === 'string') {
        try {
            const parsed = JSON.parse(rawChecklist);
            if (Array.isArray(parsed)) storedChecklist = parsed;
        } catch (e) {
            storedChecklist = [];
        }
    }

    const storedById = Object.fromEntries(storedChecklist.map(item => [item.id, item]));
    const mergedChecklist = DEFAULT_PROJECT_CHECKLIST.map(item => ({
        ...item,
        ...storedById[item.id],
        checked: storedById[item.id]?.checked || false,
        checkedAt: storedById[item.id]?.checkedAt || null,
        checkedBy: storedById[item.id]?.checkedBy || null,
    }));

    const extraItems = storedChecklist.filter(item => !DEFAULT_PROJECT_CHECKLIST.some(def => def.id === item.id));
    return [...mergedChecklist, ...extraItems];
}

// ─── UTILS ─────────────────────────────────────────────────────────────────────
async function logActivity(userId, action, message, details = '') {
    try {
        await supabase.from('activity_log').insert({
            user_id: userId, action, message,
            new_value: details, created_at: new Date().toISOString(),
        });
    } catch (e) { console.error('Activity log error:', e); }
}

function totalFromPayments(payments) {
    if (!Array.isArray(payments)) return 0;
    return payments.reduce((s, p) => s + (Number(p.amount) || 0), 0);
}

function exportAllToCSV(customers) {
    const headers = [
        'CRN', 'Customer Name', 'Phone', 'Email', 'Location', 'Branch',
        'Capacity (kWp)', 'Project Type', 'POC', 'Stage', 'Financial Tag',
        'Quoted Amount', 'Bank Quote', 'Receivables', 'Discount',
        'Payment Type', 'Bank Name', 'Account #', 'IFSC', 'Loan Application #',
        'Meter Category', 'EB Number', 'DTR Code', 'Sanctioned Load',
        'DISCOM Division', 'Net Metering', 'Vendor', 'Aadhar',
        'Application #', 'Application Date', 'Google Docs', 'Created At',
    ];
    const rows = customers.map(c => {
        const tagLabel = FINANCIAL_TAGS.find(f => f.id === c.financial_tag)?.label || c.financial_tag || '';
        return [
            c.crn || '', c.customer_name || '', c.phone || '', c.email || '',
            c.location || '', c.company_branch || '', c.capacity_kwp || '',
            c.project_type || '', c.poc || '',
            PRIMARY_STAGES.find(s => s.id === c.stage)?.label || c.stage || '',
            tagLabel, c.quoted_amount || '', c.quote_to_bank || '',
            c.receivables || '', c.discount || '',
            c.payment_type || '', c.bank_name || '', c.bank_account_number || '',
            c.ifsc_code || '', c.loan_application_number || '', c.meter_category || '',
            c.eb_number || '', c.dtr_code || '', c.sanctioned_load || '',
            c.discom_division || '', c.net_metering || '', c.vendor || '',
            c.aadhar || '', c.application_number || '', c.application_date || '',
            c.google_docs || '',
            c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN') : '',
        ].join(',');
    });
    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `solarflow_customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

function useMetadata() {
    const [meta, setMeta] = useState({});
    useEffect(() => {
        supabase.from('metadata').select('category, label').then(({ data }) => {
            if (!data) return;
            const grouped = {};
            data.forEach(({ category, label }) => {
                if (!grouped[category]) grouped[category] = [];
                grouped[category].push(label);
            });
            setMeta(grouped);
        });
    }, []);
    return meta;
}

// ─── LOGIN SCREEN ───────────────────────────────────────────────────────────────
function LoginScreen({ onLogin }) {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const [showPw, setShowPw] = useState(false);

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);
        try {
            // Sign out any existing session first to prevent auto-redirect issues
            const { error: signOutError } = await supabase.auth.signOut();
            // Brief pause to ensure sign out completes
            await new Promise(res => setTimeout(res, 100));

            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email: email.trim(), password });
            if (authError) throw authError;
            if (!authData?.user) throw new Error('Login failed. Please try again.');

            const { data: profile, error: profileError } = await supabase
                .from('profiles').select('*').eq('id', authData.user.id).single();
            if (profileError || !profile) {
                await supabase.auth.signOut();
                throw new Error('Profile not found. Contact Admin.');
            }
            onLogin({
                id: authData.user.id,
                email: authData.user.email,
                name: profile.name,
                role: profile.role,
                userType: profile.user_type,
            });
        } catch (err) {
            setError(err.message);
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-stone-50 p-6">
            <form onSubmit={handleLogin} className="bg-white p-12 rounded-[40px] shadow-xl w-full max-w-md text-center border border-stone-100">
                <div className="w-16 h-16 bg-amber-500 rounded-3xl flex items-center justify-center text-white mx-auto mb-8 shadow-lg shadow-amber-200">
                    <Sun size={32} />
                </div>
                <h1 className="text-2xl font-bold text-stone-800 tracking-tight">SolarFlow</h1>
                <p className="text-stone-400 font-medium text-xs mb-10 mt-1">Administrative Management Portal</p>
                <div className="space-y-4 mb-8">
                    <div className="relative">
                        <Mail className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
                        <input type="email" placeholder="Email Address" required value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full pl-11 p-3.5 bg-stone-50 rounded-2xl border border-stone-100 outline-none font-medium focus:border-amber-400 transition-all text-sm" />
                    </div>
                    <div className="relative">
                        <User className="absolute left-4 top-3.5 w-4 h-4 text-stone-400" />
                        <input type={showPw ? 'text' : 'password'} placeholder="Password" required value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full pl-11 pr-11 p-3.5 bg-stone-50 rounded-2xl border border-stone-100 outline-none font-medium focus:border-amber-400 transition-all text-sm" />
                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-4 top-3.5 text-stone-400 hover:text-stone-600">
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                </div>
                {error && <p className="text-red-500 text-xs mb-4 bg-red-50 p-2 rounded-xl">{error}</p>}
                <button type="submit" disabled={loading}
                    className="w-full bg-stone-800 text-white py-4 rounded-2xl font-bold hover:bg-stone-900 transition-all shadow-lg shadow-stone-200 flex items-center justify-center gap-2 disabled:opacity-60">
                    {loading ? 'Entering Portal...' : <><Sparkles size={16} /> Access Portal</>}
                </button>
            </form>
        </div>
    );
}

// ─── DASHBOARD VIEW ─────────────────────────────────────────────────────────────
function DashboardView({ customers = [], loading }) {
    if (loading) return (
        <div className="p-20 text-center text-stone-400 font-medium italic animate-pulse">
            Calculating solar metrics...
        </div>
    );

    const totalCap = customers.reduce((s, c) => s + (parseFloat(c.capacity_kwp) || 0), 0);
    const totalRev = customers.reduce((s, c) => s + (Number(c.quoted_amount) || 0), 0);
    const totalIn = customers.reduce((s, c) => s + (Number(c.total_received) || 0), 0);

    return (
        <div className="space-y-8 animate-in fade-in duration-700">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <MetricBox label="Live Projects" value={customers.length} icon={Sun} color="amber" />
                <MetricBox label="Solar Capacity" value={`${totalCap.toFixed(1)} kWp`} icon={Zap} color="yellow" />
                <MetricBox label="Total Sales" value={`₹${(totalRev / 100000).toFixed(1)}L`} icon={IndianRupee} color="emerald" />
                <MetricBox label="Pending Dues" value={`₹${((totalRev - totalIn) / 100000).toFixed(1)}L`} icon={Wallet} color="orange" />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                <div className="lg:col-span-2 bg-white rounded-3xl p-8 border border-stone-100 shadow-sm">
                    <h3 className="text-[11px] font-bold text-stone-400 uppercase tracking-widest mb-8">Operational Pipeline</h3>
                    <div className="space-y-5">
                        {PRIMARY_STAGES.slice(0, 11).map(stage => {
                            const count = customers.filter(c => c.stage === stage.id).length;
                            const perc = customers.length > 0 ? (count / customers.length) * 100 : 0;
                            return (
                                <div key={stage.id} className="space-y-1.5">
                                    <div className="flex justify-between text-xs font-bold text-stone-600">
                                        <span>{stage.label}</span><span>{count}</span>
                                    </div>
                                    <div className="h-2 bg-stone-50 rounded-full overflow-hidden">
                                        <div className="h-full bg-amber-400 transition-all duration-1000 rounded-full" style={{ width: `${perc}%` }} />
                                    </div>
                                </div>
                            );
                        })}
                    </div>
                </div>
                <div className="bg-stone-800 rounded-3xl p-8 text-white flex flex-col justify-between">
                    <div>
                        <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-6">Realized Revenue</h4>
                        <p className="text-3xl font-bold">₹{(totalIn / 100000).toFixed(2)}L</p>
                        <p className="text-xs text-stone-400 mt-2 font-medium">Actual cash inflow from all payments</p>
                    </div>
                    <div className="pt-6 border-t border-stone-700 mt-6">
                        <TrendingUp size={20} className="text-amber-500" />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                {PRIMARY_STAGES.map(stage => {
                    const count = customers.filter(c => c.stage === stage.id).length;
                    return (
                        <div key={stage.id} className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm text-center">
                            <p className="text-xl font-bold text-stone-800">{count}</p>
                            <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wider mt-1 leading-tight">{stage.label}</p>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}

const MetricBox = ({ label, value, icon: Icon, color }) => {
    const cMap = {
        amber: 'bg-amber-50 text-amber-600', yellow: 'bg-yellow-50 text-yellow-600',
        emerald: 'bg-emerald-50 text-emerald-600', orange: 'bg-orange-50 text-orange-600',
    };
    return (
        <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm hover:border-amber-100 transition-all">
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center mb-4 ${cMap[color]}`}>
                <Icon size={18} />
            </div>
            <p className="text-2xl font-bold text-stone-800 tracking-tight">{value}</p>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mt-1">{label}</p>
        </div>
    );
};

// ─── FINANCIAL SIDEBAR VIEW ─────────────────────────────────────────────────────
// Shows all customers with a financial_tag, grouped by tag type
function FinancialSidebarView({ customers, onSelectCustomer }) {
    const tagged = customers.filter(c => c.financial_tag);

    const grouped = FINANCIAL_TAGS.reduce((acc, tag) => {
        const group = tagged.filter(c => c.financial_tag === tag.id);
        if (group.length > 0) acc[tag.id] = group;
        return acc;
    }, {});

    const totalPending = tagged.reduce((s, c) => s + (Number(c.receivables) || 0), 0);

    if (tagged.length === 0) {
        return (
            <div className="flex flex-col items-center justify-center h-64 text-stone-400">
                <Tag className="w-10 h-10 mb-3 text-stone-300" />
                <p className="font-medium text-stone-500 text-sm">No financial tags active</p>
                <p className="text-xs mt-1 text-stone-400">Tag customers from their detail view</p>
            </div>
        );
    }

    return (
        <div className="space-y-6 animate-in fade-in duration-500">
            {/* Summary bar */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm col-span-2">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Tagged Customers</p>
                    <p className="text-2xl font-bold text-stone-800">{tagged.length}</p>
                </div>
                <div className="bg-white rounded-2xl p-4 border border-stone-100 shadow-sm col-span-2">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Total Receivables</p>
                    <p className="text-2xl font-bold text-orange-600">₹{(totalPending / 100000).toFixed(2)}L</p>
                </div>
                {FINANCIAL_TAGS.map(tag => {
                    const count = (grouped[tag.id] || []).length;
                    if (count === 0) return null;
                    const colors = FINANCIAL_TAG_COLORS[tag.id] || { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200', dot: 'bg-stone-400' };
                    return (
                        <div key={tag.id} className={`rounded-2xl p-3 border ${colors.bg} ${colors.border}`}>
                            <p className={`text-[9px] font-bold uppercase tracking-widest mb-0.5 ${colors.text}`}>{tag.label}</p>
                            <p className={`text-xl font-bold ${colors.text}`}>{count}</p>
                        </div>
                    );
                })}
            </div>

            {/* Grouped lists */}
            {FINANCIAL_TAGS.map(tag => {
                const group = grouped[tag.id];
                if (!group) return null;
                const colors = FINANCIAL_TAG_COLORS[tag.id] || { bg: 'bg-stone-50', text: 'text-stone-700', border: 'border-stone-200', dot: 'bg-stone-400' };
                return (
                    <div key={tag.id}>
                        <div className="flex items-center gap-2 mb-3">
                            <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${colors.dot}`} />
                            <h3 className="text-xs font-bold text-stone-700 uppercase tracking-widest">{tag.label}</h3>
                            <span className={`ml-auto text-[10px] px-2 py-0.5 rounded-full font-bold border ${colors.bg} ${colors.text} ${colors.border}`}>
                                {group.length}
                            </span>
                        </div>
                        <div className="space-y-2">
                            {group.map(c => {
                                const recv = Number(c.receivables) || 0;
                                const totalRec = Number(c.total_received) || 0;
                                return (
                                    <button key={c.id} onClick={() => onSelectCustomer(c)}
                                        className="w-full bg-white rounded-2xl border border-stone-100 p-4 text-left hover:border-amber-200 hover:shadow-sm transition-all group">
                                        <div className="flex justify-between items-start mb-2">
                                            <div>
                                                <p className="font-bold text-stone-800 text-sm group-hover:text-amber-600 transition-colors">
                                                    {c.customer_name}
                                                </p>
                                                <p className="text-[10px] text-stone-400 font-medium mt-0.5">
                                                    {c.crn || 'No CRN'} · {c.location || 'No Location'}
                                                </p>
                                            </div>
                                            <span className="text-[9px] bg-stone-50 text-stone-400 px-2 py-1 rounded font-bold uppercase ml-2 whitespace-nowrap">
                                                {PRIMARY_STAGES.find(s => s.id === c.stage)?.label || c.stage}
                                            </span>
                                        </div>
                                        <div className="grid grid-cols-3 gap-2 pt-2 border-t border-stone-50">
                                            <div>
                                                <p className="text-[9px] text-stone-400 font-bold uppercase">Quoted</p>
                                                <p className="text-xs font-bold text-stone-700">₹{(Number(c.quoted_amount || 0) / 1000).toFixed(0)}k</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-stone-400 font-bold uppercase">Received</p>
                                                <p className="text-xs font-bold text-emerald-600">₹{(totalRec / 1000).toFixed(0)}k</p>
                                            </div>
                                            <div>
                                                <p className="text-[9px] text-stone-400 font-bold uppercase">Receivable</p>
                                                <p className={`text-xs font-bold ${recv > 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
                                                    ₹{(recv / 1000).toFixed(0)}k
                                                </p>
                                            </div>
                                        </div>
                                        {c.poc && (
                                            <p className="text-[10px] text-stone-400 mt-2 flex items-center gap-1">
                                                <User className="w-2.5 h-2.5" /> {c.poc}
                                            </p>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>
                );
            })}
        </div>
    );
}

// ─── ADD LEAD MODAL ─────────────────────────────────────────────────────────────
function AddLeadModal({ onClose, onSave, meta }) {
    const [form, setForm] = useState({
        customer_name: '', phone: '', email: '', location: '',
        company_branch: '', capacity_kwp: '', project_type: 'On-Grid',
        poc: '', quoted_amount: '', stage: 'Leads',
    });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

    const handleSave = async () => {
        if (!form.customer_name.trim()) { setError('Customer name is required'); return; }
        if (!form.phone.trim()) { setError('Phone is required'); return; }
        setSaving(true);
        await onSave({
            ...form,
            quoted_amount: form.quoted_amount ? Number(form.quoted_amount) : null,
            capacity_kwp: form.capacity_kwp ? Number(form.capacity_kwp) : null,
            payments: [],
            follow_ups: [],
            project_checklist: DEFAULT_PROJECT_CHECKLIST,
            subsidy_history: [],
            total_received: 0,
        });
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-stone-900 px-5 py-4 flex justify-between items-center flex-shrink-0">
                    <h2 className="text-lg font-bold text-white">Add New Lead</h2>
                    <button onClick={onClose} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="flex-1 overflow-y-auto p-4 space-y-3">
                    {error && <p className="text-red-500 text-xs bg-red-50 p-2 rounded-lg">{error}</p>}
                    {[
                        { label: 'Customer Name *', field: 'customer_name', type: 'text' },
                        { label: 'Phone *', field: 'phone', type: 'tel' },
                        { label: 'Email', field: 'email', type: 'email' },
                        { label: 'Location', field: 'location', type: 'text' },
                        { label: 'Capacity (kWp)', field: 'capacity_kwp', type: 'number' },
                        { label: 'Quoted Amount (₹)', field: 'quoted_amount', type: 'number' },
                    ].map(({ label, field, type }) => (
                        <div key={field}>
                            <label className="block text-xs font-medium text-stone-600 mb-1">{label}</label>
                            <input type={type} value={form[field]} onChange={e => set(field, e.target.value)}
                                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                        </div>
                    ))}
                    {[
                        { label: 'Branch', field: 'company_branch', category: 'company_branch' },
                        { label: 'POC', field: 'poc', category: 'poc' },
                    ].map(({ label, field, category }) => (
                        <div key={field}>
                            <label className="block text-xs font-medium text-stone-600 mb-1">{label}</label>
                            <select value={form[field]} onChange={e => set(field, e.target.value)}
                                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                                <option value="">Select...</option>
                                {(meta[category] || []).map(opt => <option key={opt}>{opt}</option>)}
                            </select>
                        </div>
                    ))}
                    <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">Project Type</label>
                        <select value={form.project_type} onChange={e => set('project_type', e.target.value)}
                            className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                            {(meta['project_type'] || ['On-Grid', 'Hybrid']).map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                <div className="border-t p-4 flex gap-3 flex-shrink-0">
                    <button onClick={onClose} className="flex-1 py-2.5 border border-stone-300 text-stone-700 rounded-xl text-sm font-medium">Cancel</button>
                    <button onClick={handleSave} disabled={saving}
                        className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                        {saving ? 'Saving...' : <><Plus className="w-4 h-4" /> Add Lead</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── PAYMENT ROW EDITOR ─────────────────────────────────────────────────────────
function PaymentsEditor({ payments = [], onChange, isEditing }) {
    const handleChange = (idx, field, val) => {
        const updated = payments.map((p, i) => i === idx ? { ...p, [field]: val } : p);
        onChange(updated);
    };
    const addPayment = () => {
        onChange([...payments, { no: payments.length + 1, amount: '', date: '' }]);
    };
    const removePayment = (idx) => {
        onChange(payments.filter((_, i) => i !== idx));
    };

    // Use isEditing prop here, NOT editingSection
    if (!isEditing) {
        return (
            <div className="space-y-2">
                {payments.length === 0 && <p className="text-xs text-stone-400 italic">No payments recorded</p>}
                {payments.map((p, i) => (
                    <div key={i} className="bg-stone-50 p-3 rounded-xl flex justify-between items-center">
                        <div>
                            <p className="text-[9px] text-stone-400 font-bold uppercase">Payment {p.no || i + 1}</p>
                            <p className="text-sm font-semibold text-emerald-600">₹{Number(p.amount || 0).toLocaleString('en-IN')}</p>
                        </div>
                        {p.date && <p className="text-xs text-stone-400">{p.date}</p>}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {payments.map((p, i) => (
                <div key={i} className="bg-stone-50 p-3 rounded-xl space-y-2 border border-stone-200">
                    <div className="flex items-center justify-between">
                        <p className="text-[9px] font-bold text-stone-400 uppercase">Payment {p.no || i + 1}</p>
                        <button onClick={() => removePayment(i)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <input type="number" placeholder="Amount (₹)" value={p.amount || ''}
                            onChange={e => handleChange(i, 'amount', e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-300" />
                        <input type="date" value={p.date || ''}
                            onChange={e => handleChange(i, 'date', e.target.value)}
                            className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-300" />
                    </div>
                </div>
            ))}
            <button onClick={addPayment}
                className="w-full flex items-center justify-center gap-1.5 border border-dashed border-stone-300 rounded-xl py-2 text-xs text-stone-500 hover:border-amber-400 hover:text-amber-600 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Payment
            </button>
        </div>
    );
}

// ─── SUBSIDY HISTORY EDITOR ─────────────────────────────────────────────────────
function SubsidyHistoryEditor({ subsidyHistory = [], onChange, isEditing }) {
    const addEntry = () => {
        onChange([...subsidyHistory, { type: 'Rejected', date: '', remark: '', created_at: new Date().toISOString() }]);
    };
    const removeEntry = (idx) => onChange(subsidyHistory.filter((_, i) => i !== idx));
    const updateEntry = (idx, field, val) => {
        onChange(subsidyHistory.map((e, i) => i === idx ? { ...e, [field]: val } : e));
    };

    const TYPE_OPTIONS = ['Rejected', 'Redeemed', 'Disbursed'];

    // Use isEditing prop here
    if (!isEditing) {
        return (
            <div className="space-y-2">
                {subsidyHistory.length === 0 && <p className="text-xs text-stone-400 italic">No subsidy history recorded</p>}
                {subsidyHistory.map((e, i) => (
                    <div key={i} className="bg-stone-50 p-3 rounded-xl">
                        <div className="flex justify-between items-center mb-1">
                            <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase ${e.type === 'Disbursed' ? 'bg-emerald-100 text-emerald-700' :
                                e.type === 'Redeemed' ? 'bg-blue-100 text-blue-700' :
                                    'bg-red-100 text-red-700'
                                }`}>{e.type}</span>
                            {e.date && <p className="text-xs text-stone-400">{e.date}</p>}
                        </div>
                        {e.remark && <p className="text-xs text-stone-600 mt-1">{e.remark}</p>}
                    </div>
                ))}
            </div>
        );
    }

    return (
        <div className="space-y-2">
            {subsidyHistory.map((e, i) => (
                <div key={i} className="bg-stone-50 p-3 rounded-xl space-y-2 border border-stone-200">
                    <div className="flex items-center justify-between">
                        <p className="text-[9px] font-bold text-stone-400 uppercase">Entry {i + 1}</p>
                        <button onClick={() => removeEntry(i)} className="text-red-400 hover:text-red-600">
                            <Trash2 className="w-3.5 h-3.5" />
                        </button>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                        <select value={e.type || 'Rejected'} onChange={ev => updateEntry(i, 'type', ev.target.value)}
                            className="bg-white border border-stone-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-300">
                            {TYPE_OPTIONS.map(t => <option key={t}>{t}</option>)}
                        </select>
                        <input type="date" value={e.date || ''} onChange={ev => updateEntry(i, 'date', ev.target.value)}
                            className="bg-white border border-stone-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-300" />
                    </div>
                    <input type="text" placeholder="Remark..." value={e.remark || ''} onChange={ev => updateEntry(i, 'remark', ev.target.value)}
                        className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1.5 text-sm focus:outline-none focus:ring-1 focus:ring-amber-300" />
                </div>
            ))}
            <button onClick={addEntry}
                className="w-full flex items-center justify-center gap-1.5 border border-dashed border-stone-300 rounded-xl py-2 text-xs text-stone-500 hover:border-amber-400 hover:text-amber-600 transition-colors">
                <Plus className="w-3.5 h-3.5" /> Add Subsidy Entry
            </button>
        </div>
    );
}
// ─── CUSTOMER CARD ───────────────────────────────────────────────────────────────
function CustomerCard({ customer, onSelect, onMoveStage }) {
    const [showStageMenu, setShowStageMenu] = useState(false);
    const dropdownRef = useRef(null);

    useEffect(() => {
        if (!showStageMenu) return;
        const handleClick = (e) => {
            if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowStageMenu(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showStageMenu]);

    // Use total_received from DB column (not computed)
    const totalPaid = Number(customer.total_received) || 0;
    const quotedAmt = Number(customer.quoted_amount || 0);
    const balance = quotedAmt - totalPaid;
    const tagInfo = FINANCIAL_TAGS.find(f => f.id === customer.financial_tag);
    const tagColors = customer.financial_tag ? (FINANCIAL_TAG_COLORS[customer.financial_tag] || {}) : {};

    return (
        <div className="bg-white rounded-2xl border border-stone-100 shadow-sm hover:shadow-md transition-all border-l-4 border-l-amber-400 group flex flex-col">
            <div className="p-5 cursor-pointer flex-1" onClick={() => onSelect(customer)}>
                <div className="flex justify-between items-start mb-3">
                    <h3 className="font-bold text-stone-800 group-hover:text-amber-600 transition-colors leading-tight">
                        {customer.customer_name}
                    </h3>
                    <span className="text-[9px] bg-stone-50 text-stone-400 px-2 py-1 rounded font-bold uppercase ml-2 whitespace-nowrap">
                        {customer.crn || 'NO-CRN'}
                    </span>
                </div>
                <div className="grid grid-cols-2 gap-y-1.5 mb-3">
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                        <Zap size={11} className="text-amber-500 flex-shrink-0" />
                        <span>{customer.capacity_kwp ? `${customer.capacity_kwp} kWp` : '–'} {customer.project_type || ''}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                        <MapPin size={11} className="text-stone-300 flex-shrink-0" />
                        <span className="truncate">{customer.location || 'N/A'}</span>
                    </div>
                    <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                        <User size={11} className="text-stone-300 flex-shrink-0" />
                        <span className="truncate">{customer.poc || 'No POC'}</span>
                    </div>
                    {customer.phone && (
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                            <span className="text-stone-300">📞</span>
                            <span>{customer.phone}</span>
                        </div>
                    )}
                    {customer.company_branch && (
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium col-span-2">
                            <Building2 size={11} className="text-stone-300 flex-shrink-0" />
                            <span>{customer.company_branch}</span>
                        </div>
                    )}
                    {customer.vendor && (
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 font-medium col-span-2">
                            <Package size={11} className="text-stone-300 flex-shrink-0" />
                            <span>Vendor: {customer.vendor}</span>
                        </div>
                    )}
                </div>
                {customer.google_docs && (
                    <div className="mb-3" onClick={e => e.stopPropagation()}>
                        <a href={customer.google_docs} target="_blank" rel="noopener noreferrer"
                            className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1 rounded-full font-medium transition-colors">
                            <FolderOpen className="w-3 h-3" /> Docs
                        </a>
                    </div>
                )}
            </div>

            <div className="border-t border-stone-100 bg-stone-50/60 rounded-b-2xl" onClick={e => e.stopPropagation()}>
                <div className="grid grid-cols-3 gap-0 divide-x divide-stone-100 px-1 py-3">
                    <div className="text-center px-2">
                        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wide">Quoted</p>
                        <p className="text-xs font-bold text-stone-700 mt-0.5">₹{(quotedAmt / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="text-center px-2">
                        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wide">Received</p>
                        <p className="text-xs font-bold text-emerald-600 mt-0.5">₹{(totalPaid / 1000).toFixed(0)}k</p>
                    </div>
                    <div className="text-center px-2">
                        <p className="text-[9px] font-bold text-stone-400 uppercase tracking-wide">Balance</p>
                        <p className={`text-xs font-bold mt-0.5 ${balance > 0 ? 'text-orange-500' : 'text-emerald-500'}`}>
                            ₹{(balance / 1000).toFixed(0)}k
                        </p>
                    </div>
                </div>

                {/* Financial tag pill — only shown if set */}
                {tagInfo && (
                    <div className="px-4 pb-3 border-t border-stone-100 pt-2">
                        <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase border ${tagColors.bg || 'bg-stone-50'} ${tagColors.text || 'text-stone-500'} ${tagColors.border || 'border-stone-200'}`}>
                            <span className={`w-1.5 h-1.5 rounded-full ${tagColors.dot || 'bg-stone-400'}`} />
                            {tagInfo.label}
                        </span>
                    </div>
                )}

                {/* Internal remarks preview */}
                {customer.internal_remarks && (
                    <div className="px-4 pb-3 border-t border-stone-100 pt-2">
                        <p className="text-[10px] text-stone-500 italic leading-tight line-clamp-2">
                            💬 {customer.internal_remarks}
                        </p>
                    </div>
                )}

                <div className="px-4 pb-4 pt-2 border-t border-stone-100">
                    <div className="relative" ref={dropdownRef}>
                        <button onClick={() => setShowStageMenu(!showStageMenu)}
                            className="w-full flex items-center justify-between bg-white hover:bg-stone-100 border border-stone-200 rounded-xl px-3 py-2 text-xs text-stone-600 font-semibold transition-colors">
                            <span className="truncate">{PRIMARY_STAGES.find(s => s.id === customer.stage)?.label || customer.stage || 'Move to Stage'}</span>
                            <ChevronDown className={`w-4 h-4 flex-shrink-0 ml-1 transition-transform ${showStageMenu ? 'rotate-180' : ''}`} />
                        </button>
                        {showStageMenu && (
                            <div className="absolute bottom-full left-0 right-0 mb-1 bg-white rounded-xl shadow-xl border border-stone-100 py-1 z-20 max-h-64 overflow-y-auto">
                                {PRIMARY_STAGES.map(stage => (
                                    <button key={stage.id}
                                        onClick={() => { onMoveStage(customer.id, stage.id); setShowStageMenu(false); }}
                                        className={`w-full px-3 py-2 text-left text-xs flex items-center gap-2 hover:bg-stone-50 transition-colors ${customer.stage === stage.id ? 'bg-amber-50 font-bold text-amber-700' : 'text-stone-600'}`}>
                                        <stage.icon className="w-3.5 h-3.5 text-stone-400 flex-shrink-0" />
                                        {stage.label}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

// ─── DETAIL ITEM ─────────────────────────────────────────────────────────────────
function DetailItem({ label, value, isMoney = false, isEnergy = false }) {
    return (
        <div className="bg-stone-50 p-3 rounded-xl">
            <p className="text-[9px] text-stone-400 uppercase tracking-wide mb-1 font-bold">{label}</p>
            <p className={`text-sm font-semibold truncate ${isMoney ? 'text-emerald-600' : isEnergy ? 'text-amber-600' : 'text-stone-800'}`}>
                {value || '–'}
            </p>
        </div>
    );
}

function EditableDetailItem({ label, field, value, onChange, type = 'text', isMoney = false, isEnergy = false, isEditing, options }) {
    if (!isEditing) return <DetailItem label={label} value={value} isMoney={isMoney} isEnergy={isEnergy} />;
    return (
        <div className="bg-stone-50 p-3 rounded-xl">
            <p className="text-[9px] text-stone-400 uppercase tracking-wide mb-1 font-bold">{label}</p>
            {options ? (
                <select value={value || ''} onChange={e => onChange(field, e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-300">
                    <option value="">Select...</option>
                    {options.map(o => <option key={o}>{o}</option>)}
                </select>
            ) : (
                <input type={type} value={value || ''} onChange={e => onChange(field, e.target.value)}
                    className="w-full bg-white border border-stone-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-amber-300" />
            )}
        </div>
    );
}

// ─── CUSTOMER DETAIL MODAL ───────────────────────────────────────────────────────
function CustomerDetailModal({ customer, onClose, onUpdate, onDelete, user, meta }) {
    const [activeTab, setActiveTab] = useState('overview'); // overview, finance, checklist, history
    const [editingSection, setEditingSection] = useState(null);
    const [editData, setEditData] = useState({ ...customer });
    const [followUpText, setFollowUpText] = useState('');
    const [saving, setSaving] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const [activityLogs, setActivityLogs] = useState([]);
    const isAdmin = user?.userType === 'admin';

    const [localChecklist, setLocalChecklist] = useState(normalizeChecklist(customer.project_checklist));
    const [checklistDirty, setChecklistDirty] = useState(false);
    const sections = [...new Set(localChecklist.map(item => item.section))];

    const ACTION_COLORS = {
        create: 'bg-emerald-100 text-emerald-700', update: 'bg-blue-100 text-blue-700',
        delete: 'bg-rose-100 text-rose-700', stage_change: 'bg-amber-100 text-amber-700',
        note: 'bg-indigo-100 text-indigo-700',
    };

    const fetchLogs = async () => {
        const { data } = await supabase.from('activity_log').select('*, profiles(name)')
            .or(`new_value.eq.${customer.id},message.ilike.%${customer.customer_name}%`)
            .order('created_at', { ascending: false }).limit(25);
        if (data) setActivityLogs(data);
    };

    const handleToggleFinancialTag = async (tagId) => {
        const newTag = editData.financial_tag === tagId ? null : tagId;
        // This makes the UI change immediately
        setEditData(prev => ({ ...prev, financial_tag: newTag }));

        // This updates the database
        await onUpdate(customer.id, { financial_tag: newTag });

        const tagLabel = FINANCIAL_TAGS.find(t => t.id === tagId)?.label || tagId;
        logActivity(user.id, 'update', `${customer.customer_name}: Financial tag — ${tagLabel}`, customer.id);
        fetchLogs();
    };


    useEffect(() => {
        setEditData({ ...customer });
        setLocalChecklist(normalizeChecklist(customer.project_checklist));
        fetchLogs();
    }, [customer.id]);

    const formatLogDate = (dateStr) => {
        return new Date(dateStr).toLocaleString('en-IN', {
            day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit', hour12: true
        });
    };

    const handleChange = (field, val) => setEditData(prev => ({ ...prev, [field]: val }));

    const handleSave = async () => {
        setSaving(true);
        const updates = { ...editData };

        // Detailed logging: compare old vs new
        let changeSummary = [];
        Object.keys(updates).forEach(key => {
            if (updates[key] !== customer[key] && key !== 'id' && key !== 'updated_at' && typeof updates[key] !== 'object') {
                const label = key.replace(/_/g, ' ').toUpperCase();
                changeSummary.push(`${label}: ${customer[key] || 'None'} → ${updates[key] || 'None'}`);
            }
        });

        delete updates.id; delete updates.created_at; delete updates.crn;
        await onUpdate(customer.id, updates);

        if (changeSummary.length > 0) {
            await logActivity(user.id, 'update', changeSummary.join(' | '), customer.id);
        }

        setEditingSection(null);
        setSaving(false);
        fetchLogs();
    };

    const handleAddNote = async () => {
        if (!followUpText.trim()) return;
        const updatedNotes = [...(editData.follow_ups || []), { text: followUpText, author: user.name, date: new Date().toISOString() }];
        await onUpdate(customer.id, { follow_ups: updatedNotes });
        await logActivity(user.id, 'note', `Note Added: ${followUpText}`, customer.id);
        setEditData(prev => ({ ...prev, follow_ups: updatedNotes }));
        setFollowUpText('');
        fetchLogs();
    };

    const SectionHeader = ({ title, id, icon: Icon }) => (
        <div className="flex items-center justify-between mb-3 border-b border-stone-100 pb-1.5 mt-6">
            <h3 className="text-[9px] font-bold text-stone-400 uppercase tracking-widest flex items-center gap-2">
                <Icon size={12} /> {title}
            </h3>
            <button onClick={() => setEditingSection(editingSection === id ? null : id)} className="text-stone-400 hover:text-amber-600 transition-colors">
                {editingSection === id ? <X size={14} /> : <Edit3 size={12} />}
            </button>
        </div>
    );

    return (
        <div className="fixed inset-0 bg-stone-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-[28px] shadow-2xl w-full max-w-5xl h-[94vh] overflow-hidden flex flex-col border border-stone-100">

                {/* --- HEADER --- */}
                <div className="bg-stone-900 px-6 py-5 flex justify-between items-center flex-shrink-0">
                    <div>
                        <div className="flex items-center gap-3">
                            <h2 className="text-xl font-bold text-white">{customer.customer_name}</h2>
                            <span className="text-[9px] bg-white/10 text-stone-400 px-2 py-0.5 rounded font-bold uppercase tracking-widest">{customer.crn || 'NO-CRN'}</span>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                            {customer.location_link && (
                                <a href={customer.location_link} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-blue-500 text-white px-2.5 py-1 rounded-lg text-[9px] font-bold hover:bg-blue-600 transition-all shadow-lg shadow-blue-500/20">
                                    <MapPin size={10} /> VIEW MAPS
                                </a>
                            )}
                            {customer.google_docs && (
                                <a href={customer.google_docs} target="_blank" rel="noreferrer" className="flex items-center gap-1.5 bg-emerald-500 text-white px-2.5 py-1 rounded-lg text-[9px] font-bold hover:bg-emerald-600 transition-all shadow-lg shadow-emerald-500/20">
                                    <FolderOpen size={10} /> GOOGLE DRIVE
                                </a>
                            )}
                        </div>
                    </div>
                    <div className="flex gap-2">
                        {isAdmin && <button onClick={() => setShowDeleteConfirm(true)} className="p-2 text-white/30 hover:text-red-400"><Trash2 size={18} /></button>}
                        <button onClick={onClose} className="p-2 text-white/30 hover:text-white"><X size={24} /></button>
                    </div>
                </div>

                {/* --- SUB-TAB NAVIGATION --- */}
                <div className="flex bg-stone-900 px-6 gap-6 border-t border-white/5 flex-shrink-0">
                    {[
                        { id: 'overview', label: 'Overview', icon: LayoutDashboard },
                        { id: 'finance', label: 'Finance & Bank', icon: IndianRupee },
                        { id: 'checklist', label: 'Checklist', icon: CheckSquare },
                        { id: 'history', label: 'Notes & History', icon: History },
                    ].map(tab => (
                        <button key={tab.id} onClick={() => { setActiveTab(tab.id); setEditingSection(null); }}
                            className={`flex items-center gap-2 py-3 text-[10px] font-bold uppercase tracking-widest transition-all border-b-2 ${activeTab === tab.id ? 'text-amber-400 border-amber-400' : 'text-stone-500 border-transparent hover:text-stone-300'}`}>
                            <tab.icon size={12} /> {tab.label}
                        </button>
                    ))}
                </div>

                {/* --- BODY --- */}
                <div className="flex-1 overflow-y-auto p-6 custom-scrollbar bg-[#FCFBFA]">

                    {activeTab === 'overview' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                                    <label className="text-[9px] text-stone-400 font-bold uppercase mb-2 block">Primary Stage</label>
                                    <select value={editData.stage} onChange={async (e) => {
                                        const oldStage = customer.stage;
                                        await onUpdate(customer.id, { stage: e.target.value });
                                        await logActivity(user.id, 'stage_change', `STAGE: ${oldStage} → ${e.target.value}`, customer.id);
                                        fetchLogs();
                                    }} className="w-full p-2 bg-stone-50 border-none rounded-xl text-sm font-bold text-stone-700 outline-none">
                                        {PRIMARY_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                                    </select>
                                </div>
                                <div className="bg-white p-4 rounded-2xl border border-stone-100 shadow-sm">
                                    <label className="text-[9px] text-stone-400 font-bold uppercase mb-2 block">Financial Tag</label>
                                    <div className="flex flex-wrap gap-1.5">
                                        {FINANCIAL_TAGS.map(tag => {
                                            const isActive = editData.financial_tag === tag.id;
                                            const colors = FINANCIAL_TAG_COLORS[tag.id] || {};
                                            return (
                                                <button
                                                    key={tag.id}
                                                    onClick={() => handleToggleFinancialTag(tag.id)}
                                                    className={`inline-flex items-center gap-1 text-[9px] px-2.5 py-1 rounded-full font-bold border transition-all ${isActive
                                                        ? `${colors.bg} ${colors.text} ${colors.border}`
                                                        : 'bg-stone-50 text-stone-400 border-transparent hover:border-stone-200'}`}
                                                >
                                                    {isActive && <span className={`w-1 h-1 rounded-full ${colors.dot}`} />}
                                                    {tag.label}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            </div>

                            <section>
                                <SectionHeader title="Customer Info" id="cus" icon={User} />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <EditableDetailItem label="Phone" field="phone" value={editData.phone} onChange={handleChange} isEditing={editingSection === 'cus'} />
                                    <EditableDetailItem label="Email" field="email" value={editData.email} onChange={handleChange} isEditing={editingSection === 'cus'} />
                                    <EditableDetailItem label="Aadhar" field="aadhar" value={editData.aadhar} onChange={handleChange} isEditing={editingSection === 'cus'} />
                                    <EditableDetailItem label="POC" field="poc" value={editData.poc} onChange={handleChange} options={meta['poc']} isEditing={editingSection === 'cus'} />
                                    <EditableDetailItem label="Branch" field="company_branch" value={editData.company_branch} onChange={handleChange} options={meta['company_branch']} isEditing={editingSection === 'cus'} />
                                    <EditableDetailItem label="Location" field="location" value={editData.location} onChange={handleChange} isEditing={editingSection === 'cus'} />
                                </div>
                            </section>

                            <section>
                                <SectionHeader title="Project & Technical" id="pro" icon={Zap} />
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                                    <EditableDetailItem label="Capacity (kWp)" field="capacity_kwp" value={editData.capacity_kwp} onChange={handleChange} isEditing={editingSection === 'pro'} isEnergy />
                                    <EditableDetailItem label="Type" field="project_type" value={editData.project_type} onChange={handleChange} options={meta['project_type']} isEditing={editingSection === 'pro'} />
                                    <EditableDetailItem label="Vendor" field="vendor" value={editData.vendor} onChange={handleChange} options={meta['vendor']} isEditing={editingSection === 'pro'} />
                                    <EditableDetailItem label="Meter Cat" field="meter_category" value={editData.meter_category} onChange={handleChange} options={meta['meter_category']} isEditing={editingSection === 'pro'} />
                                    <EditableDetailItem label="EB Number" field="eb_number" value={editData.eb_number} onChange={handleChange} isEditing={editingSection === 'pro'} />
                                    <EditableDetailItem label="DTR Code" field="dtr_code" value={editData.dtr_code} onChange={handleChange} isEditing={editingSection === 'pro'} />
                                    <EditableDetailItem label="Sanctioned Load" field="sanctioned_load" value={editData.sanctioned_load} onChange={handleChange} isEditing={editingSection === 'pro'} />
                                    <EditableDetailItem label="DISCOM Div" field="discom_division" value={editData.discom_division} onChange={handleChange} options={meta['discom_division']} isEditing={editingSection === 'pro'} />
                                </div>
                            </section>

                            <section>
                                <SectionHeader title="Application Links" id="links" icon={FolderOpen} />
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                    <EditableDetailItem label="Google Docs Link" field="google_docs" value={editData.google_docs} onChange={handleChange} isEditing={editingSection === 'links'} />
                                    <EditableDetailItem label="Location Link" field="location_link" value={editData.location_link} onChange={handleChange} isEditing={editingSection === 'links'} />
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'finance' && (
                        <div className="space-y-6 animate-in fade-in duration-300">
                            <section>
                                <SectionHeader title="Financial Summary" id="fin" icon={IndianRupee} />
                                <div className="grid grid-cols-2 md:grid-cols-5 gap-3 mb-4">
                                    <EditableDetailItem label="Quoted Amt" field="quoted_amount" value={editData.quoted_amount} onChange={handleChange} type="number" isEditing={editingSection === 'fin'} isMoney />
                                    <EditableDetailItem label="Received" field="total_received" value={editData.total_received} onChange={handleChange} type="number" isEditing={editingSection === 'fin'} isMoney />
                                    <EditableDetailItem label="Receivable" field="receivables" value={editData.receivables} onChange={handleChange} type="number" isEditing={editingSection === 'fin'} isMoney />
                                    <EditableDetailItem label="Discount" field="discount" value={editData.discount} onChange={handleChange} type="number" isEditing={editingSection === 'fin'} isMoney />
                                    <EditableDetailItem label="Pay Type" field="payment_type" value={editData.payment_type} onChange={handleChange} options={meta['payment_type']} isEditing={editingSection === 'fin'} />
                                </div>
                                <PaymentsEditor payments={editData.payments || []} onChange={val => handleChange('payments', val)} isEditing={editingSection === 'fin'} />
                            </section>

                            <section>
                                <SectionHeader title="Subsidy Status History" id="sub" icon={Banknote} />
                                <SubsidyHistoryEditor subsidyHistory={editData.subsidy_history || []} onChange={val => handleChange('subsidy_history', val)} isEditing={editingSection === 'sub'} />
                            </section>

                            <section>
                                <SectionHeader title="Bank Information" id="bnk" icon={Building2} />
                                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                                    <EditableDetailItem label="Account Name" field="customer_account_name" value={editData.customer_account_name} onChange={handleChange} isEditing={editingSection === 'bnk'} />
                                    <EditableDetailItem label="Bank Name" field="bank_name" value={editData.bank_name} onChange={handleChange} options={meta['bank_name']} isEditing={editingSection === 'bnk'} />
                                    <EditableDetailItem label="Branch" field="bank_branch" value={editData.bank_branch} onChange={handleChange} isEditing={editingSection === 'bnk'} />
                                    <EditableDetailItem label="Account #" field="bank_account_number" value={editData.bank_account_number} onChange={handleChange} isEditing={editingSection === 'bnk'} />
                                    <EditableDetailItem label="IFSC Code" field="ifsc_code" value={editData.ifsc_code} onChange={handleChange} isEditing={editingSection === 'bnk'} />
                                    <EditableDetailItem label="Loan App #" field="loan_application_number" value={editData.loan_application_number} onChange={handleChange} isEditing={editingSection === 'bnk'} />
                                </div>
                            </section>
                        </div>
                    )}

                    {activeTab === 'checklist' && (
                        <div className="space-y-4 animate-in fade-in duration-300">
                            <div className="flex items-center justify-between bg-white p-5 rounded-2xl border border-stone-100 shadow-sm mb-4">
                                <div>
                                    <h3 className="text-sm font-bold text-stone-800">Installation Progress</h3>
                                    <p className="text-[9px] text-stone-400 font-bold uppercase mt-1">{localChecklist.filter(i => i.checked).length} / {localChecklist.length} Items Cleared</p>
                                </div>
                                {checklistDirty && <button onClick={async () => { await onUpdate(customer.id, { project_checklist: localChecklist }); setChecklistDirty(false); fetchLogs(); }}
                                    className="bg-emerald-600 text-white px-4 py-2 rounded-xl text-[10px] font-bold">Save Checklist</button>}
                            </div>

                            <div className="space-y-4">
                                {sections.map(sec => (
                                    <div key={sec} className="bg-white p-5 rounded-2xl border border-stone-100 shadow-sm">
                                        <h4 className="text-[9px] font-bold text-stone-400 mb-4 uppercase tracking-widest border-b border-stone-50 pb-2">{sec}</h4>
                                        <div className="flex flex-col gap-3">
                                            {localChecklist.filter(i => i.section === sec).map(item => (
                                                <label key={item.id} className="flex items-start gap-3 cursor-pointer group p-1.5 hover:bg-stone-50 rounded-lg transition-colors">
                                                    <input type="checkbox" checked={item.checked} onChange={() => {
                                                        const updated = localChecklist.map(i => i.id === item.id ? { ...i, checked: !i.checked, checkedAt: new Date().toISOString(), checkedBy: user.name } : i);
                                                        setLocalChecklist(updated); setChecklistDirty(true);
                                                    }} className="mt-0.5 w-4.5 h-4.5 rounded border-stone-300 text-amber-500 focus:ring-amber-500" />
                                                    <div className="flex-1">
                                                        <span className={`text-xs block ${item.checked ? 'text-stone-400 line-through' : 'text-stone-700 font-medium'}`}>{item.label}</span>
                                                        {item.checked && <span className="text-[8px] text-stone-400 font-bold uppercase mt-0.5 block">By {item.checkedBy} on {formatLogDate(item.checkedAt)}</span>}
                                                    </div>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {activeTab === 'history' && (
                        <div className="space-y-8 animate-in fade-in duration-300">
                            {/* Internal Remarks */}
                            <section>
                                <SectionHeader title="Internal Remarks (Staff Only)" id="rem" icon={ShieldCheck} />
                                {editingSection === 'rem' ? (
                                    <textarea value={editData.internal_remarks || ''} onChange={e => handleChange('internal_remarks', e.target.value)}
                                        className="w-full p-4 border rounded-2xl text-xs bg-stone-50 focus:ring-1 focus:ring-amber-400 outline-none" rows={4} placeholder="Sensitive notes visible only to internal staff..." />
                                ) : (
                                    <div className="bg-stone-100/50 p-4 rounded-2xl border border-stone-200 text-xs text-stone-600 italic">
                                        {editData.internal_remarks || 'No internal remarks recorded yet.'}
                                    </div>
                                )}
                            </section>

                            {/* Team Notes */}
                            <section>
                                <h3 className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-6">Activity Notes</h3>
                                <div className="space-y-3 mb-6 max-h-[300px] overflow-y-auto pr-2 custom-scrollbar">
                                    {(editData.follow_ups || []).slice().reverse().map((f, i) => (
                                        <div key={i} className="bg-white p-3.5 rounded-xl border border-stone-100 shadow-sm">
                                            <p className="text-xs text-stone-800 leading-relaxed">{f.text}</p>
                                            <div className="flex justify-between mt-2.5 text-[8px] text-stone-400 font-bold uppercase">
                                                <span>{f.author}</span><span>{formatLogDate(f.date)}</span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="flex gap-2">
                                    <input value={followUpText} onChange={e => setFollowUpText(e.target.value)} placeholder="Share an update with the team..."
                                        className="flex-1 px-4 py-3 bg-white border border-stone-200 rounded-xl text-xs outline-none focus:ring-1 focus:ring-amber-400" />
                                    <button onClick={handleAddNote} className="bg-stone-900 text-white px-6 rounded-xl hover:bg-stone-800 transition-all"><Send size={16} /></button>
                                </div>
                            </section>

                            {/* Detailed System Timeline */}
                            <section>
                                <h3 className="text-[9px] font-bold text-stone-400 uppercase tracking-widest mb-6">Detailed System History</h3>
                                <div className="space-y-4">
                                    {activityLogs.length > 0 ? activityLogs.map((log, i) => (
                                        <div key={i} className="relative pl-6 pb-4 border-l border-stone-100 last:border-0">
                                            <div className="absolute -left-[4.5px] top-0 w-2 h-2 rounded-full bg-white border-2 border-amber-500 shadow-sm" />
                                            <div className="bg-white p-3 rounded-xl border border-stone-100 shadow-sm -mt-1.5 hover:border-amber-200 transition-colors">
                                                <div className="flex justify-between items-start mb-1.5">
                                                    <span className={`text-[8px] px-1.5 py-0.5 rounded-full font-bold uppercase ${ACTION_COLORS[log.action] || 'bg-stone-100 text-stone-600'}`}>
                                                        {log.action}
                                                    </span>
                                                    <span className="text-[8px] text-stone-400 font-bold">{formatLogDate(log.created_at)}</span>
                                                </div>
                                                <div className="text-xs text-stone-700 font-medium whitespace-pre-wrap leading-relaxed">
                                                    {log.message.includes('|') ? (
                                                        <div className="space-y-1">
                                                            {log.message.split('|').map((line, idx) => (
                                                                <div key={idx} className="flex items-center gap-1">
                                                                    <span className="text-stone-400">↳</span> {line.trim()}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    ) : log.message}
                                                </div>
                                                <p className="text-[8px] text-stone-400 font-bold uppercase mt-2 border-t border-stone-50 pt-1.5">User: {log.profiles?.name || 'System'}</p>
                                            </div>
                                        </div>
                                    )) : <p className="text-[8px] text-stone-400 italic">No timeline entries found.</p>}
                                </div>
                            </section>
                        </div>
                    )}
                </div>

                {/* --- FOOTER SAVE BAR --- */}
                {editingSection && (
                    <div className="p-4 border-t border-stone-100 bg-white flex-shrink-0">
                        <button onClick={handleSave} disabled={saving} className="w-full bg-stone-900 text-white py-3.5 rounded-xl font-bold flex items-center justify-center gap-2 hover:bg-stone-800 transition-all">
                            {saving ? "Saving Changes..." : <><Save size={16} /> Save Changes</>}
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}

// ─── ACTIVITY LOG VIEW ───────────────────────────────────────────────────────────
function ActivityLogView() {
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchLogs = async () => {
            const { data, error } = await supabase
                .from('activity_log')
                .select('*, profiles(name)')
                .order('created_at', { ascending: false })
                .limit(200);
            if (!error) setLogs(data || []);
            setLoading(false);
        };
        fetchLogs();
        const channel = supabase.channel('activity_log_realtime')
            .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'activity_log' }, fetchLogs)
            .subscribe();
        return () => supabase.removeChannel(channel);
    }, []);

    const ACTION_COLORS = {
        create: 'bg-green-100 text-green-700', update: 'bg-blue-100 text-blue-700',
        delete: 'bg-red-100 text-red-700', stage_change: 'bg-amber-100 text-amber-700',
        note: 'bg-yellow-100 text-yellow-700',
    };

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-3xl mx-auto space-y-3">
            {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-stone-400">
                    <Activity className="w-12 h-12 mb-3 text-stone-300" />
                    <p className="font-medium text-stone-500">No activity logged yet</p>
                </div>
            ) : logs.map(log => (
                <div key={log.id} className="bg-white rounded-xl p-4 border border-stone-100 shadow-sm flex items-start gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-bold uppercase flex-shrink-0 ${ACTION_COLORS[log.action] || 'bg-stone-100 text-stone-700'}`}>
                        {log.action}
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-stone-800">{log.message}</p>
                        {log.new_value && <p className="text-xs text-stone-500 mt-0.5">{log.new_value}</p>}
                        <p className="text-[10px] text-stone-400 mt-1 font-bold uppercase">
                            {log.profiles?.name || 'Unknown'} • {new Date(log.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── USER MANAGEMENT VIEW ────────────────────────────────────────────────────────
function UserManagementView({ currentUser }) {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [actionLoading, setActionLoading] = useState(null);

    const fetchProfiles = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('profiles')
            .select('*').eq('status', 'active').order('created_at', { ascending: false });
        if (!error) setProfiles(data || []);
        setLoading(false);
    };

    useEffect(() => { fetchProfiles(); }, []);

    const handleUpdateRole = async (profileId, field, value) => {
        setActionLoading(profileId);
        const { error } = await supabase.from('profiles').update({ [field]: value }).eq('id', profileId);
        if (!error) {
            setProfiles(prev => prev.map(p => p.id === profileId ? { ...p, [field]: value } : p));
            logActivity(currentUser.id, 'update', `Updated ${field} for user profile`, value);
        }
        setActionLoading(null);
    };

    const handleResetPassword = async (email) => {
        const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: window.location.origin });
        if (!error) alert(`Password reset email sent to ${email}`);
        else alert(`Error: ${error.message}`);
    };

    const deactivateUser = async (userId) => {
        try {
            const response = await fetch(
                'https://vpsuvtopsyuafbrjyinr.supabase.co/functions/v1/smooth-worker',
                {
                    method: 'DELETE',
                    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${import.meta.env.VITE_SUPABASE_ANON_KEY}` },
                    body: JSON.stringify({ user_id: userId }),
                }
            );
            const data = await response.json();
            if (!response.ok) throw new Error(data.error);
            setProfiles(profiles.filter(p => p.id !== userId));
        } catch (err) {
            console.error('Error deactivating user:', err.message);
        }
    };

    const USER_TYPE_OPTIONS = ['admin', 'sales', 'agent'];
    const ROLE_OPTIONS = ['Manager', 'Sales Executive', 'Field Agent', 'Operations', 'Finance'];

    if (loading) return (
        <div className="flex items-center justify-center h-64">
            <div className="w-8 h-8 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return (
        <div className="max-w-4xl mx-auto space-y-4">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-stone-400" />
                    <p className="text-sm text-stone-500">{profiles.length} users registered</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchProfiles} className="p-2 border border-stone-200 rounded-xl text-stone-500 hover:bg-stone-50 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-stone-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors">
                        <Plus className="w-4 h-4" /> Create User
                    </button>
                </div>
            </div>

            <div className="bg-white rounded-2xl border border-stone-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-stone-100 bg-stone-50">
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">User</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Access Type</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Role</th>
                                <th className="text-left px-4 py-3 text-[10px] font-bold text-stone-400 uppercase tracking-wider">Joined</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-stone-50">
                            {profiles.map(profile => (
                                <tr key={profile.id} className="hover:bg-stone-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                {profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-stone-800">{profile.name || 'Unnamed'}</p>
                                                <p className="text-xs text-stone-400">{profile.email || '–'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select value={profile.user_type || ''} disabled={profile.id === currentUser.id || actionLoading === profile.id}
                                            onChange={e => handleUpdateRole(profile.id, 'user_type', e.target.value)}
                                            className="text-xs border border-stone-200 rounded-lg px-2 py-1.5 focus:outline-none disabled:opacity-50 bg-white">
                                            {USER_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select value={profile.role || ''} disabled={actionLoading === profile.id}
                                            onChange={e => handleUpdateRole(profile.id, 'role', e.target.value)}
                                            className="text-xs border border-stone-200 rounded-lg px-2 py-1.5 focus:outline-none disabled:opacity-50 bg-white">
                                            <option value="">Select role...</option>
                                            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-stone-500">
                                        {profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN') : '–'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            {profile.id !== currentUser.id ? (
                                                <>
                                                    <button onClick={() => handleResetPassword(profile.email)} title="Send password reset"
                                                        className="p-1.5 text-stone-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                        <RefreshCw className="w-3.5 h-3.5" />
                                                    </button>
                                                    <button onClick={() => deactivateUser(profile.id)}
                                                        className="px-3 py-1.5 text-xs text-stone-700 hover:text-orange-700 hover:bg-orange-50 rounded-lg transition-colors font-medium">
                                                        Deactivate
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-bold">You</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {showCreateModal && (
                <CreateUserModal
                    onClose={() => setShowCreateModal(false)}
                    onCreated={() => { setShowCreateModal(false); fetchProfiles(); }}
                    currentUser={currentUser}
                />
            )}
        </div>
    );
}

// ─── CREATE USER MODAL ───────────────────────────────────────────────────────────
function CreateUserModal({ onClose, onCreated, currentUser }) {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Sales Executive', user_type: 'sales' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showPw, setShowPw] = useState(false);
    const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

    const handleCreate = async () => {
        if (!form.name.trim() || !form.email.trim() || !form.password.trim()) { setError('Name, email, and password are required.'); return; }
        if (form.password.length < 8) { setError('Password must be at least 8 characters.'); return; }
        setSaving(true);
        setError('');
        try {
            const response = await supabase.functions.invoke('smooth-worker', { body: form });
            if (response.error) throw new Error(response.error.message || JSON.stringify(response.error));
            if (response.data?.error) throw new Error(response.data.error);
            logActivity(currentUser.id, 'create', `Created new user: ${form.name}`, `${form.role} (${form.user_type})`);
            onCreated();
        } catch (err) {
            setError(err.message || 'Failed to create user.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md overflow-hidden flex flex-col">
                <div className="bg-stone-900 px-5 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-white">Create New User</h2>
                        <p className="text-stone-400 text-xs mt-0.5">They'll receive a login via email</p>
                    </div>
                    <button onClick={onClose} className="text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
                </div>
                <div className="p-4 space-y-3 overflow-y-auto">
                    {error && (
                        <div className="bg-red-50 border border-red-200 rounded-xl p-3 flex items-start gap-2">
                            <AlertTriangle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                            <p className="text-red-600 text-xs">{error}</p>
                        </div>
                    )}
                    {[
                        { label: 'Full Name *', field: 'name', type: 'text' },
                        { label: 'Email *', field: 'email', type: 'email' },
                    ].map(({ label, field, type }) => (
                        <div key={field}>
                            <label className="block text-xs font-medium text-stone-600 mb-1">{label}</label>
                            <input type={type} value={form[field]} onChange={e => set(field, e.target.value)}
                                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                        </div>
                    ))}
                    <div>
                        <label className="block text-xs font-medium text-stone-600 mb-1">Temporary Password *</label>
                        <div className="relative">
                            <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                                placeholder="Min. 8 characters"
                                className="w-full px-3 py-2.5 pr-10 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300" />
                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3 text-stone-400 hover:text-stone-600">
                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-stone-600 mb-1">Access Type</label>
                            <select value={form.user_type} onChange={e => set('user_type', e.target.value)}
                                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                                {['admin', 'sales', 'agent'].map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-stone-600 mb-1">Role</label>
                            <select value={form.role} onChange={e => set('role', e.target.value)}
                                className="w-full px-3 py-2.5 border border-stone-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300">
                                {['Manager', 'Sales Executive', 'Field Agent', 'Operations', 'Finance'].map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>
                </div>
                <div className="border-t p-4 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 border border-stone-300 text-stone-700 rounded-xl text-sm font-medium">Cancel</button>
                    <button onClick={handleCreate} disabled={saving}
                        className="flex-1 py-2.5 bg-stone-900 text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                        {saving ? 'Creating...' : <><UserCog className="w-4 h-4" /> Create User</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── MAIN DASHBOARD ──────────────────────────────────────────────────────────────
function Dashboard({ user, onLogout }) {
    const [customers, setCustomers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [currentView, setCurrentView] = useState('dashboard');
    const [selectedStage, setSelectedStage] = useState('Leads');
    const [searchQuery, setSearchQuery] = useState('');
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showAddLead, setShowAddLead] = useState(false);
    const meta = useMetadata();

    const fetchData = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('admin').select('*').order('created_at', { ascending: false });
        if (!error) setCustomers(data || []);
        else console.error('Fetch error:', error);
        setLoading(false);
    };

    useEffect(() => {
        fetchData();
        const channel = supabase.channel('admin_changes')
            .on('postgres_changes', { event: '*', schema: 'public', table: 'admin' }, fetchData)
            .subscribe();
        return () => supabase.removeChannel(channel);
    }, []);

    const handleUpdateCustomer = async (id, updates) => {
        const { error } = await supabase.from('admin').update(updates).eq('id', id);
        if (!error) {
            setCustomers(prev => prev.map(c => c.id === id ? { ...c, ...updates } : c));
            if (selectedCustomer?.id === id) setSelectedCustomer(prev => ({ ...prev, ...updates }));
        }
    };

    const handleDeleteCustomer = async (id) => {
        await supabase.from('admin').delete().eq('id', id);
        setCustomers(prev => prev.filter(c => c.id !== id));
    };

    const handleMoveStage = async (id, newStage) => {
        const customer = customers.find(c => c.id === id);
        await handleUpdateCustomer(id, { stage: newStage });
        logActivity(user.id, 'stage_change',
            `${customer?.customer_name}: Moved to ${PRIMARY_STAGES.find(s => s.id === newStage)?.label || newStage}`
        );
    };

    const handleAddLead = async (data) => {
        const leadData = {
            ...data,
            application_done_by: user.name,
            created_at: new Date().toISOString(),
        };
        const { error } = await supabase.from('admin').insert(leadData).select().single();
        if (!error) {
            logActivity(user.id, 'create', `Added new lead: ${data.customer_name}`, `Done by: ${user.name}`);
            setShowAddLead(false);
            fetchData();
        }
    };

    // Count customers per stage — case-sensitive match with new IDs
    const stageCounts = PRIMARY_STAGES.reduce((acc, s) => {
        acc[s.id] = customers.filter(c => c.stage === s.id).length;
        return acc;
    }, {});

    // Count tagged customers for financial sidebar badge
    const financialTagCount = customers.filter(c => c.financial_tag).length;

    const filtered = customers.filter(c => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery ||
            c.customer_name?.toLowerCase().includes(searchLower) ||
            c.phone?.includes(searchQuery) ||
            c.crn?.toLowerCase().includes(searchLower);
        const matchesStage = c.stage === selectedStage;
        const isAuthorized = user.userType === 'admin' || c.poc === user.name;
        return matchesStage && matchesSearch && isAuthorized;
    });

    const NavBtn = ({ view, stage, icon: Icon, label, count, badgeDot }) => {
        const isActive = view === 'stages' ? (currentView === 'stages' && selectedStage === stage) : currentView === view;
        return (
            <button
                onClick={() => {
                    if (view === 'stages') { setCurrentView('stages'); setSelectedStage(stage); }
                    else setCurrentView(view);
                    setSidebarOpen(false);
                }}
                className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold mb-0.5 transition-colors ${isActive ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="flex-1 text-left truncate">{label}</span>
                {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${isActive ? 'bg-white/20 text-white' : 'bg-stone-100 text-stone-500'}`}>
                        {count}
                    </span>
                )}
                {badgeDot && count === 0 && (
                    <span className="w-2 h-2 rounded-full bg-amber-400 flex-shrink-0" />
                )}
            </button>
        );
    };

    return (
        <div className="min-h-screen bg-[#FCFBFA] flex">
            {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r border-stone-100 flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-5 border-b border-stone-100 flex justify-between items-center">
                    <div className="flex items-center gap-3">
                        <div className="w-9 h-9 bg-amber-100 rounded-xl flex items-center justify-center text-amber-600">
                            <Sun size={20} />
                        </div>
                        <div>
                            <h1 className="text-sm font-bold text-stone-800">SolarFlow</h1>
                            <p className="text-[9px] text-stone-400 font-bold uppercase tracking-widest">Portal</p>
                        </div>
                    </div>
                    <button className="lg:hidden text-stone-400" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
                </div>

                <div className="flex-1 overflow-y-auto p-3">
                    {/* Main nav */}
                    <NavBtn view="dashboard" icon={LayoutDashboard} label="Dashboard" count={0} />

                    {/* ── Financial Section ── completely separate from stages */}
                    <div className="mt-4 mb-1">
                        <div className="text-[9px] uppercase font-bold text-stone-300 px-3 pb-2 tracking-widest">Financial</div>
                        <button
                            onClick={() => { setCurrentView('financial'); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs font-semibold mb-0.5 transition-colors ${currentView === 'financial' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'}`}>
                            <IndianRupee className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-1 text-left">Financial Tags</span>
                            {financialTagCount > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${currentView === 'financial' ? 'bg-white/20 text-white' : 'bg-amber-100 text-amber-600'}`}>
                                    {financialTagCount}
                                </span>
                            )}
                        </button>
                        {/* Mini tag breakdown — visible always in sidebar */}
                        <div className="px-3 pb-2 space-y-1">
                            {FINANCIAL_TAGS.map(tag => {
                                const count = customers.filter(c => c.financial_tag === tag.id).length;
                                if (count === 0) return null;
                                const colors = FINANCIAL_TAG_COLORS[tag.id] || {};
                                return (
                                    <button key={tag.id}
                                        onClick={() => { setCurrentView('financial'); setSidebarOpen(false); }}
                                        className="w-full flex items-center justify-between px-2 py-1 rounded-lg hover:bg-stone-50 transition-colors">
                                        <div className="flex items-center gap-1.5">
                                            <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${colors.dot || 'bg-stone-400'}`} />
                                            <span className="text-[10px] text-stone-500 font-medium truncate">{tag.label}</span>
                                        </div>
                                        <span className={`text-[9px] px-1.5 py-0.5 rounded-full font-bold border ${colors.bg || 'bg-stone-50'} ${colors.text || 'text-stone-500'} ${colors.border || 'border-stone-200'}`}>
                                            {count}
                                        </span>
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* ── Project Stages ── */}
                    <div className="text-[9px] uppercase font-bold text-stone-300 px-3 pt-4 pb-2 tracking-widest">Project Stages</div>
                    {PRIMARY_STAGES.map(s => (
                        <NavBtn key={s.id} view="stages" stage={s.id} icon={s.icon} label={s.label} count={stageCounts[s.id] || 0} />
                    ))}

                    {/* ── System ── */}
                    <div className="text-[9px] uppercase font-bold text-stone-300 px-3 pt-5 pb-2 tracking-widest">System</div>

                    <NavBtn view="activity" icon={Activity} label="Activity Log" count={0} />
                    {user.userType === 'admin' && (
                        <NavBtn view="users" icon={UserCog} label="User Management" count={0} />
                    )}
                </div>

                <div className="p-3 border-t border-stone-100">
                    <div className="flex items-center gap-3 px-3 py-2 mb-1">
                        <div className="w-8 h-8 bg-stone-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {user.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'A'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-xs font-semibold text-stone-700 truncate">{user.name}</p>
                            <p className="text-[9px] text-stone-400">{user.role}</p>
                        </div>
                    </div>
                    <button onClick={onLogout}
                        className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl text-xs font-semibold transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <header className="h-16 bg-white/90 backdrop-blur-md border-b border-stone-100 px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-stone-500"><Menu className="w-6 h-6" /></button>
                        <h2 className="font-bold text-stone-800">
                            {currentView === 'dashboard' ? 'Business Dashboard'
                                : currentView === 'financial' ? 'Financial Tags'
                                    : currentView === 'activity' ? 'Activity Log'
                                        : currentView === 'users' ? 'User Management'
                                            : PRIMARY_STAGES.find(s => s.id === selectedStage)?.label || selectedStage}
                        </h2>
                        {currentView === 'financial' && financialTagCount > 0 && (
                            <span className="text-xs bg-amber-100 text-amber-700 px-2 py-0.5 rounded-full font-bold">
                                {financialTagCount} tagged
                            </span>
                        )}
                    </div>
                    <div className="flex items-center gap-2">
                        {currentView === 'stages' && (
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-stone-400 w-4 h-4" />
                                <input type="text" placeholder="Search name, phone, CRN..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-stone-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-amber-300 w-40 lg:w-56" />
                            </div>
                        )}
                        {user.userType === 'admin' && (
                            <>
                                <button onClick={() => exportAllToCSV(customers)}
                                    className="flex items-center gap-1.5 border border-stone-200 text-stone-600 px-3 py-2 rounded-xl text-sm font-medium hover:bg-stone-50 transition-colors">
                                    <Download className="w-4 h-4" />
                                    <span className="hidden sm:inline text-xs">Export</span>
                                </button>
                                <button onClick={() => setShowAddLead(true)}
                                    className="flex items-center gap-1.5 bg-stone-900 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-stone-800 transition-colors">
                                    <Plus className="w-4 h-4" />
                                    <span className="hidden sm:inline text-xs">Add Lead</span>
                                </button>
                            </>
                        )}
                    </div>
                </header>

                <div className="flex-1 p-4 lg:p-6">
                    {currentView === 'dashboard' && <DashboardView customers={customers} loading={loading} />}

                    {currentView === 'financial' && (
                        <FinancialSidebarView
                            customers={customers}
                            onSelectCustomer={setSelectedCustomer}
                        />
                    )}
                    {currentView === 'activity' && <ActivityLogView />}
                    {currentView === 'users' && user.userType === 'admin' && <UserManagementView currentUser={user} />}
                    {currentView === 'stages' && (
                        loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="w-8 h-8 border-4 border-stone-900 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : filtered.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filtered.map(c => (
                                    <CustomerCard key={c.id} customer={c}
                                        onSelect={setSelectedCustomer}
                                        onMoveStage={handleMoveStage} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-stone-400">
                                <Users className="w-12 h-12 mb-3 text-stone-300" />
                                <p className="font-medium text-stone-500">{searchQuery ? 'No matching results' : 'No customers in this stage'}</p>
                                <p className="text-sm mt-1">{searchQuery ? 'Try a different search' : 'Move customers here or add a new lead'}</p>
                            </div>
                        )
                    )}
                </div>
            </main>

            {selectedCustomer && (
                <CustomerDetailModal
                    customer={selectedCustomer}
                    onClose={() => setSelectedCustomer(null)}
                    onUpdate={handleUpdateCustomer}
                    onDelete={handleDeleteCustomer}
                    user={user}
                    meta={meta}
                />
            )}
            {showAddLead && <AddLeadModal onClose={() => setShowAddLead(false)} onSave={handleAddLead} meta={meta} />}
        </div>
    );
}

// ─── ROOT APP ─────────────────────────────────────────────────────────────────────
export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // On mount, check for an existing session
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session?.user) {
                const { data: profile } = await supabase
                    .from('profiles').select('*').eq('id', session.user.id).single();
                if (profile) {
                    setUser({
                        id: session.user.id,
                        email: session.user.email,
                        name: profile.name,
                        role: profile.role,
                        userType: profile.user_type,
                    });
                } else {
                    // Profile missing — force sign out so login form shows
                    await supabase.auth.signOut();
                }
            }
            setLoading(false);
        });

        // Listen for auth changes — only update on explicit SIGNED_IN from the login form
        // Do NOT auto-redirect on TOKEN_REFRESHED or INITIAL_SESSION to prevent opening on its own
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (event === 'SIGNED_OUT') {
                setUser(null);
            }
            // SIGNED_IN is fired by our login form — handled via onLogin callback directly
            // Ignoring INITIAL_SESSION / TOKEN_REFRESHED to prevent auto-open
        });

        return () => subscription.unsubscribe();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-stone-900">
            <Sun className="animate-spin text-amber-500" size={40} />
        </div>
    );

    if (!user) return <LoginScreen onLogin={setUser} />;

    // ─── ROLE-BASED GATEKEEPING ───
    if (user.userType === 'agent') {
        return <AgentForm user={user} onLogout={() => supabase.auth.signOut().then(() => setUser(null))} />;
    }

    // Default: Show the full Admin Dashboard
    return (
        <Dashboard user={user} onLogout={async () => { await supabase.auth.signOut(); setUser(null); }} />
    );
}