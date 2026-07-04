import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';
import Dropdown from '../components/Dropdown';

export default function Dashboard() {
  const inventoryItems = [
    { id: 1, name: 'RVF Live Attenuated (Smithburn)', supplier: 'BioPharma Inc.', stock: '12,500', status: 'In Stock', rating: '4.8' },
    { id: 2, name: 'RVF Inactivated Vaccine', supplier: 'GlobalVet Solutions', stock: '8,200', status: 'Low Stock', rating: '4.5' },
    { id: 3, name: 'Clone 13 (Live Attenuated)', supplier: 'African Vet Labs', stock: '24,000', status: 'In Stock', rating: '4.9' },
    { id: 4, name: 'Recombinant MP-12', supplier: 'TechVac', stock: '1,500', status: 'Critical', rating: '4.7' },
    { id: 5, name: 'RVF Adjuvanted Vaccine', supplier: 'BioPharma Inc.', stock: '9,800', status: 'In Stock', rating: '4.6' },
    { id: 6, name: 'Emergency Stock (Central)', supplier: 'WHO Hub', stock: '50,000', status: 'Reserved', rating: '5.0' },
  ];

  const [filterBy, setFilterBy] = useState('All');
  const [sortBy, setSortBy] = useState('Most relevant');

  return (
    <div className="max-w-[1200px] mx-auto pb-12">
      <div className="flex items-center justify-between mb-8">
        <h1 className="text-2xl font-bold text-slate-900">Current Inventory</h1>
        
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Filter by</span>
            <Dropdown 
              value={filterBy} 
              options={['All', 'In Stock', 'Critical']} 
              onChange={setFilterBy} 
            />
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-slate-500 font-medium">Sort by</span>
            <Dropdown 
              value={sortBy} 
              options={['Most relevant', 'Name A-Z']} 
              onChange={setSortBy} 
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {inventoryItems.map((item) => (
          <div key={item.id} className="group bg-white rounded-2xl p-4 transition-all duration-300 hover:shadow-[0_4px_20px_-4px_rgba(0,0,0,0.1)] cursor-pointer border border-transparent hover:border-slate-100 flex flex-col h-full">
            <div className={`h-36 rounded-xl w-full mb-4 flex items-center justify-center text-white font-bold text-xl relative overflow-hidden ${
              item.status === 'Critical' ? 'bg-gradient-to-br from-red-500 to-rose-600' :
              item.status === 'Low Stock' ? 'bg-gradient-to-br from-orange-400 to-amber-500' :
              'bg-gradient-to-br from-blue-500 to-indigo-600'
            }`}>
              <div className="absolute inset-0 bg-black/10"></div>
              <span className="relative z-10 text-center px-4 drop-shadow-md">{item.name}</span>
            </div>
            <div className="flex-1">
              <h3 className="font-semibold text-slate-900 mb-1">{item.name}</h3>
              <div className="flex items-center gap-1 text-sm text-slate-600 mb-2">
                <span>{item.rating}</span>
                <span className="text-slate-400">★</span>
                <span className="text-slate-300 mx-1">|</span>
                <span className="text-blue-600 hover:underline">{item.supplier}</span>
              </div>
              <p className="text-sm text-slate-500 leading-relaxed">
                Available stock: <span className="font-medium text-slate-800">{item.stock} doses</span>. Currently marked as {item.status.toLowerCase()}.
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

