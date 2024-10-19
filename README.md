# Responsive Google Flights Clone

## Overview

This project is a responsive clone of Google Flights, built using React and the [Sky Scrapper API](https://rapidapi.com/apiheya/api/sky-scrapper) from RapidAPI. The application allows users to search for flights based on origin, destination, date, number of adults, and cabin class.

## Features

- **Responsive Design**: The application is fully responsive and works well on various devices.
- **Flight Search**: Users can search for flights by entering an origin and destination, selecting a date, and choosing the number of adults and cabin class.
- **Suggestions**: As users type in the origin and destination fields, suggestions will appear based on airport data fetched from the API.
- **Error Handling**: The app gracefully handles errors, providing feedback to users when no flights are found or when an error occurs during the API request.

## Technologies Used

- **React**: Frontend library for building the user interface.
- **Axios**: Promise-based HTTP client for making API requests.
- **Lodash**: Utility library for debouncing input.
- **Tailwind CSS**: CSS framework for styling the application.
- **Sky Scrapper API**: Used for fetching flight data.

## Installation

1. Clone the repository:

   ```bash
   git clone https://github.com/taiwo2/Flight-search.git

  ```
2. Navigate to the project directory:

 ```bash
 cd responsive-google-flights-clone
 ```
3. Install dependencies:
```bash
  npm install
 ```
4. Create a .env file with your API key:
 ```bash
  REACT_APP_API_KEY=your_api_key_here

 5. Start the development server:
  npm run dev

 ```
## Usage

1. Open http://localhost:3000.
2. Enter origin and destination, select date, adults, and cabin class.
3. Click "Search Flights" to view options.

## License
This project is licensed under the MIT License. See the LICENSE file for details.

## Acknowledgments

Thanks to RapidAPI for the Sky Scrapper API and Tailwind CSS for styling.

