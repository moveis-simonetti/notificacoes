import { getFirestore } from "firebase-admin/firestore";

class FirestoreService {
  constructor(firebaseClient) {
    this.firestore = getFirestore(firebaseClient);
  }

  async createNotification(notificacao) {
    const collection = this.firestore.collection('notificacoes');
    const id = notification.id;

    await collection.doc(id).set(notificacao);
  }
}

export default FirestoreService;
