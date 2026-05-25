import React from 'react';
import { Users, Zap, IndianRupee, TrendingUp, Wallet, HardHat, FileCheck, PieChart, Clock } from 'lucide-react';

const MetricCard = ({ icon: Icon, label, value, subValue, colorClass, bgClass }) => (
    <div className="bg-white rounded-xl p-5 shadow-sm border border-gray-100">
        <div className="flex items-center justify-between mb-3">
            <div className={`p-2 rounded-lg ${bgClass}`}>
                <Icon className={`w-5 h-5 ${colorClass}`} />
            </div>
            {subValue && <span className="text-[10px] font-bold text-gray-400 bg-gray-50 px-2 py-1 rounded-md">{subValue}</span>}
        </div>
        <p className="text-2xl font-bold text-gray-900">{value}</p>
        <p className="text-xs font-medium text-gray-500 mt-1">{label}</p>
    </div>
);

export default function DashboardView({ customers = [], loading }) {
    if (loading) return <div className="p-20 text-center text-gray-500">Loading Dashboard Data...</div>;

    // Calculations based on your 'admin' table columns
    const totalCapacity = customers.reduce((sum, c) => sum + (Number(c.capacity) || 0), 0);
    const totalRevenue = customers.reduce((sum, c) => sum + (Number(c.quoted_amount) || 0), 0);
    
    // Logic for Receivables: sum of payment_1 through payment_5
    const totalCollected = customers.reduce((sum, c) => {
        return sum + (Number(c.payment_1) || 0) + (Number(c.payment_2) || 0) + 
               (Number(c.payment_3) || 0) + (Number(c.payment_4) || 0) + (Number(c.payment_5) || 0);
    }, 0);
    
    const receivables = totalRevenue - totalCollected;

    return (
        <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <MetricCard 
                    icon={Users} label="Total Projects" value={customers.length} 
                    colorClass="text-blue-600" bgClass="bg-blue-50" 
                />
                <MetricCard 
                    icon={Zap} label="Solar Capacity" value={`${totalCapacity.toFixed(1)} kWp`} 
                    colorClass="text-amber-600" bgClass="bg-amber-50" 
                />
                <MetricCard 
                    icon={IndianRupee} label="Total Revenue" value={`₹${(totalRevenue/100000).toFixed(2)}L`} 
                    colorClass="text-emerald-600" bgClass="bg-emerald-50" 
                />
                <MetricCard 
                    icon={Wallet} label="Receivables" value={`₹${(receivables/100000).toFixed(2)}L`} 
                    colorClass="text-red-600" bgClass="bg-red-50" 
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                    <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                        <TrendingUp size={18} className="text-gray-400" /> Recent Activity
                    </h3>
                    <div className="overflow-x-auto">
                        <table className="w-full text-sm text-left">
                            <thead>
                                <tr className="text-gray-400 border-b border-gray-50">
                                    <th className="pb-3 font-medium">Customer</th>
                                    <th className="pb-3 font-medium">Stage</th>
                                    <th className="pb-3 font-medium">Branch</th>
                                    <th className="pb-3 font-medium text-right">Quoted</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-gray-50">
                                {customers.slice(0, 8).map((c, i) => (
                                    <tr key={i} className="hover:bg-gray-50 transition-colors">
                                        <td className="py-3 font-bold text-gray-700">{c.customer_name}</td>
                                        <td className="py-3">
                                            <span className="px-2 py-0.5 bg-gray-100 text-gray-600 rounded text-[10px] font-bold uppercase tracking-wider">
                                                {c.stage?.replace('_', ' ')}
                                            </span>
                                        </td>
                                        <td className="py-3 text-gray-500">{c.branch_name || 'N/A'}</td>
                                        <td className="py-3 text-right font-semibold text-emerald-600">
                                            ₹{Number(c.quoted_amount).toLocaleString('en-IN')}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                        {customers.length === 0 && <p className="text-center py-10 text-gray-400">No projects found.</p>}
                    </div>
                </div>

                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl border border-gray-100 shadow-sm">
                        <h3 className="font-bold text-gray-800 mb-4 flex items-center gap-2">
                            <PieChart size={18} className="text-gray-400"/> Top Branches
                        </h3>
                        <div className="space-y-4">
                            {Object.entries(
                                customers.reduce((acc, c) => {
                                    if(c.branch_name) acc[c.branch_name] = (acc[c.branch_name] || 0) + 1;
                                    return acc;
                                }, {})
                            ).sort((a,b) => b[1] - a[1]).map(([name, count]) => (
                                <div key={name} className="flex justify-between items-center">
                                    <span className="text-sm text-gray-600 font-medium">{name}</span>
                                    <span className="font-bold text-gray-900 bg-gray-50 px-2 py-0.5 rounded-lg border border-gray-100">{count}</span>
                                </div>
                            ))}
                        </div>
                    </div>
                    
                    <div className="bg-gray-900 p-6 rounded-xl text-white shadow-lg">
                        <h4 className="text-gray-400 text-xs font-bold uppercase mb-2">Technical Summary</h4>
                        <div className="flex justify-between items-end">
                            <div>
                                <p className="text-2xl font-bold">{customers.filter(c => c.eb_number).length}</p>
                                <p className="text-[10px] text-gray-400">EB Connections Linked</p>
                            </div>
                            <HardHat className="text-gray-700" size={40} />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}

const logActivity = async (action, message, details = '') => {
    await supabase.from('activity_log').insert({
        user_id: user.id,
        action,
        message,
        new_value: details,
    });
};

