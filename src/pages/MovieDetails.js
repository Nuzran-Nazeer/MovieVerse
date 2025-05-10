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
  Button,
  Card,
  CardContent,
  CardMedia,
} from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import LanguageIcon from '@mui/icons-material/Language';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import PersonIcon from '@mui/icons-material/Person';
import { getMovieDetails, getMovieVideos, getMovieCredits } from '../services/tmdbApi';

const MovieDetails = ({ favorites, onToggleFavorite }) => {
  const { id } = useParams();
  const [movie, setMovie] = useState(null);
  const [videos, setVideos] = useState([]);
  const [cast, setCast] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showTrailer, setShowTrailer] = useState(false);

  useEffect(() => {
    const fetchMovieData = async () => {
      try {
        setLoading(true);
        const [movieData, videoData, castData] = await Promise.all([
          getMovieDetails(id),
          getMovieVideos(id),
          getMovieCredits(id)
        ]);
        setMovie(movieData);
        setVideos(videoData);
        setCast(castData.slice(0, 10)); 
        setError(null);
      } catch (err) {
        setError('Failed to load movie details. Please try again later.');
      } finally {
        setLoading(false);
      }
    };

    fetchMovieData();
  }, [id]);

  const trailer = videos.find(video => video.type === 'Trailer' && video.site === 'YouTube');

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

  const renderCastCard = (actor) => {
    const imageUrl = actor.profile_path
      ? `https://image.tmdb.org/t/p/w200${actor.profile_path}`
      : null;

    return (
      <Card 
        sx={{ 
          width: '100%',
          height: 320,
          display: 'flex',
          flexDirection: 'column',
          transition: 'transform 0.2s',
          '&:hover': {
            transform: 'translateY(-4px)',
          },
        }}
      >
        <Box
          sx={{
            height: 240, 
            position: 'relative',
            bgcolor: 'grey.200',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            overflow: 'hidden',
          }}
        >
          {imageUrl ? (
            <CardMedia
              component="img"
              image={imageUrl}
              alt={actor.name}
              sx={{
                width: '100%',
                height: '100%',
                objectFit: 'cover',
              }}
              onError={(e) => {
                e.target.style.display = 'none';
                e.target.parentElement.querySelector('.placeholder-icon').style.display = 'flex';
              }}
            />
          ) : (
            <Box
              className="placeholder-icon"
              sx={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                height: '100%',
                width: '100%',
                bgcolor: 'grey.200',
              }}
            >
              <PersonIcon sx={{ fontSize: 64, color: 'grey.400', mb: 1 }} />
              <Typography variant="caption" color="text.secondary">
                No Image
              </Typography>
            </Box>
          )}
        </Box>
        <CardContent 
          sx={{ 
            flexGrow: 1,
            p: 1.5,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            minHeight: 80, 
          }}
        >
          <Typography 
            variant="subtitle1" 
            component="div" 
            noWrap
            sx={{ 
              fontWeight: 600,
              mb: 0.5,
            }}
          >
            {actor.name}
          </Typography>
          <Typography 
            variant="body2" 
            color="text.secondary" 
            noWrap
            sx={{
              fontSize: '0.875rem',
            }}
          >
            {actor.character}
          </Typography>
        </CardContent>
      </Card>
    );
  };

  return (
    <Box sx={{ mt: { xs: 7, sm: 8 } }}>
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
                <Typography variant="h3" component="h1" gutterBottom sx={{ mt: { xs: 5, sm: 12 } }}>
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
                {trailer && (
                  <Button
                    variant="contained"
                    startIcon={<PlayArrowIcon />}
                    onClick={() => setShowTrailer(true)}
                    sx={{
                      mb: 2,
                      backgroundColor: 'red',
                      '&:hover': {
                        backgroundColor: 'darkred',
                      },
                    }}
                  >
                    Watch Trailer
                  </Button>
                )}
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
      {showTrailer && trailer && (
        <Box
          sx={{
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.9)',
            zIndex: 1300,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            p: 2,
          }}
          onClick={() => setShowTrailer(false)}
        >
          <Box
            sx={{
              width: '100%',
              maxWidth: '1000px',
              aspectRatio: '16/9',
              position: 'relative',
            }}
            onClick={(e) => e.stopPropagation()}
          >
            <iframe
              width="100%"
              height="100%"
              src={`https://www.youtube.com/embed/${trailer.key}?autoplay=1`}
              title="Movie Trailer"
              frameBorder="0"
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
              style={{ borderRadius: '8px' }}
            />
          </Box>
        </Box>
      )}
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
          {/* Cast Section */}
          <Grid item xs={12}>
            <Paper sx={{ p: 3 }}>
              <Typography variant="h6" gutterBottom>
                Cast
              </Typography>
              <Divider sx={{ mb: 2 }} />
              <Grid container spacing={2}>
                {cast.map((actor) => (
                  <Grid item xs={6} sm={4} md={2.4} key={actor.id}>
                    {renderCastCard(actor)}
                  </Grid>
                ))}
              </Grid>
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default MovieDetails; 