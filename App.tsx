import React, { useState, useRef } from 'react';
import { Contract, ProcessingStatus } from './types';
import { calculateContractMetrics, formatCurrency } from './utils';
import { PRODUCT_LIST } from './constants';
import { Calculator, Loader2, Plus, Upload, FileText } from 'lucide-react';

const App: React.FC = () => {
  const [contracts, setContracts] = useState<Contract[]>([]);
  const [status, setStatus] = useState<ProcessingStatus>('idle');
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const addEmptyContract = () => {
    const newContract: Contract = {
      id: Math.random().toString(36).substr(2, 9),
      name: `Contract ${contracts.length + 1}`,
      startDate: new Date().toISOString().split('T')[0],
      endDate: new Date().toISOString().split('T')[0],
      lineItems: [
        {
          id: Math.random().toString(36).substr(2, 9),
          productName: "",
          quantity: 1,
          unitPrice: 0
        }
      ]
    };
    setContracts([...contracts, newContract]);
  };

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setStatus('processing');
    setErrorMessage(null);

    try {
      // Skipping Gemini parsing for now
      const data = null; 
      if (!data) throw new Error("Could not extract data.");

    } catch (e: any) {
      console.error(e);
      setErrorMessage(e.message || "Failed to analyze contract. Ensure file is readable.");
      setStatus('error');
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = '';
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  const updateContract = (index: number, updated: Contract) => {
    const newContracts = [...contracts];
    newContracts[index] = updated;
    setContracts(newContracts);
  };

  const deleteContract = (index: number) => {
    const newContracts = contracts.filter((_, i) => i !== index);
    setContracts(newContracts);
  };

  // Grand Totals
  const grandTotalBuyout = contracts.reduce((acc, contract) => {
    return acc + calculateContractMetrics(contract).totalBuyout;
  }, 0);

  return (
    <div className="min-h-screen pb-40 flex flex-col bg-gray-50 font-sans">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200 sticky top-0 z-20">
        <div className="max-w-5xl mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
             <div className="bg-black p-2 rounded-lg text-white">
                <Calculator size={20} />
             </div>
             <div>
                 <h1 className="text-lg font-bold text-gray-900 leading-tight">Contract Buyout</h1>
                 <p className="text-xs text-gray-500">Motive Prospect Calculator</p>
             </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-5xl mx-auto px-4 py-8 w-full flex-grow">
        
        {/* Actions Area */}
        <div className="mb-8 grid grid-cols-1 md:grid-cols-2 gap-4">
            {/* Upload Button */}
            <div className="relative group">
                <input 
                    type="file" 
                    ref={fileInputRef}
                    onChange={handleFileUpload}
                    accept=".pdf, .jpg, .jpeg, .png, .docx, .xlsx, .xls"
                    className="absolute inset-0 w-full h-full opacity-0 cursor-pointer z-10"
                    disabled={status === 'processing'}
                />
                <div className={`
                    h-full border-2 border-dashed rounded-xl p-6 flex flex-col items-center justify-center text-center transition-all cursor-pointer
                    ${status === 'processing' ? 'bg-gray-50 border-gray-300' : 'bg-white border-gray-300 hover:border-black hover:bg-gray-50'}
                    ${status === 'error' ? 'border-red-300 bg-red-50' : ''}
                    ${status === 'success' ? 'border-green-500 bg-green-50' : ''}
                `}>
                    {status === 'processing' ? (
                        <>
                            <Loader2 className="animate-spin text-black mb-2" size={28} />
                            <span className="text-sm font-medium text-gray-600">Analyzing Contract...</span>
                        </>
                    ) : (
                        <>
                            <Upload className="text-gray-400 group-hover:text-black mb-2 transition-colors" size={28} />
                            <span className="text-sm font-bold text-gray-700 group-hover:text-black">Upload Contract</span>
                            <span className="text-xs text-gray-400 mt-1">PDF, Image, Excel, Word</span>
                        </>
                    )}
                </div>
            </div>

            {/* Manual Add Button */}
            <button 
                onClick={addEmptyContract}
                className="h-full bg-white border-2 border-dashed border-gray-300 rounded-xl p-6 flex flex-col items-center justify-center text-center hover:border-black hover:bg-gray-50 transition-all group"
            >
                <Plus className="text-gray-400 group-hover:text-black mb-2 transition-colors" size={28} />
                <span className="text-sm font-bold text-gray-700 group-hover:text-black">Manual Entry</span>
                <span className="text-xs text-gray-400 mt-1">Add details yourself</span>
            </button>
        </div>

        {errorMessage && (
            <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg border border-red-200 text-sm flex items-center gap-2">
                <FileText size={16} />
                {errorMessage}
            </div>
        )}

        {/* Contract List */}
        {contracts.length === 0 ? (
            <div className="text-center py-12">
                <p className="text-gray-400">No contracts added yet. Upload a file or add manually to start.</p>
            </div>
        ) : (
            <div className="space-y-6">
                {contracts.map((contract, index) => (
                    <div key={contract.id} className="border p-4 rounded-lg">
                        <p>{contract.name}</p>
                    </div>
                ))}
            </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-8 border-t border-gray-200 flex flex-col sm:flex-row items-start sm:items-center gap-3">
             <svg width="28" height="24" viewBox="0 0 35 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="text-black">
                 <path d="M10 24L5 0H0L5 24H10Z" fill="currentColor"/>
                 <path d="M19 24L14 0H22L27 24H19Z" fill="currentColor"/>
                 <path d="M30 24L25 0H32.5L35 12L32.5 24H30Z" fill="currentColor"/>
             </svg>
             <span className="text-xs text-gray-400 font-medium">© 2013-2024 Motive Technologies, Inc.</span>
        </div>
      </main>

      {/* Grand Total Sticky Footer */}
      {contracts.length > 0 && (
        <div className="fixed bottom-0 left-0 right-0 bg-black text-white shadow-[0_-4px_12px_rgba(0,0,0,0.2)] z-30">
          <div className="max-w-5xl mx-auto px-6 py-5 flex justify-between items-center">
             <div className="flex flex-col">
                <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">Total Buyout Estimate</span>
                <span className="text-2xl font-bold">{formatCurrency(grandTotalBuyout)}</span>
             </div>
             <button 
                onClick={() => window.print()}
                className="bg-gray-800 hover:bg-gray-700 text-white px-5 py-2.5 rounded-lg font-medium text-sm transition-colors border border-gray-700"
             >
                Export / Print
             </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default App;
