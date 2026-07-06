import React, { useState, useEffect } from 'react';
import { solarMath, numberToWords } from '../../utils/solarMath';

const InvoiceGenerator = () => {
  // 1. Client & Invoice Metadata
  const [meta, setMeta] = useState({
    invoiceNo: `SFINV-${new Date().getMonth()+1}${new Date().getFullYear().toString().slice(-2)}-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    name: '',
    address: '',
    phone: '',
    email: '',
    gstin: ''
  });

  // 2. Line Items State
  const [items, setItems] = useState([
    { id: Date.now(), desc: 'Solar PV Module 550Wp Mono PERC', hsn: '8541', qty: 1, price: 0, gstRate: 12 }
  ]);

  // 3. Actions
  const addItem = () => {
    setItems([...items, { id: Date.now(), desc: '', hsn: '8541', qty: 1, price: 0, gstRate: 12 }]);
  };

  const removeItem = (id) => {
    if (items.length > 1) setItems(items.filter(item => item.id !== id));
  };

  const updateItem = (id, field, value) => {
    setItems(items.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  // 4. Totals Calculation
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
      <div className="print:hidden max-w-5xl mx-auto mb-10 bg-white p-8 rounded-[40px] shadow-sm border border-stone-100">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-black text-stone-800">Tax Invoice Generator</h1>
          <button onClick={() => window.print()} className="bg-stone-900 text-white px-6 py-2 rounded-xl font-bold hover:bg-stone-800 transition-all">
            Print Invoice
          </button>
        </div>

        {/* Client Inputs */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
          <input type="text" placeholder="Client Name" className="p-3 bg-stone-50 rounded-xl border-none text-sm" onChange={e => setMeta({...meta, name: e.target.value})} />
          <input type="text" placeholder="Client GSTIN (Optional)" className="p-3 bg-stone-50 rounded-xl border-none text-sm" onChange={e => setMeta({...meta, gstin: e.target.value})} />
          <textarea placeholder="Billing Address" className="p-3 bg-stone-50 rounded-xl border-none text-sm md:col-span-2" rows="2" onChange={e => setMeta({...meta, address: e.target.value})} />
        </div>

        {/* Dynamic Items List */}
        <div className="space-y-3">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest px-2">Line Items</p>
          {items.map((item) => (
            <div key={item.id} className="grid grid-cols-12 gap-2 items-center bg-stone-50 p-2 rounded-2xl">
              <input className="col-span-5 p-2 bg-white rounded-lg text-sm" placeholder="Description" value={item.desc} onChange={e => updateItem(item.id, 'desc', e.target.value)} />
              <input className="col-span-2 p-2 bg-white rounded-lg text-sm" placeholder="HSN" value={item.hsn} onChange={e => updateItem(item.id, 'hsn', e.target.value)} />
              <input className="col-span-1 p-2 bg-white rounded-lg text-sm text-center" type="number" value={item.qty} onChange={e => updateItem(item.id, 'qty', Number(e.target.value))} />
              <input className="col-span-2 p-2 bg-white rounded-lg text-sm" type="number" placeholder="Price (Incl)" value={item.price} onChange={e => updateItem(item.id, 'price', Number(e.target.value))} />
              <select className="col-span-1 p-2 bg-white rounded-lg text-xs font-bold" value={item.gstRate} onChange={e => updateItem(item.id, 'gstRate', Number(e.target.value))}>
                <option value="5">5%</option>
                <option value="12">12%</option>
                <option value="18">18%</option>
              </select>
              <button onClick={() => removeItem(item.id)} className="col-span-1 text-red-400 hover:text-red-600 font-bold">×</button>
            </div>
          ))}
          <button onClick={addItem} className="px-4 py-2 text-sm font-bold text-amber-600 hover:bg-amber-50 rounded-lg transition-colors">
            + Add New Row
          </button>
        </div>
      </div>

      {/* INVOICE DOCUMENT - A4 Styled */}
      <div className="bg-white mx-auto w-full max-w-[8.5in] min-h-[11in] shadow-2xl p-[0.5in] text-stone-800 print:shadow-none print:m-0 print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-start border-b-2 border-stone-900 pb-6 mb-8">
          <div>
            <h1 className="text-3xl font-black mb-1">TAX INVOICE</h1>
            <p className="text-xs font-bold text-stone-400">Original for Buyer</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-black text-amber-600">SolarFlow Pvt Ltd</h2>
            <p className="text-[10px] text-stone-500 font-medium">GSTIN: 09AAAAA0000A1Z0 | PAN: ABCDE1234F</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-8 mb-8 text-xs">
          <div>
            <p className="font-bold text-stone-400 uppercase mb-2">Billed To:</p>
            <p className="text-sm font-black">{meta.name || 'Customer Name'}</p>
            <p className="mt-1 whitespace-pre-wrap">{meta.address || 'Address not provided'}</p>
            {meta.gstin && <p className="mt-2 font-bold">GSTIN: {meta.gstin}</p>}
          </div>
          <div className="text-right flex flex-col items-end">
            <div className="bg-stone-50 p-4 rounded-xl border border-stone-100">
               <p className="font-bold">Invoice No: <span className="font-black text-stone-900 ml-2">{meta.invoiceNo}</span></p>
               <p className="mt-1 font-bold">Date: <span className="font-black text-stone-900 ml-2">{meta.date}</span></p>
            </div>
          </div>
        </div>

        {/* Items Table */}
        <table className="w-full text-xs text-left border-collapse mb-8">
          <thead>
            <tr className="bg-stone-900 text-white">
              <th className="p-2 border border-stone-900">Description</th>
              <th className="p-2 border border-stone-900 text-center">HSN</th>
              <th className="p-2 border border-stone-900 text-center">Qty</th>
              <th className="p-2 border border-stone-900 text-right">Taxable</th>
              <th className="p-2 border border-stone-900 text-right">Amount</th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, i) => {
              const { base } = solarMath.calculateGST(item.price * item.qty, item.gstRate, true);
              return (
                <tr key={i} className="border-b border-stone-200">
                  <td className="p-2 font-bold">{item.desc}</td>
                  <td className="p-2 text-center text-stone-500">{item.hsn}</td>
                  <td className="p-2 text-center">{item.qty}</td>
                  <td className="p-2 text-right">₹{Math.round(base).toLocaleString()}</td>
                  <td className="p-2 text-right font-bold">₹{(item.price * item.qty).toLocaleString()}</td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {/* Totals Summary */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-2 text-xs">
            <div className="flex justify-between text-stone-500"><span>Taxable Subtotal:</span><span>₹{Math.round(totals.taxable).toLocaleString()}</span></div>
            <div className="flex justify-between text-stone-500"><span>Total GST:</span><span>₹{Math.round(totals.gst).toLocaleString()}</span></div>
            <div className="flex justify-between text-lg font-black border-t-2 border-stone-900 pt-2">
              <span>Grand Total:</span>
              <span className="text-amber-600">₹{totals.grand.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Words and Terms */}
        <div className="border-t border-stone-100 pt-6">
          <p className="text-[10px] font-bold text-stone-400 uppercase mb-1">Amount in Words</p>
          <p className="text-xs font-black italic">{numberToWords(totals.grand)}</p>
          
          <div className="mt-10 grid grid-cols-2 gap-10">
            <div className="text-[9px] text-stone-400 leading-relaxed">
              <p className="font-bold text-stone-600 mb-1 uppercase">Terms & Conditions</p>
              <p>1. Goods once sold will not be taken back.</p>
              <p>2. Interest @18% p.a. will be charged if payment is not made within 15 days.</p>
              <p>3. Subject to Noida Jurisdiction.</p>
            </div>
            <div className="text-center flex flex-col items-center justify-end">
              <div className="w-40 border-b border-stone-300 mb-2"></div>
              <p className="text-[9px] font-bold text-stone-400 uppercase tracking-tighter">Authorised Signatory</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default InvoiceGenerator;