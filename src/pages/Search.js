import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  TextField,
  MenuItem,
  InputAdornment,
  useTheme,
  Paper,
  Divider,
  Autocomplete,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MovieCard from '../components/Movie/MovieCard';
import { searchMovies } from '../services/tmdbApi';
import { useNavigate } from 'react-router-dom';

const LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'es-ES', label: 'Spanish' },
  { code: 'fr-FR', label: 'French' },
  { code: 'de-DE', label: 'German' },
  { code: 'ja-JP', label: 'Japanese' },
  { code: 'ko-KR', label: 'Korean' },
  // Add more as needed
];

const Search = ({ favorites, onToggleFavorite }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [year, setYear] = useState('');
  const [language, setLanguage] = useState('en-US');
  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [searched, setSearched] = useState(false);
  const [lastQueries, setLastQueries] = useState([]);
  const [lastMovie, setLastMovie] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  // Load last searched movies from localStorage on mount
  useEffect(() => {
    const lastMovies = localStorage.getItem('lastSearchedMovies');
    if (lastMovies) {
      setMovies(JSON.parse(lastMovies));
      setSearched(true);
    }
  }, []);

  // Load last searched queries from localStorage on mount
  useEffect(() => {
    const last = localStorage.getItem('lastSearchedQueries');
    if (last) {
      setLastQueries(JSON.parse(last));
    }
  }, []);

  // Load last visited movie from localStorage on mount
  useEffect(() => {
    const last = localStorage.getItem('lastSearchedMovie');
    if (last) {
      setLastMovie(JSON.parse(last));
    }
  }, []);

  // Save a new query to localStorage
  const saveQuery = (query, year, language) => {
    const newQuery = { query, year, language };
    let updated = [newQuery, ...lastQueries.filter(q => q.query !== query || q.year !== year || q.language !== language)];
    if (updated.length > 8) updated = updated.slice(0, 8);
    setLastQueries(updated);
    localStorage.setItem('lastSearchedQueries', JSON.stringify(updated));
  };

  // Save last visited movie to localStorage
  const handleMovieClick = (movie) => {
    localStorage.setItem('lastSearchedMovie', JSON.stringify(movie));
    setLastMovie(movie);
    navigate(`/movie/${movie.id}`);
  };

  const handleSearch = async (resetPage = true) => {
    if (!searchQuery.trim()) return;
    try {
      setLoading(true);
      setError(null);
      setSearched(true);
      const searchParams = {
        query: searchQuery,
        include_adult: false,
        language,
        primary_release_year: year ? Number(year) : undefined,
        page: resetPage ? 1 : page + 1,
      };
      const data = await searchMovies(searchParams.query, searchParams.page, searchParams);
      const newMovies = resetPage ? data.results : [...movies, ...data.results];
      setMovies(newMovies);
      setTotalPages(data.total_pages);
      setPage(resetPage ? 1 : page + 1);
      localStorage.setItem('lastSearchedMovies', JSON.stringify(newMovies));
      saveQuery(searchQuery, year, language);
    } catch (err) {
      setError('Failed to search movies. Please try again later.');
    } finally {
      setLoading(false);
    }
  };

  const loadMore = async () => {
    if (loadingMore) return;
    try {
      setLoadingMore(true);
      await handleSearch(false);
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, pb: 6 }}>
      <Container maxWidth="lg" sx={{ mt: 4, pt: { xs: 8, sm: 10 } }}>
        <Paper elevation={0} sx={{ p: { xs: 2, sm: 4 }, mb: 4, borderRadius: 3, background: 'none', boxShadow: 'none', maxWidth: 600, mx: 'auto' }}>
          <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 2 }}>
            <Autocomplete
              freeSolo
              options={lastMovie ? [lastMovie] : []}
              getOptionLabel={option => option.title || ''}
              openOnFocus
              disableClearable
              noOptionsText={lastMovie ? '' : 'No last visited movie'}
              sx={{ width: '100%', mb: 2 }}
              renderOption={(props, option) => (
                <Box component="li" {...props} sx={{ p: 1, display: 'flex', alignItems: 'center', gap: 2, cursor: 'pointer' }} onClick={() => handleMovieClick(option)}>
                  <img
                    src={option.poster_path ? `https://image.tmdb.org/t/p/w92${option.poster_path}` : 'https://via.placeholder.com/92x138?text=No+Poster'}
                    alt={option.title}
                    style={{ width: 46, height: 69, borderRadius: 6, objectFit: 'cover', background: '#222' }}
                  />
                  <Box>
                    <Typography variant="subtitle2" sx={{ fontWeight: 600 }}>{option.title}</Typography>
                    <Typography variant="caption" color="text.secondary">{option.release_date ? new Date(option.release_date).getFullYear() : '-'}</Typography>
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>★ {option.vote_average ? option.vote_average.toFixed(1) : '-'}</Typography>
                  </Box>
                </Box>
              )}
              renderInput={(params) => (
                <TextField
                  {...params}
                  fullWidth
                  variant="outlined"
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={e => setSearchQuery(e.target.value)}
                  onKeyDown={e => { if (e.key === 'Enter') handleSearch(true); }}
                  InputProps={{
                    ...params.InputProps,
                    sx: { borderRadius: 999, pr: 0, background: theme.palette.background.default },
                    endAdornment: (
                      <InputAdornment position="end">
                        <Button
                          variant="contained"
                          color="primary"
                          onClick={() => handleSearch(true)}
                          disabled={!searchQuery.trim() || loading}
                          sx={{
                            minWidth: 40,
                            height: 40,
                            borderRadius: '50%',
                            boxShadow: 1,
                            p: 0,
                            ml: -2,
                            backgroundColor: theme.palette.primary.main,
                            color: theme.palette.getContrastText(theme.palette.primary.main),
                            '&:hover': {
                              backgroundColor: theme.palette.primary.dark,
                            },
                          }}
                        >
                          <SearchIcon />
                        </Button>
                      </InputAdornment>
                    ),
                  }}
                  sx={{
                    borderRadius: 999,
                    background: theme.palette.background.default,
                    boxShadow: 1,
                    input: { color: theme.palette.text.primary },
                  }}
                />
              )}
            />
            <Box sx={{ display: 'flex', gap: 2, width: '100%', justifyContent: 'center', mt: 1 }}>
              <TextField
                label="Year"
                type="text"
                value={year}
                onChange={e => setYear(e.target.value)}
                sx={{ minWidth: 120, borderRadius: 999, background: theme.palette.background.default }}
                variant="outlined"
              />
              <TextField
                select
                label="Language"
                value={language}
                onChange={e => setLanguage(e.target.value)}
                sx={{ minWidth: 140, borderRadius: 999, background: theme.palette.background.default }}
                variant="outlined"
              >
                {LANGUAGES.map(lang => (
                  <MenuItem key={lang.code} value={lang.code}>{lang.label}</MenuItem>
                ))}
              </TextField>
            </Box>
          </Box>
        </Paper>
        <Divider sx={{ mb: 3 }} />
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : movies.length === 0 && searched ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="300px" sx={{ opacity: 0.8 }}>
            <Typography variant="h6" sx={{ color: theme.palette.text.secondary }} align="center">
              No movies found for your search.<br />
              Try a different keyword or filter.
            </Typography>
          </Box>
        ) : (
          <>
            <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
              {movies.map((movie) => (
                <Grid item key={movie.id}>
                  <MovieCard
                    movie={movie}
                    isFavorite={favorites.some(fav => fav.id === movie.id)}
                    onToggleFavorite={() => onToggleFavorite(movie)}
                    onClick={() => handleMovieClick(movie)}
                  />
                </Grid>
              ))}
            </Grid>
            {page < totalPages && movies.length > 0 && (
              <Box display="flex" justifyContent="center" mt={5}>
                <Button
                  variant="contained"
                  onClick={loadMore}
                  disabled={loadingMore}
                  sx={{
                    minWidth: 200,
                    fontWeight: 700,
                    fontSize: '1.1rem',
                    borderRadius: 2,
                    boxShadow: 2,
                    backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.main : theme.palette.background.paper,
                    color: theme.palette.mode === 'light' ? theme.palette.getContrastText(theme.palette.primary.main) : theme.palette.text.primary,
                    border: theme.palette.mode === 'light' ? 'none' : `1.5px solid ${theme.palette.divider}`,
                    '&:hover': {
                      backgroundColor: theme.palette.mode === 'light' ? theme.palette.primary.dark : theme.palette.action.hover,
                    },
                  }}
                >
                  {loadingMore ? (
                    <>
                      <CircularProgress size={24} sx={{ mr: 1 }} />
                      Loading...
                    </>
                  ) : (
                    'Load More'
                  )}
                </Button>
              </Box>
            )}
          </>
        )}
      </Container>
    </Box>
  );
};

export default Search; 