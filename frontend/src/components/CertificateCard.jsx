import React, { forwardRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import rabLogo from '../assets/images/RAB_Logo2.png';

const CertificateCard = forwardRef(({ result }, ref) => {
  if (!result) return null;

  // The verification URL that the QR code will point to
  const verificationUrl = `${window.location.origin}/verify/${result.id}`;

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
      <div className="absolute top-0 left-0 w-full h-4 bg-green-600" />
      <div className="absolute -top-32 -right-32 w-96 h-96 bg-green-50 rounded-full opacity-50 pointer-events-none" />
      <div className="absolute -bottom-32 -left-32 w-96 h-96 bg-blue-50 rounded-full opacity-50 pointer-events-none" />
      <div className="absolute top-0 right-0 w-32 h-full bg-gradient-to-l from-green-50 to-transparent opacity-50 pointer-events-none" />

      {/* Header */}
      <div className="flex items-center justify-between mb-8 relative z-10 border-b border-slate-200 pb-6">
        <div className="flex items-center gap-4">
          <img src={rabLogo} alt="RAB Logo" className="h-20 object-contain" />
          <div>
            <h1 className="text-[22px] font-bold text-slate-800 uppercase">
              Republic of Rwanda
            </h1>
            <h2 className="text-[15px] font-medium text-slate-600 uppercase mt-1">
              Ministry of Agriculture and Animal Resources
            </h2>
            <p className="text-sm text-green-700 font-semibold mt-1">
              Rwanda Agriculture and Animal Resources Development Board (RAB)
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex justify-between relative z-10">
        <div className="flex-1 pr-8">
          <h3 className="text-2xl font-black text-slate-800 mb-6 uppercase text-blue-900">
            Certificate for RVF Testing
          </h3>
          
          <div className="grid grid-cols-2 gap-x-8 gap-y-4">
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Farmer Name</p>
              <p className="text-lg font-bold text-slate-800">{result.farmer_name || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Animal ID</p>
              <p className="text-lg font-bold text-slate-800">{result.animal_id || 'N/A'}</p>
            </div>
            
            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Specie</p>
              <p className="text-lg font-bold text-slate-800">{result.specie || 'N/A'}</p>
            </div>

            <div>
              <p className="text-xs text-slate-500 uppercase font-semibold mb-1">Date Tested</p>
              <p className="text-lg font-bold text-slate-800">
                {new Date(result.createdAt).toLocaleDateString('en-GB')}
              </p>
            </div>

            <div className="col-span-2 pt-2">
              <p className="text-xs text-slate-500 uppercase font-semibold mb-2">PCR Test Result</p>
              <div className={`inline-flex px-4 py-2 rounded-lg border-2 ${isPositive ? 'border-red-200 bg-red-50 text-red-700' : 'border-green-200 bg-green-50 text-green-700'}`}>
                <span className="text-xl font-black uppercase">
                  {result.rvf_pcr_results || 'UNKNOWN'}
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* QR Code Section */}
        <div className="w-56 flex flex-col items-center justify-center border-l border-slate-200 pl-8">
          <div className="bg-white p-3 rounded-xl border border-slate-200 shadow-sm mb-4">
            <QRCodeSVG 
              value={verificationUrl} 
              size={140}
              level="H"
              includeMargin={true}
            />
          </div>
          <p className="text-[11px] text-center text-slate-500 font-medium leading-tight">
            Scan QR code to verify authenticity via Government of Rwanda portal
          </p>
          <div className="mt-4 pt-4 border-t border-slate-100 w-full text-center">
            <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Certificate ID</p>
            <p className="text-xs font-mono font-bold text-slate-700 mt-0.5">
              RAB-RVF-{result.id?.toString().padStart(6, '0')}
            </p>
          </div>
        </div>
      </div>

      {/* Footer */}
      <div className="absolute bottom-0 left-0 w-full bg-slate-50 border-t border-slate-200 py-3 px-8 flex justify-between items-center text-[10px] text-slate-500 font-medium">
        <p>Issued by: {result.tested_site || 'RAB Laboratory'}</p>
        <p>Verified Document</p>
        <p>{window.location.host}</p>
      </div>
    </div>
  );
});

CertificateCard.displayName = 'CertificateCard';
export default CertificateCard;
