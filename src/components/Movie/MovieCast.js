import React from 'react';
import {
  Box,
  Typography,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Paper,
  Divider,
} from '@mui/material';
import PersonIcon from '@mui/icons-material/Person';

const MovieCast = ({ cast }) => {
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
  );
};

export default MovieCast; 