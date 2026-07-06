import React, { useState } from 'react';
import { solarMath } from '../../utils/solarMath';
import ToolWrapper from './ToolWrapper';
import { Calculator, Percent, Calendar, IndianRupee } from 'lucide-react';

const EMICalculator = () => {
    const [values, setValues] = useState({ p: 1000000, r: 8.5, n: 60, isFlat: false });
    const res = solarMath.calculateEMI(values.p, values.r, values.n, values.isFlat);

    return (
        <ToolWrapper title="EMI Calculator">
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-700">
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">

                    {/* LEFT: INPUTS */}
                    <div className="lg:col-span-6 bg-white p-8 rounded-[40px] shadow-sm border border-stone-100 space-y-8">
                        <div className="flex bg-stone-100 p-1 rounded-2xl w-fit">
                            <button onClick={() => setValues({ ...values, isFlat: false })} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${!values.isFlat ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400 hover:text-stone-600'}`}>Reducing</button>
                            <button onClick={() => setValues({ ...values, isFlat: true })} className={`px-6 py-2 rounded-xl text-xs font-bold transition-all ${values.isFlat ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400 hover:text-stone-600'}`}>Flat Rate</button>
                        </div>

                        <div className="space-y-6">
                            <div className="space-y-2">
                                <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2 px-1"><IndianRupee size={12} /> Loan Amount</label>
                                <input type="number" value={values.p} onChange={e => setValues({ ...values, p: Number(e.target.value) })} className="w-full p-4 bg-stone-50 rounded-2xl border-none font-black text-2xl text-stone-800 outline-none focus:ring-2 focus:ring-amber-500" />
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2 px-1"><Percent size={12} /> Rate (%)</label>
                                    <input type="number" value={values.r} onChange={e => setValues({ ...values, r: e.target.value })} className="w-full p-4 bg-stone-50 rounded-2xl border-none font-bold text-stone-800 outline-none" />
                                </div>
                                <div className="space-y-2">
                                    <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest flex items-center gap-2 px-1"><Calendar size={12} /> Months</label>
                                    <input type="number" value={values.n} onChange={e => setValues({ ...values, n: e.target.value })} className="w-full p-4 bg-stone-50 rounded-2xl border-none font-bold text-stone-800 outline-none" />
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* RIGHT: RESULTS */}
                    <div className="lg:col-span-6 space-y-6">
                        <div className="bg-stone-900 text-white p-10 rounded-[48px] shadow-2xl relative overflow-hidden flex flex-col items-center text-center">
                            <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.3em] mb-4">Monthly EMI</p>
                            <h2 className="text-6xl font-black tracking-tighter">₹{Math.round(res.emi).toLocaleString()}</h2>

                            <div className="mt-10 w-full grid grid-cols-2 gap-6 border-t border-white/10 pt-8 text-left">
                                <div>
                                    <p className="text-[9px] opacity-40 font-bold uppercase tracking-widest">Total Interest</p>
                                    <p className="text-lg font-black text-stone-300">₹{Math.round(res.totalInterest).toLocaleString()}</p>
                                </div>
                                <div className="text-right">
                                    <p className="text-[9px] opacity-40 font-bold uppercase tracking-widest">Total Payable</p>
                                    <p className="text-lg font-black text-stone-300">₹{Math.round(res.totalPayment).toLocaleString()}</p>
                                </div>
                            </div>
                        </div>

                        <div className="bg-amber-50 p-6 rounded-[32px] border border-amber-100 flex items-center gap-4">
                            <div className="p-3 bg-white rounded-2xl shadow-sm"><Calculator className="text-amber-600" size={24} /></div>
                            <p className="text-xs text-amber-800 font-bold leading-relaxed">
                                Calculation using <strong>{values.isFlat ? 'Flat Interest' : 'Reducing Balance'}</strong>.
                                <br /><span className="opacity-60 text-[10px]">Use this data for official solar financing proposals.</span>
                            </p>
                        </div>
                    </div>

                </div>
            </div>
        </ToolWrapper>
    );
};

export default EMICalculator;