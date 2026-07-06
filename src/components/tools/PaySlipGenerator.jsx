import React, { useState } from 'react';
import { solarMath, numberToWords } from '../../utils/solarMath';

const PaySlipGenerator = () => {
  // 1. Employee & Metadata State
  const [employee, setEmployee] = useState({
    name: '', id: '', designation: '', dept: '',
    joiningDate: '', bankAcc: '', ifsc: '', pan: '',
    payslipNo: `SFPAY-${Math.floor(1000 + Math.random() * 9000)}`,
    date: new Date().toISOString().split('T')[0],
    period: ''
  });

  // 2. Dynamic Earnings & Deductions
  const [earnings, setEarnings] = useState([
    { id: 1, desc: 'Basic Salary', amount: 0, isFixed: true },
    { id: 2, desc: 'Commission', amount: 0, isFixed: true }
  ]);

  const [deductions, setDeductions] = useState([
    { id: 1, desc: 'Professional Tax', amount: 0 }
  ]);

  // 3. Handlers
  const addEntry = (type) => {
    const newItem = { id: Date.now(), desc: '', amount: 0 };
    if (type === 'earning') setEarnings([...earnings, newItem]);
    else setDeductions([...deductions, newItem]);
  };

  const removeEntry = (type, id) => {
    if (type === 'earning') setEarnings(earnings.filter(e => e.id !== id));
    else setDeductions(deductions.filter(d => d.id !== id));
  };

  const updateEntry = (type, id, field, val) => {
    const list = type === 'earning' ? earnings : deductions;
    const setter = type === 'earning' ? setEarnings : setDeductions;
    setter(list.map(item => item.id === id ? { ...item, [field]: val } : item));
  };

  // 4. Totals Logic
  const totalEarnings = earnings.reduce((sum, item) => sum + Number(item.amount), 0);
  const totalDeductions = deductions.reduce((sum, item) => sum + Number(item.amount), 0);
  const netPay = totalEarnings - totalDeductions;

  return (
    <div className="p-4 lg:p-8 bg-stone-50 min-h-screen">
      
      {/* FORM SECTION - Hidden on Print */}
      <div className="print:hidden max-w-6xl mx-auto mb-10 space-y-6">
        <div className="flex justify-between items-center">
          <h1 className="text-2xl font-black text-stone-800">PaySlip Generator</h1>
          <button onClick={() => window.print()} className="bg-stone-900 text-white px-8 py-3 rounded-2xl font-bold shadow-lg shadow-stone-200">
            Print Payslip
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Employee Info Card */}
          <div className="lg:col-span-1 bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm space-y-4">
            <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest">Employee Profile</p>
            <input type="text" placeholder="Employee Name" className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm" onChange={e => setEmployee({...employee, name: e.target.value})} />
            <input type="text" placeholder="Designation" className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm" onChange={e => setEmployee({...employee, designation: e.target.value})} />
            <input type="text" placeholder="Staff ID" className="w-full p-3 bg-stone-50 rounded-xl border-none text-sm" onChange={e => setEmployee({...employee, id: e.target.value})} />
            <div className="grid grid-cols-2 gap-2">
                <input type="text" placeholder="Bank Acc" className="p-3 bg-stone-50 rounded-xl border-none text-xs" onChange={e => setEmployee({...employee, bankAcc: e.target.value})} />
                <input type="text" placeholder="IFSC" className="p-3 bg-stone-50 rounded-xl border-none text-xs" onChange={e => setEmployee({...employee, ifsc: e.target.value})} />
            </div>
            <input type="text" placeholder="Pay Period (e.g. June 2026)" className="w-full p-3 bg-amber-50 text-amber-700 rounded-xl border-none text-sm font-bold" onChange={e => setEmployee({...employee, period: e.target.value})} />
          </div>

          {/* Earnings & Deductions Management */}
          <div className="lg:col-span-2 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Earnings */}
            <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm space-y-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-bold text-emerald-600 uppercase tracking-widest">Earnings (₹)</p>
                <button onClick={() => addEntry('earning')} className="text-xs font-bold text-stone-400 hover:text-stone-800">+ Add</button>
              </div>
              {earnings.map((e, idx) => (
                <div key={e.id} className="flex gap-2 items-center">
                  <input className="flex-1 p-2 bg-stone-50 rounded-lg text-xs" placeholder="Desc" value={e.desc} readOnly={e.isFixed} onChange={el => updateEntry('earning', e.id, 'desc', el.target.value)} />
                  <input className="w-24 p-2 bg-stone-50 rounded-lg text-xs font-bold" type="number" placeholder="Amt" onChange={el => updateEntry('earning', e.id, 'amount', el.target.value)} />
                  {!e.isFixed && <button onClick={() => removeEntry('earning', e.id)} className="text-red-300 px-1">×</button>}
                </div>
              ))}
            </div>

            {/* Deductions */}
            <div className="bg-white p-6 rounded-[32px] border border-stone-100 shadow-sm space-y-3">
              <div className="flex justify-between items-center mb-2">
                <p className="text-[10px] font-bold text-red-500 uppercase tracking-widest">Deductions (₹)</p>
                <button onClick={() => addEntry('deduction')} className="text-xs font-bold text-stone-400 hover:text-stone-800">+ Add</button>
              </div>
              {deductions.map((d) => (
                <div key={d.id} className="flex gap-2 items-center">
                  <input className="flex-1 p-2 bg-stone-50 rounded-lg text-xs" placeholder="Desc" value={d.desc} onChange={el => updateEntry('deduction', d.id, 'desc', el.target.value)} />
                  <input className="w-24 p-2 bg-stone-50 rounded-lg text-xs font-bold text-red-500" type="number" placeholder="Amt" onChange={el => updateEntry('deduction', d.id, 'amount', el.target.value)} />
                  <button onClick={() => removeEntry('deduction', d.id)} className="text-red-300 px-1">×</button>
                </div>
              ))}
              <div className="mt-4 pt-4 border-t border-stone-100">
                <p className="text-xs font-bold text-stone-400 uppercase">Net Take Home</p>
                <p className="text-2xl font-black text-amber-600">₹{netPay.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* PAYSLIP DOCUMENT - A4 PRINT LAYOUT */}
      <div className="bg-white mx-auto w-full max-w-[8.5in] min-h-[11in] shadow-2xl p-[0.75in] text-stone-800 print:shadow-none print:m-0 print:p-0">
        
        {/* Header */}
        <div className="flex justify-between items-end border-b-2 border-stone-900 pb-6 mb-10">
          <div>
            <h1 className="text-3xl font-black">SALARY SLIP</h1>
            <p className="text-stone-400 font-bold uppercase text-[10px] tracking-[0.2em]">{employee.period || 'Pay Period Not Specified'}</p>
          </div>
          <div className="text-right">
            <h2 className="text-xl font-black text-stone-900 leading-none">SolarFlow Pvt Ltd</h2>
            <p className="text-[9px] font-bold text-stone-400 mt-1 uppercase">Administrative & Operations HQ</p>
          </div>
        </div>

        {/* Employee Info Grid */}
        <div className="grid grid-cols-2 gap-x-12 gap-y-4 mb-10 text-[11px]">
          <div className="flex justify-between border-b border-stone-100 pb-1"><span className="text-stone-400 font-bold uppercase">Employee Name</span><span className="font-black text-right">{employee.name || '---'}</span></div>
          <div className="flex justify-between border-b border-stone-100 pb-1"><span className="text-stone-400 font-bold uppercase">Staff ID</span><span className="font-black text-right">{employee.id || '---'}</span></div>
          <div className="flex justify-between border-b border-stone-100 pb-1"><span className="text-stone-400 font-bold uppercase">Designation</span><span className="font-black text-right">{employee.designation || '---'}</span></div>
          <div className="flex justify-between border-b border-stone-100 pb-1"><span className="text-stone-400 font-bold uppercase">Bank Account</span><span className="font-black text-right">{employee.bankAcc || '---'}</span></div>
          <div className="flex justify-between border-b border-stone-100 pb-1"><span className="text-stone-400 font-bold uppercase">Payslip No</span><span className="font-black text-right">{employee.payslipNo}</span></div>
          <div className="flex justify-between border-b border-stone-100 pb-1"><span className="text-stone-400 font-bold uppercase">Issue Date</span><span className="font-black text-right">{employee.date}</span></div>
        </div>

        {/* Earnings & Deductions Tables */}
        <div className="grid grid-cols-2 gap-0 border border-stone-900 mb-10">
          {/* Left Column: Earnings */}
          <div className="border-r border-stone-900">
            <div className="bg-stone-900 text-white text-[10px] font-bold uppercase p-2 tracking-widest text-center">Earnings</div>
            <table className="w-full text-[11px]">
              <tbody>
                {earnings.map(e => (
                  <tr key={e.id} className="border-b border-stone-100">
                    <td className="p-3">{e.desc}</td>
                    <td className="p-3 text-right font-bold">₹{Number(e.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {/* Right Column: Deductions */}
          <div>
            <div className="bg-stone-900 text-white text-[10px] font-bold uppercase p-2 tracking-widest text-center">Deductions</div>
            <table className="w-full text-[11px]">
              <tbody>
                {deductions.map(d => (
                  <tr key={d.id} className="border-b border-stone-100">
                    <td className="p-3">{d.desc}</td>
                    <td className="p-3 text-right font-bold text-red-600">₹{Number(d.amount).toLocaleString()}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Summary Footer Section */}
        <div className="flex justify-end mb-12">
          <div className="w-80 space-y-2 border-2 border-stone-900 p-6 rounded-3xl">
            <div className="flex justify-between text-xs"><span className="text-stone-400 font-bold uppercase">Total Earnings</span><span className="font-bold">₹{totalEarnings.toLocaleString()}</span></div>
            <div className="flex justify-between text-xs"><span className="text-stone-400 font-bold uppercase">Total Deductions</span><span className="font-bold">- ₹{totalDeductions.toLocaleString()}</span></div>
            <div className="flex justify-between text-xl font-black border-t-2 border-stone-900 pt-3 mt-2">
              <span>NET PAYABLE</span>
              <span className="text-amber-600 font-black">₹{netPay.toLocaleString()}</span>
            </div>
          </div>
        </div>

        {/* Amount in Words */}
        <div className="mb-16">
          <p className="text-[10px] font-bold text-stone-400 uppercase tracking-widest mb-1">Net Salary in Words</p>
          <p className="text-sm font-black italic border-l-4 border-stone-900 pl-4">{numberToWords(netPay)}</p>
        </div>

        {/* Verification and Signatures */}
        <div className="flex justify-between items-center pt-10 border-t border-stone-100 text-[9px] text-stone-400 font-bold uppercase">
          <div className="max-w-xs">
            <p>Certified that this is a system-generated document and the salary has been credited to the employee's bank account.</p>
            <p className="mt-2">SolarFlow Private Limited | Employee Care</p>
          </div>
          <div className="text-center">
            <div className="h-10 w-40 border-b border-stone-300 mb-2"></div>
            <p>Authorized Signature</p>
          </div>
        </div>

      </div>
    </div>
  );
};

export default PaySlipGenerator;