import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container,
  Grid,
  Typography,
  Box,
  Chip,
  IconButton,
  Paper,
  CircularProgress,
  Link,
  Divider,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LanguageIcon from '@mui/icons-material/Language';
import { getMovieDetails } from '../services/tmdbApi';

const MovieDetails = ({ favorites, onToggleFavorite }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchMovieDetails = async () => {
      try {
        setLoading(true);
        const data = await getMovieDetails(id);
        setMovie(data);
        setError(null);
      } catch (err) {
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="80vh">
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Container>
        <Typography color="error" sx={{ mt: 4 }}>
          {error}
        </Typography>
      </Container>
    );
  }

  if (!movie) {
    return null;
  }

  const imageUrl = movie.backdrop_path
    ? `https://image.tmdb.org/t/p/original${movie.backdrop_path}`
    : 'https://via.placeholder.com/1920x1080?text=No+Image';

  const formatCurrency = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      maximumFractionDigits: 0,
    }).format(amount);
  };

  return (
    <Box>
      <Box
        sx={{
          position: 'relative',
          height: '60vh',
          backgroundImage: `url(${imageUrl})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center',
          '&::before': {
            content: '""',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
          },
        }}
      >
        <Container
          sx={{
            position: 'relative',
            height: '100%',
            display: 'flex',
            alignItems: 'flex-end',
            pb: 4,
          }}
        >
          <Grid container spacing={4}>
            <Grid item xs={12} md={4}>
              <Paper
                elevation={3}
                sx={{
                  height: '400px',
                  backgroundImage: `url(https://image.tmdb.org/t/p/w500${movie.poster_path})`,
                  backgroundSize: 'cover',
                  backgroundPosition: 'center',
                }}
              />
            </Grid>
            <Grid item xs={12} md={8}>
              <Box sx={{ color: 'white' }}>
                <Typography variant="h3" component="h1" gutterBottom>
                  {movie.title}
                </Typography>
                {movie.tagline && (
                  <Typography variant="h6" gutterBottom sx={{ fontStyle: 'italic' }}>
                    "{movie.tagline}"
                  </Typography>
                )}
                <Box sx={{ mb: 2 }}>
                  {movie.genres.map((genre) => (
                    <Chip
                      key={genre.id}
                      label={genre.name}
                      sx={{ mr: 1, mb: 1, backgroundColor: 'rgba(255, 255, 255, 0.2)' }}
                    />
                  ))}
                </Box>
                <Typography variant="body1" paragraph>
                  {movie.overview}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, mb: 2 }}>
                  <Typography variant="h6">
                    Rating: {movie.vote_average.toFixed(1)}/10
                  </Typography>
                  <Typography variant="body2" color="text.secondary">
                    ({movie.vote_count.toLocaleString()} votes)
                  </Typography>
                  <IconButton
                    onClick={() => onToggleFavorite(movie)}
                    sx={{ color: 'white' }}
                  >
                    {favorites.some(fav => fav.id === movie.id) ? (
                      <FavoriteIcon color="error" />
                    ) : (
                      <FavoriteBorderIcon />
                    )}
                  </IconButton>
                </Box>
                {movie.homepage && (
                  <Link
                    href={movie.homepage}
                    target="_blank"
                    rel="noopener noreferrer"
                    sx={{
                      color: 'white',
                      textDecoration: 'none',
                      display: 'flex',
                      alignItems: 'center',
                      gap: 1,
                      '&:hover': { textDecoration: 'underline' },
                    }}
                  >
                    <LanguageIcon /> Official Website
                  </Link>
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
      <Container sx={{ mt: 4, mb: 4 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Movie Details
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Release Date:</strong>
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {new Date(movie.release_date).toLocaleDateString()}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Runtime:</strong>
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {movie.runtime} minutes
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Language:</strong>
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {movie.spoken_languages.map(lang => lang.english_name).join(', ')}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Status:</strong>
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {movie.status}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Budget:</strong>
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {formatCurrency(movie.budget)}
                  </Typography>
                </Grid>
                <Grid item xs={6}>
                  <Typography variant="body1">
                    <strong>Revenue:</strong>
                  </Typography>
                  <Typography variant="body1" color="text.secondary">
                    {formatCurrency(movie.revenue)}
                  </Typography>
                </Grid>
              </Grid>
            </Paper>
          </Grid>
          <Grid item xs={12} md={6}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Production Information
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1" gutterBottom>
                  Production Companies
                </Typography>
                {movie.production_companies.map((company) => (
                  <Box key={company.id} sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                    {company.logo_path && (
                      <Box
                        component="img"
                        src={`https://image.tmdb.org/t/p/w92${company.logo_path}`}
                        alt={company.name}
                        sx={{ height: 30, mr: 2 }}
                      />
                    )}
                    <Typography variant="body1">
                      {company.name}
                      {company.origin_country && ` (${company.origin_country})`}
                    </Typography>
                  </Box>
                ))}
              </Box>
              <Box>
                <Typography variant="subtitle1" gutterBottom>
                  Production Countries
                </Typography>
                {movie.production_countries.map((country) => (
                  <Typography key={country.iso_3166_1} variant="body1">
                    • {country.name}
                  </Typography>
                ))}
              </Box>
            </Paper>
          </Grid>
          {movie.belongs_to_collection && (
            <Grid item xs={12}>
              <Paper sx={{ p: 3 }}>
                <Typography variant="h6" gutterBottom>
                  Part of Collection
                </Typography>
                <Divider sx={{ mb: 2 }} />
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 2 }}>
                  <Box
                    component="img"
                    src={`https://image.tmdb.org/t/p/w200${movie.belongs_to_collection.poster_path}`}
                    alt={movie.belongs_to_collection.name}
                    sx={{ height: 150, borderRadius: 1 }}
                  />
                  <Typography variant="h6">
                    {movie.belongs_to_collection.name}
                  </Typography>
                </Box>
              </Paper>
            </Grid>
          )}
        </Grid>
      </Container>
    </Box>
  );
};

export default MovieDetails; 