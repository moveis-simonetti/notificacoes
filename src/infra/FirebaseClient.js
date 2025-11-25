import { initializeApp } from 'firebase-admin/app';
import { PrismaClient } from '@prisma/client';

class FirebaseClient {
  constructor(contexto) {
    this.prisma = new PrismaClient();
    this.contexto = contexto;
  }

  async initialize() {
    const serviceAccount = await this.prisma.parametro.findFirst({
      where: {
        contexto: this.contexto,
        chave: 'firebase.service_account',
      },
    });

    if (!serviceAccount) {
      throw new Error(`Service Account não encontrado para contexto: ${this.contexto}`);
    }

    this.app = initializeApp({
      credential: admin.credential.cert(serviceAccount.valor)
    });

    return this.app;
  }
}

export default FirebaseClient;
