import axios from 'axios';
import ParametroService from '../services/ParametroService.js';

const KEY_ONESIGNAL_REST_API_KEY = 'onesignal.rest_api_key';
const KEY_ONESIGNAL_APP_ID = 'onesignal.app_id';

class OneSignalClient {
  constructor(context) {
    this.parametroService = new ParametroService();
    this.context = context;
    this.axiosInstance = null;
  }

  async getClient() {
    if (this.axiosInstance) {
      return this.axiosInstance;
    }

    const apiKey = await this.parametroService.buscarPorContextoEChaveOuFalhar(
      this.context,
      KEY_ONESIGNAL_REST_API_KEY
    );

    const appId = await this.parametroService.buscarPorContextoEChaveOuFalhar(
      this.context,
      KEY_ONESIGNAL_APP_ID
    );

    this.axiosInstance = axios.create({
      baseURL: 'https://api.onesignal.com',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Key ${apiKey.valor}`
      }
    });

    this.axiosInstance.interceptors.request.use((config) => {
      config.data.app_id = appId.valor;
      return config;
    });

    return this.axiosInstance;
  }

  async post(endpoint, data) {
    const client = await this.getClient();
    return client.post(endpoint, data);
  }

  async get(endpoint, config = {}) {
    const client = await this.getClient();
    return client.get(endpoint, config);
  }
}

export default OneSignalClient;
