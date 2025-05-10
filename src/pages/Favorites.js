import React from 'react';
import { Container, Grid, Typography, Box } from '@mui/material';
import MovieCard from '../components/Movie/MovieCard';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';

const Favorites = ({ favorites, onToggleFavorite }) => {
  const favoriteMovies = favorites;
  const loading = false;
  const error = null;

  return (
    <Container maxWidth="lg" sx={{ mt: 4, mb: 4 }}>
      {/* Header */}
      <Typography variant="h4" component="h1" gutterBottom>
        Favorite Movies
      </Typography>

      {/* Error message */}
      {error && (
        <Typography color="error" sx={{ mb: 2 }}>
          {error}
        </Typography>
      )}

      {/* Loading state */}
      {loading ? (
        <Typography>Loading...</Typography>
      ) : favoriteMovies.length === 0 ? (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" minHeight="300px" sx={{ opacity: 0.8 }}>
          <FavoriteBorderIcon sx={{ fontSize: 64, color: 'text.secondary', mb: 2 }} />
          <Typography variant="h6" color="text.secondary" align="center">
            No favorite movies yet.<br />
            Add some movies to your favorites!
          </Typography>
        </Box>
      ) : (
        /* Movie grid */
        <Grid container spacing={3}>
          {favoriteMovies.map((movie) => (
            <Grid item xs={12} sm={6} md={4} lg={3} key={movie.id}>
              <MovieCard
                movie={movie}
                isFavorite={favorites.some(fav => fav.id === movie.id)}
                onToggleFavorite={() => onToggleFavorite(movie)}
              />
            </Grid>
          ))}
        </Grid>
      )}
    </Container>
  );
};

export default Favorites; 