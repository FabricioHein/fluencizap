import { Firestore } from "firebase-admin/firestore";
import { User } from "../types";

export class UserModel {
  private db: Firestore;
  private collection = "users";

  constructor(db: Firestore) {
    this.db = db;
  }

  async findByPhoneNumber(phoneNumber: string): Promise<User | null> {
    const doc = await this.db.collection(this.collection).doc(phoneNumber).get();
    if (!doc.exists) {
      return null;
    }
    return doc.data() as User;
  }

  async create(user: User): Promise<User> {
    await this.db.collection(this.collection).doc(user.phoneNumber).set({
      ...user,
      createdAt: new Date(),
      level: user.level || "beginner",
      questionsAnswered: 0,
      correctAnswers: 0,
      currentStreak: 0,
    });
    return user;
  }

  async update(phoneNumber: string, data: Partial<User>): Promise<void> {
    await this.db.collection(this.collection).doc(phoneNumber).update({
      ...data,
      lastInteraction: new Date(),
    });
  }

  async incrementStats(phoneNumber: string, isCorrect: boolean): Promise<void> {
    const userRef = this.db.collection(this.collection).doc(phoneNumber);
    const user = await userRef.get();

    if (user.exists) {
      const currentData = user.data() as User;
      await userRef.update({
        questionsAnswered: (currentData.questionsAnswered || 0) + 1,
        correctAnswers: isCorrect ? (currentData.correctAnswers || 0) + 1 : currentData.correctAnswers,
        currentStreak: isCorrect ? (currentData.currentStreak || 0) + 1 : 0,
        lastInteraction: new Date(),
      });
    }
  }

  async resetProgress(phoneNumber: string): Promise<void> {
    await this.db.collection(this.collection).doc(phoneNumber).update({
      questionsAnswered: 0,
      correctAnswers: 0,
      currentStreak: 0,
      level: "beginner",
      lastInteraction: new Date(),
    });
  }
}
