import { initializeApp, getApps } from 'firebase-admin/app';
import { PrismaClient } from '@prisma/client';
import { credential } from 'firebase-admin';
const KEY_FIREBASE = 'firebase.service_account';

class FirebaseClient {
  prisma = null;
  app = null;

  constructor(contexto) {
    this.prisma = new PrismaClient();
    this.contexto = contexto;
  }

  async getApp() {
    if (this.app) {
      return this.app;
    }

    const serviceAccount = await this.prisma.parametro.findFirst({
      where: {
        contexto: this.contexto,
        chave: KEY_FIREBASE,
      },
    });

    if (!serviceAccount) {
      throw new Error(`Service Account não encontrado para o contexto: ${this.contexto}`);
    }

    const appName = `firebase-${this.contexto}`;

    const existingApp = getApps().find(app => app.name === appName);

    if (existingApp) {
      this.app = existingApp;
    } else {
      this.app = initializeApp({
        credential: credential.cert(JSON.parse(serviceAccount.valor)),
      }, appName);
    }

    return this.app;
  }
}

export default FirebaseClient;
