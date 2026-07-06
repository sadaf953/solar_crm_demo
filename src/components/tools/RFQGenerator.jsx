import React, { useState } from 'react';
import { marked } from 'marked';

const RFQGenerator = () => {
  // 1. State for RFQ Details
  const [data, setData] = useState({
    vendorName: '',
    vendorAddress: '',
    vendorPhone: '',
    vendorEmail: '',
    vendorGstin: '',
    heading: 'REQUEST FOR QUOTATION',
    date: new Date().toISOString().split('T')[0],
    rfqNumber: `SFRFQ${new Date().getMonth() + 1}${new Date().getFullYear().toString().slice(-2)}-${Math.floor(100 + Math.random() * 900)}`,
    body: `### Scope of Supply\nPlease provide a competitive quotation for the following solar components:\n\n1. **Solar Panels:** 10 x 545Wp Mono PERC (DCR)\n2. **Inverter:** 1 x 5kW On-Grid String Inverter\n3. **BOS:** Complete DC/AC protection kit\n\n*Terms: Delivery required within 10 days of PO.*`
  });

  // 2. Render Markdown to HTML
  const getParsedHtml = () => {
    try {
      return { __html: marked.parse(data.body) };
    } catch (e) {
      return { __html: data.body.replace(/\n/g, '<br>') };
    }
  };

  return (
    <div className="p-4 lg:p-8 bg-stone-50 min-h-screen">
      
      {/* FORM SECTION - Hidden on Print */}
      <div className="print:hidden max-w-6xl mx-auto mb-10 grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left Column: Vendor & Header Info */}
        <div className="lg:col-span-1 space-y-6">
          <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm space-y-4">
            <div className="flex justify-between items-center">
              <h2 className="text-sm font-black text-stone-800 uppercase">Vendor Details</h2>
              <button onClick={() => window.print()} className="bg-stone-900 text-white p-2 rounded-lg transition-transform active:scale-95">
                <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M6 9V2h12v7"></path><path d="M6 18H4a2 2 0 0 1-2-2v-5a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v5a2 2 0 0 1-2 2h-2"></path><rect x="6" y="14" width="12" height="8"></rect></svg>
              </button>
            </div>
            <input type="text" placeholder="Vendor Name" className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm" onChange={e => setData({...data, vendorName: e.target.value})} />
            <textarea placeholder="Vendor Address" className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm" rows="2" onChange={e => setData({...data, vendorAddress: e.target.value})} />
            <input type="text" placeholder="Vendor GSTIN" className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm" onChange={e => setData({...data, vendorGstin: e.target.value})} />
            
            <hr className="border-stone-100" />
            
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Document Settings</p>
            <input type="text" value={data.heading} className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm font-bold" onChange={e => setData({...data, heading: e.target.value.toUpperCase()})} />
            <input type="text" value={data.rfqNumber} className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm" onChange={e => setData({...data, rfqNumber: e.target.value})} />
          </div>
        </div>

        {/* Right Column: Markdown Editor */}
        <div className="lg:col-span-2">
          <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm h-full flex flex-col">
            <label className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-2 block">RFQ Content (Markdown Supported)</label>
            <textarea 
              className="flex-1 w-full p-4 bg-stone-900 text-amber-400 font-mono text-xs rounded-2xl outline-none focus:ring-4 focus:ring-amber-500/20 resize-none min-h-[400px]"
              value={data.body}
              onChange={e => setData({...data, body: e.target.value})}
            />
            <p className="mt-2 text-[9px] text-stone-400">Use # for Headers, * for Bullets, ** for Bold</p>
          </div>
        </div>
      </div>

      {/* DOCUMENT PREVIEW - A4 PRINT LAYOUT */}
      <div className="bg-white mx-auto w-full max-w-[8.5in] min-h-[11in] shadow-2xl p-[0.75in] text-stone-800 print:shadow-none print:m-0 print:p-0">
        
        {/* Document Header */}
        <div className="flex justify-between items-start border-b-4 border-stone-900 pb-8 mb-10">
          <div>
            <h1 className="text-4xl font-black tracking-tighter leading-none">{data.heading}</h1>
            <p className="text-stone-400 font-bold uppercase text-[10px] tracking-[0.3em] mt-2 italic">SolarFlow Procurement Division</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-black text-amber-600">SolarFlow Pvt Ltd</h2>
            <p className="text-[9px] font-bold text-stone-400">GSTIN: 09AAAAA0000A1Z0</p>
          </div>
        </div>

        {/* Info Grid */}
        <div className="grid grid-cols-2 gap-10 mb-10 border-b border-stone-100 pb-10">
          <section>
            <h3 className="text-[10px] font-black text-stone-300 uppercase mb-3 tracking-widest">To Supplier:</h3>
            <p className="text-lg font-black text-stone-800 uppercase">{data.vendorName || '[Vendor Name]'}</p>
            <p className="text-xs text-stone-500 mt-1 whitespace-pre-wrap leading-relaxed">{data.vendorAddress || 'No address provided'}</p>
            {data.vendorGstin && <p className="mt-2 text-xs font-bold">GST: {data.vendorGstin}</p>}
          </section>
          
          <section className="bg-stone-50 p-6 rounded-2xl flex flex-col justify-center">
            <div className="flex justify-between items-center mb-2">
                <span className="text-[9px] font-black text-stone-400 uppercase">RFQ Number:</span>
                <span className="text-sm font-black">{data.rfqNumber}</span>
            </div>
            <div className="flex justify-between items-center">
                <span className="text-[9px] font-black text-stone-400 uppercase">Date:</span>
                <span className="text-sm font-black">{data.date}</span>
            </div>
          </section>
        </div>

        {/* RENDERED MARKDOWN BODY */}
        <div className="rfq-rendered-content min-h-[5in]">
          <div 
            className="prose prose-stone prose-sm max-w-none 
                       prose-headings:font-black prose-headings:uppercase prose-headings:tracking-tight
                       prose-strong:text-stone-900 prose-p:leading-relaxed"
            dangerouslySetInnerHTML={getParsedHtml()} 
          />
        </div>

        {/* Document Footer */}
        <footer className="mt-20 pt-10 border-t border-stone-200">
           <div className="flex justify-between items-end">
              <div className="text-[9px] text-stone-400 font-bold uppercase space-y-1">
                <p>SolarFlow Private Limited</p>
                <p>Sector 63, Noida, UP - 201301</p>
                <p className="text-stone-300">Generated via SolarFlow CRM Toolbox</p>
              </div>
              <div className="text-center">
                <div className="w-40 border-b border-stone-300 mb-2"></div>
                <p className="text-[9px] font-bold text-stone-400 uppercase">Authorized Signatory</p>
              </div>
           </div>
        </footer>

      </div>
    </div>
  );
};

export default RFQGenerator;