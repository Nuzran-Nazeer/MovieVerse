import React from 'react';
import { Card, CardContent, Typography, IconButton, Box, useTheme } from '@mui/material';
import { Link } from 'react-router-dom';
import FavoriteIcon from '@mui/icons-material/Favorite';
import FavoriteBorderIcon from '@mui/icons-material/FavoriteBorder';
import MovieIcon from '@mui/icons-material/Movie';

const CARD_WIDTH = 240;
const CARD_HEIGHT = 400;
const IMAGE_HEIGHT = 320;
const FALLBACK_IMAGE = 'https://via.placeholder.com/500x750?text=No+Poster';

const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  const imageUrl = movie.poster_path
    ? `https://image.tmdb.org/t/p/w500${movie.poster_path}`
    : FALLBACK_IMAGE;
  const [imgSrc, setImgSrc] = React.useState(imageUrl);
  const theme = useTheme();

  const handleClick = () => {
    localStorage.setItem('lastSearchedMovie', JSON.stringify(movie));
  };

  return (
    <Card
      sx={{
        width: CARD_WIDTH,
        height: CARD_HEIGHT,
        display: 'flex',
        flexDirection: 'column',
        position: 'relative',
        borderRadius: 3,
        boxShadow: 3,
        overflow: 'hidden',
        transition: 'transform 0.2s, box-shadow 0.2s',
        '&:hover': {
          transform: 'translateY(-8px) scale(1.03)',
          boxShadow: 6,
        },
        background: theme.palette.background.paper,
      }}
    >
      <Link to={`/movie/${movie.id}`} style={{ textDecoration: 'none', color: 'inherit' }} onClick={handleClick}>
        <Box
          sx={{
            width: '100%',
            height: IMAGE_HEIGHT,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: theme.palette.mode === 'dark' ? '#222' : '#e0e0e0',
            borderTopLeftRadius: 12,
            borderTopRightRadius: 12,
            overflow: 'hidden',
          }}
        >
          {imgSrc === FALLBACK_IMAGE ? (
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '100%', height: '100%' }}>
              <MovieIcon sx={{ fontSize: 64, color: theme.palette.text.disabled, mb: 1 }} />
              <Typography variant="caption" color="text.secondary">No Poster</Typography>
            </Box>
          ) : (
            <img
              src={imgSrc}
              alt={movie.title}
              style={{
                width: '100%',
                height: IMAGE_HEIGHT,
                objectFit: 'cover',
                display: 'block',
              }}
              onError={() => setImgSrc(FALLBACK_IMAGE)}
            />
          )}
        </Box>
      </Link>
      <IconButton
        onClick={(e) => {
          e.preventDefault();
          onToggleFavorite();
        }}
        sx={{
          position: 'absolute',
          top: 10,
          right: 10,
          backgroundColor: theme.palette.mode === 'dark' ? 'rgba(30,30,30,0.85)' : 'rgba(255,255,255,0.85)',
          boxShadow: 1,
          '&:hover': {
            backgroundColor: theme.palette.mode === 'dark' ? 'rgba(50,50,50,1)' : 'rgba(255,255,255,1)',
          },
          zIndex: 2,
        }}
      >
        {isFavorite ? (
          <FavoriteIcon color="error" />
        ) : (
          <FavoriteBorderIcon />
        )}
      </IconButton>
      <CardContent sx={{ flexGrow: 1, p: 2, display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
        <Typography gutterBottom variant="subtitle1" component="div" noWrap sx={{ fontWeight: 600, mb: 1, color: theme.palette.text.primary }}>
          {movie.title}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 'auto' }}>
          <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
            {movie.release_date ? new Date(movie.release_date).getFullYear() : '-'}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <Typography variant="body2" sx={{ fontWeight: 500, color: theme.palette.text.secondary }}>
              ★ {movie.vote_average ? movie.vote_average.toFixed(1) : '-'}
            </Typography>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default MovieCard; 