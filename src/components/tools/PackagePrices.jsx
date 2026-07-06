import React, { useState } from 'react';
import { solarMath } from '../../utils/solarMath';

const PackagePrices = () => {
    // 1. State Management
    const [capacity, setCapacity] = useState(3);
    const [customerType, setCustomerType] = useState('residential'); // residential | commercial
    const [inverterType, setInverterType] = useState('single'); // single | three
    const [margin, setMargin] = useState(20);
    const [gstRate, setGstRate] = useState(5);

    // 2. Constants (Your "Color Math" logic)
    const RATES = {
        panel: customerType === 'residential' ? 27 : 18,
        inverter: inverterType === 'single' ? 6000 : 2500,
        structure: 4.5,
        bos: 2,
        install: 4,
        civil: 1.2,
        metering: 6600,
        wiring: 5,
        transport: 5000
    };

    const capacityWatts = capacity * 1000;

    // 3. Line Item Calculations
    const breakdown = [
        { label: 'Solar Panels', val: RATES.panel * capacityWatts, desc: `₹${RATES.panel}/W` },
        { label: 'Inverter', val: RATES.inverter * capacity, desc: `₹${RATES.inverter}/kWp` },
        { label: 'Mounting Structure', val: RATES.structure * capacityWatts, desc: `₹${RATES.structure}/W` },
        { label: 'Balance of System (BOS)', val: RATES.bos * capacityWatts, desc: `₹${RATES.bos}/W` },
        { label: 'Installation & Commissioning', val: RATES.install * capacityWatts, desc: `₹${RATES.install}/W` },
        { label: 'Civil Work', val: RATES.civil * capacityWatts, desc: `₹${RATES.civil}/W` },
        { label: 'Net Metering Setup', val: RATES.metering, desc: 'Fixed Fee' },
        { label: 'Cabling & Wiring', val: RATES.wiring * capacityWatts, desc: `₹${RATES.wiring}/W` },
        { label: 'Transportation', val: RATES.transport, desc: 'Lump sum' },
    ];

    const subtotal = breakdown.reduce((acc, item) => acc + item.val, 0);
    const profitVal = subtotal * (margin / 100);
    const finalExclGst = subtotal + profitVal;
    const gstVal = finalExclGst * (gstRate / 100);
    const grandTotal = finalExclGst + gstVal;

    return (
        <div className="p-4 lg:p-8 max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* LEFT COLUMN: CONTROLS */}
            <div className="lg:col-span-5 space-y-6">
                <div className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-100 space-y-8">
                    <div>
                        <h1 className="text-2xl font-black text-stone-800 uppercase tracking-tight">Package Configurator</h1>
                        <p className="text-stone-400 text-sm font-medium">Adjust parameters for instant pricing.</p>
                    </div>

                    {/* Capacity Slider */}
                    <div className="space-y-4">
                        <div className="flex justify-between items-end">
                            <label className="text-[10px] font-black text-stone-400 uppercase tracking-widest">System Capacity</label>
                            <span className="text-3xl font-black text-amber-600">{capacity} <small className="text-xs uppercase">kWp</small></span>
                        </div>
                        <input type="range" min="1" max="100" step="0.5" value={capacity} onChange={e => setCapacity(parseFloat(e.target.value))} 
                            className="w-full h-2 bg-stone-100 rounded-lg appearance-none cursor-pointer accent-amber-500" />
                    </div>

                    {/* Toggles */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Client Type</label>
                            <div className="flex bg-stone-100 p-1 rounded-2xl">
                                <button onClick={() => setCustomerType('residential')} className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all ${customerType === 'residential' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400'}`}>RESIDENTIAL</button>
                                <button onClick={() => setCustomerType('commercial')} className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all ${customerType === 'commercial' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400'}`}>COMMERCIAL</button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-[9px] font-black text-stone-400 uppercase tracking-widest">Inverter Phase</label>
                            <div className="flex bg-stone-100 p-1 rounded-2xl">
                                <button onClick={() => setInverterType('single')} className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all ${inverterType === 'single' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400'}`}>1-PHASE</button>
                                <button onClick={() => setInverterType('three')} className={`flex-1 py-2 rounded-xl text-[10px] font-bold transition-all ${inverterType === 'three' ? 'bg-white shadow-sm text-stone-800' : 'text-stone-400'}`}>3-PHASE</button>
                            </div>
                        </div>
                    </div>

                    {/* Margin & GST */}
                    <div className="grid grid-cols-2 gap-4">
                        <div className="p-4 bg-stone-50 rounded-3xl border border-stone-100">
                            <label className="text-[9px] font-black text-stone-400 uppercase block mb-1">Profit Margin %</label>
                            <input type="number" value={margin} onChange={e => setMargin(e.target.value)} className="w-full bg-transparent text-lg font-black text-stone-800 outline-none" />
                        </div>
                        <div className="p-4 bg-stone-50 rounded-3xl border border-stone-100">
                            <label className="text-[9px] font-black text-stone-400 uppercase block mb-1">GST Rate %</label>
                            <input type="number" value={gstRate} onChange={e => setGstRate(e.target.value)} className="w-full bg-transparent text-lg font-black text-stone-800 outline-none" />
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT COLUMN: BREAKDOWN */}
            <div className="lg:col-span-7 space-y-6">
                <div className="bg-stone-900 text-white p-10 rounded-[48px] shadow-2xl shadow-stone-200">
                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-[0.2em] mb-8">Estimated Itemized Costing</p>
                    
                    <div className="space-y-4">
                        {breakdown.map((item, i) => (
                            <div key={i} className="flex justify-between items-center group">
                                <div>
                                    <p className="text-xs font-bold text-white group-hover:text-amber-400 transition-colors">{item.label}</p>
                                    <p className="text-[9px] text-stone-500 uppercase font-medium">{item.desc}</p>
                                </div>
                                <p className="text-sm font-black tracking-tight">{solarMath.formatINR(item.val)}</p>
                            </div>
                        ))}
                    </div>

                    <div className="mt-10 pt-8 border-t border-white/10 space-y-4">
                        <div className="flex justify-between text-stone-500 text-xs font-bold uppercase">
                            <span>Cost Subtotal</span>
                            <span>{solarMath.formatINR(subtotal)}</span>
                        </div>
                        <div className="flex justify-between text-stone-500 text-xs font-bold uppercase">
                            <span>Company Margin ({margin}%)</span>
                            <span>{solarMath.formatINR(profitVal)}</span>
                        </div>
                        <div className="flex justify-between items-end pt-4 border-t-2 border-amber-500">
                            <div>
                                <p className="text-[10px] font-bold text-amber-400 uppercase mb-1">Total (Incl. {gstRate}% GST)</p>
                                <p className="text-5xl font-black tracking-tighter">{solarMath.formatINR(grandTotal)}</p>
                            </div>
                            <div className="text-right text-[10px] text-stone-500 font-bold uppercase italic">
                                Approx. {solarMath.formatINR(grandTotal / capacity)} / kWp
                            </div>
                        </div>
                    </div>
                </div>

                <div className="p-6 bg-amber-50 rounded-3xl border border-amber-100">
                    <p className="text-xs text-amber-800 font-medium leading-relaxed">
                        <strong>Note:</strong> Residential rates use DCR panels (₹27/W). Commercial rates use Non-DCR panels (₹18/W). All cabling and structure costs are scaled per Watt peak.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default PackagePrices;