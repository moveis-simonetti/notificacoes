import { getFirestore } from "firebase-admin/firestore";
import FirebaseClient from "../infra/FirebaseClient";

class FirestoreService {
  firestore = null;
  firebaseClient = null;

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
      this.firestore = getFirestore(
        await new FirebaseClient(this.context).initialize()
      );
    }

    return this.firestore;
  }
}

export default FirestoreService;
