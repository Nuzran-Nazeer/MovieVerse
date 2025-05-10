const API_TOKEN = process.env.REACT_APP_TMDB_API_TOKEN;
const BASE_URL = 'https://api.themoviedb.org/3';

const headers = {
  'Authorization': `Bearer ${API_TOKEN}`,
  'Content-Type': 'application/json'
};

export const fetchTrendingMovies = async (timeWindow = 'day', page = 1) => {
  try {
    const response = await fetch(`${BASE_URL}/trending/movie/${timeWindow}?page=${page}`, {
      headers
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching trending movies:', error);
    throw error;
  }
};

export const searchMovies = async (query, page = 1, params = {}) => {
  try {
    const url = new URL(`${BASE_URL}/search/movie`);
    url.searchParams.append('query', query);
    url.searchParams.append('page', page);
    if (params.include_adult !== undefined) url.searchParams.append('include_adult', params.include_adult);
    if (params.language) url.searchParams.append('language', params.language);
    if (params.primary_release_year) url.searchParams.append('primary_release_year', params.primary_release_year);
    if (params.region) url.searchParams.append('region', params.region);
    const response = await fetch(url.toString(), { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error searching movies:', error);
    throw error;
  }
};

export const getMovieDetails = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}`, {
      headers
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching movie details:', error);
    throw error;
  }
};

export const fetchGenres = async () => {
  try {
    const response = await fetch(`${BASE_URL}/genre/movie/list?language=en-US`, { headers });
    const data = await response.json();
    return data.genres;
  } catch (error) {
    console.error('Error fetching genres:', error);
    throw error;
  }
};

export const discoverMovies = async (params = {}, page = 1) => {
  try {
    const url = new URL(`${BASE_URL}/discover/movie`);
    url.searchParams.append('page', page);
    url.searchParams.append('include_adult', 'false');
    if (params.language) url.searchParams.append('language', params.language);
    if (params.primary_release_year) url.searchParams.append('primary_release_year', params.primary_release_year);
    if (params.region) url.searchParams.append('region', params.region);
    if (params.with_genres) url.searchParams.append('with_genres', params.with_genres);
    if (params['vote_average.gte']) url.searchParams.append('vote_average.gte', params['vote_average.gte']);
    const response = await fetch(url.toString(), { headers });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error discovering movies:', error);
    throw error;
  }
};

export const getMovieVideos = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/videos`, {
      headers
    });
    const data = await response.json();
    return data.results;
  } catch (error) {
    console.error('Error fetching movie videos:', error);
    throw error;
  }
};

export const getMovieCredits = async (movieId) => {
  try {
    const response = await fetch(`${BASE_URL}/movie/${movieId}/credits`, {
      headers
    });
    const data = await response.json();
    return data.cast;
  } catch (error) {
    console.error('Error fetching movie credits:', error);
    throw error;
  }
}; 