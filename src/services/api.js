import axios from 'axios';
const api = axios.create({
  baseURL: 'https://map-devs-backend.herokuapp.com'
});

export default api;
