// WeatherCard.jsx
import React from 'react';
import { Card, CardContent, Typography } from '@mui/material';
import './WeatherCard.css';

const WeatherCard = ({ text, sender }) => {
  const isForecast = text.includes('forecast');
  const lines = text.split('\n').filter(line => line.trim() !== '');

  return (
    <Card className={`weather-card ${sender}`}>
      <CardContent>
        {isForecast ? (
          <>
            <Typography variant="h6" gutterBottom>
              {lines[0]}
            </Typography>
            {lines.slice(1).map((line, index) => (
              <Typography key={index} variant="body2" component="div">
                {line}
              </Typography>
            ))}
          </>
        ) : (
          <Typography variant="body1">{text}</Typography>
        )}
      </CardContent>
    </Card>
  );
};

export default WeatherCard;
