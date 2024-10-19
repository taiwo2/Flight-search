import React from 'react';

// Function to format date and time with AM/PM
const formatDateTime = (dateTime) => {
  const date = new Date(dateTime);
  return date.toLocaleString('en-US', {
    hour: 'numeric',
    minute: 'numeric',
    hour12: true,
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
};

const FlightResults = ({ flightData }) => {
  return (
    <div className="mt-6">
      <h2 className="text-2xl font-semibold text-center mb-6">Search Results</h2>
      <p className="text-center mb-4 font-semibold">Total Results: {flightData.context.totalResults}</p>

      {/* {flightData.destinationImageUrl && (
        <div className="flex justify-center mb-8">
          <img
            src={flightData.destinationImageUrl}
            alt="Destination"
            className="max-w-xs rounded-lg shadow-md"
          />
        </div>
      )} */}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {flightData.itineraries.map((itinerary, index) => (
          <div
            key={index}
            className="bg-gradient-to-br from-gray-50 via-blue-50 to-blue-100 shadow-lg rounded-lg p-4 transition-transform transform hover:scale-105 hover:shadow-xl flex flex-col"
          >
            <p className="mb-2">
              <span className="font-bold">Price:</span> <span className="text-xl text-blue-600">{itinerary.price.formatted}</span>
            </p>

            {itinerary.legs.map((leg, legIndex) => (
              <div key={legIndex} className="mt-4 border-t pt-4">
                <p>
                  <span className="font-bold">From:</span> {leg.origin.name} ({leg.origin.id})
                </p>
                <p>
                  <span className="font-bold">To:</span> {leg.destination.name} ({leg.destination.id})
                </p>

                {/* Format the departure and arrival times */}
                <p>
                  <span className="font-bold">Departure:</span> {formatDateTime(leg.departure)}
                </p>
                <p>
                  <span className="font-bold">Arrival:</span> {formatDateTime(leg.arrival)}
                </p>

                {/* Displaying Airline Name with different color */}
                <div className="flex items-center mt-2">
                  <p className="text-center">
                    <span className="font-bold text-blue-600 me-2">Carrier:</span> 
                    <span className="text-green-600">{leg.carriers.marketing[0].name}</span>
                  </p>
                </div>
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FlightResults;
