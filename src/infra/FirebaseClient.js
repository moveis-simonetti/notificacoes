import { initializeApp, getApps } from 'firebase-admin/app';
import { credential } from 'firebase-admin';
import ParametroService from '../services/ParametroService.js';

const KEY_FIREBASE = 'firebase.service_account';

class FirebaseClient {
  app = null;

  constructor(contexto) {
    this.parametroService = new ParametroService();
    this.contexto = contexto;
  }

  async getApp() {
    if (this.app) {
      return this.app;
    }

    const serviceAccountParametro = await this.parametroService.buscarPorContextoEChave(
      this.contexto,
      KEY_FIREBASE
    );

    if (!serviceAccountParametro) {
      throw new Error(`Parâmetro ${KEY_FIREBASE} não encontrado para o contexto ${this.contexto}`);
    }

    const appName = `firebase-${this.contexto}`;

    const existingApp = getApps().find(app => app.name === appName);

    if (existingApp) {
      this.app = existingApp;
    } else {
      this.app = initializeApp({
        credential: credential.cert(JSON.parse(serviceAccountParametro.valor)),
      }, appName);
    }

    return this.app;
  }
}

export default FirebaseClient;
