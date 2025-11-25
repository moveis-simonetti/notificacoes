import { getFirestore } from "firebase-admin/firestore";
import FirebaseClient from "../infra/FirebaseClient";

class FirestoreService {
  firestore = null;

  constructor(context) {
    this.context = context;
  }

  async createNotification(notificacao) {
    const collection = (await this.getFirestore()).collection('notificacoes');
    const id = notificacao.id;

    await collection.doc(id).set(notificacao);
  }

  async getFirestore() {
    if (!this.firestore) {
      const firebaseClient = new FirebaseClient(this.context);
      this.firestore = getFirestore(await firebaseClient.getApp());
    }

    return this.firestore;
  }
}

export default FirestoreService;
