import { getFirestore } from "firebase-admin/firestore";
import FirebaseClient from "../infra/FirebaseClient";

class FirestoreService {
  firestoreInstances = new Map();

  async createNotification(notificacao, context) {
    const collection = (await this.getFirestore(context)).collection('notificacoes');
    const id = notificacao.id;

    await collection.doc(id).set(notificacao);
  }

  async getFirestore(context) {
    if (!this.firestoreInstances.has(context)) {
      const firebaseClient = new FirebaseClient(context);
      const firestore = getFirestore(await firebaseClient.getApp());
      this.firestoreInstances.set(context, firestore);
    }

    return this.firestoreInstances.get(context);
  }
}

export default FirestoreService;
