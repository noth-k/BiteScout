import axios from 'axios';

const api = axios.create({
    baseURL: 'http://192.168.50.72:4000/api/user', //putting in IP address cuz local host
    headers: {
        'Content-Type': 'application/json',
      },
})

// api.interceptors.response.use(
//     response => response,
//     error => {
//       throw error
//     }
// )

export default api;

