import React, { useState } from 'react';

const WarrantyGenerator = () => {
    // 1. Form State
    const [data, setData] = useState({
        projectId: 'SF-2025-0001',
        customerName: '',
        address: '',
        phone: '',
        installDate: new Date().toISOString().split('T')[0],
        specs: '5 kWp On-Grid Solar Power Plant',
        moduleBrand: 'Adani 550Wp Mono PERC',
        moduleProductWarranty: 10,
        performanceWarranty: 30,
        moduleSerials: '',
        inverterName: 'Growatt 5kW On-Grid Inverter',
        inverterWarranty: 5,
        inverterSerials: '',
        dcrCertificate: ''
    });

    // 2. Helper Logic
    const formatDate = (dateStr) => {
        return new Date(dateStr).toLocaleDateString('en-GB', {
            day: '2-digit', month: 'long', year: 'numeric'
        });
    };

    const calculateExpiry = (years) => {
        const date = new Date(data.installDate);
        date.setFullYear(date.getFullYear() + parseInt(years || 0));
        return formatDate(date);
    };

    const parseSerials = (text) => {
        if (!text) return [];
        return text.split(/[\n,]+/).map(s => s.trim()).filter(s => s !== '');
    };

    // 3. Reusable Page Component (Internal)
    const PageWrapper = ({ children, pageNum, projId }) => (
        <div className="bg-white mx-auto w-full max-w-[8.5in] min-h-[11in] p-[0.75in] mb-12 shadow-2xl relative flex flex-col text-stone-800 print:shadow-none print:m-0 print:border-none">
            {children}
            {/* Page Footer */}
            <div className="mt-auto pt-8 border-t border-stone-100 flex justify-between items-end text-[9px] font-bold text-stone-400 uppercase tracking-widest">
                <span>Project: {projId}</span>
                <span>Page {pageNum} of 4</span>
            </div>
        </div>
    );

    return (
        <div className="p-4 lg:p-8 bg-stone-50 min-h-screen">
            {/* UI CONTROLS - Hidden on Print */}
            <div className="print:hidden max-w-6xl mx-auto mb-10 bg-white p-8 rounded-[40px] shadow-sm border border-stone-100">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-black text-stone-800 uppercase tracking-tight">Warranty Engine</h1>
                    <button onClick={() => window.print()} className="bg-amber-500 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-amber-200">
                        Print Certificate (4 Pages)
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Customer & Project</h3>
                        <input type="text" placeholder="Project ID" className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm" value={data.projectId} onChange={e => setData({ ...data, projectId: e.target.value })} />
                        <input type="text" placeholder="Customer Name" className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm" onChange={e => setData({ ...data, customerName: e.target.value })} />
                        <textarea placeholder="Site Address" className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm" rows="2" onChange={e => setData({ ...data, address: e.target.value })} />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="date" value={data.installDate} className="p-3 bg-stone-50 rounded-xl border-none text-sm" onChange={e => setData({ ...data, installDate: e.target.value })} />
                            <input type="text" placeholder="DCR Cert #" className="p-3 bg-stone-50 rounded-xl border-none text-sm" onChange={e => setData({ ...data, dcrCertificate: e.target.value })} />
                        </div>
                    </div>

                    <div className="space-y-4">
                        <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Hardware & Serials</h3>
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Module Brand" className="p-3 bg-stone-50 rounded-xl border-none text-sm" value={data.moduleBrand} onChange={e => setData({ ...data, moduleBrand: e.target.value })} />
                            <input type="number" placeholder="Performance Yrs" className="p-3 bg-stone-50 rounded-xl border-none text-sm" value={data.performanceWarranty} onChange={e => setData({ ...data, performanceWarranty: e.target.value })} />
                        </div>
                        <textarea placeholder="Module Serials (Paste list here...)" className="w-full p-3 bg-stone-900 text-amber-400 font-mono text-[10px] rounded-xl border-none" rows="2" onChange={e => setData({ ...data, moduleSerials: e.target.value })} />
                        <div className="grid grid-cols-2 gap-4">
                            <input type="text" placeholder="Inverter Name" className="p-3 bg-stone-50 rounded-xl border-none text-sm" value={data.inverterName} onChange={e => setData({ ...data, inverterName: e.target.value })} />
                            <input type="number" placeholder="Inv. Warranty Yrs" className="p-3 bg-stone-50 rounded-xl border-none text-sm" value={data.inverterWarranty} onChange={e => setData({ ...data, inverterWarranty: e.target.value })} />
                        </div>
                        <textarea placeholder="Inverter Serials..." className="w-full p-3 bg-stone-900 text-amber-400 font-mono text-[10px] rounded-xl border-none" rows="2" onChange={e => setData({ ...data, inverterSerials: e.target.value })} />
                    </div>
                </div>
            </div>

            {/* DOCUMENT PREVIEW */}
            <div id="warranty-print-area">

                {/* PAGE 1: COVER & DETAILS */}
                <PageWrapper pageNum={1} projId={data.projectId}>
                    <div className="flex justify-between items-start border-b-8 border-amber-500 pb-10 mb-12">
                        <div>
                            <h1 className="text-5xl font-black text-stone-900 leading-none">WARRANTY<br />CERTIFICATE</h1>
                            <p className="text-stone-400 font-bold tracking-[0.3em] uppercase mt-4">Solar Power Installation</p>
                        </div>
                        <div className="text-right">
                            <div className="bg-stone-900 text-white p-4 rounded-2xl mb-4">
                                <p className="text-[10px] opacity-50 uppercase font-bold">Issue Date</p>
                                <p className="font-black text-sm">{formatDate(data.installDate)}</p>
                            </div>
                        </div>
                    </div>

                    <div className="grid grid-cols-2 gap-12 mb-12">
                        <section>
                            <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4">Customer Details</h3>
                            <p className="text-xl font-black">{data.customerName || '---'}</p>
                            <p className="text-xs text-stone-500 mt-2 leading-relaxed whitespace-pre-wrap">{data.address || 'Address not provided'}</p>
                        </section>
                        <section>
                            <h3 className="text-[10px] font-black text-amber-600 uppercase tracking-widest mb-4">System Specifications</h3>
                            <div className="space-y-2 text-xs">
                                <div className="flex justify-between border-b pb-1"><span>Capacity</span><span className="font-bold">{data.specs}</span></div>
                                <div className="flex justify-between border-b pb-1"><span>PV Modules</span><span className="font-bold">{data.moduleBrand}</span></div>
                                <div className="flex justify-between border-b pb-1"><span>Inverter</span><span className="font-bold">{data.inverterName}</span></div>
                            </div>
                        </section>
                    </div>

                    <div className="bg-stone-50 p-8 rounded-[40px] border border-stone-100 flex-1">
                        <h4 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">About SolarFlow</h4>
                        <p className="text-xs text-stone-600 leading-loose text-justify">
                            SolarFlow Private Limited is committed to delivering high-quality, reliable solar energy solutions.
                            This certificate guarantees that the installed components meet rigorous performance standards
                            and are backed by manufacturer product warranties as itemized in the following pages.
                        </p>
                    </div>
                </PageWrapper>

                {/* PAGE 2: MODULE WARRANTY */}
                <PageWrapper pageNum={2} projId={data.projectId}>
                    <h2 className="text-2xl font-black text-stone-900 mb-8 border-b-2 border-stone-900 pb-4">Solar Module Warranty</h2>
                    <div className="bg-amber-500 text-white p-8 rounded-3xl mb-8 flex justify-between items-center shadow-xl shadow-amber-100">
                        <div>
                            <p className="text-[10px] font-bold uppercase opacity-70">Performance Coverage</p>
                            <p className="text-3xl font-black">{data.performanceWarranty} Years</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase opacity-70">Valid Until</p>
                            <p className="text-xl font-black">{calculateExpiry(data.performanceWarranty)}</p>
                        </div>
                    </div>

                    <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Installed Serial Numbers</h3>
                    <div className="grid grid-cols-3 gap-2">
                        {parseSerials(data.moduleSerials).map((sn, i) => (
                            <div key={i} className="bg-stone-50 p-2 text-[10px] font-bold text-stone-800 border rounded-lg text-center">{sn}</div>
                        ))}
                        {parseSerials(data.moduleSerials).length === 0 && <p className="text-xs italic text-stone-400 col-span-3">No serial numbers recorded.</p>}
                    </div>
                </PageWrapper>

                {/* PAGE 3: INVERTER WARRANTY */}
                <PageWrapper pageNum={3} projId={data.projectId}>
                    <h2 className="text-2xl font-black text-stone-900 mb-8 border-b-2 border-stone-900 pb-4">Inverter Warranty Certificate</h2>
                    <div className="bg-stone-900 text-white p-8 rounded-3xl mb-8 flex justify-between items-center">
                        <div>
                            <p className="text-[10px] font-bold uppercase opacity-50">Manufacturer Warranty</p>
                            <p className="text-3xl font-black text-amber-400">{data.inverterWarranty} Years</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] font-bold uppercase opacity-50">Equipment Model</p>
                            <p className="text-lg font-black">{data.inverterName}</p>
                        </div>
                    </div>

                    <h3 className="text-[10px] font-black text-stone-400 uppercase tracking-widest mb-4">Inverter Serial Numbers</h3>
                    <div className="grid grid-cols-2 gap-4">
                        {parseSerials(data.inverterSerials).map((sn, i) => (
                            <div key={i} className="bg-stone-50 p-3 text-xs font-black text-stone-900 border-l-4 border-amber-500 rounded-lg">{sn}</div>
                        ))}
                    </div>
                </PageWrapper>

                {/* PAGE 4: GENERAL TERMS */}
                <PageWrapper pageNum={4} projId={data.projectId}>
                    <h2 className="text-2xl font-black text-stone-900 mb-8 border-b-2 border-stone-900 pb-4">General Terms & Conditions</h2>
                    <div className="p-6 bg-emerald-50 border border-emerald-100 rounded-2xl mb-8">
                        <p className="text-[10px] font-black text-emerald-700 uppercase mb-1 tracking-widest">DCR Certificate Reference</p>
                        <p className="text-lg font-black text-emerald-900">{data.dcrCertificate || 'DCR-NOT-SPECIFIED'}</p>
                    </div>

                    <div className="text-[11px] text-stone-600 space-y-6 leading-relaxed flex-1">
                        <section>
                            <h4 className="font-black text-stone-900 uppercase">1. Workmanship Warranty</h4>
                            <p>A standard 5-year workmanship warranty is provided by SolarFlow starting from the date of installation.</p>
                        </section>
                        <section>
                            <h4 className="font-black text-stone-900 uppercase">2. Claim Procedure</h4>
                            <p>All warranty claims must be reported to SolarFlow support within 7 days of identifying the defect. Original purchase documents must be presented.</p>
                        </section>
                    </div>

                    <div className="mt-20 flex justify-between items-end border-t pt-10 border-stone-100">
                        <div className="text-[9px] font-bold text-stone-400 uppercase">
                            <p>SolarFlow Private Limited</p>
                            <p>System Generated: #WARR-{data.projectId}</p>
                        </div>
                        <div className="text-center">
                            <div className="w-48 border-b border-stone-300 mb-2 h-12"></div>
                            <p className="text-[9px] font-bold text-stone-400 uppercase">Authorized Signatory</p>
                        </div>
                    </div>
                </PageWrapper>

            </div>
        </div>
    );
};

export default WarrantyGenerator;