import React, { useCallback } from 'react';
import { Grid, Box, CircularProgress } from '@mui/material';
import MovieCard from './MovieCard';
import useInfiniteScroll from '../../hooks/useInfiniteScroll';

const MovieGrid = ({ movies, loading, hasMore, onLoadMore, favorites, onToggleFavorite }) => {
  const [lastElementRef] = useInfiniteScroll(
    loading,
    hasMore,
    onLoadMore
  );

  const getFavoriteStatus = useCallback(
    (movieId) => favorites.some((fav) => fav.id === movieId),
    [favorites]
  );

  return (
    <Box sx={{ flexGrow: 1, p: 3 }}>
      <Grid container spacing={3}>
        {movies.map((movie, index) => (
          <Grid
            item
            xs={12}
            sm={6}
            md={4}
            lg={3}
            key={`${movie.id}-${index}`}
            ref={index === movies.length - 1 ? lastElementRef : null}
          >
            <MovieCard
              movie={movie}
              isFavorite={getFavoriteStatus(movie.id)}
              onToggleFavorite={onToggleFavorite}
            />
          </Grid>
        ))}
      </Grid>
      {loading && (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      )}
    </Box>
  );
};

export default MovieGrid; 