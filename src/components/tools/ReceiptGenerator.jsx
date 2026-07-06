import React, { useState } from 'react';
import { solarMath, numberToWords } from '../../utils/solarMath';

const ReceiptGenerator = () => {
  // 1. Metadata State
  const [meta, setMeta] = useState({
    receiptNo: `SFADV-${new Date().getMonth() + 1}${new Date().getFullYear().toString().slice(-2)}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    name: '',
    address: '',
    phone: '',
    prevPayment: 0,
    currentPayment: 0
  });

  // 2. Line Items (Project Components)
  const [items, setItems] = useState([
    { id: Date.now(), desc: 'Solar Power Plant Installation (Project Cost)', qty: 1, price: 0, gstRate: 12 }
  ]);

  // 3. Logic Handlers
  const addItem = () => setItems([...items, { id: Date.now(), desc: '', qty: 1, price: 0, gstRate: 12 }]);
  const removeItem = (id) => items.length > 1 && setItems(items.filter(item => item.id !== id));
  const updateItem = (id, field, value) => setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));

  // 4. Financial Calculations
  const grandTotal = items.reduce((sum, item) => sum + (item.price * item.qty), 0);
  const remainingBalance = grandTotal - (Number(meta.prevPayment) + Number(meta.currentPayment));

  return (
    <div className="p-4 lg:p-8 bg-stone-50 min-h-screen">
      
      {/* FORM SECTION - Hidden on Print */}
      <div className="print:hidden max-w-5xl mx-auto mb-10 bg-white p-8 rounded-[40px] shadow-sm border border-stone-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-stone-800 tracking-tight">Payment Receipt Tool</h1>
          <button onClick={() => window.print()} className="bg-amber-500 text-white px-6 py-2 rounded-xl font-bold shadow-lg shadow-amber-200 hover:bg-amber-600 transition-all">
            Print / Save PDF
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Customer Info</h3>
            <input type="text" placeholder="Customer Name" className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm" onChange={e => setMeta({...meta, name: e.target.value})} />
            <textarea placeholder="Site Address" className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm" rows="2" onChange={e => setMeta({...meta, address: e.target.value})} />
          </div>
          
          <div className="space-y-4">
            <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Payment Tracking (₹)</h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-stone-50 p-3 rounded-xl">
                <label className="text-[9px] font-bold text-stone-400 uppercase">Previously Paid</label>
                <input type="number" className="w-full bg-transparent font-bold text-sm outline-none" value={meta.prevPayment} onChange={e => setMeta({...meta, prevPayment: e.target.value})} />
              </div>
              <div className="bg-amber-50 p-3 rounded-xl border border-amber-100">
                <label className="text-[9px] font-bold text-amber-600 uppercase">Current Installment</label>
                <input type="number" className="w-full bg-transparent font-bold text-sm outline-none text-amber-700" value={meta.currentPayment} onChange={e => setMeta({...meta, currentPayment: e.target.value})} />
              </div>
            </div>
            <div className={`p-4 rounded-xl text-center border-2 border-dashed ${remainingBalance > 0 ? 'bg-stone-50 border-stone-200' : 'bg-emerald-50 border-emerald-200'}`}>
               <p className="text-[10px] font-bold text-stone-400 uppercase">Balance Outstanding</p>
               <p className={`text-xl font-black ${remainingBalance > 0 ? 'text-stone-800' : 'text-emerald-600'}`}>₹{remainingBalance.toLocaleString()}</p>
            </div>
          </div>
        </div>

        {/* Line Items List */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-1">Project Items (For Receipt Calculation)</p>
          {items.map((item) => (
            <div key={item.id} className="flex gap-2 items-center bg-stone-50 p-2 rounded-2xl">
              <input className="flex-1 p-2 bg-white rounded-lg text-sm" placeholder="Description" value={item.desc} onChange={e => updateItem(item.id, 'desc', e.target.value)} />
              <input className="w-16 p-2 bg-white rounded-lg text-sm text-center" type="number" value={item.qty} onChange={e => updateItem(item.id, 'qty', Number(e.target.value))} />
              <input className="w-32 p-2 bg-white rounded-lg text-sm" type="number" placeholder="Price (Incl)" value={item.price} onChange={e => updateItem(item.id, 'price', Number(e.target.value))} />
              <button onClick={() => removeItem(item.id)} className="w-8 text-red-400 hover:text-red-600 font-bold">×</button>
            </div>
          ))}
          <button onClick={addItem} className="text-xs font-bold text-amber-600 hover:underline px-2">+ Add Item</button>
        </div>
      </div>

      {/* RECEIPT DOCUMENT - A4 PRINT LAYOUT */}
      <div className="bg-white mx-auto w-full max-w-[8.5in] min-h-[11in] shadow-2xl p-[0.75in] text-stone-800 print:shadow-none print:m-0 print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-center border-b-4 border-stone-900 pb-8 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter">PAYMENT RECEIPT</h1>
            <p className="text-stone-400 font-bold uppercase text-xs tracking-[0.2em] mt-1">SolarFlow Private Limited</p>
          </div>
          <div className="bg-stone-900 text-white p-6 rounded-[24px] text-right">
             <p className="text-[10px] font-bold opacity-50 uppercase mb-1">Receipt Number</p>
             <p className="text-xl font-black leading-none">{meta.receiptNo}</p>
             <p className="text-[10px] mt-2 opacity-70 font-bold">{meta.date}</p>
          </div>
        </div>

        {/* Customer Details */}
        <div className="grid grid-cols-2 gap-10 mb-10">
          <div>
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-3">Received From</p>
            <h2 className="text-2xl font-black text-stone-800">{meta.name || 'Valued Customer'}</h2>
            <p className="text-xs text-stone-500 mt-2 leading-relaxed whitespace-pre-wrap">{meta.address || 'Site installation address'}</p>
          </div>
          <div className="border-l border-stone-100 pl-10 flex flex-col justify-center">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Payment Status</p>
            <p className="text-3xl font-black text-emerald-600">₹{Number(meta.currentPayment).toLocaleString()}</p>
            <p className="text-[10px] font-bold text-stone-400 uppercase mt-2">Current Installment Only</p>
          </div>
        </div>

        {/* Project Cost Breakdown Table */}
        <div className="mb-10">
          <h3 className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-4">Project Components</h3>
          <table className="w-full text-xs text-left">
            <thead>
              <tr className="border-b-2 border-stone-800">
                <th className="py-3">Description</th>
                <th className="py-3 text-center">Qty</th>
                <th className="py-3 text-right">Amount (Incl. GST)</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item, i) => (
                <tr key={i} className="border-b border-stone-50">
                  <td className="py-4 font-bold">{item.desc}</td>
                  <td className="py-4 text-center">{item.qty}</td>
                  <td className="py-4 text-right">₹{(item.price * item.qty).toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Payment Summary Footer Section */}
        <div className="flex justify-end mb-12">
          <div className="w-72 bg-stone-50 p-6 rounded-3xl border border-stone-100 space-y-3">
            <div className="flex justify-between text-xs">
              <span className="text-stone-400 font-bold uppercase">Total Project Cost</span>
              <span className="font-black">₹{grandTotal.toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs">
              <span className="text-stone-400 font-bold uppercase">Previously Paid</span>
              <span className="font-bold text-stone-600">- ₹{Number(meta.prevPayment).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-xs pt-3 border-t border-stone-200">
              <span className="text-stone-400 font-bold uppercase">Amount Received Now</span>
              <span className="font-black text-emerald-600">₹{Number(meta.currentPayment).toLocaleString()}</span>
            </div>
            <div className="flex justify-between text-sm pt-3 border-t-2 border-stone-800 font-black">
              <span>Remaining Balance</span>
              <span className={remainingBalance > 0 ? 'text-amber-600' : 'text-emerald-600'}>
                ₹{remainingBalance.toLocaleString()}
              </span>
            </div>
          </div>
        </div>

        {/* Certification and Words */}
        <div className="mb-20">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2">Current Payment in Words</p>
          <p className="text-sm font-black italic border-l-4 border-amber-500 pl-4">{numberToWords(meta.currentPayment)}</p>
        </div>

        {/* Authorized Signatory */}
        <div className="flex justify-between items-end pt-10 border-t border-stone-100">
          <div className="text-[9px] text-stone-400 font-bold uppercase">
            <p>Generated by SolarFlow Toolbox</p>
            <p>Professional Solar EPC Solutions</p>
          </div>
          <div className="text-center">
             <div className="w-48 border-b border-stone-300 mb-2"></div>
             <p className="text-[9px] font-bold text-stone-400 uppercase">Authorized Signature</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default ReceiptGenerator;