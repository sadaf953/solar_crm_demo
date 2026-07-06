export const solarMath = {
    // 1. GST LOGIC (Spec #3)
    calculateGST: (amount, rate, isInclusive = false) => {
        if (isInclusive) {
            // "Remove GST" Formula: Base = Total / (1 + Rate/100)
            const base = amount / (1 + rate / 100);
            return { base, gst: amount - base, total: amount };
        }
        // "Add GST" Formula
        const gst = (amount * rate) / 100;
        return { base: amount, gst, total: amount + gst };
    },

    // EMI Logic (Newton-Raphson for Rate included)
    calculateEMI: (p, r, n, isFlat = false) => {
        const annualRate = parseFloat(r);
        const monthlyRate = annualRate / 12 / 100;
        
        if (isFlat) {
            const totalInterest = p * (annualRate / 100) * (n / 12);
            const totalPayment = p + totalInterest;
            return { emi: totalPayment / n, totalInterest, totalPayment };
        }
        const emi = (p * monthlyRate * Math.pow(1 + monthlyRate, n)) / (Math.pow(1 + monthlyRate, n) - 1);
        const totalPayment = emi * n;
        return { emi, totalInterest: totalPayment - p, totalPayment };
    },
    calculateTenure: (p, r, targetEmi, isFlat = false) => {
        const monthlyRate = r / 12 / 100;
        if (isFlat) {
            return Math.ceil(p / (targetEmi - (p * monthlyRate)));
        }
        if (targetEmi <= p * monthlyRate) return null; 
        const n = Math.log(targetEmi / (targetEmi - p * monthlyRate)) / Math.log(1 + monthlyRate);
        return Math.ceil(n);
    },

    solveForRate: (p, emi, n) => {
        let r = 0.1 / 12; // Initial guess
        for (let i = 0; i < 100; i++) {
            let t1 = Math.pow(1 + r, n);
            let f = p * r * t1 / (t1 - 1) - emi;
            let f_prime = p * (Math.pow(1 + r, n + 1) - Math.pow(1 + r, n) - r * n * Math.pow(1 + r, n - 1)) / Math.pow(Math.pow(1 + r, n) - 1, 2);
            let new_r = r - f / f_prime;
            if (Math.abs(new_r - r) < 0.0000001) break;
            r = new_r;
        }
        return (r * 12 * 100).toFixed(2);
    },

    // Quote / ROI Logic
    calculateROI: (capacity, cost, tariff, yieldPerKw = 1440) => {
        const annualUnits = capacity * yieldPerKw;
        const year1Savings = annualUnits * tariff;
        const paybackYears = cost / year1Savings;

        // Environmental
        const lifetimeUnits = annualUnits * 25;
        const co2Saved = (lifetimeUnits * 0.82) / 1000; // Tonnes
        const treesEquivalent = Math.round(co2Saved * 45);

        return { annualUnits, year1Savings, paybackYears, co2Saved, treesEquivalent };
    },

    // Currency Formatter
    formatINR: (num) => new Intl.NumberFormat('en-IN', {
        style: 'currency',
        currency: 'INR',
        maximumFractionDigits: 0
    }).format(num)
};


export const numberToWords = (num) => {
    if (num === 0) return 'Zero Rupees Only';
    const ones = ['', 'One', 'Two', 'Three', 'Four', 'Five', 'Six', 'Seven', 'Eight', 'Nine', 'Ten', 'Eleven', 'Twelve', 'Thirteen', 'Fourteen', 'Fifteen', 'Sixteen', 'Seventeen', 'Eighteen', 'Nineteen'];
    const tens = ['', '', 'Twenty', 'Thirty', 'Forty', 'Fifty', 'Sixty', 'Seventy', 'Eighty', 'Ninety'];

    const twoDigits = (n) => (n < 20 ? ones[n] : tens[Math.floor(n / 10)] + (n % 10 ? ' ' + ones[n % 10] : ''));
    const threeDigits = (n) => (n >= 100 ? ones[Math.floor(n / 100)] + ' Hundred' + (n % 100 ? ' and ' + twoDigits(n % 100) : '') : twoDigits(n));

    let result = '', n = Math.round(num);
    if (n >= 10000000) { result += threeDigits(Math.floor(n / 10000000)) + ' Crore '; n %= 10000000; }
    if (n >= 100000) { result += twoDigits(Math.floor(n / 100000)) + ' Lakh '; n %= 100000; }
    if (n >= 1000) { result += twoDigits(Math.floor(n / 1000)) + ' Thousand '; n %= 1000; }
    if (n > 0) result += threeDigits(n);
    return result.trim() + ' Rupees Only';
};