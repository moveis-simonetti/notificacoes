import { initializeApp, getApps } from 'firebase-admin/app';
import { credential } from 'firebase-admin';
import ParametroService from '../services/ParametroService.js';

const KEY_FIREBASE = 'firebase.service_account';

class FirebaseClient {
  app = null;

  constructor(context) {
    this.parametroService = new ParametroService();
    this.context = context;
  }

  async getApp() {
    if (this.app) {
      return this.app;
    }

    const parametro = await this.parametroService.buscarPorContextoEChaveOuFalhar(
      this.context,
      KEY_FIREBASE
    );

    const appName = `firebase-${this.context}`;

    const existingApp = getApps().find(app => app.name === appName);

    if (existingApp) {
      this.app = existingApp;
    } else {
      this.app = initializeApp({
        credential: credential.cert(JSON.parse(parametro.valor)),
      }, appName);
    }

    return this.app;
  }
}

export default FirebaseClient;
