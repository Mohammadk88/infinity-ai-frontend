import axios from 'axios';
import Cookies from 'js-cookie';

const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // تأكد أنه مفعل لإرسال cookies
});

// Interceptor لإضافة CSRF token تلقائيًا لكل الطلبات
api.interceptors.request.use(
  (config) => {
    const csrfToken = Cookies.get('XSRF-TOKEN');
    if (csrfToken && config.headers) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
      config.headers['Content-Type'] = 'application/json';
      config.headers['Accept'] = 'application/json';
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
