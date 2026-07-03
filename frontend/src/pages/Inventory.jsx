import React, { useState, useEffect } from 'react';
import { ChevronDown } from 'lucide-react';
import axios from 'axios';

export default function Inventory() {
  const [inventoryItems, setInventoryItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchInventory = async () => {
      try {
        const res = await axios.get('http://localhost:3001/api/inventory');
        setInventoryItems(res.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchInventory();
  }, []);

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Current Inventory</h1>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter by</span>
            <button className="flex items-center justify-between gap-8 px-4 py-2 border border-slate-300 rounded-full text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
              All <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sort by</span>
            <button className="flex items-center justify-between gap-8 px-4 py-2 border border-slate-300 rounded-full text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors">
              Most relevant <ChevronDown className="w-4 h-4 text-slate-500" />
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <div className="col-span-full py-12 flex justify-center">
            <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
          </div>
        ) : inventoryItems.length === 0 ? (
          <div className="col-span-full py-16 flex flex-col items-center justify-center text-center">
            <div className="relative w-48 h-48 mb-2">
              <img 
                src="/empty_mascot.png" 
                alt="Empty Inventory Mascot" 
                className="w-full h-full object-contain mix-blend-multiply"
              />
            </div>
            <h3 className="text-lg font-bold text-slate-800">No inventory found</h3>
          </div>
        ) : inventoryItems.map((item) => (
          <div key={item.id} className="group bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] cursor-pointer border border-transparent hover:border-slate-100 flex flex-col h-full">
            <div className={`h-36 rounded-xl w-full mb-4 flex items-center justify-center text-white font-bold text-xl relative overflow-hidden ${item.quantity_available < 5000 ? 'bg-gradient-to-br from-red-500 to-rose-600' :
                item.quantity_available < 15000 ? 'bg-gradient-to-br from-orange-400 to-amber-500' :
                  'bg-gradient-to-br from-blue-500 to-indigo-600'
              }`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <span className="relative z-10 text-center px-4 drop-shadow-md">{item.Batch.Vaccine.name}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">{item.Batch.Vaccine.name}</h3>
              <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
                <span>Batch: {item.Batch.batch_number}</span>
                {item.Batch.Supplier && (
                  <>
                    <span className="text-slate-300 mx-1">|</span>
                    <span className="text-blue-600 hover:underline">{item.Batch.Supplier.name}</span>
                  </>
                )}
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Available stock: <span className="font-medium text-slate-800">{item.quantity_available.toLocaleString()} doses</span>.
                <br />
                Expires: {new Date(item.Batch.expiry_date).toLocaleDateString()}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
