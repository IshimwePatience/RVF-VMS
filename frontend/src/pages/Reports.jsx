import React, { useContext, useState, useMemo, useRef, useEffect } from 'react';
import axios from 'axios';
import { useQuery } from '@tanstack/react-query';
import { AuthContext } from '../context/AuthContext';
import { ToastContext } from '../context/ToastContext';
import { usePagination } from '../hooks/usePagination';
import Pagination from '../components/Pagination';
import LocationDropdown from '../components/LocationDropdown';
import SampleTestReportView from '../components/SampleTestReportView';
import HomeVaccinationReportView from '../components/HomeVaccinationReportView';
import MapModal from '../components/MapModal';
import ViewResultsTab from './LabPortal/ViewResultsTab';
import ReportPDFModal from '../components/ReportPDFModal';
import ExportExcelModal from '../components/ExportExcelModal';
import { exportToExcel } from '../utils/exportExcel';
import { generatePDFReport } from '../utils/generatePDF';
import { MoreVertical, Download, FileText } from 'lucide-react';

export default function Reports() {
  const { user } = useContext(AuthContext);
  const { addToast } = useContext(ToastContext);
  
  const [activeTab, setActiveTab] = useState(user?.role === 'Admin' ? 'overview' : 'vaccination'); 
  const [error, setError] = useState('');
  const [selectedReport, setSelectedReport] = useState(null);
  const [selectedHomeVaccination, setSelectedHomeVaccination] = useState(null);
  const [mapLocationData, setMapLocationData] = useState(null);
  const [showExportMenu, setShowExportMenu] = useState(false);
  const [pdfModalConfig, setPdfModalConfig] = useState(null);
  const [excelModalConfig, setExcelModalConfig] = useState(null);
  const exportMenuRef = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (exportMenuRef.current && !exportMenuRef.current.contains(event.target)) {
        setShowExportMenu(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleGeneratePDF = async ({ startDate, endDate, status, dateRangeLabel }) => {
    const type = pdfModalConfig.type;
    const title = pdfModalConfig.title;
    
    try {
      // Fetch all veterinaries and users to know who didn't report
      const [vetsRes, labTechsRes] = await Promise.all([
        axios.get('/rvf-api/veterinaries').catch(() => ({ data: [] })),
        axios.get('/rvf-api/auth/lab-techs').catch(() => ({ data: [] }))
      ]);
      const allVets = vetsRes.data || [];
      const labUsers = labTechsRes.data || [];

      let records = [];
      let allUsersToCheck = [];
      let reportedUserIdentifierFn = () => null;

      if (type === 'home_vaccination') {
        const res = await axios.get('/rvf-api/veterinary-portal/vaccinations');
        records = res.data;
        allUsersToCheck = allVets;
        reportedUserIdentifierFn = (r) => r.veterinary_email; // Using email column for phone
      } else if (type === 'surveillance') {
        const res = await axios.get('/rvf-api/surveillance');
        records = res.data;
        allUsersToCheck = allVets;
        reportedUserIdentifierFn = (r) => r.veterinary_email || r.phone_number;
      } else if (type === 'lab_results') {
        const res = await axios.get('/rvf-api/lab-results');
        records = res.data;
        allUsersToCheck = labUsers;
        reportedUserIdentifierFn = (r) => r.uploaded_by || r.lab_user_id; // Need to match lab users
        // Note: if lab results don't clearly map to a Lab User ID, this might fall back to showing all as missing.
        // For lab results, let's just show the raw records if reported, and for missing we check lab users.
      }

      // Filter records by date range
      const recordsInRange = records.filter(r => {
        const d = new Date(r.createdAt || r.date_administered);
        return d >= startDate && d <= endDate;
      });

      // Get unique identifiers of those who reported
      const reportedIdentifiers = new Set(recordsInRange.map(reportedUserIdentifierFn).filter(Boolean));

      let rows = [];
      let headers = [];

      if (status === 'reported') {
        if (type === 'home_vaccination') {
          headers = ['Date', 'Veterinary Name', 'Veterinary Phone', 'District', 'Vaccine', 'Doses'];
          rows = recordsInRange.map(r => {
            const vet = allVets.find(v => v.phone_number === r.veterinary_email || v.email === r.veterinary_email);
            return [
              new Date(r.createdAt).toLocaleDateString(),
              vet?.name || vet?.full_name || 'N/A',
              r.veterinary_email || 'N/A',
              r.district || 'N/A',
              r.vaccine_name || 'N/A',
              r.dose_given || '0'
            ];
          });
        } else if (type === 'surveillance') {
          headers = ['Date', 'Veterinary Name', 'Veterinary Phone', 'District', 'Samples'];
          rows = recordsInRange.map(r => {
            const vetPhone = r.veterinary_email || r.phone_number;
            const vet = allVets.find(v => v.phone_number === vetPhone || v.email === vetPhone);
            return [
              new Date(r.createdAt).toLocaleDateString(),
              r.submitted_by || vet?.name || vet?.full_name || 'N/A',
              vetPhone || 'N/A',
              r.district || 'N/A',
              r.samples?.length || '0'
            ];
          });
        } else if (type === 'lab_results') {
          headers = ['Date Uploaded', 'Farmer', 'District', 'Specie', 'PCR Result'];
          rows = recordsInRange.map(r => [
            new Date(r.createdAt).toLocaleDateString(),
            r.farmer_name || 'N/A',
            r.animal_district_origin || r.district || 'N/A',
            r.specie || 'N/A',
            r.pcr_result || 'Pending'
          ]);
        }
      } else {
        // Missing Reports
        headers = ['Name', 'Phone', 'District'];
        const missingUsers = allUsersToCheck.filter(u => {
          const identifier = type === 'lab_results' ? u.id : (u.phone_number || u.email);
          return !reportedIdentifiers.has(identifier);
        });

        rows = missingUsers.map(u => [
          u.name || u.full_name || 'N/A',
          u.phone_number || u.phone || u.email || 'N/A',
          u.district || 'N/A'
        ]);
      }

      const statusText = status === 'reported' ? 'Submitted Reports' : 'Did NOT Submit';
      const fullTitle = `${title} - ${statusText} (${dateRangeLabel.toUpperCase()})`;
      generatePDFReport(fullTitle, headers, rows, `${title.replace(/\s+/g, '_')}_${status}`);
      setPdfModalConfig(null);
    } catch (err) {
      console.error(err);
      addToast('Failed to generate PDF. Check network or permissions.', 'error');
    }
  };

  const handleGenerateExcel = async ({ startDate, endDate, dateRangeLabel, filters: excelFilters }) => {
    const type = excelModalConfig.type;
    const title = excelModalConfig.title;

    try {
      let records = [];
      let vetMap = {};
      if (type === 'home_vaccination') {
        const res = await axios.get('/rvf-api/veterinary-portal/vaccinations');
        records = res.data;
      } else if (type === 'surveillance') {
        const res = await axios.get('/rvf-api/surveillance');
        records = res.data;
      } else if (type === 'lab_results') {
        const [labRes, survRes, vaccRes] = await Promise.all([
          axios.get('/rvf-api/lab-results'),
          axios.get('/rvf-api/surveillance').catch(() => ({ data: [] })),
          axios.get('/rvf-api/veterinary-portal/vaccinations').catch(() => ({ data: [] }))
        ]);
        records = labRes.data;
        const surv = survRes.data || [];
        const vacc = vaccRes.data || [];

        surv.forEach(r => {
          r.samples?.forEach(s => {
            if (s.animal_id) {
              vetMap[s.animal_id] = { name: r.submitted_by || r.veterinary_name, phone: r.phone_number || r.veterinary_email };
            }
          });
        });
        vacc.forEach(r => {
          if (r.animal_id) {
            vetMap[r.animal_id] = { name: r.veterinary_name, phone: r.veterinary_email };
          }
        });
      }

      // Filter records
      let filtered = records.filter(r => {
        const d = new Date(r.createdAt || r.date_administered);
        if (d < startDate || d > endDate) return false;

        // For surveillance, the location is usually on the samples, but we'll check both form and samples later
        // For now, if it's not surveillance, filter directly
        if (type !== 'surveillance') {
          const rDist = r.animal_district_origin || r.district;
          if (excelFilters.district && rDist !== excelFilters.district) return false;
          if (excelFilters.sector && r.sector !== excelFilters.sector) return false;
          if (excelFilters.cell && r.cell !== excelFilters.cell) return false;
          if (excelFilters.village && r.village !== excelFilters.village) return false;
        }
        return true;
      });

      let data = [];

      if (type === 'home_vaccination') {
        data = filtered.map(r => ({
          'Date Submitted': new Date(r.date_administered || r.createdAt).toLocaleDateString(),
          'Veterinary Phone': r.veterinary_email,
          'Province': r.province,
          'District': r.district,
          'Sector': r.sector,
          'Cell': r.cell,
          'Village': r.village,
          'Owner Name': r.owner_name,
          'Owner Phone': r.owner_phone,
          'Owner National ID': r.owner_national_id,
          'Vaccine': r.vaccine_name,
          'Batch Number': r.batch_number,
          'Animal Type': r.animal_type,
          'Dose Given': r.dose_given,
          'Damages': r.damages
        }));
      } else if (type === 'surveillance') {
        filtered.forEach(form => {
          if (form.samples && form.samples.length > 0) {
            form.samples.forEach(sample => {
              const sDist = sample.district_origin || sample.district || form.district;
              const sSec = sample.sector || form.sector;
              const sCell = sample.cell || form.cell;
              const sVill = sample.village || form.village;
              
              if (excelFilters.district && sDist !== excelFilters.district) return;
              if (excelFilters.sector && sSec !== excelFilters.sector) return;
              if (excelFilters.cell && sCell !== excelFilters.cell) return;
              if (excelFilters.village && sVill !== excelFilters.village) return;

              data.push({
                'Date Submitted': new Date(form.createdAt).toLocaleDateString(),
                'Veterinary Phone': form.veterinary_email || form.phone_number,
                'Test Requested': form.test_requested,
                'District': sDist || '',
                'Sector': sSec || '',
                'Cell': sCell || '',
                'Village': sVill || '',
                'From Abattoir': form.from_abattoir ? 'Yes' : 'No',
                'Sample SN': sample.sn,
                'Farmer Name': sample.farmer_name,
                'Farmer Phone': sample.phone,
                'Animal ID': sample.animal_id,
                'Specie': sample.specie,
                'Breed': sample.breed,
                'Sex': sample.sex,
                'Age': sample.age,
                'Vaccination Status': sample.vaccination_status,
                'Purpose': sample.purpose,
                'Health Status': sample.health_status
              });
            });
          } else {
            if (excelFilters.district && form.district !== excelFilters.district) return;
            if (excelFilters.sector && form.sector !== excelFilters.sector) return;
            if (excelFilters.cell && form.cell !== excelFilters.cell) return;
            if (excelFilters.village && form.village !== excelFilters.village) return;
            
            data.push({
              'Date Submitted': new Date(form.createdAt).toLocaleDateString(),
              'Veterinary Phone': form.veterinary_email || form.phone_number,
              'Test Requested': form.test_requested,
              'District': form.district,
              'Sector': form.sector,
              'Cell': form.cell,
              'Village': form.village
            });
          }
        });
      } else if (type === 'lab_results') {
        data = filtered.map(r => ({
          'Lab Technician Name': r.uploader?.name || 'N/A',
          'Technician Number': r.uploader?.phone_number || 'N/A',
          'Date Uploaded': new Date(r.createdAt).toLocaleDateString(),
          'Veterinary (Result Owner)': vetMap[r.animal_id]?.name || 'N/A',
          'Veterinary Phone': vetMap[r.animal_id]?.phone || 'N/A',
          'Farmer Name': r.farmer_name || 'N/A',
          'Farmer Phone': r.phone || 'N/A',
          'District': r.animal_district_origin || r.district || 'N/A',
          'Sector': r.sector || 'N/A',
          'Cell': r.cell || 'N/A',
          'Village': r.village || 'N/A',
          'Animal ID': r.animal_id || 'N/A',
          'Specie': r.specie || 'N/A',
          'Breed': r.breed || 'N/A',
          'Sex': r.sex || 'N/A',
          'Age': r.age || 'N/A',
          'Vacc. Status': r.vaccination_status || 'N/A',
          'Purpose': r.purpose || 'N/A',
          'Health Status': r.health_status || 'N/A',
          'PCR Result': r.rvf_pcr_results || 'Pending'
        }));
      }

      exportToExcel(data, `${title.replace(/\s+/g, '_')}_${dateRangeLabel}`);
      setExcelModalConfig(null);
    } catch (err) {
      console.error(err);
      addToast('Failed to export Excel. Check network.', 'error');
    }
  };



  // Filters State
  const [filters, setFilters] = useState({
    province: '',
    district: '',
    sector: '',
    veterinary_name: '',
    dateFrom: '',
    dateTo: '',
    status: ''
  });

  // Query string for filters for the API
  const queryParams = new URLSearchParams();
  if (filters.province) queryParams.append('province', filters.province);
  if (filters.district) queryParams.append('district', filters.district);
  if (filters.sector) queryParams.append('sector', filters.sector);
  if (filters.veterinary_name) queryParams.append('email', filters.veterinary_name); // Assuming 'email' is used for vet search in backend

  // 1. Sector/District simple table (Allocations basically)
  const { data: reports = [], isLoading: loadingVaccination } = useQuery({
    queryKey: ['reports', user?.stock_id],
    queryFn: async () => {
      let url = '/rvf-api/administrations';
      if (user.role !== 'Admin' && user.stock_id) {
        url += `?stock_id=${user.stock_id}`;
      }
      const res = await axios.get(url);
      return res.data;
    },
    enabled: !!user && user.role !== 'Admin'
  });

  // Removed Central Overview Data as it is no longer used

  // 3. Central Home Vaccinations Data
  const { data: homeVaccinations = [], isLoading: loadingHomeVaccinations } = useQuery({
    queryKey: ['central-home-vaccinations', filters.province, filters.district, filters.sector, filters.veterinary_name],
    queryFn: async () => {
      const res = await axios.get(`/rvf-api/veterinary-portal/vaccinations?${queryParams.toString()}`);
      return res.data;
    },
    enabled: user?.role === 'Admin'
  });

  // 4. Central Surveillance Data
  const { data: surveillanceReports = [], isLoading: loadingSurveillance } = useQuery({
    queryKey: ['surveillance_reports'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/surveillance');
      return res.data;
    },
    enabled: user?.role === 'Admin'
  });

  // 5. Central Lab Results Data
  const { data: centralLabResults = [] } = useQuery({
    queryKey: ['central-lab-results'],
    queryFn: async () => {
      const res = await axios.get('/rvf-api/lab-results');
      return res.data;
    },
    enabled: user?.role === 'Admin'
  });

  // Client-side filtering for old Vaccination Reports (Sector)
  const filteredReports = useMemo(() => {
    return reports.filter(r => {
      if (filters.province && r.province !== filters.province) return false;
      if (user?.role !== 'Admin' && user?.stock?.district && r.district !== user.stock.district) return false;
      if (filters.district && r.district !== filters.district) return false;
      if (filters.sector && r.sector !== filters.sector) return false;
      if (filters.status && r.report_status !== filters.status) return false;
      if (filters.veterinary_name && !r.veterinary_name?.toLowerCase().includes(filters.veterinary_name.toLowerCase()) && !r.veterinary_email?.toLowerCase().includes(filters.veterinary_name.toLowerCase())) return false;
      if (filters.dateFrom && new Date(r.date_administered) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(r.date_administered) > new Date(filters.dateTo)) return false;
      return true;
    });
  }, [reports, filters]);

  // Client-side filtering for Surveillance Reports
  const filteredSurveillance = useMemo(() => {
    return surveillanceReports.filter(r => {
      if (filters.province && r.province !== filters.province) return false;
      if (user?.role !== 'Admin' && user?.stock?.district && r.district !== user.stock.district) return false;
      if (filters.district && r.district !== filters.district) return false;
      if (filters.sector && r.sector !== filters.sector) return false;
      if (filters.veterinary_name && (!r.veterinary_email || !r.veterinary_email.toLowerCase().includes(filters.veterinary_name.toLowerCase())) && (!r.veterinary_name || !r.veterinary_name.toLowerCase().includes(filters.veterinary_name.toLowerCase()))) return false;
      if (filters.dateFrom && new Date(r.collection_date || r.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(r.collection_date || r.createdAt) > new Date(filters.dateTo)) return false;
      return true;
    });
  }, [surveillanceReports, filters]);

  // Client-side filtering for Lab Results
  const filteredLabResults = useMemo(() => {
    return centralLabResults.filter(r => {
      if (filters.district && r.animal_district_origin !== filters.district && r.district !== filters.district) return false;
      if (filters.sector && r.sector !== filters.sector) return false;
      if (filters.veterinary_name) {
        const searchVal = filters.veterinary_name.toLowerCase();
        const rPhone = (r.phone || '').toLowerCase();
        const rFarmer = (r.farmer_name || '').toLowerCase();
        if (!rPhone.includes(searchVal) && !rFarmer.includes(searchVal)) return false;
      }
      if (filters.dateFrom && new Date(r.createdAt) < new Date(filters.dateFrom)) return false;
      if (filters.dateTo && new Date(r.createdAt) > new Date(filters.dateTo + 'T23:59:59')) return false;
      return true;
    });
  }, [centralLabResults, filters]);

  // Determine which data to paginate based on active tab and role
  const getListData = () => {
    if (user?.role !== 'Admin') return filteredReports;
    if (activeTab === 'home_vaccination') return homeVaccinations; // API handles filtering
    if (activeTab === 'surveillance') return filteredSurveillance;
    if (activeTab === 'lab_results') return []; // Managed inside ViewResultsTab
    return [];
  };

  const pagination = usePagination(getListData(), 10);
  
  const loading = user?.role !== 'Admin' 
    ? loadingVaccination 
    : (activeTab === 'home_vaccination' ? loadingHomeVaccinations : loadingSurveillance);

  if (selectedReport) {
    return <SampleTestReportView report={selectedReport} onClose={() => setSelectedReport(null)} />;
  }

  if (selectedHomeVaccination) {
    return <HomeVaccinationReportView report={selectedHomeVaccination} onClose={() => setSelectedHomeVaccination(null)} />;
  }

  return (
    <div className="pb-12 max-w-7xl mx-auto">
      <div className="flex flex-col lg:flex-row justify-between items-start lg:items-center gap-6 mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            {(user?.role === 'Admin' || user?.is_central || user?.stock?.is_central) ? 'Veterinary Reports' : 'Usage Reports'}
          </h1>
          <p className="text-slate-500 mt-1">All forms submitted by veterinarians in the field.</p>
        </div>

        {user?.role === 'Admin' && (
          <div className="flex flex-wrap justify-end items-center gap-4">
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Phone Number</span>
              <input 
                type="text"
                placeholder="Search..."
                value={filters.veterinary_name}
                onChange={e => setFilters({...filters, veterinary_name: e.target.value})}
                className="w-40 pl-4 pr-3 py-2 border border-slate-300 rounded-full text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]"
              />
            </div>
            
            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">District</span>
              <div className="w-36 border border-slate-300 rounded-full bg-white hover:bg-slate-50 transition-colors outline-none focus-within:border-[#12aeec] focus-within:ring-1 focus-within:ring-[#12aeec] text-sm font-medium text-slate-700">
                <LocationDropdown 
                  type="districts"
                  params={{ province: filters.province }}
                  value={filters.district}
                  onChange={(val) => setFilters({ ...filters, district: val, sector: '' })}
                  placeholder="All"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">Sector</span>
              <div className="w-36 border border-slate-300 rounded-full bg-white hover:bg-slate-50 transition-colors outline-none focus-within:border-[#12aeec] focus-within:ring-1 focus-within:ring-[#12aeec] text-sm font-medium text-slate-700">
                <LocationDropdown 
                  type="sectors"
                  params={{ district: filters.district }}
                  value={filters.sector}
                  onChange={(val) => setFilters({ ...filters, sector: val })}
                  placeholder="All"
                />
              </div>
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">From</span>
              <input 
                type="date"
                value={filters.dateFrom}
                onChange={e => setFilters({...filters, dateFrom: e.target.value})}
                className="w-36 pl-4 pr-3 py-2 border border-slate-300 rounded-full text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]"
              />
            </div>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-500 font-medium whitespace-nowrap">To</span>
              <input 
                type="date"
                value={filters.dateTo}
                onChange={e => setFilters({...filters, dateTo: e.target.value})}
                className="w-36 pl-4 pr-3 py-2 border border-slate-300 rounded-full text-sm font-medium text-slate-700 bg-white hover:bg-slate-50 transition-colors outline-none focus:border-[#12aeec] focus:ring-1 focus:ring-[#12aeec]"
              />
            </div>

            {(filters.district || filters.sector || filters.veterinary_name || filters.dateFrom || filters.dateTo || filters.status) && (
              <button 
                onClick={() => setFilters({ province: '', district: '', sector: '', veterinary_name: '', dateFrom: '', dateTo: '', status: '' })}
                className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-red-600 hover:bg-red-50 rounded-full transition-colors border border-red-200"
              >
                Clear
              </button>
            )}
          </div>
        )}
      </div>

      {user?.role === 'Admin' && (
        <div className="flex justify-between items-center mb-8 border-b-2 border-transparent">
          <div className="flex space-x-4 overflow-x-auto">
            <button
              onClick={() => { setActiveTab('overview'); pagination.jump(1); }}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'overview' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Overview
            </button>
            <button
              onClick={() => { setActiveTab('home_vaccination'); pagination.jump(1); }}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'home_vaccination' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Home Vaccination Records
            </button>
            <button
              onClick={() => { setActiveTab('surveillance'); pagination.jump(1); }}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'surveillance' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Sample Test Forms
            </button>
            <button
              onClick={() => { setActiveTab('lab_results'); pagination.jump(1); }}
              className={`py-3 px-4 text-sm font-medium border-b-2 transition-colors whitespace-nowrap ${
                activeTab === 'lab_results' 
                  ? 'border-blue-600 text-blue-600' 
                  : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'
              }`}
            >
              Lab Results
            </button>
          </div>
          
          <div className="relative ml-4" ref={exportMenuRef}>
            <button 
              onClick={() => setShowExportMenu(!showExportMenu)} 
              className="p-2 hover:bg-slate-100 rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500"
              title="Export Options"
            >
              <MoreVertical className="w-5 h-5 text-slate-600" />
            </button>
            
            {showExportMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white rounded-lg shadow-xl border border-slate-200 z-50 py-2">
                <div className="px-4 py-2 text-xs font-bold tracking-wider text-slate-400 uppercase mb-1">
                  Export to Excel
                </div>
                <button 
                  onClick={() => { setExcelModalConfig({ type: 'home_vaccination', title: 'Home Vaccination Records' }); setShowExportMenu(false); }} 
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-emerald-500" />
                  Home Vaccination Records
                </button>
                <button 
                  onClick={() => { setExcelModalConfig({ type: 'surveillance', title: 'Sample Test Forms' }); setShowExportMenu(false); }} 
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-emerald-500" />
                  Sample Test Forms
                </button>
                <button 
                  onClick={() => { setExcelModalConfig({ type: 'lab_results', title: 'Lab Results' }); setShowExportMenu(false); }} 
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <Download className="w-4 h-4 text-emerald-500" />
                  Lab Results
                </button>
                <div className="px-4 py-2 mt-2 text-xs font-bold tracking-wider text-slate-400 uppercase border-t border-slate-100 pt-3 mb-1">
                  Export to PDF
                </div>
                <button 
                  onClick={() => { setPdfModalConfig({ type: 'home_vaccination', title: 'Home Vaccination Records' }); setShowExportMenu(false); }} 
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-red-500" />
                  Home Vaccination Records
                </button>
                <button 
                  onClick={() => { setPdfModalConfig({ type: 'surveillance', title: 'Sample Test Forms' }); setShowExportMenu(false); }} 
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-red-500" />
                  Sample Test Forms
                </button>
                <button 
                  onClick={() => { setPdfModalConfig({ type: 'lab_results', title: 'Lab Results' }); setShowExportMenu(false); }} 
                  className="w-full text-left px-4 py-2.5 text-sm font-medium text-slate-700 hover:bg-slate-50 flex items-center gap-2"
                >
                  <FileText className="w-4 h-4 text-red-500" />
                  Lab Results
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      <ReportPDFModal 
        isOpen={!!pdfModalConfig}
        onClose={() => setPdfModalConfig(null)}
        title={pdfModalConfig?.title}
        onGenerate={handleGeneratePDF}
      />

      <ExportExcelModal 
        isOpen={!!excelModalConfig}
        onClose={() => setExcelModalConfig(null)}
        title={excelModalConfig?.title}
        onExport={handleGenerateExcel}
      />

      {user?.role === 'Admin' && activeTab === 'overview' ? (
        <div className="bg-white shadow-sm border border-slate-200 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-sm text-slate-700">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="py-4 px-6 font-semibold text-slate-900 border-r border-slate-200 bg-slate-100/50">Summary</th>
                  <th className="py-4 px-6 font-semibold text-slate-800 border-r border-slate-200 whitespace-nowrap text-center">County Total</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Total Sample Test Forms</td>
                  <td className="py-3 px-6 border-r border-slate-200 text-center font-bold text-lg text-slate-900">
                    {filteredSurveillance?.length || 0}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Total Samples Collected</td>
                  <td className="py-3 px-6 border-r border-slate-200 text-center text-blue-600 font-bold text-lg">
                    {filteredSurveillance?.reduce((acc, r) => acc + (r?.samples?.length || 0), 0) || 0}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Home Vaccination Records</td>
                  <td className="py-3 px-6 border-r border-slate-200 text-center font-bold text-lg text-slate-900">
                    {homeVaccinations?.length || 0}
                  </td>
                </tr>
                <tr className="bg-slate-100 hover:bg-slate-200 transition-colors">
                  <td className="py-4 px-6 font-bold text-slate-900 border-r border-slate-300">Total Vaccines Given</td>
                  <td className="py-4 px-6 border-r border-slate-300 text-center font-bold text-xl text-slate-900">
                    {homeVaccinations?.reduce((acc, r) => acc + (Number(r?.dose_given) || 0), 0).toLocaleString() || 0}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Total Lab Results</td>
                  <td className="py-3 px-6 border-r border-slate-200 text-center font-bold text-lg text-slate-900">
                    {filteredLabResults.length}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Positive Lab Results</td>
                  <td className="py-3 px-6 border-r border-slate-200 text-center font-bold text-lg text-red-600">
                    {filteredLabResults.filter(r => r.pcr_result === 'Positive' || r.rvf_pcr_results?.toUpperCase().includes('POSITIVE')).length}
                  </td>
                </tr>
                <tr className="hover:bg-slate-50/50">
                  <td className="py-3 px-6 font-medium text-slate-700 border-r border-slate-200 bg-slate-50/30">Negative Lab Results</td>
                  <td className="py-3 px-6 border-r border-slate-200 text-center font-bold text-lg text-green-600">
                    {filteredLabResults.filter(r => r.pcr_result === 'Negative' || r.rvf_pcr_results?.toUpperCase().includes('NEGATIVE')).length}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      ) : activeTab === 'lab_results' && user?.role === 'Admin' ? (
        <ViewResultsTab filters={filters} />
      ) : (
        <>
          {loading ? (
            <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden p-12 text-center">
              <div className="w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
              <p className="text-slate-500 font-medium">Loading reports data...</p>
            </div>
          ) : pagination.currentData.length === 0 ? (
            <div className="py-20 flex flex-col items-center justify-center text-center mt-2">
              <img src={`${import.meta.env.BASE_URL}empty_mascot.png`} alt="No data" className="h-40 object-contain mb-6 opacity-75" />
              <p className="text-[15px] font-medium text-slate-500">No reports found</p>
              <p className="text-slate-500 text-sm mt-1 max-w-sm">
                Try adjusting your filters to see more results.
              </p>
            </div>
          ) : (
            <>
              {user?.role !== 'Admin' ? (
                <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                  <div className="overflow-x-auto">
                    <table className="w-full text-left text-sm text-slate-700">
                      <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                          <th className="py-4 pl-6 pr-3 font-semibold text-slate-800">Date</th>
                          <th className="py-4 px-3 font-semibold text-slate-800">Veterinary Name</th>
                          <th className="py-4 px-3 font-semibold text-slate-800">Location</th>
                          <th className="py-4 px-3 font-semibold text-slate-800">Vaccine</th>
                          <th className="py-4 px-3 font-semibold text-slate-800">Doses</th>
                          <th className="py-4 px-3 font-semibold text-slate-800">Affected</th>
                          <th className="py-4 px-3 font-semibold text-slate-800">Died</th>
                          <th className="py-4 pr-6 pl-3 font-semibold text-slate-800">Status</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100">
                        {pagination.currentData.map((r) => (
                          <tr key={r.id} className="hover:bg-slate-50/80 transition-colors group">
                            <td className="py-4 pl-6 pr-3 text-slate-600 whitespace-nowrap">
                              {new Date(r.date_administered).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                            </td>
                            <td className="py-4 px-3">
                              <span className="font-semibold text-slate-900">{r.veterinary_name}</span>
                            </td>
                            <td className="py-4 px-3">
                              <div className="flex flex-col">
                                <span className="text-sm font-medium text-slate-800">
                                  {r.village || r.cell || r.sector || r.district || 'Unknown Location'}
                                </span>
                                <span className="text-xs text-slate-500">
                                  {[r.province, r.district, r.sector, r.cell].filter(Boolean).filter(x => x !== (r.village || r.cell || r.sector || r.district)).join(' / ')}
                                </span>
                              </div>
                            </td>
                            <td className="py-4 px-3">
                              <span className="inline-flex px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                                {r.Batch?.Vaccine?.name || 'N/A'}
                              </span>
                            </td>
                            <td className="py-4 px-3 text-slate-800 font-medium">
                              {r.doses_used || 0}
                            </td>
                            <td className="py-4 px-3 text-amber-600 font-medium">
                              {r.animals_affected || 0}
                            </td>
                            <td className="py-4 px-3">
                              {r.animals_died > 0 ? (
                                <span className="text-red-600 font-bold">{r.animals_died}</span>
                              ) : (
                                <span className="text-slate-400">0</span>
                              )}
                            </td>
                            <td className="py-4 pr-6 pl-3">
                              {r.report_status === 'submitted' ? (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-semibold border border-emerald-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span>
                                  Submitted
                                </span>
                              ) : (
                                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-50 text-amber-700 text-xs font-semibold border border-amber-200">
                                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                  Pending
                                </span>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                  <div className="px-6 py-4 border-t border-slate-100 bg-slate-50">
                    <Pagination {...pagination} onPageChange={pagination.jump} />
                  </div>
                </div>
              ) : activeTab === 'home_vaccination' ? (
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="py-3 font-semibold text-slate-800">Date Submitted</th>
                      <th className="py-3 font-semibold text-slate-800">Veterinary Phone</th>
                      <th className="py-3 font-semibold text-slate-800">Location</th>
                      <th className="py-3 font-semibold text-slate-800">Vaccine</th>
                      <th className="py-3 font-semibold text-slate-800">Animal Type</th>
                      <th className="py-3 font-semibold text-slate-800">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pagination.currentData.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedHomeVaccination(r)}>
                        <td className="py-4 pr-4 text-slate-600 whitespace-nowrap">
                          {new Date(r.date_administered || r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-4">
                          <span className="font-semibold text-slate-900">{r.veterinary_email}</span>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-800">
                              {r.village || r.cell || r.sector || r.district || 'Unknown Location'}
                            </span>
                            <span className="text-xs text-slate-500">
                              {[r.province, r.district, r.sector, r.cell].filter(Boolean).filter(x => x !== (r.village || r.cell || r.sector || r.district)).join(' / ')}
                            </span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex px-2 py-1 rounded-md bg-slate-100 text-slate-700 text-xs font-medium border border-slate-200">
                            {r.vaccine_name || 'N/A'}
                          </span>
                        </td>
                        <td className="py-4 text-slate-800 font-medium">
                          {r.animal_type || 'N/A'}
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <button className="text-blue-600 font-medium hover:text-blue-800 text-sm flex items-center">
                              View Form
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setMapLocationData({
                                  province: r.province,
                                  district: r.district,
                                  sector: r.sector,
                                  cell: r.cell,
                                  village: r.village
                                });
                              }}
                              className="text-slate-500 font-medium hover:text-slate-700 text-sm flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                              Map
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              ) : (
                <table className="w-full text-left text-sm text-slate-700">
                  <thead className="border-b border-slate-200">
                    <tr>
                      <th className="py-3 font-semibold text-slate-800">Date Submitted</th>
                      <th className="py-3 font-semibold text-slate-800">Veterinary</th>
                      <th className="py-3 font-semibold text-slate-800">Location</th>
                      <th className="py-3 font-semibold text-slate-800">Samples</th>
                      <th className="py-3 font-semibold text-slate-800">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100">
                    {pagination.currentData.map((r) => (
                      <tr key={r.id} className="hover:bg-slate-50/50 transition-colors group cursor-pointer" onClick={() => setSelectedReport(r)}>
                        <td className="py-4 pr-4 text-slate-600 whitespace-nowrap">
                          {new Date(r.createdAt).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                        </td>
                        <td className="py-4">
                          <div className="flex flex-col">
                            <span className="font-semibold text-slate-900">{r.submitted_by || 'Unknown'}</span>
                            <span className="text-xs text-slate-500">{r.veterinary_email}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <div className="flex flex-col">
                            <span className="text-sm font-medium text-slate-800">{r.sector || (r.samples && r.samples[0]?.sector) || r.district}</span>
                            <span className="text-xs text-slate-500">{r.province || 'Eastern Province'} / {r.district || (r.samples && r.samples[0]?.district_origin)}</span>
                          </div>
                        </td>
                        <td className="py-4">
                          <span className="inline-flex items-center px-2.5 py-0.5 rounded-full bg-purple-100 text-purple-800 text-xs font-medium">
                            {r.samples?.length || 0} Samples
                          </span>
                        </td>
                        <td className="py-4">
                          <div className="flex items-center gap-3">
                            <button className="text-blue-600 font-medium hover:text-blue-800 text-sm flex items-center">
                              View Report
                              <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5l7 7-7 7"></path></svg>
                            </button>
                            <button 
                              onClick={(e) => {
                                e.stopPropagation();
                                setMapLocationData({
                                  province: r.province || 'Eastern Province',
                                  district: r.district || (r.samples && r.samples[0]?.district_origin),
                                  sector: r.sector || (r.samples && r.samples[0]?.sector),
                                  cell: r.cell || (r.samples && r.samples[0]?.cell),
                                  village: r.village || (r.samples && r.samples[0]?.village)
                                });
                              }}
                              className="text-slate-500 font-medium hover:text-slate-700 text-sm flex items-center"
                            >
                              <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path></svg>
                              Map
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
              <div className="mt-4">
                <Pagination {...pagination} onPageChange={pagination.jump} />
              </div>
            </>
          )}
        </>
      )}

      <MapModal
        isOpen={!!mapLocationData}
        onClose={() => setMapLocationData(null)}
        locationData={mapLocationData}
        title="Report Location"
      />
    </div>
  );
}
