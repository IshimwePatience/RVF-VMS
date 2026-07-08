import React from 'react';
import Select from 'react-select';

export default function SearchableDropdown({ options, value, onChange, placeholder, disabled, loading, isClearable = true }) {
  // Format options for react-select: { value, label }
  const formattedOptions = options.map(opt => (
    typeof opt === 'string' ? { value: opt, label: opt } : opt
  ));

  const selectedValue = formattedOptions.find(opt => opt.value === value) || null;

  const customStyles = {
    control: (provided, state) => ({
      ...provided,
      backgroundColor: 'transparent',
      border: 'none',
      boxShadow: state.isFocused ? '0 0 0 1px #3b82f6' : 'none',
      minHeight: '38px',
      cursor: 'pointer',
      width: '100%',
      flexWrap: 'nowrap'
    }),
    valueContainer: (provided) => ({
      ...provided,
      padding: '0 2px',
      justifyContent: 'center',
      flexWrap: 'nowrap',
      overflow: 'hidden'
    }),
    singleValue: (provided) => ({
      ...provided,
      textAlign: 'center',
      color: 'inherit'
    }),
    placeholder: (provided) => ({
      ...provided,
      textAlign: 'center',
      color: '#94a3b8',
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    }),
    indicatorSeparator: () => ({
      display: 'none',
    }),
    dropdownIndicator: (provided) => ({
      ...provided,
      padding: '2px',
      color: '#94a3b8',
      cursor: 'pointer',
      '&:hover': {
        color: '#64748b'
      }
    }),
    clearIndicator: (provided) => ({
      ...provided,
      padding: '2px',
      cursor: 'pointer'
    }),
    menu: (provided) => ({
      ...provided,
      zIndex: 50,
      textAlign: 'left',
      minWidth: '150px', 
      maxWidth: '90vw'   
    }),
    menuPortal: base => ({ ...base, zIndex: 9999 }),
    option: (provided, state) => ({
      ...provided,
      backgroundColor: state.isSelected ? '#3b82f6' : state.isFocused ? '#eff6ff' : 'white',
      color: state.isSelected ? 'white' : '#1e293b',
      cursor: 'pointer',
      fontSize: '14px'
    })
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <Select
        className="w-full"
        styles={customStyles}
        options={formattedOptions}
        value={selectedValue}
        onChange={(selected) => onChange(selected ? selected.value : '')}
        placeholder={placeholder}
        isDisabled={disabled}
        isLoading={loading}
        isClearable={isClearable}
        menuPortalTarget={document.body}
        menuPosition="fixed"
        menuPlacement="auto"
      />
    </div>
  );
}
