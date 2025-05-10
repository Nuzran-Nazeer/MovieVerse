import axios from 'axios';

const API_KEY = process.env.REACT_APP_TMDB_API_KEY;
const BASE_URL = 'https://api.themoviedb.org/3';

const api = axios.create({
  baseURL: BASE_URL,
  params: {
    api_key: API_KEY,
  },
});

export const getMovies = async (page = 1) => {
  const response = await api.get('/movie/popular', {
    params: { page },
  });
  return response.data;
};

export const searchMovies = async (query, page = 1) => {
  const response = await api.get('/search/movie', {
    params: {
      query,
      page,
    },
  });
  return response.data;
};

export const getMovieDetails = async (movieId) => {
  const [movieDetails, credits] = await Promise.all([
    api.get(`/movie/${movieId}`),
    api.get(`/movie/${movieId}/credits`),
  ]);

  return {
    ...movieDetails.data,
    credits: credits.data,
  };
};

export const getTrendingMovies = async () => {
  const response = await api.get('/trending/movie/day');
  return response.data;
};

export const getMovieVideos = async (movieId) => {
  const response = await api.get(`/movie/${movieId}/videos`);
  return response.data;
}; 