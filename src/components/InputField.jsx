import React from 'react';

const InputField = ({ name, value, onChange, placeholder, suggestions, handleSelect })  => {
  return (
    <div className="relative mb-4">
      <input
        type="text"
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        required
      />
      {suggestions.length > 0 && (
        <ul className="absolute bg-white shadow-md rounded-lg mt-2 w-full z-10">
          {suggestions.map((suggestion) => (
            <li
              key={suggestion.entityId}
              onClick={() => handleSelect(suggestion, name)}
              className="cursor-pointer hover:bg-gray-200 px-4 py-2"
            >
              {suggestion.suggestionTitle} ({suggestion.skyId})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default InputField;
