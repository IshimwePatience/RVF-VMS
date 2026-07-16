import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import rabLogo from '../assets/images/RAB_Logo2.png';

const CertificateCard = forwardRef(({ result }, ref) => {
  if (!result) return null;

  // The verification URL that the QR code will point to
  const verificationUrl = `${window.location.origin}${import.meta.env.BASE_URL}verify/${result.id}`;

  const isPositive = result.rvf_pcr_results?.toUpperCase().includes('POSITIVE');

  return (
    <div 
      ref={ref}
      className="bg-white"
      style={{ 
        width: '800px', 
        height: '500px', 
        padding: '32px',
        boxSizing: 'border-box',
        position: 'relative',
        overflow: 'hidden',
        border: '1px solid #e2e8f0',
        borderRadius: '16px'
      }}
    >
      {/* Background Decorative Elements */}
      <div className="absolute top-0 left-0 w-full h-3 bg-gradient-to-r from-blue-600 via-yellow-400 to-green-600" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-50/50 rounded-full opacity-50 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-50/50 rounded-full opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-green-50 to-transparent opacity-50 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10 border-b-2 border-slate-100 pb-6">
        <div className="flex items-center gap-5">
          <img src={rabLogo} alt="RAB Logo" className="h-20 object-contain drop-shadow-sm" />
          <div>
            <h1 className="text-[22px] font-black text-[#1e3a8a] tracking-tight uppercase">
              Republic of Rwanda
            </h1>
            <h2 className="text-[14px] font-bold text-slate-600 uppercase tracking-wide mt-1">
              Ministry of Agriculture and Animal Resources
            </h2>
            <p className="text-sm text-green-700 font-bold uppercase tracking-wide mt-1">
              Rwanda Agriculture and Animal Resources Development Board (RAB)
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-between relative z-10">
        <div className="flex-1 pr-8">
          <h3 className="text-[26px] font-black text-slate-800 mb-6 uppercase tracking-tight text-[#1e3a8a]">
            Certificate for RVF Testing
          </h3>
          
          <div className="grid grid-cols-2 gap-x-6 gap-y-4">
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Farmer Name</p>
              <p className="text-[17px] font-bold text-slate-800">{result.farmer_name || 'N/A'}</p>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Animal ID</p>
              <p className="text-[17px] font-bold text-slate-800">{result.animal_id || 'N/A'}</p>
            </div>
            
            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Specie</p>
              <p className="text-[17px] font-bold text-slate-800">{result.specie || 'N/A'}</p>
            </div>

            <div className="bg-slate-50 p-3 rounded-lg border border-slate-100">
              <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold mb-1">Date Tested</p>
              <p className="text-[17px] font-bold text-slate-800">
                {new Date(result.createdAt).toLocaleDateString('en-GB')}
              </p>
            </div>

            <div className="col-span-2 pt-2">
              <p className="text-[11px] text-slate-500 uppercase tracking-widest font-bold mb-2">PCR Test Result</p>
              <div className={`inline-flex items-center gap-2 px-5 py-2 rounded-xl border ${
                isPositive ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'
              }`}>
                <div className={`w-2.5 h-2.5 rounded-full ${isPositive ? 'bg-red-500' : 'bg-green-500'}`} />
                <span className="text-lg font-black uppercase tracking-widest">
                  {result.rvf_pcr_results?.trim() || 'UNKNOWN'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="w-56 flex flex-col items-center justify-start border-l-2 border-slate-100 pl-8 pt-2">
          <div className="bg-white p-3 rounded-2xl border border-slate-200 shadow-sm mb-4">
            <QRCodeSVG 
              value={verificationUrl} 
              size={140}
              level="H"
              includeMargin={false}
            />
          </div>
          <div className="text-center">
            <p className="text-[10px] text-slate-500 font-semibold leading-relaxed px-2">
              Scan QR code to verify authenticity via Government of Rwanda portal
            </p>
          </div>
          <div className="mt-4 pt-4 border-t-2 border-slate-100 w-full text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold">Certificate ID</p>
            <p className="text-sm font-mono font-bold text-slate-800 mt-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
              RAB-RVF-{result.id?.toString().padStart(6, '0')}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-[#f8fafc] border-t-2 border-slate-100 py-3 px-8 flex justify-between items-center text-[10px] text-slate-500 font-bold uppercase tracking-wider">
        <p>Issued by: <span className="text-slate-700">{result.tested_site || 'RAB Laboratory'}</span></p>
        <p className="flex items-center gap-1.5 text-blue-600">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
          Verified Document
        </p>
        <p className="text-slate-400">{window.location.host}</p>
      </div>
    </div>
  );
});

CertificateCard.displayName = 'CertificateCard';
export default CertificateCard;
