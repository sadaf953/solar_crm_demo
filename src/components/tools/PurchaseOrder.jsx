import React, { useState } from 'react';
import { solarMath, numberToWords } from '../../utils/solarMath';

const PurchaseOrder = () => {
  // 1. Vendor & PO Metadata
  const [meta, setMeta] = useState({
    poNo: `SFPO-${new Date().getMonth() + 1}${new Date().getFullYear().toString().slice(-2)}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    vendorName: '',
    vendorAddress: '',
    vendorGstin: '',
    deliveryAddress: 'SolarFlow Warehouse, Sector 63, Noida, UP',
    terms: '1. Delivery within 7 working days.\n2. Payment: 50% Advance, 50% on Delivery.\n3. Goods must match technical specs provided.'
  });

  // 2. Dynamic Items (Procurement List)
  const [items, setItems] = useState([
    { id: Date.now(), desc: 'Solar Panels 550Wp', qty: 10, price: 0, gstRate: 12 }
  ]);

  // 3. Logic Handlers
  const addItem = () => setItems([...items, { id: Date.now(), desc: '', qty: 1, price: 0, gstRate: 12 }]);
  const removeItem = (id) => items.length > 1 && setItems(items.filter(item => item.id !== id));
  const updateItem = (id, field, value) => setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));

  // 4. Financial Calculations (Inclusive GST logic as per your JS)
  const totals = items.reduce((acc, item) => {
    const { base, gst } = solarMath.calculateGST(item.price * item.qty, item.gstRate, true);
    return {
      taxable: acc.taxable + base,
      gst: acc.gst + gst,
      grand: acc.grand + (item.price * item.qty)
    };
  }, { taxable: 0, gst: 0, grand: 0 });

  return (
    <div className="p-4 lg:p-8 bg-stone-50 min-h-screen">
      
      {/* FORM SECTION - Hidden on Print */}
      <div className="print:hidden max-w-6xl mx-auto mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 rounded-[40px] shadow-sm border border-stone-100">
                <div className="flex justify-between items-center mb-8">
                    <h1 className="text-2xl font-black text-stone-800 uppercase">Purchase Order</h1>
                    <button onClick={() => window.print()} className="bg-stone-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-stone-800 transition-all">
                        Print PO
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Vendor Details</p>
                        <input type="text" placeholder="Vendor Company Name" className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm" onChange={e => setMeta({...meta, vendorName: e.target.value})} />
                        <input type="text" placeholder="Vendor GSTIN" className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm" onChange={e => setMeta({...meta, vendorGstin: e.target.value})} />
                        <textarea placeholder="Vendor Address" className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm" rows="2" onChange={e => setMeta({...meta, vendorAddress: e.target.value})} />
                    </div>
                    <div className="space-y-3">
                        <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Delivery & Terms</p>
                        <textarea placeholder="Delivery Address" className="w-full p-3 bg-amber-50 text-amber-900 rounded-xl border-none text-sm" rows="2" value={meta.deliveryAddress} onChange={e => setMeta({...meta, deliveryAddress: e.target.value})} />
                        <textarea placeholder="Terms & Conditions" className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm" rows="3" value={meta.terms} onChange={e => setMeta({...meta, terms: e.target.value})} />
                    </div>
                </div>

                {/* Items */}
                <div className="space-y-3">
                    <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Order Items</p>
                    {items.map((item) => (
                        <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-stone-50 p-2 rounded-2xl">
                            <input className="col-span-6 p-2 bg-white rounded-lg text-sm" placeholder="Item Description" value={item.desc} onChange={e => updateItem(item.id, 'desc', e.target.value)} />
                            <input className="col-span-2 p-2 bg-white rounded-lg text-sm text-center" type="number" value={item.qty} onChange={e => updateItem(item.id, 'qty', Number(e.target.value))} />
                            <input className="col-span-3 p-2 bg-white rounded-lg text-sm font-bold" type="number" placeholder="Price (Incl)" value={item.price} onChange={e => updateItem(item.id, 'price', Number(e.target.value))} />
                            <button onClick={() => removeItem(item.id)} className="col-span-1 text-red-400 hover:text-red-600 font-bold">×</button>
                        </div>
                    ))}
                    <button onClick={addItem} className="text-xs font-bold text-amber-600 px-2">+ Add Item</button>
                </div>
            </div>
        </div>

        {/* Live Preview Sidebar (For Desktop form view) */}
        <div className="hidden lg:block bg-stone-900 text-white p-8 rounded-[40px] h-fit sticky top-8">
            <p className="text-[10px] text-amber-400 font-bold uppercase tracking-widest mb-2">Order Value</p>
            <p className="text-4xl font-black">₹{totals.grand.toLocaleString()}</p>
            <div className="mt-8 space-y-4 text-xs opacity-60">
                <div className="flex justify-between"><span>Taxable Base</span><span>₹{Math.round(totals.taxable).toLocaleString()}</span></div>
                <div className="flex justify-between"><span>Total GST</span><span>₹{Math.round(totals.gst).toLocaleString()}</span></div>
            </div>
        </div>
      </div>

      {/* DOCUMENT PREVIEW - A4 PRINT LAYOUT */}
      <div className="bg-white mx-auto w-full max-w-[8.5in] min-h-[11in] shadow-2xl p-[0.75in] text-stone-800 print:shadow-none print:m-0 print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-4 border-stone-900 pb-8 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">PURCHASE ORDER</h1>
            <div className="mt-4 space-y-1">
                <p className="text-sm font-black text-amber-600">SolarFlow Private Limited</p>
                <p className="text-[10px] text-stone-500 font-bold uppercase">GSTIN: 09AAAAA0000A1Z0</p>
            </div>
          </div>
          <div className="text-right border-l-2 border-stone-100 pl-8">
             <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">PO Number</p>
             <p className="text-xl font-black">{meta.poNo}</p>
             <p className="text-xs font-bold mt-2">{meta.date}</p>
          </div>
        </div>

        {/* Address Grid */}
        <div className="grid grid-cols-2 gap-12 mb-10 text-xs">
          <section>
            <h3 className="font-black text-stone-400 uppercase mb-3 tracking-widest border-b pb-1">Vendor:</h3>
            <p className="text-sm font-black uppercase">{meta.vendorName || '[Vendor Name]'}</p>
            <p className="mt-2 text-stone-600 whitespace-pre-wrap leading-relaxed">{meta.vendorAddress || 'Vendor Address Not Provided'}</p>
            {meta.vendorGstin && <p className="mt-2 font-bold">GSTIN: {meta.vendorGstin}</p>}
          </section>
          <section>
            <h3 className="font-black text-stone-400 uppercase mb-3 tracking-widest border-b pb-1">Deliver To:</h3>
            <p className="text-stone-700 font-medium leading-relaxed whitespace-pre-wrap">{meta.deliveryAddress}</p>
          </section>
        </div>

        {/* Table */}
        <table className="w-full text-xs text-left mb-10">
          <thead className="bg-stone-50">
            <tr className="border-b-2 border-stone-900">
              <th className="p-3 font-black uppercase">Description</th>
              <th className="p-3 font-black uppercase text-center w-20">Qty</th>
              <th className="p-3 font-black uppercase text-right">Unit (Taxable)</th>
              <th className="p-3 font-black uppercase text-right">Total (Incl. GST)</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const { base } = solarMath.calculateGST(item.price * item.qty, item.gstRate, true);
              return (
                <tr key={item.id} className="border-b border-stone-100">
                  <td className="p-4 font-bold text-stone-800">{item.desc}</td>
                  <td className="p-4 text-center font-bold text-stone-400">{item.qty}</td>
                  <td className="p-4 text-right">₹{Math.round(base / item.qty).toLocaleString()}</td>
                  <td className="p-4 text-right font-black">₹{(item.price * item.qty).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Summary and Words */}
        <div className="flex justify-between items-start mb-12">
            <div className="flex-1 pr-12">
                <p className="text-[10px] font-bold text-stone-400 uppercase mb-2">Amount in Words</p>
                <p className="text-xs font-black italic border-l-4 border-amber-500 pl-4 leading-relaxed">{numberToWords(totals.grand)}</p>
            </div>
            <div className="w-64 bg-stone-900 text-white p-6 rounded-3xl">
                <div className="flex justify-between text-[10px] opacity-50 uppercase font-bold mb-1"><span>Total Taxable</span><span>₹{Math.round(totals.taxable).toLocaleString()}</span></div>
                <div className="flex justify-between text-[10px] opacity-50 uppercase font-bold mb-4"><span>GST Component</span><span>₹{Math.round(totals.gst).toLocaleString()}</span></div>
                <div className="flex justify-between text-lg font-black border-t border-white/20 pt-4">
                    <span>GRAND TOTAL</span>
                    <span className="text-amber-400 font-black text-xl">₹{totals.grand.toLocaleString()}</span>
                </div>
            </div>
        </div>

        {/* Terms Paragraphs */}
        <div className="mb-16">
            <h4 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Terms & Conditions</h4>
            <div className="text-[10px] text-stone-500 space-y-2 leading-relaxed">
                {meta.terms.split('\n').map((line, i) => (
                    <p key={i}>{line}</p>
                ))}
            </div>
        </div>

        {/* Footer Signatures */}
        <div className="pt-10 border-t border-stone-100 flex justify-between items-end">
            <div className="text-[9px] font-bold text-stone-300 uppercase">
                <p>SolarFlow - Procurement Division</p>
                <p>Generated by System #SF-PO-TOOL</p>
            </div>
            <div className="text-center">
                <div className="w-48 border-b border-stone-300 mb-2"></div>
                <p className="text-[9px] font-bold text-stone-400 uppercase">Authorized Signatory</p>
            </div>
        </div>

      </div>
    </div>
  );
};

export default PurchaseOrder;