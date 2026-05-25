import { useState, useEffect, useRef } from 'react';
import { supabase } from './supabase';
import SalesView from './components/salesview';
import AgentForm from './components/agentform';
import DashboardView from './DashboardView';
import {
    Users, ShoppingCart, Clock, Package, Wrench, FileText, Send, Gauge,
    CheckCircle2, Plus, ChevronDown, X, MapPin, Zap, LogOut, Search,
    LayoutDashboard, Menu, Trash2, Edit3, Sparkles, Save, MessageSquare,
    Banknote, CreditCard, ClipboardCheck, Mail, User, IndianRupee,
    Building2, Activity, FolderOpen, CheckSquare, AlertTriangle, Download,
    UserCog, ShieldCheck, Eye, EyeOff, RefreshCw
} from 'lucide-react'
// ─── Primary Stages ───────────────────────────────────────────────────────────
const PRIMARY_STAGES = [
    { id: 'leads', label: 'Leads', icon: Users },
    // { id: 'sales_closed', label: 'Sales Closed', icon: ShoppingCart },
    { id: 'pending_loans', label: 'Pending Loans/Advances', icon: Clock },
    { id: 'material_procurement', label: 'Material Procurement', icon: Package },
    { id: 'pending_installation', label: 'Pending Installation', icon: Wrench },
    { id: 'post_installation_docs', label: 'Post-Installation Docs', icon: FileText },
    { id: 'pending_discom', label: 'DISCOM Submissions', icon: Send },
    { id: 'meter_installation', label: 'Meter Installation', icon: Gauge },
    { id: 'system_commissioning', label: 'System Commissioning', icon: Zap },
    { id: 'meter_flag', label: 'Meter Flag', icon: MapPin },
    { id: 'discom_inspection', label: 'DISCOM Inspection', icon: ClipboardCheck },
    { id: 'subsidy_pending', label: 'Subsidy Pending', icon: Banknote },
    { id: 'second_payment', label: '2nd Payment', icon: CreditCard },
    { id: 'third_payment', label: '3rd Payment', icon: CreditCard },
    { id: 'completed', label: 'Completed', icon: CheckCircle2 },
    { id: 'pending_cheque', label: 'Pending Cheque', icon: Clock },
    { id: 'received_cheque', label: 'Received Cheque', icon: CheckCircle2 },
];


// ─── Financial Tags ───────────────────────────────────────────────────────────
const FINANCIAL_TAGS = [
    { id: 'subsidy_redeems', label: 'Subsidy Redeems Pending', icon: Banknote },
    { id: 'subsidy_disbursement', label: 'Subsidy Disbursement Pending', icon: Banknote },
    { id: 'second_payment', label: '2nd Payment', icon: CreditCard },
    { id: 'third_payment', label: '3rd Payment', icon: CreditCard },
    { id: 'pending_cheque', label: 'Pending Cheque', icon: Clock },
    { id: 'received_cheque', label: 'Received Cheque', icon: CheckCircle2 },
];

const ALL_STAGES = [...PRIMARY_STAGES, ...FINANCIAL_TAGS];

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

// ─── Log Activity ─────────────────────────────────────────────────────────────
async function logActivity(userId, action, message, details = '') {
    try {
        await supabase.from('activity_log').insert({ user_id: userId, action, message, new_value: details });
    } catch (e) {
        console.error('Activity log error:', e);
    }
}

// ─── Export CSV ───────────────────────────────────────────────────────────────
function exportAllToCSV(customers) {
    const headers = [
        'Customer Name', 'Quotation #', 'Phone', 'Email', 'Location', 'Branch',
        'Capacity (kWp)', 'Project Type', 'POC', 'Stage', 'Financial Tags',
        'Quoted Amount', 'Bank Quote', 'Payment Type', 'Bank Name', 'Account #',
        'IFSC', 'Loan Application #', 'Meter Category', 'EB Number', 'DTR Code',
        'Sanctioned Load', 'DISCOM Division', 'Net Metering', 'Subsidy',
        'System Commissioning', 'Vendor', 'Aadhar', 'Site Remarks', 'Remarks',
        'Payment 1', 'Payment 1 Date', 'Payment 2', 'Payment 2 Date',
        'Payment 3', 'Payment 3 Date', 'Docs Link', 'Created At'
    ];

    const rows = customers.map(c => {
        const financialTags = Array.isArray(c.financial_tags)
            ? c.financial_tags.map(t => FINANCIAL_TAGS.find(f => f.id === t)?.label || t).join(' | ')
            : '';
        return [
            c.customer_name || '', c.quotation_number || c.project_id || '',
            c.phone || '', c.email || '', c.location || '', c.branch || '',
            c.capacity || '', c.project_type || '', c.poc_name || c.poc || '',
            PRIMARY_STAGES.find(s => s.id === c.stage)?.label || c.stage || '',
            financialTags, c.quoted_amount || '', c.quote_to_bank || '',
            c.cash_or_loan || c.payment_type || '', c.bank_name || '',
            c.bank_account_number || '', c.ifsc_code || c.disbursal_ifsc_code || '',
            c.loan_application_number || '', c.meter_category || '', c.eb_number || '',
            c.dtr_code || '', c.sanctioned_load || '', c.discom_division || '',
            c.net_metering || '', c.subsidy || '', c.system_commissioning || '',
            c.vendor || '', c.aadhar_number || '',
            `"${(c.site_remarks || '').replace(/"/g, '""')}"`,
            `"${(c.remarks || '').replace(/"/g, '""')}"`,
            c.payment_1 || '', c.payment_1_date || '',
            c.payment_2 || '', c.payment_2_date || '',
            c.payment_3 || '', c.payment_3_date || '',
            c.docs_link || '',
            c.created_at ? new Date(c.created_at).toLocaleDateString('en-IN') : '',
        ].join(',');
    });

    const csv = [headers.join(','), ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `ray2volt_customers_${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    URL.revokeObjectURL(url);
}

// ─── Login Screen ─────────────────────────────────────────────────────────────
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
            const { data: authData, error: authError } = await supabase.auth.signInWithPassword({ email, password });
            if (authError) throw authError;
            const { data: profile, error: profileError } = await supabase
                .from('profiles').select('*').eq('id', authData.user.id).single();
            if (profileError || !profile) {
                await supabase.auth.signOut();
                throw new Error('Profile not found. Contact Admin.');
            }
            onLogin({ id: authData.user.id, email: authData.user.email, name: profile.name, role: profile.role, userType: profile.user_type });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50 p-4">
            <div className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-sm border border-gray-100">
                <div className="text-center mb-8">
                    <h1 className="text-2xl font-bold text-gray-900">Ray2Volt Solar</h1>
                    <p className="text-gray-500 text-sm mt-1">CRM Login</p>
                </div>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div className="relative">
                        <Mail className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        <input type="email" placeholder="Email" value={email} onChange={e => setEmail(e.target.value)}
                            className="w-full pl-10 p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" required />
                    </div>
                    <div className="relative">
                        <User className="absolute left-3 top-3.5 w-4 h-4 text-gray-400" />
                        <input type={showPw ? 'text' : 'password'} placeholder="Password" value={password} onChange={e => setPassword(e.target.value)}
                            className="w-full pl-10 pr-10 p-3 border rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" required />
                        <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-600">
                            {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                        </button>
                    </div>
                    {error && <p className="text-red-500 text-xs text-center bg-red-50 p-2 rounded-lg">{error}</p>}
                    <button disabled={loading} className="w-full bg-gray-900 text-white p-3 rounded-xl font-bold hover:bg-gray-800 transition-all flex justify-center items-center gap-2 text-sm">
                        {loading ? 'Verifying...' : <><Sparkles size={16} /> Sign In</>}
                    </button>
                </form>
            </div>
        </div>
    );
}

// ─── Add Lead Modal ───────────────────────────────────────────────────────────
function AddLeadModal({ onClose, onSave }) {
    const [form, setForm] = useState({
        customer_name: '', phone: '', email: '', location: '', branch: '',
        capacity: '', project_type: 'On-Grid', poc_name: '', quoted_amount: '',
        stage: 'leads', financial_tags: [],
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
            follow_ups: [],
            project_checklist: DEFAULT_PROJECT_CHECKLIST,
        });
        setSaving(false);
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-lg max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-gray-900 px-5 py-4 flex justify-between items-center flex-shrink-0">
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
                        { label: 'Branch', field: 'branch', type: 'text' },
                        { label: 'Capacity (kWp)', field: 'capacity', type: 'text' },
                        { label: 'POC', field: 'poc_name', type: 'text' },
                        { label: 'Quoted Amount (₹)', field: 'quoted_amount', type: 'number' },
                    ].map(({ label, field, type }) => (
                        <div key={field}>
                            <label className="block text-xs font-medium text-gray-600 mb-1">{label}</label>
                            <input type={type} value={form[field]} onChange={e => set(field, e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
                        </div>
                    ))}
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Project Type</label>
                        <select value={form.project_type} onChange={e => set('project_type', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300">
                            {['On-Grid', 'Off-Grid', 'Hybrid'].map(t => <option key={t}>{t}</option>)}
                        </select>
                    </div>
                </div>
                <div className="border-t p-4 flex gap-3 flex-shrink-0">
                    <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium">Cancel</button>
                    <button onClick={handleSave} disabled={saving}
                        className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                        {saving ? 'Saving...' : <><Plus className="w-4 h-4" /> Add Lead</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Detail Items ─────────────────────────────────────────────────────────────
function DetailItem({ label, value, isMoney = false, isEnergy = false }) {
    return (
        <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{label}</p>
            <p className={`text-sm font-medium truncate ${isMoney ? 'text-emerald-600' : isEnergy ? 'text-blue-600' : 'text-gray-800'}`}>
                {value || '–'}
            </p>
        </div>
    );
}

function EditableDetailItem({ label, field, value, onChange, type = 'text', isMoney = false, isEnergy = false, isEditing }) {
    if (!isEditing) return <DetailItem label={label} value={value} isMoney={isMoney} isEnergy={isEnergy} />;
    return (
        <div className="bg-gray-50 p-3 rounded-xl">
            <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{label}</p>
            <input type={type} value={value || ''} onChange={e => onChange(field, e.target.value)}
                className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
        </div>
    );
}

// ─── Customer Detail Modal ────────────────────────────────────────────────────
function CustomerDetailModal({ customer, onClose, onUpdate, onDelete, user }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editData, setEditData] = useState({ ...customer });
    const [followUpText, setFollowUpText] = useState('');
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
    const isAdmin = user?.userType === 'admin';

    // ── Checklist: local draft, only saved on explicit button click ──────────
    const initialChecklist = Array.isArray(customer.project_checklist) && customer.project_checklist.length > 0
        ? customer.project_checklist : DEFAULT_PROJECT_CHECKLIST;
    const [localChecklist, setLocalChecklist] = useState(initialChecklist);
    const [checklistDirty, setChecklistDirty] = useState(false);
    const [savingChecklist, setSavingChecklist] = useState(false);

    // ── Activity log: local state so it updates instantly ───────────────────
    const [followUps, setFollowUps] = useState(customer.follow_ups || []);

    const sections = [...new Set(localChecklist.map(item => item.section))];
    const financialTags = Array.isArray(editData.financial_tags) ? editData.financial_tags : [];

    const handleChange = (field, val) => setEditData(prev => ({ ...prev, [field]: val }));

    // Single-select for financial tags in detail modal
    const handleToggleFinancialTag = (tagId) => {
        const updated = financialTags.includes(tagId) ? [] : [tagId];
        setEditData(prev => ({ ...prev, financial_tags: updated }));
        onUpdate(customer.id, { financial_tags: updated });
        logActivity(user.id, 'update', `Updated financial tags for ${customer.customer_name}`, updated.join(', '));
    };

    const handleStageChange = async (newStage) => {
        setEditData(prev => ({ ...prev, stage: newStage }));
        await onUpdate(customer.id, { stage: newStage });
        logActivity(user.id, 'stage_change',
            `Moved ${customer.customer_name} to ${PRIMARY_STAGES.find(s => s.id === newStage)?.label || newStage}`
        );
    };

    const handleSave = async () => {
        setSaving(true);
        const updates = { ...editData };
        delete updates.id;
        delete updates.created_at;
        await onUpdate(customer.id, updates);
        logActivity(user.id, 'update', `Updated details for ${customer.customer_name}`);
        setIsEditing(false);
        setSaving(false);
    };

    // Local checklist toggle — only updates local state
    const handleChecklistToggle = (itemId) => {
        if (!isAdmin) return;
        setLocalChecklist(prev => prev.map(item =>
            item.id === itemId
                ? { ...item, checked: !item.checked, checkedAt: !item.checked ? new Date().toISOString() : null, checkedBy: !item.checked ? user.name : null }
                : item
        ));
        setChecklistDirty(true);
    };

    // Persist checklist to DB only when Save is clicked
    const handleSaveChecklist = async () => {
        setSavingChecklist(true);
        await onUpdate(customer.id, { project_checklist: localChecklist });
        const completedCount = localChecklist.filter(i => i.checked).length;
        logActivity(user.id, 'update', `Saved checklist for ${customer.customer_name}`, `${completedCount}/${localChecklist.length} completed`);
        setChecklistDirty(false);
        setSavingChecklist(false);
    };

    // Activity log: update local state immediately, persist in background
    const handleAddFollowUp = async () => {
        if (!followUpText.trim()) return;
        const newFollowUp = {
            id: Date.now().toString(),
            text: followUpText,
            date: new Date().toISOString(),
            authorName: user.name,
        };
        const updatedFollowUps = [...followUps, newFollowUp];
        setFollowUps(updatedFollowUps);           // instant UI update
        setFollowUpText('');
        await onUpdate(customer.id, { follow_ups: updatedFollowUps }); // persist
        logActivity(user.id, 'note', `Note on ${customer.customer_name}: ${newFollowUp.text}`);
    };

    const handleDelete = async () => {
        setDeleting(true);
        logActivity(user.id, 'delete', `Deleted customer ${customer.customer_name}`, customer.quotation_number || '');
        await onDelete(customer.id);
        setDeleting(false);
        onClose();
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-2xl max-h-[95vh] sm:max-h-[90vh] overflow-hidden flex flex-col">
                <div className="bg-gray-900 px-5 py-4 flex justify-between items-start flex-shrink-0">
                    <div>
                        <h2 className="text-lg font-bold text-white">{customer.customer_name}</h2>
                        <p className="text-gray-400 text-xs mt-0.5">{customer.quotation_number || customer.project_id || 'No ID'}</p>
                    </div>
                    <div className="flex items-center gap-1">
                        {isAdmin && (
                            <>
                                <button onClick={() => setIsEditing(!isEditing)}
                                    className={`p-2 rounded-lg transition-colors ${isEditing ? 'bg-white/20 text-white' : 'text-white/60 hover:text-white hover:bg-white/10'}`}>
                                    <Edit3 className="w-4 h-4" />
                                </button>
                                <button onClick={() => setShowDeleteConfirm(true)}
                                    className="p-2 text-white/60 hover:text-red-400 hover:bg-white/10 rounded-lg transition-colors">
                                    <Trash2 className="w-4 h-4" />
                                </button>
                            </>
                        )}
                        <button onClick={onClose} className="p-2 text-white/60 hover:text-white"><X className="w-5 h-5" /></button>
                    </div>
                </div>

                <div className="flex-1 overflow-y-auto p-4 space-y-4">

                    {/* Primary Stage */}
                    <div className="bg-gray-50 p-3 rounded-xl">
                        <label className="text-xs text-gray-500 font-medium mb-2 block">Project Stage</label>
                        <select value={editData.stage || ''}
                            onChange={e => handleStageChange(e.target.value)}
                            className="w-full px-3 py-2 border border-gray-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 bg-white">
                            <option value="">Select stage...</option>
                            {PRIMARY_STAGES.map(s => <option key={s.id} value={s.id}>{s.label}</option>)}
                        </select>
                    </div>

                    {/* Financial Tags — true multi-select toggles */}
                    <div className="bg-gray-50 p-3 rounded-xl">
                        <label className="text-xs text-gray-500 font-medium mb-2 block">
                            Financial Status Tags
                            {financialTags.length > 0 && (
                                <span className="ml-2 text-[10px] bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full">
                                    Active
                                </span>
                            )}
                        </label>
                        <div className="flex flex-wrap gap-2">
                            {FINANCIAL_TAGS.map(tag => {
                                const isActive = financialTags.includes(tag.id);
                                return (
                                    <button key={tag.id} onClick={() => handleToggleFinancialTag(tag.id)}
                                        className={`inline-flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-full font-medium border transition-all ${isActive
                                            ? (STAGE_COLORS[tag.id] || 'bg-gray-200 text-gray-700') + ' border-transparent'
                                            : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                                            }`}>
                                        {isActive && <CheckCircle2 className="w-3 h-3" />}
                                        {tag.label}
                                    </button>
                                );
                            })}
                        </div>
                        {financialTags.length > 0 && (
                            <button
                                onClick={() => {
                                    setEditData(prev => ({ ...prev, financial_tags: [] }));
                                    onUpdate(customer.id, { financial_tags: [] });
                                }}
                                className="mt-2 text-[10px] text-red-500 hover:text-red-700 transition-colors">
                                Clear all tags
                            </button>
                        )}
                    </div>

                    {/* Customer Info */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><User className="w-3.5 h-3.5" /> Customer Info</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <EditableDetailItem label="Phone" field="phone" value={editData.phone} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="Email" field="email" value={editData.email} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="Location" field="location" value={editData.location} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="Branch" field="branch" value={editData.branch} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="Aadhar" field="aadhar_number" value={editData.aadhar_number} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="POC" field="poc_name" value={editData.poc_name || editData.poc} onChange={handleChange} isEditing={isEditing} />
                        </div>
                    </div>

                    {/* Project */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Zap className="w-3.5 h-3.5 text-blue-500" /> Project</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <EditableDetailItem label="Capacity (kWp)" field="capacity" value={editData.capacity} onChange={handleChange} isEditing={isEditing} isEnergy />
                            <EditableDetailItem label="Project Type" field="project_type" value={editData.project_type} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="Vendor" field="vendor" value={editData.vendor} onChange={handleChange} isEditing={isEditing} />
                            <DetailItem label="Application #" value={customer.application_number} />
                        </div>
                    </div>

                    {/* Financial */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><IndianRupee className="w-3.5 h-3.5 text-emerald-600" /> Financial</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <EditableDetailItem label="Quoted Amount" field="quoted_amount" value={editData.quoted_amount} onChange={handleChange} type="number" isEditing={isEditing} isMoney />
                            <EditableDetailItem label="Bank Quote" field="quote_to_bank" value={editData.quote_to_bank} onChange={handleChange} type="number" isEditing={isEditing} isMoney />
                            <EditableDetailItem label="Payment Type" field="cash_or_loan" value={editData.cash_or_loan} onChange={handleChange} isEditing={isEditing} />
                            <DetailItem label="Quoted Price" value={customer.quoted_price ? `₹${Number(customer.quoted_price).toLocaleString('en-IN')}` : null} isMoney />
                            <DetailItem label="Receivables" value={customer.receivables ? `₹${Number(customer.receivables).toLocaleString('en-IN')}` : null} isMoney />
                            <DetailItem label="Discount" value={customer.discount ? `₹${Number(customer.discount).toLocaleString('en-IN')}` : null} />
                        </div>
                    </div>

                    {/* Payments */}
                    {(customer.payment_1 || customer.payment_2 || customer.payment_3) && (
                        <div>
                            <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><CreditCard className="w-3.5 h-3.5" /> Payments</h3>
                            <div className="grid grid-cols-2 gap-2">
                                {customer.payment_1 && <DetailItem label="Payment 1" value={`₹${Number(customer.payment_1).toLocaleString('en-IN')} • ${customer.payment_1_date || ''}`} isMoney />}
                                {customer.payment_2 && <DetailItem label="Payment 2" value={`₹${Number(customer.payment_2).toLocaleString('en-IN')} • ${customer.payment_2_date || ''}`} isMoney />}
                                {customer.payment_3 && <DetailItem label="Payment 3" value={`₹${Number(customer.payment_3).toLocaleString('en-IN')} • ${customer.payment_3_date || ''}`} isMoney />}
                                {customer.payment_4 && <DetailItem label="Payment 4" value={`₹${Number(customer.payment_4).toLocaleString('en-IN')} • ${customer.payment_4_date || ''}`} isMoney />}
                                {customer.payment_5 && <DetailItem label="Payment 5" value={`₹${Number(customer.payment_5).toLocaleString('en-IN')} • ${customer.payment_5_date || ''}`} isMoney />}
                            </div>
                        </div>
                    )}

                    {/* Bank Details */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Building2 className="w-3.5 h-3.5" /> Bank Details</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <EditableDetailItem label="Bank Name" field="bank_name" value={editData.bank_name} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="Branch" field="branch_name" value={editData.branch_name} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="Account #" field="bank_account_number" value={editData.bank_account_number} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="IFSC" field="ifsc_code" value={editData.ifsc_code || editData.disbursal_ifsc_code} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="Loan Application #" field="loan_application_number" value={editData.loan_application_number} onChange={handleChange} isEditing={isEditing} />
                        </div>
                    </div>

                    {/* Technical */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><Gauge className="w-3.5 h-3.5" /> Technical</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <EditableDetailItem label="Meter Category" field="meter_category" value={editData.meter_category} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="EB Number" field="eb_number" value={editData.eb_number} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="DTR Code" field="dtr_code" value={editData.dtr_code} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="Sanctioned Load" field="sanctioned_load" value={editData.sanctioned_load} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="DISCOM Division" field="discom_division" value={editData.discom_division} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="Net Metering" field="net_metering" value={editData.net_metering} onChange={handleChange} isEditing={isEditing} />
                        </div>
                    </div>

                    {/* Post Installation */}
                    <div>
                        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wide mb-2 flex items-center gap-1.5"><FileText className="w-3.5 h-3.5" /> Post Installation</h3>
                        <div className="grid grid-cols-2 gap-2">
                            <EditableDetailItem label="System Commissioning" field="system_commissioning" value={editData.system_commissioning} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="Net Meter Install Date" field="net_meter_install_date" value={editData.net_meter_install_date} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="Subsidy" field="subsidy" value={editData.subsidy} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="Subsidy Disbursement" field="subsidy_disbursement_date" value={editData.subsidy_disbursement_date} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="Subsidy Return Remark" field="subsidy_return_remark" value={editData.subsidy_return_remark} onChange={handleChange} isEditing={isEditing} />
                            <EditableDetailItem label="Impression" field="impression" value={editData.impression} onChange={handleChange} isEditing={isEditing} />
                        </div>
                        {isEditing ? (
                            <div className="mt-2 space-y-2">
                                {['installation_remarks', 'post_installation_remarks'].map(field => (
                                    <div key={field} className="bg-gray-50 p-3 rounded-xl">
                                        <p className="text-[10px] text-gray-400 uppercase mb-1">{field.replace(/_/g, ' ')}</p>
                                        <textarea value={editData[field] || ''} onChange={e => handleChange(field, e.target.value)} rows={2}
                                            className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none resize-none" />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="mt-2 space-y-2">
                                {customer.installation_remarks && <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] text-gray-400 uppercase mb-1">Installation Remarks</p><p className="text-sm text-gray-700">{customer.installation_remarks}</p></div>}
                                {customer.post_installation_remarks && <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] text-gray-400 uppercase mb-1">Post Installation Remarks</p><p className="text-sm text-gray-700">{customer.post_installation_remarks}</p></div>}
                            </div>
                        )}
                    </div>

                    {/* Links */}
                    <div className="flex flex-wrap gap-3">
                        {customer.location_link && (
                            <a href={customer.location_link} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-blue-600 hover:text-blue-800 text-sm font-medium bg-blue-50 px-3 py-1.5 rounded-lg">
                                <MapPin className="w-4 h-4" /> View on Maps
                            </a>
                        )}
                        {(customer.docs_link || customer.google_drive_link) && (
                            <a href={customer.docs_link || customer.google_drive_link} target="_blank" rel="noopener noreferrer"
                                className="inline-flex items-center gap-1.5 text-emerald-600 hover:text-emerald-800 text-sm font-medium bg-emerald-50 px-3 py-1.5 rounded-lg">
                                <FolderOpen className="w-4 h-4" /> Customer Documents
                            </a>
                        )}
                        {isEditing && (
                            <div className="w-full bg-gray-50 p-3 rounded-xl">
                                <p className="text-[10px] text-gray-400 uppercase mb-1">Docs Link (Google Drive)</p>
                                <input type="url" value={editData.docs_link || ''} onChange={e => handleChange('docs_link', e.target.value)}
                                    placeholder="https://drive.google.com/..."
                                    className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none focus:ring-1 focus:ring-gray-300" />
                            </div>
                        )}
                    </div>

                    {/* Remarks */}
                    {isEditing ? (
                        <div className="space-y-2">
                            {['site_remarks', 'remarks', 'remarks_on_sanctioned_load'].map(field => (
                                <div key={field} className="bg-gray-50 p-3 rounded-xl">
                                    <p className="text-[10px] text-gray-400 uppercase mb-1">{field.replace(/_/g, ' ')}</p>
                                    <textarea value={editData[field] || ''} onChange={e => handleChange(field, e.target.value)} rows={2}
                                        className="w-full bg-white border border-gray-200 rounded-lg px-2 py-1 text-sm focus:outline-none resize-none" />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="space-y-2">
                            {customer.site_remarks && <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] text-gray-400 uppercase mb-1">Site Remarks</p><p className="text-sm text-gray-700">{customer.site_remarks}</p></div>}
                            {customer.remarks && <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] text-gray-400 uppercase mb-1">Remarks</p><p className="text-sm text-gray-700">{customer.remarks}</p></div>}
                            {customer.remarks_on_sanctioned_load && <div className="bg-gray-50 p-3 rounded-xl"><p className="text-[10px] text-gray-400 uppercase mb-1">Sanctioned Load Remarks</p><p className="text-sm text-gray-700">{customer.remarks_on_sanctioned_load}</p></div>}
                        </div>
                    )}

                    {/* ── Checklist with local state + Save button ── */}
                    <div className="border-t pt-4">
                        <div className="flex items-center justify-between mb-3">
                            <h3 className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                                <CheckSquare className="w-4 h-4 text-emerald-600" /> Project Management Checklist
                            </h3>
                            {isAdmin && checklistDirty && (
                                <button
                                    onClick={handleSaveChecklist}
                                    disabled={savingChecklist}
                                    className="flex items-center gap-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs px-3 py-1.5 rounded-lg font-medium disabled:opacity-50 transition-colors">
                                    {savingChecklist ? 'Saving...' : <><Save className="w-3 h-3" /> Save Checklist</>}
                                </button>
                            )}
                        </div>
                        <div className="space-y-4">
                            {sections.map(section => {
                                const sectionItems = localChecklist.filter(item => item.section === section);
                                const completedCount = sectionItems.filter(item => item.checked).length;
                                const progress = Math.round((completedCount / sectionItems.length) * 100);
                                return (
                                    <div key={section} className="bg-gray-50 rounded-xl p-3">
                                        <div className="flex justify-between items-center mb-2">
                                            <h4 className="text-xs font-semibold text-gray-600 uppercase tracking-wide">{section}</h4>
                                            <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${progress === 100 ? 'bg-emerald-100 text-emerald-700' : progress > 0 ? 'bg-yellow-100 text-yellow-700' : 'bg-gray-200 text-gray-500'}`}>
                                                {completedCount}/{sectionItems.length}
                                            </span>
                                        </div>
                                        <div className="w-full bg-gray-200 rounded-full h-1.5 mb-3">
                                            <div className={`h-1.5 rounded-full transition-all ${progress === 100 ? 'bg-emerald-500' : 'bg-yellow-400'}`} style={{ width: `${progress}%` }} />
                                        </div>
                                        <div className="space-y-2">
                                            {sectionItems.map(item => (
                                                <label key={item.id} className={`flex items-start gap-2 ${isAdmin ? 'cursor-pointer' : 'cursor-not-allowed'}`}>
                                                    <input type="checkbox" checked={item.checked}
                                                        onChange={() => handleChecklistToggle(item.id)}
                                                        disabled={!isAdmin}
                                                        className="mt-0.5 w-4 h-4 rounded border-gray-300 text-emerald-600 focus:ring-emerald-500" />
                                                    <span className={`text-sm leading-tight ${item.checked ? 'text-gray-400 line-through' : 'text-gray-700'}`}>{item.label}</span>
                                                </label>
                                            ))}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                        {/* Unsaved changes hint */}
                        {checklistDirty && (
                            <p className="text-xs text-amber-600 mt-2 flex items-center gap-1">
                                <AlertTriangle className="w-3 h-3" /> Unsaved checklist changes — click Save Checklist above
                            </p>
                        )}
                    </div>

                    {/* ── Activity Log — local state, instant updates ── */}
                    <div className="border-t pt-4">
                        <h3 className="text-sm font-semibold text-gray-700 mb-3 flex items-center gap-2">
                            <MessageSquare className="w-4 h-4 text-gray-500" /> Activity Log
                        </h3>
                        <div className="space-y-2 mb-3 max-h-48 overflow-y-auto">
                            {followUps.length > 0 ? (
                                [...followUps].reverse().map((f, i) => (
                                    <div key={f.id || i} className="bg-gray-50 p-3 rounded-xl">
                                        <p className="text-sm text-gray-800">{f.text}</p>
                                        <div className="flex justify-between mt-1.5 text-[10px] text-gray-400">
                                            <span>{f.authorName}</span>
                                            <span>{new Date(f.date).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}</span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-gray-400 text-sm text-center py-4">No activity yet</p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <input
                                type="text"
                                value={followUpText}
                                onChange={e => setFollowUpText(e.target.value)}
                                onKeyDown={e => e.key === 'Enter' && handleAddFollowUp()}
                                placeholder="Add a note..."
                                className="flex-1 px-3 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
                            <button
                                onClick={handleAddFollowUp}
                                disabled={!followUpText.trim()}
                                className="px-3 py-2 bg-gray-900 text-white rounded-xl hover:bg-gray-800 disabled:opacity-40 transition-colors">
                                <Send className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </div>

                {isEditing && (
                    <div className="border-t p-4 flex-shrink-0">
                        <button onClick={handleSave} disabled={saving}
                            className="w-full bg-gray-900 text-white py-2.5 rounded-xl font-medium flex items-center justify-center gap-2 hover:bg-gray-800 disabled:opacity-50">
                            {saving ? 'Saving...' : <><Save className="w-4 h-4" /> Save Changes</>}
                        </button>
                    </div>
                )}
            </div>

            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-[60] p-4">
                    <div className="bg-white rounded-2xl p-6 w-full max-w-sm">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 bg-red-100 rounded-full"><AlertTriangle className="w-5 h-5 text-red-600" /></div>
                            <h3 className="font-bold text-gray-800">Delete Customer?</h3>
                        </div>
                        <p className="text-sm text-gray-600 mb-5">Are you sure you want to delete <strong>{customer.customer_name}</strong>? This cannot be undone.</p>
                        <div className="flex gap-3">
                            <button onClick={() => setShowDeleteConfirm(false)} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium">Cancel</button>
                            <button onClick={handleDelete} disabled={deleting}
                                className="flex-1 py-2.5 bg-red-600 text-white rounded-xl text-sm font-medium flex items-center justify-center gap-2 disabled:opacity-50">
                                {deleting ? 'Deleting...' : <><Trash2 className="w-4 h-4" /> Delete</>}
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

// ─── Activity Log View ────────────────────────────────────────────────────────
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
        create: 'bg-green-100 text-green-700',
        update: 'bg-blue-100 text-blue-700',
        delete: 'bg-red-100 text-red-700',
        stage_change: 'bg-purple-100 text-purple-700',
        note: 'bg-yellow-100 text-yellow-700',
    };

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="max-w-3xl mx-auto space-y-3">
            {logs.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                    <Activity className="w-12 h-12 mb-3 text-gray-300" />
                    <p className="font-medium text-gray-500">No activity logged yet</p>
                    <p className="text-sm mt-1">Actions will appear here as the team uses the CRM</p>
                </div>
            ) : logs.map(log => (
                <div key={log.id} className="bg-white rounded-xl p-4 border border-gray-100 shadow-sm flex items-start gap-3">
                    <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${ACTION_COLORS[log.action] || 'bg-gray-100 text-gray-700'}`}>
                        {log.action}
                    </span>
                    <div className="flex-1 min-w-0">
                        <p className="text-sm text-gray-800">{log.message}</p>
                        {log.new_value && <p className="text-xs text-gray-500 mt-0.5">{log.new_value}</p>}
                        <p className="text-[10px] text-gray-400 mt-1">
                            {log.profiles?.name || 'Unknown'} • {new Date(log.created_at).toLocaleString('en-IN', { dateStyle: 'short', timeStyle: 'short' })}
                        </p>
                    </div>
                </div>
            ))}
        </div>
    );
}

// ─── User Management View (Admin Only) ───────────────────────────────────────
// Uses Supabase Edge Function "smooth-worker" for safe server-side user creation.
// The Edge Function holds the service role key — it never reaches the browser.
// Deploy it from: supabase/functions/smooth-worker/index.ts
function UserManagementView({ currentUser }) {
    const [profiles, setProfiles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showCreateModal, setShowCreateModal] = useState(false);
    const [editingProfile, setEditingProfile] = useState(null);
    const [actionLoading, setActionLoading] = useState(null); // id of row being acted on

    const fetchProfiles = async () => {
        setLoading(true);
        const { data, error } = await supabase.from('profiles').select('*').order('created_at', { ascending: false });
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
        const { error } = await supabase.auth.resetPasswordForEmail(email, {
            redirectTo: window.location.origin,
        });
        if (!error) alert(`Password reset email sent to ${email}`);
        else alert(`Error: ${error.message}`);
    };

    const USER_TYPE_OPTIONS = ['admin', 'sales', 'agent'];
    const ROLE_OPTIONS = ['Manager', 'Sales Executive', 'Field Agent', 'Operations', 'Finance'];

    if (loading) return <div className="flex items-center justify-center h-64"><div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" /></div>;

    return (
        <div className="max-w-4xl mx-auto space-y-4">

            {/* Header */}
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                    <ShieldCheck className="w-5 h-5 text-gray-400" />
                    <p className="text-sm text-gray-500">{profiles.length} users registered</p>
                </div>
                <div className="flex gap-2">
                    <button onClick={fetchProfiles} className="p-2 border border-gray-200 rounded-xl text-gray-500 hover:bg-gray-50 transition-colors">
                        <RefreshCw className="w-4 h-4" />
                    </button>
                    <button onClick={() => setShowCreateModal(true)}
                        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                        <Plus className="w-4 h-4" /> Create User
                    </button>
                </div>
            </div>


            {/* Users Table */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-sm">
                        <thead>
                            <tr className="border-b border-gray-100 bg-gray-50">
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">User</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Access Type</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Role</th>
                                <th className="text-left px-4 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Joined</th>
                                <th className="px-4 py-3"></th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-50">
                            {profiles.map(profile => (
                                <tr key={profile.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-3">
                                            <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold flex-shrink-0">
                                                {profile.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || '?'}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-800">{profile.name || 'Unnamed'}</p>
                                                <p className="text-xs text-gray-400">{profile.email || '–'}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={profile.user_type || ''}
                                            disabled={profile.id === currentUser.id || actionLoading === profile.id}
                                            onChange={e => handleUpdateRole(profile.id, 'user_type', e.target.value)}
                                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 disabled:cursor-not-allowed bg-white">
                                            {USER_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3">
                                        <select
                                            value={profile.role || ''}
                                            disabled={actionLoading === profile.id}
                                            onChange={e => handleUpdateRole(profile.id, 'role', e.target.value)}
                                            className="text-xs border border-gray-200 rounded-lg px-2 py-1.5 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:opacity-50 bg-white">
                                            <option value="">Select role...</option>
                                            {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                                        </select>
                                    </td>
                                    <td className="px-4 py-3 text-xs text-gray-500">
                                        {profile.created_at ? new Date(profile.created_at).toLocaleDateString('en-IN') : '–'}
                                    </td>
                                    <td className="px-4 py-3">
                                        <div className="flex items-center gap-1 justify-end">
                                            {profile.id !== currentUser.id && (
                                                <button
                                                    onClick={() => handleResetPassword(profile.email)}
                                                    title="Send password reset email"
                                                    className="p-1.5 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                    <RefreshCw className="w-3.5 h-3.5" />
                                                </button>
                                            )}
                                            {profile.id === currentUser.id && (
                                                <span className="text-[10px] bg-emerald-100 text-emerald-700 px-2 py-0.5 rounded-full font-medium">You</span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>

            {/* Create User Modal */}
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

// ─── Create User Modal ────────────────────────────────────────────────────────
function CreateUserModal({ onClose, onCreated, currentUser }) {
    const [form, setForm] = useState({ name: '', email: '', password: '', role: 'Sales Executive', user_type: 'sales' });
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState('');
    const [showPw, setShowPw] = useState(false);
    const set = (field, val) => setForm(prev => ({ ...prev, [field]: val }));

    const handleCreate = async () => {
        if (!form.name.trim() || !form.email.trim() || !form.password.trim()) {
            setError('Name, email, and password are required.');
            return;
        }
        if (form.password.length < 8) {
            setError('Password must be at least 8 characters.');
            return;
        }
        setSaving(true);
        setError('');
        try {
            const response = await supabase.functions.invoke('smooth-worker', {
                body: form,
            });
            const data = response.data;

            if (response.error) {
                throw new Error(response.error.message || JSON.stringify(response.error));
            }
            if (data?.error) {
                throw new Error(data.error || 'Something went wrong');
            }

            logActivity(currentUser.id, 'create', `Created new user: ${form.name}`, `${form.role} (${form.user_type})`);
            onCreated();
        } catch (err) {
            setError(err.message || 'Failed to create user. Check Edge Function setup.');
        } finally {
            setSaving(false);
        }
    };

    const USER_TYPE_OPTIONS = ['admin', 'sales', 'agent'];
    const ROLE_OPTIONS = ['Manager', 'Sales Executive', 'Field Agent', 'Operations', 'Finance'];

    return (
        <div className="fixed inset-0 bg-black/50 flex items-end sm:items-center justify-center z-50 p-0 sm:p-4">
            <div className="bg-white rounded-t-2xl sm:rounded-2xl shadow-2xl w-full sm:max-w-md overflow-hidden flex flex-col">
                <div className="bg-gray-900 px-5 py-4 flex justify-between items-center">
                    <div>
                        <h2 className="text-lg font-bold text-white">Create New User</h2>
                        <p className="text-gray-400 text-xs mt-0.5">They'll receive a login via email</p>
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
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Full Name *</label>
                        <input type="text" value={form.name} onChange={e => set('name', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Email *</label>
                        <input type="email" value={form.email} onChange={e => set('email', e.target.value)}
                            className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
                    </div>
                    <div>
                        <label className="block text-xs font-medium text-gray-600 mb-1">Temporary Password *</label>
                        <div className="relative">
                            <input type={showPw ? 'text' : 'password'} value={form.password} onChange={e => set('password', e.target.value)}
                                placeholder="Min. 8 characters"
                                className="w-full px-3 py-2.5 pr-10 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300" />
                            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-3 text-gray-400 hover:text-gray-600">
                                {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                        </div>
                        <p className="text-[10px] text-gray-400 mt-1">Share this with the user. They can reset it anytime.</p>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Access Type</label>
                            <select value={form.user_type} onChange={e => set('user_type', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300">
                                {USER_TYPE_OPTIONS.map(t => <option key={t} value={t}>{t.charAt(0).toUpperCase() + t.slice(1)}</option>)}
                            </select>
                        </div>
                        <div>
                            <label className="block text-xs font-medium text-gray-600 mb-1">Role</label>
                            <select value={form.role} onChange={e => set('role', e.target.value)}
                                className="w-full px-3 py-2.5 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300">
                                {ROLE_OPTIONS.map(r => <option key={r} value={r}>{r}</option>)}
                            </select>
                        </div>
                    </div>
                    <div className="bg-blue-50 rounded-xl p-3">
                        <p className="text-xs text-blue-700 font-medium mb-1">Access levels:</p>
                        <ul className="text-xs text-blue-600 space-y-0.5">
                            <li><strong>Admin</strong> — full CRM access, edit/delete, user management</li>
                            <li><strong>Sales</strong> — read-only sales pipeline view</li>
                            <li><strong>Agent</strong> — field agent form only</li>
                        </ul>
                    </div>
                </div>
                <div className="border-t p-4 flex gap-3">
                    <button onClick={onClose} className="flex-1 py-2.5 border border-gray-300 text-gray-700 rounded-xl text-sm font-medium">Cancel</button>
                    <button onClick={handleCreate} disabled={saving}
                        className="flex-1 py-2.5 bg-gray-900 text-white rounded-xl text-sm font-medium disabled:opacity-50 flex items-center justify-center gap-2">
                        {saving ? 'Creating...' : <><UserCog className="w-4 h-4" /> Create User</>}
                    </button>
                </div>
            </div>
        </div>
    );
}

// ─── Customer Card ────────────────────────────────────────────────────────────
function CustomerCard({ customer, onSelect, onMoveStage, onUpdate }) {
    const [showStageMenu, setShowStageMenu] = useState(false);
    const [showFinancialMenu, setShowFinancialMenu] = useState(false);
    const dropdownRef = useRef(null);
    const financialDropdownRef = useRef(null);
    const financialTags = Array.isArray(customer.financial_tags) ? customer.financial_tags : [];

    // Single-select: toggle individual tag on/off
    const toggleFinancialTag = (tagId) => {
        const newTags = financialTags.includes(tagId) ? [] : [tagId];
        onUpdate(customer.id, { financial_tags: newTags });
        setShowFinancialMenu(false);
    };

    useEffect(() => {
        if (!showStageMenu && !showFinancialMenu) return;
        const handleClick = (e) => {
            if (showStageMenu && dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowStageMenu(false);
            if (showFinancialMenu && financialDropdownRef.current && !financialDropdownRef.current.contains(e.target)) setShowFinancialMenu(false);
        };
        document.addEventListener('mousedown', handleClick);
        return () => document.removeEventListener('mousedown', handleClick);
    }, [showStageMenu, showFinancialMenu]);

    return (
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-4 cursor-pointer hover:shadow-md transition-shadow" onClick={() => onSelect(customer)}>
            <div className="flex justify-between items-start mb-2">
                <h3 className="font-bold text-gray-800 text-base leading-tight">{customer.customer_name}</h3>
                <span className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full font-medium ml-2 whitespace-nowrap">
                    {customer.quotation_number || customer.project_id || '–'}
                </span>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-gray-600 mb-1">
                <Zap className="w-3.5 h-3.5 text-blue-500 flex-shrink-0" />
                <span>{customer.capacity ? `${customer.capacity} kWp` : '–'} {customer.project_type || ''}</span>
            </div>
            <div className="flex justify-between items-center text-sm mb-2">
                <span className="flex items-center gap-1 text-gray-500 text-xs"><MapPin className="w-3 h-3" />{customer.location || '–'}</span>
                <span className="font-bold text-emerald-600">{customer.quoted_amount ? `₹${Number(customer.quoted_amount).toLocaleString('en-IN')}` : '–'}</span>
            </div>

            {/* Docs link badge */}
            {customer.docs_link && (
                <div className="mb-2" onClick={e => e.stopPropagation()}>
                    <a href={customer.docs_link} target="_blank" rel="noopener noreferrer"
                        className="inline-flex items-center gap-1 text-[10px] bg-emerald-50 text-emerald-600 hover:bg-emerald-100 px-2 py-1 rounded-full font-medium transition-colors">
                        <FolderOpen className="w-3 h-3" /> Docs
                    </a>
                </div>
            )}



            {/* Stage dropdown — unchanged */}
            <div className="flex flex-col gap-2">
                <div className="relative" ref={dropdownRef} onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => { setShowStageMenu(!showStageMenu); setShowFinancialMenu(false); }}
                        className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 font-medium transition-colors">
                        <span>{PRIMARY_STAGES.find(s => s.id === customer.stage)?.label || 'Move to Stage'}</span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showStageMenu ? 'rotate-180' : ''}`} />
                    </button>
                    {showStageMenu && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 max-h-72 overflow-y-auto">
                            {PRIMARY_STAGES.map(stage => (
                                <button key={stage.id}
                                    onClick={() => { onMoveStage(customer.id, stage.id); setShowStageMenu(false); }}
                                    className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${customer.stage === stage.id ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-600'}`}>
                                    <stage.icon className="w-3.5 h-3.5 text-gray-400" />
                                    {stage.label}
                                </button>
                            ))}
                        </div>
                    )}
                </div>

                <div className="relative" ref={financialDropdownRef} onClick={e => e.stopPropagation()}>
                    <button
                        onClick={() => { setShowFinancialMenu(!showFinancialMenu); setShowStageMenu(false); }}
                        className="w-full flex items-center justify-between bg-gray-50 hover:bg-gray-100 border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-600 font-medium transition-colors">
                        <span>
                            {financialTags.length > 0
                                ? FINANCIAL_TAGS.find(t => t.id === financialTags[0])?.label || 'Financial Tags'
                                : 'Financial Tags'}
                        </span>
                        <ChevronDown className={`w-4 h-4 transition-transform ${showFinancialMenu ? 'rotate-180' : ''}`} />
                    </button>
                    {showFinancialMenu && (
                        <div className="absolute top-full left-0 right-0 mt-1 bg-white rounded-xl shadow-xl border border-gray-100 py-1 z-20 max-h-72 overflow-y-auto">
                            {FINANCIAL_TAGS.map(tag => {
                                const isSelected = financialTags.includes(tag.id);
                                return (
                                    <button key={tag.id}
                                        onClick={() => toggleFinancialTag(tag.id)}
                                        className={`w-full px-3 py-2 text-left text-sm flex items-center gap-2 hover:bg-gray-50 transition-colors ${isSelected ? 'bg-gray-100 font-semibold text-gray-900' : 'text-gray-600'}`}>
                                        <tag.icon className="w-3.5 h-3.5 text-gray-400" />
                                        {tag.label}
                                    </button>
                                );
                            })}
                            {/* Clear all if any active */}
                            {financialTags.length > 0 && (
                                <div className="border-t border-gray-100 pt-1 mt-1">
                                    <button
                                        onClick={() => { onUpdate(customer.id, { financial_tags: [] }); }}
                                        className="w-full px-3 py-1.5 text-left text-xs text-red-500 hover:bg-red-50 transition-colors">
                                        Clear all tags
                                    </button>
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}

// ─── Main Dashboard ───────────────────────────────────────────────────────────
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
            `Moved ${customer?.customer_name} to ${PRIMARY_STAGES.find(s => s.id === newStage)?.label || newStage}`
        );
    };

    const handleAddLead = async (data) => {
        const { data: inserted, error } = await supabase.from('admin').insert(data).select().single();
        if (!error) {
            logActivity(user.id, 'create', `Added new lead: ${data.customer_name}`, `${data.capacity || '?'} kWp ${data.project_type || ''}`);
            setShowAddLead(false);
            fetchData();
        }
    };

    const filtered = customers.filter(c => {
        const searchLower = searchQuery.toLowerCase();
        const matchesSearch = !searchQuery ||
            c.customer_name?.toLowerCase().includes(searchLower) ||
            c.phone?.includes(searchQuery) ||
            c.quotation_number?.toLowerCase().includes(searchLower);
        const matchesStage = c.stage?.toLowerCase() === selectedStage.toLowerCase();
        const isAuthorized = user.userType === 'admin' || c.poc_name === user.name || c.poc === user.name;
        return matchesStage && matchesSearch && isAuthorized;
    });

    const stageCounts = PRIMARY_STAGES.reduce((acc, s) => {
        acc[s.id] = customers.filter(c => c.stage?.toLowerCase() === s.id.toLowerCase()).length;
        return acc;
    }, {});

    if (user.userType === 'agent') return <AgentForm user={user} onLogout={onLogout} />;
    if (user.userType === 'sales') return <SalesView customers={customers} loading={loading} user={user} onUpdate={handleMoveStage} />;

    return (
        <div className="min-h-screen bg-gray-50 flex">
            {sidebarOpen && <div className="fixed inset-0 bg-black/40 z-40 lg:hidden" onClick={() => setSidebarOpen(false)} />}

            <aside className={`fixed inset-y-0 left-0 z-50 w-64 bg-white border-r flex flex-col transform transition-transform duration-300 lg:translate-x-0 ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}`}>
                <div className="p-5 border-b flex justify-between items-center">
                    <img
                        src="/Logo%20Ray2Volt%20Solar%20bgless.png"
                        alt="Ray2Volt Solar"
                        className="h-10 w-auto max-w-[140px] object-contain"
                    />
                    <button className="lg:hidden text-gray-400" onClick={() => setSidebarOpen(false)}><X className="w-5 h-5" /></button>
                </div>


                <div className="flex-1 overflow-y-auto p-3">
                    <button onClick={() => { setCurrentView('dashboard'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-1 transition-colors ${currentView === 'dashboard' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <LayoutDashboard className="w-4 h-4" /> Dashboard
                    </button>
                    <div className="text-[10px] uppercase font-bold text-gray-400 px-3 pt-4 pb-2 tracking-wider">Project Stages</div>
                    {PRIMARY_STAGES.map(s => (
                        <button key={s.id} onClick={() => { setCurrentView('stages'); setSelectedStage(s.id); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-colors ${currentView === 'stages' && selectedStage === s.id ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <s.icon className="w-4 h-4 flex-shrink-0" />
                            <span className="flex-1 text-left truncate text-xs">{s.label}</span>
                            {stageCounts[s.id] > 0 && (
                                <span className={`text-[10px] px-1.5 py-0.5 rounded-full min-w-[20px] text-center ${currentView === 'stages' && selectedStage === s.id ? 'bg-white/20 text-white' : 'bg-gray-100 text-gray-500'}`}>
                                    {stageCounts[s.id]}
                                </span>
                            )}
                        </button>
                    ))}
                    <div className="text-[10px] uppercase font-bold text-gray-400 px-3 pt-4 pb-2 tracking-wider">System</div>
                    <button onClick={() => { setCurrentView('activity'); setSidebarOpen(false); }}
                        className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium mb-0.5 transition-colors ${currentView === 'activity' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                        <Activity className="w-4 h-4" /> Activity Log
                    </button>
                    {user.userType === 'admin' && (
                        <button onClick={() => { setCurrentView('users'); setSidebarOpen(false); }}
                            className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${currentView === 'users' ? 'bg-gray-900 text-white' : 'text-gray-600 hover:bg-gray-100'}`}>
                            <UserCog className="w-4 h-4" /> User Management
                        </button>
                    )}
                </div>
                <div className="p-3 border-t">
                    <div className="flex items-center gap-3 px-3 py-2 mb-1">
                        <div className="w-8 h-8 bg-gray-900 rounded-full flex items-center justify-center text-white text-xs font-bold">
                            {user.name?.split(' ').map(n => n[0]).join('').slice(0, 2) || 'A'}
                        </div>
                        <div className="min-w-0">
                            <p className="text-sm font-medium text-gray-700 truncate">{user.name}</p>
                            <p className="text-[10px] text-gray-400">{user.role}</p>
                        </div>
                    </div>
                    <button onClick={onLogout} className="w-full flex items-center gap-2 px-3 py-2 text-red-500 hover:bg-red-50 rounded-xl text-sm font-medium transition-colors">
                        <LogOut className="w-4 h-4" /> Logout
                    </button>
                </div>
            </aside>

            <main className="flex-1 lg:ml-64 flex flex-col min-h-screen">
                <header className="h-16 bg-white border-b px-4 lg:px-6 flex items-center justify-between sticky top-0 z-30">
                    <div className="flex items-center gap-3">
                        <button onClick={() => setSidebarOpen(true)} className="lg:hidden text-gray-500"><Menu className="w-6 h-6" /></button>
                        <h1 className="font-bold text-gray-800">
                            {currentView === 'dashboard' ? 'Business Dashboard'
                                : currentView === 'activity' ? 'Activity Log'
                                    : currentView === 'users' ? 'User Management'
                                        : PRIMARY_STAGES.find(s => s.id === selectedStage)?.label}
                        </h1>
                    </div>
                    <div className="flex items-center gap-2">
                        {currentView === 'stages' && (
                            <div className="relative">
                                <Search className="absolute left-3 top-2.5 text-gray-400 w-4 h-4" />
                                <input type="text" placeholder="Search..." value={searchQuery} onChange={e => setSearchQuery(e.target.value)}
                                    className="pl-9 pr-4 py-2 bg-gray-100 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-gray-300 w-40 lg:w-48" />
                            </div>
                        )}
                        {user.userType === 'admin' && (
                            <>
                                <button onClick={() => exportAllToCSV(customers)}
                                    className="flex items-center gap-1.5 border border-gray-200 text-gray-600 px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
                                    <Download className="w-4 h-4" />
                                    <span className="hidden sm:inline">Export</span>
                                </button>
                                <button onClick={() => setShowAddLead(true)}
                                    className="flex items-center gap-1.5 bg-gray-900 text-white px-3 py-2 rounded-xl text-sm font-medium hover:bg-gray-800 transition-colors">
                                    <Plus className="w-4 h-4" />
                                    <span className="hidden sm:inline">Add Lead</span>
                                </button>
                            </>
                        )}
                    </div>
                </header>

                <div className="flex-1 p-4 lg:p-6">
                    {currentView === 'dashboard' && (
                        <DashboardView
                            customers={customers.map(c => ({
                                ...c,
                                currentStage: c.stage,
                                quotedAmount: c.quoted_amount,
                                capacity: parseFloat(c.capacity) || 0,
                                customerName: c.customer_name,
                                intent: c.intent_level,
                            }))}
                            loading={loading}
                        />
                    )}
                    {currentView === 'activity' && <ActivityLogView />}
                    {currentView === 'users' && user.userType === 'admin' && (
                        <UserManagementView currentUser={user} />
                    )}
                    {currentView === 'stages' && (
                        loading ? (
                            <div className="flex items-center justify-center h-64">
                                <div className="w-8 h-8 border-4 border-gray-900 border-t-transparent rounded-full animate-spin" />
                            </div>
                        ) : filtered.length > 0 ? (
                            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
                                {filtered.map(c => (
                                    <CustomerCard key={c.id} customer={c} onSelect={setSelectedCustomer} onMoveStage={handleMoveStage} onUpdate={handleUpdateCustomer} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center h-64 text-gray-400">
                                <Users className="w-12 h-12 mb-3 text-gray-300" />
                                <p className="font-medium text-gray-500">{searchQuery ? 'No matching results' : 'No customers in this stage'}</p>
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
                />
            )}
            {showAddLead && <AddLeadModal onClose={() => setShowAddLead(false)} onSave={handleAddLead} />}
        </div>
    );
}

// ─── Root App ─────────────────────────────────────────────────────────────────
export default function App() {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        supabase.auth.getSession().then(async ({ data: { session } }) => {
            if (session) {
                const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single();
                if (profile) setUser({ id: session.user.id, email: session.user.email, name: profile.name, role: profile.role, userType: profile.user_type });
            }
            setLoading(false);
        });
        const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
            if (!session) { setUser(null); setLoading(false); }
        });
        return () => subscription.unsubscribe();
    }, []);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-900">
            <div className="w-10 h-10 border-4 border-white border-t-transparent rounded-full animate-spin" />
        </div>
    );

    return !user
        ? <LoginScreen onLogin={setUser} />
        : <Dashboard user={user} onLogout={async () => { await supabase.auth.signOut(); setUser(null); }} />;
}