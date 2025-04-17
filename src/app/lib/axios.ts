import axios from 'axios';
import Cookies from 'js-cookie';

const instance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // تأكد أنه مفعل لإرسال cookies
});

// Interceptor لإضافة CSRF token تلقائيًا لكل الطلبات
instance.interceptors.request.use(
  (config) => {
    const csrfToken = Cookies.get('XSRF-TOKEN');
    if (csrfToken && config.headers) {
      config.headers['X-XSRF-TOKEN'] = csrfToken;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default instance;