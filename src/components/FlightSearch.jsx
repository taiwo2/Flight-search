import React, { useState, useEffect, useCallback } from 'react';
import axios from 'axios';
import debounce from 'lodash.debounce';
import InputField from './InputField';
import FlightResults from './FlightResults';

function FlightSearch() {
  const apiKey = import.meta.env.VITE_API_KEY;

  const [searchParams, setSearchParams] = useState({
    origin: '',
    destination: '',
    date: '',
    adults: '1',
    cabinClass: 'economy',
    originEntityId: '',
    destinationEntityId: '',
  });
  const [originSuggestions, setOriginSuggestions] = useState([]);
  const [destinationSuggestions, setDestinationSuggestions] = useState([]);
  const [flightData, setFlightData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAirports, setSelectedAirports] = useState({
    origin: false,
    destination: false,
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setSearchParams((prevParams) => ({
      ...prevParams,
      [name]: value || '',
      [`${name}EntityId`]: '',
    }));
    setSelectedAirports(prev => ({
      ...prev,
      [name]: false
    }));
  };

  const fetchSuggestions = async (input, type) => {
    if (input.length < 2 || selectedAirports[type] ) {
      type === 'origin' ? setOriginSuggestions([]) : setDestinationSuggestions([]);
      return;
    }

    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchAirport',
      params: { query: input },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      const suggestions = response.data.data.map((item) => ({
        entityId: item.entityId,
        skyId: item.skyId,
        suggestionTitle: item.presentation.suggestionTitle,
      }));
      type === 'origin' ? setOriginSuggestions(suggestions) : setDestinationSuggestions(suggestions);
    } catch (error) {
      console.error('Error fetching suggestions:', error);
      type === 'origin' ? setOriginSuggestions([]) : setDestinationSuggestions([]);
    }
  };

  const debouncedFetchSuggestions = useCallback(debounce(fetchSuggestions, 300), []);

  useEffect(() => {
    if (searchParams.origin && !selectedAirports.origin) {
      debouncedFetchSuggestions(searchParams.origin, 'origin');
    } else {
      setOriginSuggestions([]);
    }
  }, [searchParams.origin, debouncedFetchSuggestions]);

  useEffect(() => {
    if (searchParams.destination && !selectedAirports.destination) {
      debouncedFetchSuggestions(searchParams.destination, 'destination');
    } else {
      setDestinationSuggestions([]);
    }
  }, [searchParams.destination, debouncedFetchSuggestions]);

  const handleSuggestionSelect = (suggestion, type) => {
    setSearchParams((prevParams) => ({
      ...prevParams,
      [type]: suggestion.skyId,
      [`${type}EntityId`]: suggestion.entityId,
    }));
    setSelectedAirports(prev => ({
      ...prev,
      [type]: true
    }));
       // Clear suggestions after selection
    if (type === 'origin') {
      setOriginSuggestions([]);
    } else {
      setDestinationSuggestions([]);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setFlightData(null);

    const options = {
      method: 'GET',
      url: 'https://sky-scrapper.p.rapidapi.com/api/v1/flights/searchFlights',
      params: {
        originSkyId: searchParams.origin,
        destinationSkyId: searchParams.destination,
        originEntityId: searchParams.originEntityId,
        destinationEntityId: searchParams.destinationEntityId,
        date: searchParams.date,
        adults: searchParams.adults,
        cabinClass: searchParams.cabinClass,
        currency: 'USD',
        market: 'en-US',
        countryCode: 'US',
      },
      headers: {
        'x-rapidapi-key': apiKey,
        'x-rapidapi-host': 'sky-scrapper.p.rapidapi.com',
      },
    };

    try {
      const response = await axios.request(options);
      if (response.data && response.data.data) {
        const limitedData = {
          ...response.data.data,
          itineraries: response.data.data.itineraries.slice(0, 30),
        };
        setFlightData(limitedData);
      } else {
        setError('No flights found or invalid response format.');
      }
    } catch (error) {
      setError('An error occurred while fetching flights. Please try again.');
      console.error('API Error:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6 text-center">Flight Search</h1>
  
      {/* Form */}
      <form 
        onSubmit={handleSubmit} 
        className="bg-white shadow-lg rounded-lg p-4 sm:p-8 space-y-4 sm:space-y-0 flex flex-col sm:flex-row sm:items-end sm:space-x-4"
      >
        {/* Origin Field */}
        <div className="flex-grow sm:w-1/6">
          <InputField
            name="origin"
            value={searchParams.origin}
            onChange={handleInputChange}
            placeholder="Origin"
            suggestions={originSuggestions}
            handleSelect={handleSuggestionSelect}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onBlur={() => setDestinationSuggestions([])} 
          />
        </div>
  
        {/* Destination Field */}
        <div className="flex-grow sm:w-1/6">
          <InputField
            name="destination"
            value={searchParams.destination}
            onChange={handleInputChange}
            placeholder="Destination"
            suggestions={destinationSuggestions}
            handleSelect={handleSuggestionSelect}
            className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            onBlur={() => setDestinationSuggestions([])}
          />
        </div>
  
        {/* Date Field */}
        <div className="flex-grow sm:w-1/6">
          <div className="relative mb-4">
            <input
              type="date"
              name="date"
              value={searchParams.date}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>
  
        {/* Adults and Cabin Class Fields */}
        <div className="flex-grow sm:w-1/6 flex flex-col sm:flex-row space-y-4 sm:space-y-0 sm:space-x-2">
          <div className="relative mb-4">
            <select
              name="adults"
              value={searchParams.adults}
              onChange={handleInputChange}
              className="w-full px-4 py-2 h-[45px] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="1">1 Adult</option>
              <option value="2">2 Adults</option>
              <option value="3">3 Adults</option>
              <option value="4">4 Adults</option>
            </select>
          </div>
  
          <div className="relative mb-4">
            <select
              name="cabinClass"
              value={searchParams.cabinClass}
              onChange={handleInputChange}
              className="w-full px-4 py-2 h-[45px] border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="economy">Economy</option>
              <option value="business">Business</option>
              <option value="first">First Class</option>
            </select>
          </div>
        </div>
  
        {/* Submit Button */}
        <div className="sm:w-1/6">
          <div className="relative mb-4">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 h-[45px] rounded-md hover:bg-blue-600 transition focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              Search
            </button>
          </div>
        </div>
      </form>
  
      {loading && <p className="text-center mt-4">Loading...</p>}
      {error && <p className="text-red-500 text-center mt-4">{error}</p>}
      {flightData && <FlightResults flightData={flightData} />}
    </div>
  );
  
}

export default FlightSearch;
