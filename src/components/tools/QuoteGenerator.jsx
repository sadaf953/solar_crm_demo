import React, { useState, useEffect } from 'react';
import { solarMath, numberToWords } from '../../utils/solarMath';

const QuoteGenerator = () => {
    const [data, setData] = useState({
        quoteNo: `SFQ-${new Date().getMonth() + 1}${new Date().getFullYear().toString().slice(-2)}-${Math.floor(1000 + Math.random() * 9000)}`,
        date: new Date().toISOString().split('T')[0],
        customerName: '',
        address: '',
        phone: '',
        capacity: 3,
        type: 'On-Grid',
        totalPrice: 245000,
        gstRate: 5,
        subsidyEligible: true,
        tariff: 7,
        yield: 1440,
        escalation: 5, // 5% yearly increase
    });

    const [bom, setBom] = useState([]);

    // Auto-populate BOM when Capacity or Type changes
    useEffect(() => {
        const panelQty = Math.ceil((data.capacity * 1000) / 550);
        const defaults = data.type === 'Hybrid' 
            ? [
                { item: 'Solar PV Modules (550Wp Mono PERC)', qty: panelQty, make: 'Adani/Waaree' },
                { item: 'Hybrid Inverter (IP65)', qty: 1, make: 'Deye/Solis' },
                { item: 'LiFePO4 Battery Storage 5.12kWh', qty: 1, make: 'Deye/SolarFlow' }
            ]
            : [
                { item: 'Solar PV Modules (550Wp Mono PERC)', qty: panelQty, make: 'Adani/Waaree' },
                { item: 'On-Grid String Inverter', qty: 1, make: 'Growatt/Goodwe' }
            ];
        
        setBom([...defaults, 
            { item: 'Structure (Hot Dip Galvanized)', qty: 1, make: 'JSW/Custom' },
            { item: 'ACDB/DCDB & Protection Kits', qty: 1, make: 'Polycab/Hensel' }
        ]);
    }, [data.type, data.capacity]);

    // Financial Math
    const { base, gst, total } = solarMath.calculateGST(data.totalPrice, data.gstRate, true);
    let subsidy = 0;
    if (data.subsidyEligible) {
        subsidy = data.capacity <= 2 ? 60000 : 78000;
    }
    const netCost = total - subsidy;

    // ROI Math
    const annualUnits = data.capacity * data.yield;
    const year1Savings = annualUnits * data.tariff;
    const payback = netCost / year1Savings;

    // Handler for editing BOM rows
    const updateBom = (index, field, value) => {
        const newBom = [...bom];
        newBom[index][field] = value;
        setBom(newBom);
    };

    return (
        <div className="p-4 lg:p-8 bg-stone-100 min-h-screen font-sans">
            {/* UI CONTROLS - HIDDEN ON PRINT */}
            <div className="print:hidden max-w-6xl mx-auto mb-12 grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-3 bg-white p-8 rounded-[32px] shadow-sm border border-stone-200">
                    <div className="flex justify-between items-center mb-8">
                        <h1 className="text-2xl font-black text-stone-800 uppercase tracking-tight">Quote Engine</h1>
                        <button onClick={() => window.print()} className="bg-amber-500 text-white px-6 py-2 rounded-xl font-bold hover:shadow-lg hover:shadow-amber-200 transition-all">
                            Print Proposal
                        </button>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Project Parameters</h3>
                            <input type="text" placeholder="Customer Name" className="w-full p-3 bg-stone-50 rounded-xl border-none" onChange={e => setData({...data, customerName: e.target.value})} />
                            <div className="flex gap-4">
                                <input type="number" value={data.capacity} className="w-1/2 p-3 bg-stone-50 rounded-xl border-none" onChange={e => setData({...data, capacity: e.target.value})} />
                                <select className="w-1/2 p-3 bg-stone-50 rounded-xl border-none" onChange={e => setData({...data, type: e.target.value})}>
                                    <option value="On-Grid">On-Grid</option>
                                    <option value="Hybrid">Hybrid</option>
                                </select>
                            </div>
                        </div>
                        <div className="space-y-4">
                            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Financials</h3>
                            <input type="number" value={data.totalPrice} className="w-full p-3 bg-amber-50 text-amber-700 font-bold rounded-xl border-none" onChange={e => setData({...data, totalPrice: e.target.value})} />
                            <div className="flex items-center gap-2 p-3 bg-stone-50 rounded-xl">
                                <input type="checkbox" checked={data.subsidyEligible} onChange={e => setData({...data, subsidyEligible: e.target.checked})} />
                                <label className="text-sm font-bold text-stone-600">Apply PM Surya Ghar Subsidy</label>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-[32px] border border-stone-200 shadow-sm">
                    <h3 className="text-[10px] font-bold text-stone-400 uppercase mb-4 tracking-widest">Bill of Materials</h3>
                    <div className="space-y-3 max-h-80 overflow-y-auto pr-2">
                        {bom.map((item, i) => (
                            <div key={i} className="p-3 bg-stone-50 rounded-xl">
                                <input className="w-full bg-transparent text-[10px] font-bold text-stone-800 outline-none" value={item.item} onChange={e => updateBom(i, 'item', e.target.value)} />
                                <div className="flex justify-between mt-1">
                                    <input className="w-1/2 bg-transparent text-[9px] text-stone-400 outline-none" value={item.make} onChange={e => updateBom(i, 'make', e.target.value)} />
                                    <input className="w-12 bg-transparent text-[9px] text-right font-black text-amber-600 outline-none" type="number" value={item.qty} onChange={e => updateBom(i, 'qty', e.target.value)} />
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            {/* DOCUMENT PREVIEW - 5 PAGE A4 STRUCTURE */}
            <div className="bg-white mx-auto shadow-2xl w-full max-w-[8.5in] p-[0.75in] text-stone-800 print:shadow-none print:m-0 print:p-0">
                
                {/* --- PAGE 1: COVER --- */}
                <div className="min-h-[9.5in] flex flex-col justify-between border-b-8 border-amber-500 pb-12 mb-12">
                    <header className="flex justify-between items-start">
                        <div className="w-20 h-20 bg-stone-900 rounded-3xl flex items-center justify-center">
                            <span className="text-white text-3xl font-black">SF</span>
                        </div>
                        <div className="text-right">
                            <h2 className="text-2xl font-black text-stone-900">SOLARFLOW</h2>
                            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Techno-Commercial Proposal</p>
                        </div>
                    </header>

                    <div>
                        <p className="text-amber-500 font-black tracking-[0.3em] uppercase mb-4">Residential Solar</p>
                        <h1 className="text-6xl font-black text-stone-900 leading-none">POWERING<br/>THE FUTURE.</h1>
                        <div className="mt-12 p-8 bg-stone-900 text-white rounded-[40px] inline-block">
                            <p className="text-[10px] opacity-50 uppercase font-bold mb-2">Designed For</p>
                            <h2 className="text-3xl font-black">{data.customerName || 'Value Customer'}</h2>
                            <p className="text-stone-400 mt-2 text-sm max-w-sm">{data.address || 'Address Detail'}</p>
                        </div>
                    </div>

                    <footer className="flex justify-between items-end border-t pt-8 border-stone-100">
                        <div className="text-[10px] font-bold text-stone-400 uppercase">
                            <p>Quote Ref: {data.quoteNo}</p>
                            <p>Date: {data.date}</p>
                        </div>
                        <div className="bg-amber-100 text-amber-700 px-4 py-2 rounded-full font-black text-sm">
                            {data.capacity} kWp {data.type}
                        </div>
                    </footer>
                </div>

                {/* --- PAGE 2: HARDWARE (BOM) --- */}
                <div className="min-h-[10.5in] mb-12 pt-12">
                    <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-10">01. Bill of Materials</h3>
                    <table className="w-full text-sm text-left border-collapse">
                        <thead className="bg-stone-50 text-stone-400">
                            <tr>
                                <th className="p-4 uppercase text-[9px] font-black">Hardware Component</th>
                                <th className="p-4 uppercase text-[9px] font-black text-center">Qty</th>
                                <th className="p-4 uppercase text-[9px] font-black">Brand / Specification</th>
                            </tr>
                        </thead>
                        <tbody>
                            {bom.map((b, i) => (
                                <tr key={i} className="border-b border-stone-100">
                                    <td className="p-4 font-bold text-stone-800">{b.item}</td>
                                    <td className="p-4 text-center font-black text-stone-400">{b.qty}</td>
                                    <td className="p-4 font-medium italic text-stone-500">{b.make}</td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                    <div className="mt-12 grid grid-cols-2 gap-8">
                        <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100">
                            <p className="text-[10px] font-bold text-stone-400 uppercase mb-2">Panel Warranty</p>
                            <p className="text-lg font-black text-stone-800">10Y Product / 25Y Performance</p>
                        </div>
                        <div className="p-6 bg-stone-50 rounded-3xl border border-stone-100">
                            <p className="text-[10px] font-bold text-stone-400 uppercase mb-2">Inverter Warranty</p>
                            <p className="text-lg font-black text-stone-800">5 - 10 Years (Manufacturer)</p>
                        </div>
                    </div>
                </div>

                {/* --- PAGE 3: COMMERCIALS --- */}
                <div className="min-h-[10.5in] pt-12">
                    <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-10">02. Investment Summary</h3>
                    <div className="bg-stone-900 text-white p-12 rounded-[48px] shadow-2xl">
                        <div className="space-y-6">
                            <div className="flex justify-between text-sm opacity-50 font-bold uppercase tracking-widest">
                                <span>System Price (Excl. Tax)</span>
                                <span>₹{Math.round(base).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between text-sm opacity-50 font-bold uppercase tracking-widest">
                                <span>GST ({data.gstRate}%)</span>
                                <span>₹{Math.round(gst).toLocaleString()}</span>
                            </div>
                            <div className="pt-8 border-t border-white/10 flex justify-between items-end">
                                <div>
                                    <p className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-1">Total Project Cost</p>
                                    <p className="text-5xl font-black tracking-tighter">₹{data.totalPrice.toLocaleString()}</p>
                                </div>
                            </div>
                            {subsidy > 0 && (
                                <div className="p-6 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex justify-between items-center text-emerald-400">
                                    <div>
                                        <p className="text-[10px] font-bold uppercase">Estimated Subsidy</p>
                                        <p className="text-xs font-medium">PM Surya Ghar Yojana</p>
                                    </div>
                                    <p className="text-2xl font-black">- ₹{subsidy.toLocaleString()}</p>
                                </div>
                            )}
                            <div className="pt-8 border-t border-white/10 flex justify-between">
                                <span className="text-lg font-bold">NET INVESTMENT</span>
                                <span className="text-3xl font-black text-amber-400">₹{netCost.toLocaleString()}</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-8 px-4">
                        <p className="text-[10px] font-bold text-stone-400 uppercase italic">
                            {numberToWords(data.totalPrice)}
                        </p>
                    </div>
                </div>

                {/* --- PAGE 4: ROI & IMPACT (Merged Logic) --- */}
                <div className="min-h-[10.5in] pt-12 border-t border-stone-100">
                    <h3 className="text-xs font-bold text-amber-600 uppercase tracking-widest mb-10">03. Returns & Impact</h3>
                    <div className="grid grid-cols-2 gap-8 mb-12">
                        <div className="p-8 bg-stone-50 rounded-[40px]">
                            <p className="text-[10px] font-bold text-stone-400 uppercase mb-2">Year 1 Generation</p>
                            <p className="text-4xl font-black text-stone-900">{annualUnits.toLocaleString()} <span className="text-sm">Units</span></p>
                            <p className="text-xs text-stone-400 mt-2 font-medium">Estimated @ {data.yield} units/kWp</p>
                        </div>
                        <div className="p-8 bg-amber-500 rounded-[40px] text-white shadow-xl shadow-amber-100">
                            <p className="text-[10px] font-bold opacity-70 uppercase mb-2">Estimated Payback</p>
                            <p className="text-4xl font-black">{payback.toFixed(1)} <span className="text-sm">Years</span></p>
                            <p className="text-xs opacity-70 mt-2 font-medium">Net of Subsidy</p>
                        </div>
                    </div>

                    <div className="bg-stone-900 p-10 rounded-[40px] text-white">
                        <h4 className="text-[10px] font-bold text-amber-400 uppercase tracking-widest mb-8 text-center">25-Year Cumulative Savings</h4>
                        <div className="grid grid-cols-4 gap-4 text-center">
                            <div><p className="text-[10px] opacity-50 mb-1">Year 1</p><p className="font-bold">₹{Math.round(year1Savings).toLocaleString()}</p></div>
                            <div><p className="text-[10px] opacity-50 mb-1">Year 5</p><p className="font-bold">₹{Math.round(year1Savings * 5.5).toLocaleString()}</p></div>
                            <div><p className="text-[10px] opacity-50 mb-1">Year 10</p><p className="font-bold">₹{Math.round(year1Savings * 12).toLocaleString()}</p></div>
                            <div><p className="text-[10px] opacity-50 mb-1">Year 25</p><p className="text-2xl font-black text-emerald-400">₹{Math.round(year1Savings * 45).toLocaleString()}</p></div>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};

export default QuoteGenerator;