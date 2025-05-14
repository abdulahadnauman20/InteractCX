import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Message from './Message';
import WeatherCard from './WeatherCard';
import './Chat.css';
import { TextField, IconButton, Box } from '@mui/material';
import SendIcon from '@mui/icons-material/Send';

const Chat = () => {
  const [messages, setMessages] = useState([
    { text: "Hello! I'm your weather assistant. Ask me about current weather or forecasts.", sender: 'bot' }
  ]);
  const [input, setInput] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSendMessage = async () => {
    if (!input.trim()) return;

    const userMessage = { text: input, sender: 'user' };
    setMessages(prev => [...prev, userMessage]);
    setInput('');

    const city = extractCity(input);
    const date = extractDate(input);
    const is8DayRequest = check8DayRequest(input);

    try {
      const response = await axios.post('http://localhost:3000/webhook', {
        queryResult: {
          queryText: input,
          parameters: {
            'geo-city': city,
            'date': is8DayRequest ? '8-day-forecast' : date
          },
          intent: {
            displayName: is8DayRequest ? '8DayForecastIntent' : 
                        date ? 'WeatherForecastIntent' : 'CurrentWeatherIntent'
          }
        }
      });

      const botMessage = {
        text: response.data.fulfillmentText,
        sender: 'bot',
        isWeather: true
      };
      setMessages(prev => [...prev, botMessage]);

    } catch (error) {
      console.error('Error:', error);
      setMessages(prev => [...prev, {
        text: "Sorry, I'm having trouble connecting to the weather service.",
        sender: 'bot'
      }]);
    }
  };

 const extractCity = (text) => {
  // Try to find city after weather-related keywords
  const keywordMatch = text.match(/(?:weather|forecast|temperature)\s+(?:in|for|at)?\s*([^,.!?]+)/i);
  if (keywordMatch) return keywordMatch[1].trim();
  
  // Try to find standalone city names (from a predefined list)
  const cities = ['London', 'Paris', 'New York', 'Tokyo', 'Karachi', 'Berlin', 'Mumbai'];
  const cityMatch = cities.find(city => 
    new RegExp(`\\b${city}\\b`, 'i').test(text)
  );
  return cityMatch || '';
};
  const extractDate = (text) => {
    const dateKeywords = [
      'today', 'tomorrow', 
      'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday',
      /\d{1,2}\/\d{1,2}\/\d{4}/, // MM/DD/YYYY
      /\d{4}-\d{1,2}-\d{1,2}/ // YYYY-MM-DD
    ];
    
    for (const keyword of dateKeywords) {
      if (typeof keyword === 'string' && text.toLowerCase().includes(keyword)) {
        return keyword;
      } else if (keyword instanceof RegExp) {
        const match = text.match(keyword);
        if (match) return match[0];
      }
    }
    return '';
  };

  const check8DayRequest = (text) => {
    const keywords = ['8-day', '8 day', 'eight-day', 'eight day', 'week forecast', 'weekly forecast'];
    return keywords.some(keyword => text.toLowerCase().includes(keyword));
  };

  return (
    <Box className="chat-container">
      <Box className="messages-container">
        {messages.map((message, index) => (
          message.isWeather ? (
            <WeatherCard key={index} text={message.text} sender={message.sender} />
          ) : (
            <Message key={index} text={message.text} sender={message.sender} />
          )
        ))}
        <div ref={messagesEndRef} />
      </Box>
      <Box className="input-container">
        <TextField
          fullWidth
          variant="outlined"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
          placeholder="Ask about weather (e.g., '8-day forecast for London')"
        />
        <IconButton 
          color="primary" 
          onClick={handleSendMessage}
          disabled={!input.trim()}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Box>
  );
};

export default Chat;