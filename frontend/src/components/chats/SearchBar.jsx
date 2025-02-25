import React, {useEffect, useState} from 'react';
import {debounce} from 'lodash';
import {FiSearch, FiArrowLeft, FiArrowRight} from 'react-icons/fi';

const SearchBar = ({
  placeholder,
  onSearch = () => {},
  debounceDelay = 300,
  searchContext = 'default', // Added searchContext to identify the component
}) => {
  // Validate onSearch to ensure it's a function
  if (typeof onSearch !== 'function') {
    console.error('onSearch prop must be a function');
    return null; // Render nothing if onSearch is invalid
  }

  const [isFocused, setIsFocused] = useState(false);

  // Debounce the onSearch function to reduce calls
  const debouncedOnSearch = debounce((value) => {
    onSearch(value, searchContext); // Pass searchContext along with the search term
  }, debounceDelay);

  // Handler for focus and blur events
  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  const handleInputChange = (e) => {
    const {value} = e.target;
    debouncedOnSearch(value); // Call the debounced search function
  };

  // Cleanup debounce on unmount
  useEffect(() => {
    return () => {
      debouncedOnSearch.cancel();
    };
  }, [debouncedOnSearch]);

  return (
    <div className="flex items-center p-1 pl-5 bg-gray-100 m-2 rounded-lg  max-w-full">
      {/* Conditionally render search or arrow icon */}
      <div
        className={`mr-7 transition-transform duration-300 ${
          isFocused ? '-rotate-180' : 'rotate-0'
        }`}>
        {isFocused ? (
          <FiArrowRight className="text-black text-xl" />
        ) : (
          <FiSearch className="text-black text-xl" />
        )}
      </div>

      <input
        type="text"
        placeholder={placeholder || 'Search...'}
        onFocus={handleFocus}
        onBlur={handleBlur}
        onChange={handleInputChange}
        className="truncate flex-grow bg-transparent focus:outline-none text-gray-700 placeholder-gray-500 text-lg "
      />
    </div>
  );
};

export default SearchBar;
