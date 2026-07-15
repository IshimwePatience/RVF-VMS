import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { CheckCircle2, XCircle, FileText, ArrowLeft, Building2 } from 'lucide-react';
import minisanteLogo from '../assets/images/RAB_Logo2.png';

export default function VerifyCertificate() {
  const { id } = useParams();

  const { data: cert, isLoading, isError } = useQuery({
    queryKey: ['verify-certificate', id],
    queryFn: async () => {
      const res = await axios.get(`/rvf-api/lab-results/verify/${id}`);
      return res.data;
    },
    retry: false
  });

  if (isLoading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="flex flex-col items-center">
          <div className="w-12 h-12 border-4 border-green-600 border-t-transparent rounded-full animate-spin mb-4"></div>
          <p className="text-slate-600 font-medium">Verifying Certificate...</p>
        </div>
      </div>
    );
  }

  if (isError || !cert) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-4">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center border border-red-100">
          <div className="w-20 h-20 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-6">
            <XCircle className="w-10 h-10 text-red-600" />
          </div>
          <h1 className="text-2xl font-bold text-slate-800 mb-2">Invalid Certificate</h1>
          <p className="text-slate-600 mb-8">
            The certificate ID you are trying to verify does not exist or has been tampered with.
          </p>
          <Link to="/" className="inline-flex items-center text-blue-600 hover:text-blue-700 font-medium">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Home
          </Link>
        </div>
      </div>
    );
  }

  const isPositive = cert.rvf_pcr_results?.toUpperCase().includes('POSITIVE');

  return (
    <div className="min-h-screen bg-slate-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-xl mx-auto">
        
        {/* Header */}
        <div className="text-center mb-10">
          <img src={minisanteLogo} alt="RAB Logo" className="h-20 mx-auto mb-6" />
          <h1 className="text-2xl font-bold text-slate-900">Certificate Verification</h1>
          <p className="text-slate-500 mt-2">Government of Rwanda</p>
        </div>

        {/* Verification Card */}
        <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-slate-200">
          {/* Status Banner */}
          <div className="bg-green-50 px-6 py-6 border-b border-green-100 text-center">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <h2 className="text-xl font-bold text-green-800 mb-1">Authentic Certificate</h2>
            <p className="text-green-600 text-sm font-medium">
              Verified by Rwanda Agriculture Board (RAB)
            </p>
          </div>

          {/* Certificate Details */}
          <div className="p-8 space-y-6">
            <div className="flex items-center text-slate-800 font-bold text-lg mb-4 border-b border-slate-100 pb-4">
              <FileText className="w-5 h-5 mr-3 text-blue-600" />
              Certificate RAB-RVF-{cert.id.toString().padStart(6, '0')}
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Farmer Name</p>
                <p className="font-medium text-slate-900">{cert.farmer_name || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Animal ID</p>
                <p className="font-medium text-slate-900">{cert.animal_id || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Specie</p>
                <p className="font-medium text-slate-900">{cert.specie || 'N/A'}</p>
              </div>
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Date Tested</p>
                <p className="font-medium text-slate-900">
                  {new Date(cert.date_tested).toLocaleDateString('en-GB')}
                </p>
              </div>
            </div>

            <div className="mt-8 pt-6 border-t border-slate-100">
              <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">PCR Test Result</p>
              <div className={`inline-flex px-4 py-2 rounded-lg border ${isPositive ? 'bg-red-50 border-red-200 text-red-700' : 'bg-green-50 border-green-200 text-green-700'}`}>
                <span className="font-bold tracking-wide uppercase">
                  {cert.rvf_pcr_results || 'UNKNOWN'}
                </span>
              </div>
            </div>
            
            <div className="mt-6 p-4 bg-slate-50 rounded-xl border border-slate-200 flex items-start gap-4">
              <div>
                <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-1">Tested At</p>
                <p className="text-sm font-medium text-slate-800">{cert.tested_site || 'RAB Laboratory'}</p>
                <p className="text-xs text-slate-500 mt-1">Technician: {cert.lab_technician}</p>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center mt-8 text-sm text-slate-500">
          <Link to="/" className="hover:text-slate-800 transition-colors">
            Return to RVF Vet Input Hub
          </Link>
        </div>
      </div>
    </div>
  );
}
