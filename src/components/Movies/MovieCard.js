import React from 'react';
import { Card, CardContent, CardMedia, Typography, IconButton, Box } from '@mui/material';
import { Favorite, FavoriteBorder } from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';

const MovieCard = ({ movie, isFavorite, onToggleFavorite }) => {
  const navigate = useNavigate();
  const imageUrl = `https://image.tmdb.org/t/p/w500${movie.poster_path}`;

  return (
    <Card 
      sx={{ 
        maxWidth: 345,
        cursor: 'pointer',
        '&:hover': { transform: 'scale(1.03)', transition: 'transform 0.2s' }
      }}
      onClick={() => navigate(`/movie/${movie.id}`)}
    >
      <CardMedia
        component="img"
        height="400"
        image={imageUrl}
        alt={movie.title}
        onError={(e) => {
          e.target.src = '/placeholder.png';
        }}
      />
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography gutterBottom variant="h6" component="div">
            {movie.title}
          </Typography>
          <IconButton 
            onClick={(e) => {
              e.stopPropagation();
              onToggleFavorite(movie);
            }}
          >
            {isFavorite ? <Favorite color="error" /> : <FavoriteBorder />}
          </IconButton>
        </Box>
        <Typography variant="body2" color="text.secondary">
          {new Date(movie.release_date).getFullYear()}
        </Typography>
        <Typography variant="body2" color="text.secondary">
          Rating: {movie.vote_average}/10
        </Typography>
      </CardContent>
    </Card>
  );
};

export default MovieCard; 