import React, { useState } from 'react';
import { solarMath } from '../../utils/solarMath';

const GSTCalculator = () => {
    const [amount, setAmount] = useState(0);
    const [rate, setRate] = useState(18);
    const [mode, setMode] = useState('add'); // 'add' or 'remove'
    const [region, setRegion] = useState('intra'); // 'intra' or 'inter'

    const results = solarMath.calculateGST(amount, rate, mode === 'remove');

    return (
        <div className="max-w-4xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8 p-6">
            <div className="bg-white p-6 rounded-3xl border border-stone-100 shadow-sm space-y-6">
                <h3 className="font-bold text-stone-800">GST Input</h3>
                
                {/* Mode Toggles */}
                <div className="flex gap-2 bg-stone-100 p-1 rounded-xl">
                    <button onClick={() => setMode('add')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${mode === 'add' ? 'bg-white' : 'text-stone-400'}`}>Add GST</button>
                    <button onClick={() => setMode('remove')} className={`flex-1 py-2 rounded-lg text-xs font-bold ${mode === 'remove' ? 'bg-white' : 'text-stone-400'}`}>Remove GST</button>
                </div>

                <input type="number" value={amount} onChange={e => setAmount(Number(e.target.value))} className="w-full p-4 bg-stone-50 rounded-xl outline-none border-2 border-transparent focus:border-amber-400" placeholder="Enter Amount" />

                <div className="flex gap-2 bg-stone-100 p-1 rounded-xl">
                    <button onClick={() => setRegion('intra')} className={`flex-1 py-2 rounded-lg text-[10px] font-bold ${region === 'intra' ? 'bg-white' : 'text-stone-400'}`}>Intra-State (CGST+SGST)</button>
                    <button onClick={() => setRegion('inter')} className={`flex-1 py-2 rounded-lg text-[10px] font-bold ${region === 'inter' ? 'bg-white' : 'text-stone-400'}`}>Inter-State (IGST)</button>
                </div>
            </div>

            <div className="space-y-4">
                <div className="bg-stone-900 text-white p-6 rounded-3xl">
                    <p className="text-[10px] text-amber-400 font-bold uppercase mb-4">Detailed Breakdown</p>
                    <div className="space-y-3">
                        <div className="flex justify-between border-b border-white/10 pb-2"><span>Base Amount</span><span>₹{results.base.toFixed(2)}</span></div>
                        {region === 'intra' ? (
                            <>
                                <div className="flex justify-between opacity-60"><span>CGST ({rate/2}%)</span><span>₹{(results.gst/2).toFixed(2)}</span></div>
                                <div className="flex justify-between opacity-60"><span>SGST ({rate/2}%)</span><span>₹{(results.gst/2).toFixed(2)}</span></div>
                            </>
                        ) : (
                            <div className="flex justify-between opacity-60"><span>IGST ({rate}%)</span><span>₹{results.gst.toFixed(2)}</span></div>
                        )}
                        <div className="flex justify-between pt-2 text-xl font-black text-amber-400"><span>Total</span><span>₹{results.total.toFixed(2)}</span></div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default GSTCalculator;