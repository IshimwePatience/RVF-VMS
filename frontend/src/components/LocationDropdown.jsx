import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchableDropdown from './SearchableDropdown';

const cache = {};

export default function LocationDropdown({ type, params = {}, value, onChange, placeholder, disabled, isMulti = false }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Check required params based on type
    if (type === 'sectors' && !params.district) { setOptions([]); return; }
    if (type === 'cells' && (!params.district || !params.sector)) { setOptions([]); return; }
    if (type === 'villages' && (!params.district || !params.sector || !params.cell)) { setOptions([]); return; }

    const key = `${type}-${JSON.stringify(params)}`;
    if (cache[key]) {
      setOptions(cache[key]);
      return;
    }

    let isMounted = true;
    setLoading(true);
    axios.get(`/rvf-api/locations/${type}`, { params })
      .then(res => {
        if (isMounted) {
          cache[key] = res.data;
          setOptions(res.data);
          setLoading(false);
        }
      })
      .catch(err => {
        console.error(`Failed to fetch ${type}:`, err);
        if (isMounted) {
          setOptions([]);
          setLoading(false);
        }
      });

    return () => { isMounted = false; };
  }, [type, params.district, params.sector, params.cell]);

  return (
    <SearchableDropdown
      options={options}
      value={value || ''}
      onChange={onChange}
      placeholder={loading ? 'Loading...' : placeholder}
      disabled={disabled || loading || (type !== 'districts' && options.length === 0)}
      loading={loading}
      isMulti={isMulti}
    />
  );
}
