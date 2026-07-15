import React, { useState, useEffect } from 'react';
import axios from 'axios';
import SearchableDropdown from './SearchableDropdown';

const cache = {};

export default function LocationDropdown({ type, params = {}, value, onChange, placeholder, disabled, isMulti = false }) {
  const [options, setOptions] = useState([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Helper to check if a param is empty
    const isEmpty = (val) => !val || (Array.isArray(val) && val.length === 0);

    // Check required params based on type
    if (type === 'sectors' && isEmpty(params.district)) { setOptions([]); return; }
    if (type === 'cells' && (isEmpty(params.district) || isEmpty(params.sector))) { setOptions([]); return; }
    if (type === 'villages' && (isEmpty(params.district) || isEmpty(params.sector) || isEmpty(params.cell))) { setOptions([]); return; }

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
