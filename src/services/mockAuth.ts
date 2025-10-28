export interface MockUser {
  id: string;
  name: string;
  phone: string;
  role: 'admin' | 'student';
  email?: string;
}

const mockUsers: MockUser[] = [
  {
    id: '1',
    name: 'Admin User',
    phone: '+5511999990000',
    role: 'admin',
    email: 'admin@englishbot.com',
  },
  {
    id: '2',
    name: 'Maria Silva',
    phone: '+5511999991111',
    role: 'student',
  },
  {
    id: '3',
    name: 'João Santos',
    phone: '+5511999992222',
    role: 'student',
  },
  {
    id: '4',
    name: 'Ana Costa',
    phone: '+5511999993333',
    role: 'student',
  },
];

const STORAGE_KEY = 'englishbot_auth';

export const mockAuth = {
  loginWithPhone: (phone: string): MockUser | null => {
    const user = mockUsers.find((u) => u.phone === phone);
    if (user) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  loginWithEmail: (email: string, password: string): MockUser | null => {
    if (email === 'admin@englishbot.com' && password === 'admin123') {
      const user = mockUsers[0];
      localStorage.setItem(STORAGE_KEY, JSON.stringify(user));
      return user;
    }
    return null;
  },

  logout: () => {
    localStorage.removeItem(STORAGE_KEY);
  },

  getCurrentUser: (): MockUser | null => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        return JSON.parse(stored);
      } catch {
        return null;
      }
    }
    return null;
  },

  isAuthenticated: (): boolean => {
    return mockAuth.getCurrentUser() !== null;
  },

  getMockUsers: () => mockUsers,
};
