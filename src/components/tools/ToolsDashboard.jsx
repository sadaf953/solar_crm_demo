import React from 'react';
import { Link } from 'react-router-dom';
import {
    FileText, Award, Banknote, FileSpreadsheet, Send,
    ShoppingBag, CreditCard, Calculator, Percent, Wallet, Package, ArrowLeft
} from 'lucide-react';

const tools = [
    { id: 'quote', label: 'Quote Generator', path: 'quote', icon: FileText, desc: 'Professional solar proposals' },
    { id: 'warranty', label: 'Warranty Card', path: 'warranty', icon: Award, desc: '4-page system certificates' },
    { id: 'invoice', label: 'Invoice Generator', path: 'invoice', icon: Banknote, desc: 'GST compliant invoices' },
    { id: 'proforma', label: 'Proforma Invoice', path: 'proforma', icon: FileSpreadsheet, desc: 'Pre-billing documents' },
    { id: 'rfq', label: 'Request for Quote', path: 'rfq', icon: Send, desc: 'Procurement requests' },
    { id: 'po', label: 'Purchase Order', path: 'po', icon: ShoppingBag, desc: 'Vendor orders' },
    { id: 'receipt', label: 'Receipt Generator', path: 'receipt', icon: CreditCard, desc: 'Payment tracking' },
    { id: 'emi', label: 'EMI Calculator', path: 'emi', icon: Calculator, desc: 'Loan installment math' },
    { id: 'gst', label: 'GST Calculator', path: 'gst', icon: Percent, desc: 'Tax breakdown tool' },
    { id: 'payslip', label: 'Payslip Generator', path: 'payslip', icon: Wallet, desc: 'Staff salary slips' },
    { id: 'packages', label: 'Package Prices', path: 'packages', icon: Package, desc: 'System configuration' }
];

const ToolsDashboard = () => {
    return (
        <div className="p-6">
            <div className="mb-10">
                <h1 className="text-3xl font-black text-stone-800 uppercase tracking-tight">SolarFlow Tools</h1>
                <p className="text-stone-500 font-medium mt-2">Professional utility engines for your solar business.</p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {tools.map((tool) => (
                    <Link
                        key={tool.id}
                        to={`/tools/${tool.path}`}
                        className="bg-white p-8 rounded-[40px] border border-stone-100 shadow-sm hover:shadow-xl hover:border-amber-400 transition-all group flex flex-col items-start"
                    >
                        <div className="w-14 h-14 bg-stone-50 rounded-2xl flex items-center justify-center mb-6 group-hover:bg-amber-500 transition-colors">
                            <tool.icon className="w-7 h-7 text-stone-400 group-hover:text-white transition-colors" />
                        </div>
                        <h3 className="font-black text-stone-800 mb-2 uppercase text-sm tracking-wide">{tool.label}</h3>
                        <p className="text-xs text-stone-400 leading-relaxed font-medium">{tool.desc}</p>
                    </Link>
                ))}
            </div>
        </div>
    );
};

export default ToolsDashboard;