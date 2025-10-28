import { db, auth } from '../config/firebase';
import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  query,
  where,
  orderBy,
  limit,
  Timestamp,
  increment,
} from 'firebase/firestore';
import {
  signInWithPhoneNumber,
  RecaptchaVerifier,
  ConfirmationResult,
} from 'firebase/auth';

export interface User {
  uid: string;
  name: string;
  phone: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  xp: number;
  plan: 'free' | 'premium' | 'unlimited';
  streak: number;
  lessonsCompleted: number;
  createdAt: Date;
  lastActive: Date;
}

export interface Lesson {
  id: string;
  title: string;
  content: string;
  level: 'A1' | 'A2' | 'B1' | 'B2' | 'C1' | 'C2';
  type: 'vocabulary' | 'grammar' | 'listening' | 'conversation';
  xpReward: number;
  questions?: Question[];
}

export interface Question {
  id: string;
  text: string;
  options: string[];
  correctAnswer: number;
  explanation?: string;
}

export interface Achievement {
  id: string;
  userId: string;
  name: string;
  description: string;
  icon: string;
  date: Date;
}

export interface Plan {
  id: string;
  name: string;
  price: number;
  features: string[];
  lessonsPerDay?: number;
}

class FirebaseService {
  private recaptchaVerifier: RecaptchaVerifier | null = null;
  private confirmationResult: ConfirmationResult | null = null;

  async initializeRecaptcha(containerId: string) {
    this.recaptchaVerifier = new RecaptchaVerifier(auth, containerId, {
      size: 'invisible',
    });
  }

  async sendVerificationCode(phoneNumber: string): Promise<boolean> {
    try {
      if (!this.recaptchaVerifier) {
        await this.initializeRecaptcha('recaptcha-container');
      }
      this.confirmationResult = await signInWithPhoneNumber(
        auth,
        phoneNumber,
        this.recaptchaVerifier!
      );
      return true;
    } catch (error) {
      console.error('Error sending verification code:', error);
      return false;
    }
  }

  async verifyCode(code: string): Promise<User | null> {
    try {
      if (!this.confirmationResult) {
        throw new Error('No confirmation result available');
      }
      const result = await this.confirmationResult.confirm(code);
      const user = result.user;

      const userDoc = await this.getUser(user.uid);
      if (!userDoc) {
        const newUser: User = {
          uid: user.uid,
          name: '',
          phone: user.phoneNumber || '',
          level: 'A1',
          xp: 0,
          plan: 'free',
          streak: 0,
          lessonsCompleted: 0,
          createdAt: new Date(),
          lastActive: new Date(),
        };
        await this.createUser(newUser);
        return newUser;
      }

      await this.updateUserActivity(user.uid);
      return userDoc;
    } catch (error) {
      console.error('Error verifying code:', error);
      return null;
    }
  }

  async createUser(user: User): Promise<void> {
    await setDoc(doc(db, 'users', user.uid), {
      ...user,
      createdAt: Timestamp.fromDate(user.createdAt),
      lastActive: Timestamp.fromDate(user.lastActive),
    });
  }

  async getUser(uid: string): Promise<User | null> {
    const userDoc = await getDoc(doc(db, 'users', uid));
    if (!userDoc.exists()) return null;

    const data = userDoc.data();
    return {
      ...data,
      uid: userDoc.id,
      createdAt: data.createdAt.toDate(),
      lastActive: data.lastActive.toDate(),
    } as User;
  }

  async updateUserActivity(uid: string): Promise<void> {
    const userRef = doc(db, 'users', uid);
    const userDoc = await getDoc(userRef);

    if (!userDoc.exists()) return;

    const lastActive = userDoc.data().lastActive.toDate();
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    const isConsecutiveDay =
      lastActive.toDateString() === yesterday.toDateString();

    await updateDoc(userRef, {
      lastActive: Timestamp.now(),
      streak: isConsecutiveDay ? increment(1) : 1,
    });
  }

  async updateUserXP(uid: string, xpGained: number): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      xp: increment(xpGained),
    });
  }

  async completeLesson(uid: string, lessonId: string, xpGained: number): Promise<void> {
    await updateDoc(doc(db, 'users', uid), {
      lessonsCompleted: increment(1),
      xp: increment(xpGained),
    });

    await setDoc(doc(db, 'completedLessons', `${uid}_${lessonId}`), {
      userId: uid,
      lessonId,
      completedAt: Timestamp.now(),
      xpGained,
    });
  }

  async getLessonsByLevel(level: string): Promise<Lesson[]> {
    const q = query(
      collection(db, 'lessons'),
      where('level', '==', level),
      orderBy('title')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Lesson[];
  }

  async getAllLessons(): Promise<Lesson[]> {
    const snapshot = await getDocs(collection(db, 'lessons'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Lesson[];
  }

  async createLesson(lesson: Omit<Lesson, 'id'>): Promise<string> {
    const docRef = doc(collection(db, 'lessons'));
    await setDoc(docRef, lesson);
    return docRef.id;
  }

  async updateLesson(id: string, lesson: Partial<Lesson>): Promise<void> {
    await updateDoc(doc(db, 'lessons', id), lesson);
  }

  async getUserAchievements(uid: string): Promise<Achievement[]> {
    const q = query(
      collection(db, 'achievements'),
      where('userId', '==', uid),
      orderBy('date', 'desc')
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
      date: doc.data().date.toDate(),
    })) as Achievement[];
  }

  async grantAchievement(achievement: Omit<Achievement, 'id'>): Promise<void> {
    await setDoc(doc(collection(db, 'achievements')), {
      ...achievement,
      date: Timestamp.fromDate(achievement.date),
    });
  }

  async getPlans(): Promise<Plan[]> {
    const snapshot = await getDocs(collection(db, 'plans'));
    return snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    })) as Plan[];
  }

  async getLeaderboard(limitCount: number = 10): Promise<User[]> {
    const q = query(
      collection(db, 'users'),
      orderBy('xp', 'desc'),
      limit(limitCount)
    );
    const snapshot = await getDocs(q);
    return snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      lastActive: doc.data().lastActive.toDate(),
    })) as User[];
  }

  async getAllUsers(): Promise<User[]> {
    const snapshot = await getDocs(collection(db, 'users'));
    return snapshot.docs.map(doc => ({
      uid: doc.id,
      ...doc.data(),
      createdAt: doc.data().createdAt.toDate(),
      lastActive: doc.data().lastActive.toDate(),
    })) as User[];
  }

  async updateUserPlan(uid: string, plan: string): Promise<void> {
    await updateDoc(doc(db, 'users', uid), { plan });
  }

  async updateUserLevel(uid: string, level: string): Promise<void> {
    await updateDoc(doc(db, 'users', uid), { level });
  }
}

export const firebaseService = new FirebaseService();
