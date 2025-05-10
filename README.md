# MovieVerse

A modern web application for exploring and discovering movies using The Movie Database (TMDB) API. Built with React and Material-UI, this application provides a rich user interface for browsing trending movies, searching for specific titles, and viewing detailed information about movies.

## Features

- 🎬 Browse trending movies
- 🔍 Search movies with advanced filtering options
- 📱 Responsive design for all devices
- 🎨 Modern UI with Material-UI components
- 🎥 View detailed movie information including:
  - Movie details and synopsis
  - Cast information
  - Video trailers
  - Genre information
- 🎯 Discover movies with various filters:
  - By genre
  - By release year
  - By rating

## Prerequisites

- Node.js (v14 or higher)
- npm or yarn
- TMDB API token

## Setup

1. Clone the repository:
```bash
git clone <repository-url>
cd MovieVerse
```

2. Install dependencies:
```bash
npm install
# or
yarn install
```

3. Create a `.env` file in the root directory and add your TMDB API token:
```
REACT_APP_TMDB_API_TOKEN=your_api_token_here
```

4. Start the development server:
```bash
npm start
# or
yarn start
```

The application will be available at `http://localhost:3000` in development mode.

## Deployment

The application is deployed and available at [MovieVerse](https://movie-verse-lilac.vercel.app/). The deployment is handled through Vercel, providing:
- Automatic deployments on git push
- HTTPS encryption
- Global CDN distribution
- Continuous deployment from the main branch

## API Integration

The application uses The Movie Database (TMDB) API v3. The following endpoints are implemented:

- `/trending/movie/{time_window}` - Get trending movies
- `/search/movie` - Search for movies
- `/movie/{id}` - Get movie details
- `/genre/movie/list` - Get movie genres
- `/discover/movie` - Discover movies with filters
- `/movie/{id}/videos` - Get movie videos/trailers
- `/movie/{id}/credits` - Get movie cast information

## Project Structure

```
src/
├── components/     # Reusable UI components
├── pages/         # Page components
├── services/      # API integration services
├── hooks/         # Custom React hooks
├── context/       # React context providers
└── App.js         # Main application component
```

## Scripts

- `npm start` - Runs the app in development mode

## Technologies Used

- React
- Material-UI
- React Router
- Axios
- TMDB API
