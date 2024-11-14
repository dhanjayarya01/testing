import axios from 'axios';


class ApiService {

    constructor() {
        this.axiosInstance = axios.create({
          baseURL: 'http://localhost:3000/api',
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json'
        }
        });
      }
   
     async login(credentials) {
        const response = await this.axiosInstance.post('/users/login', credentials);
        if (response.data.success) {
            localStorage.setItem('token', response.data.data.accessToken);
        }
        return response.data;
    }

     async register(userData) {
        const response = await this.axiosInstance.post('/users/register', userData);
        return response.data;
    }

     async logout() {
        const response = await this.axiosInstance.post('/users/logout');
        localStorage.removeItem('token');
        return response.data;
    }

    async getCurrentUser() {
        const response = await this.axiosInstance.get('/users/current-user');
        return response.data;
    }

    async updateProfile(userData) {
            const response = await this.axiosInstance.put('/users/update-profile', userData);
        return response.data;
    }

    async resetPassword(data) {
        const response = await this.axiosInstance.post('/users/reset-password', data);
        return response.data;
    }

    // Wallet methods
    async getWalletBalance() {
        const response = await this.axiosInstance.get('/wallet/balance');
        return response.data;
    }

    async addFunds(amount, description) {
        const response = await this.axiosInstance.post('/wallet/add', { amount, description });
        return response.data;
    }

    async withdrawFunds(amount, description) {
        const response = await this.axiosInstance.post('/wallet/withdraw', { amount, description });
        return response.data;
    }

    async getTransactionHistory() {
        const response = await this.axiosInstance.get('/wallet/transactions');
        return response.data;
    }
}

export default ApiService;