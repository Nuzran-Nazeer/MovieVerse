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
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import MovieCard from '../components/Movie/MovieCard';
import { searchMovies } from '../services/tmdbApi';
import { useNavigate } from 'react-router-dom';
import HistoryIcon from '@mui/icons-material/History';

const LANGUAGES = [
  { code: 'en-US', label: 'English' },
  { code: 'es-ES', label: 'Spanish' },
  { code: 'fr-FR', label: 'French' },
  { code: 'de-DE', label: 'German' },
  { code: 'ja-JP', label: 'Japanese' },
  { code: 'ko-KR', label: 'Korean' },
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
  const [lastMovie, setLastMovie] = useState(null);
  const theme = useTheme();
  const navigate = useNavigate();

  useEffect(() => {
    const lastMovie = localStorage.getItem('lastSearchedMovie');
    if (lastMovie) {
      setLastMovie(JSON.parse(lastMovie));
    }
  }, []);

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
            <TextField
              fullWidth
              variant="outlined"
              placeholder="Search movies..."
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
              onKeyDown={e => { if (e.key === 'Enter') handleSearch(true); }}
              InputProps={{
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
                        ml: -6,
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

        {/* Last Searched Movie Section */}
        {lastMovie && !searched && (
          <Paper sx={{ p: 3, mb: 4, borderRadius: 2 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
              <HistoryIcon sx={{ mr: 1, color: theme.palette.primary.main }} />
              <Typography variant="h6">Last Searched Movie</Typography>
            </Box>
            <Divider sx={{ mb: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'flex-start' }}>
              <MovieCard
                movie={lastMovie}
                isFavorite={favorites.some(fav => fav.id === lastMovie.id)}
                onToggleFavorite={() => onToggleFavorite(lastMovie)}
              />
            </Box>
          </Paper>
        )}

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
            {page < totalPages && (
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