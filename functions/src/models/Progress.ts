import { Firestore } from "firebase-admin/firestore";
import { Progress } from "../types";

export class ProgressModel {
  private db: Firestore;
  private collection = "progress";

  constructor(db: Firestore) {
    this.db = db;
  }

  async create(progress: Progress): Promise<string> {
    const docRef = await this.db.collection(this.collection).add({
      ...progress,
      timestamp: new Date(),
    });
    return docRef.id;
  }

  async getByPhoneNumber(phoneNumber: string, limit = 10): Promise<Progress[]> {
    const snapshot = await this.db
      .collection(this.collection)
      .where("phoneNumber", "==", phoneNumber)
      .orderBy("timestamp", "desc")
      .limit(limit)
      .get();

    return snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    } as Progress));
  }

  async getLastQuestion(phoneNumber: string): Promise<Progress | null> {
    const snapshot = await this.db
      .collection(this.collection)
      .where("phoneNumber", "==", phoneNumber)
      .orderBy("timestamp", "desc")
      .limit(1)
      .get();

    if (snapshot.empty) {
      return null;
    }

    return {
      id: snapshot.docs[0].id,
      ...snapshot.docs[0].data(),
    } as Progress;
  }
}
