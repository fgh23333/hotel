import axios from 'axios';
import { useAuthStore } from '@/store/index'; // 导入 Pinia store
import { server, port } from './config';

// 创建 Axios 实例
const axiosInstance = axios.create({
  baseURL: `http://${server}:${port}`, // 替换为你的 API 基础 URL
  timeout: 10000, // 设置超时
});

// 请求拦截器
axiosInstance.interceptors.request.use(
  config => {
    const authStore = useAuthStore(); // 获取 Pinia store 实例
    if (authStore.token) {
      config.headers['blade-auth'] = authStore.token; // 设置 token
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// 响应拦截器
axiosInstance.interceptors.response.use(
  response => response,
  error => {
    if (error.response && error.response.status === 401) {
      console.error('Unauthorized access - 401');
      const authStore = useAuthStore();
      authStore.logout(); // 调用 store 的 logout 方法
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;