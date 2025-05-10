import React, { useState, useEffect } from 'react';
import {
  Container,
  Grid,
  Typography,
  Box,
  Button,
  CircularProgress,
  TextField,
  Autocomplete,
  useTheme,
} from '@mui/material';
import MovieCard from '../components/Movie/MovieCard';
import { fetchGenres, discoverMovies } from '../services/tmdbApi';

const Browse = ({ favorites, onToggleFavorite }) => {

  const [movies, setMovies] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loadingMore, setLoadingMore] = useState(false);
  const [genres, setGenres] = useState([]);
  const [selectedGenres, setSelectedGenres] = useState([]);
  const [year, setYear] = useState('');
  const [rating, setRating] = useState('');
  const theme = useTheme();

  // Fetch genres
  useEffect(() => {
    fetchGenres().then(setGenres).catch(() => setGenres([]));
  }, []);

  // Fetch movies when filters change
  useEffect(() => {
    const loadMovies = async () => {
      try {
        setLoading(true);
        const params = {
          with_genres: selectedGenres.map(g => g.id).join(',') || undefined,
          primary_release_year: year ? Number(year) : undefined,
        };
        if (rating !== '' && !isNaN(Number(rating))) {
          params['vote_average.gte'] = Number(rating);
        }
        const data = await discoverMovies(params, 1);
        setMovies(data.results);
        setTotalPages(data.total_pages);
        setPage(1);
        setError(null);
      } catch (err) {
        setError('Failed to load movies. Please try again later.');
      } finally {
        setLoading(false);
      }
    };
    loadMovies();
  }, [selectedGenres, year, rating]);

  // Load more movies
  const loadMore = async () => {
    if (loadingMore) return;
    try {
      setLoadingMore(true);
      const nextPage = page + 1;
      const params = {
        with_genres: selectedGenres.map(g => g.id).join(',') || undefined,
        primary_release_year: year ? Number(year) : undefined,
      };
      if (rating !== '' && !isNaN(Number(rating))) {
        params['vote_average.gte'] = Number(rating);
      }
      const data = await discoverMovies(params, nextPage);
      setMovies((prevMovies) => [...prevMovies, ...data.results]);
      setPage(nextPage);
      setError(null);
    } catch (err) {
      setError('Failed to load more movies. Please try again later.');
    } finally {
      setLoadingMore(false);
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', background: theme.palette.background.default, pb: 6 }}>
      <Container maxWidth="lg" sx={{ mt: 4, pt: { xs: 8, sm: 10 } }}>
        <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 2, mb: 4, p: 2, borderRadius: 2, background: theme.palette.background.paper, boxShadow: 1 }}>
          <Autocomplete
            multiple
            options={genres}
            getOptionLabel={(option) => option.name}
            value={selectedGenres}
            onChange={(e, value) => setSelectedGenres(value)}
            filterSelectedOptions
            sx={{ minWidth: 200, flex: 1 }}
            renderInput={(params) => (
              <TextField {...params} label="Genres" placeholder="Select genres" />
            )}
          />
          <TextField
            label="Year"
            type="text"
            value={year}
            onChange={e => setYear(e.target.value)}
            sx={{ minWidth: 100 }}
            variant="outlined"
          />
          <TextField
            label="Min Rating"
            type="text"
            value={rating}
            onChange={e => setRating(e.target.value)}
            sx={{ minWidth: 120 }}
            variant="outlined"
          />
        </Box>

        {/* Error message */}
        {error && (
          <Typography color="error" sx={{ mb: 2 }}>
            {error}
          </Typography>
        )}

        {/* Loading state */}
        {loading ? (
          <Box display="flex" justifyContent="center" alignItems="center" minHeight="200px">
            <CircularProgress />
          </Box>
        ) : movies.length === 0 ? (
          <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="300px" sx={{ opacity: 0.8 }}>
            <Typography variant="h6" sx={{ color: theme.palette.text.secondary }} align="center">
              No movies found.<br />
              Try adjusting the filters.
            </Typography>
          </Box>
        ) : (
          <>
            {/* Movie grid */}
            <Grid container spacing={{ xs: 2, sm: 3 }} justifyContent="center">
              {movies.map((movie) => (
                <Grid item key={movie.id}>
                  <MovieCard
                    movie={movie}
                    isFavorite={favorites.some(fav => fav.id === movie.id)}
                    onToggleFavorite={() => onToggleFavorite(movie)}
                  />
                </Grid>
              ))}
            </Grid>

            {/* Load more button */}
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

export default Browse; 