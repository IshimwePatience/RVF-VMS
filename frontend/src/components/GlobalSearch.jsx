import React, { useState, useEffect, useContext, useRef } from 'react';
import { Search, Clock, ChevronRight } from 'lucide-react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';

export default function GlobalSearch() {
  const { user } = useContext(AuthContext);
  const navigate = useNavigate();

  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [history, setHistory] = useState([]);
  const [isFocused, setIsFocused] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const searchRef = useRef(null);

  useEffect(() => {
    const saved = localStorage.getItem('searchHistory');
    if (saved) {
      try {
        setHistory(JSON.parse(saved));
      } catch (e) {
        setHistory([]);
      }
    }
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  useEffect(() => {
    const fetchResults = async () => {
      if (!query.trim()) {
        setResults([]);
        return;
      }
      setIsLoading(true);
      try {
        const res = await axios.get(`http://localhost:3001/api/search?q=${encodeURIComponent(query)}`);
        setResults(res.data);
      } catch (err) {
        console.error('Search error', err);
      } finally {
        setIsLoading(false);
      }
    };

    const debounce = setTimeout(fetchResults, 300);
    return () => clearTimeout(debounce);
  }, [query]);

  const handleSelect = (item) => {
    // Save to history
    const newHistory = [item, ...history.filter(h => h.id !== item.id)].slice(0, 5);
    setHistory(newHistory);
    localStorage.setItem('searchHistory', JSON.stringify(newHistory));

    setIsFocused(false);
    setQuery('');
    navigate(item.link);
  };

  const placeholder = user?.role === 'Admin'
    ? "Search all records, users, and stocks"
    : "Search vaccines, inventory, and requests";

  return (
    <div className="relative w-full" ref={searchRef}>
      <div className={`w-full flex items-center bg-slate-100/80 hover:bg-slate-100 rounded-full px-4 py-2.5 transition-colors ${isFocused ? 'ring-2 ring-[#12aeec]/50 bg-white' : ''}`}>
        <Search className="w-5 h-5 text-slate-500 mr-3" />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => setIsFocused(true)}
          placeholder={placeholder}
          className="bg-transparent border-none outline-none w-full text-sm placeholder:text-slate-500 text-slate-800"
        />
      </div>

      {isFocused && (
        <div className="absolute top-full left-0 right-0 mt-2 bg-white rounded-xl shadow-xl border border-slate-100 py-2 z-50 max-h-[60vh] overflow-y-auto overflow-x-hidden">
          {query.trim() === '' ? (
            <div className="py-2">
              {history.length > 0 ? (
                history.map((h, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(h)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-4 transition-colors normal-case"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center"><Search className="w-5 h-5" /></div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-[15px] text-slate-900 truncate">{h.label}</div>
                      <div className="text-[13px] text-slate-500 truncate">{h.type}</div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="px-4 py-3 text-sm text-slate-500 text-center">No recent searches</div>
              )}
            </div>
          ) : (
            <div className="py-2">
              {results.length > 0 ? (
                results.map((r, i) => (
                  <button
                    key={i}
                    onClick={() => handleSelect(r)}
                    className="w-full text-left px-4 py-2 hover:bg-slate-100 flex items-center gap-4 transition-colors normal-case"
                  >
                    <div className="w-10 h-10 shrink-0 rounded-full bg-slate-100 text-slate-800 flex items-center justify-center"><Search className="w-5 h-5" /></div>
                    <div className="flex-1 overflow-hidden">
                      <div className="text-[15px] text-slate-900 truncate">
                        {r.label.split(new RegExp(`(${query})`, 'gi')).map((part, index) => 
                          part.toLowerCase() === query.toLowerCase() ? <strong key={index}>{part}</strong> : part
                        )}
                      </div>
                      <div className="text-[13px] text-slate-500 truncate">{r.type}</div>
                    </div>
                  </button>
                ))
              ) : (
                !isLoading && <div className="px-4 py-3 text-sm text-slate-500 text-center">No results found for "{query}"</div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
