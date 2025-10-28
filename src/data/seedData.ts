import { Lesson, Plan, Achievement } from '../services/firebaseService';

export const seedLessons: Omit<Lesson, 'id'>[] = [
  {
    title: 'Basic Greetings',
    content: 'Learn how to greet people in English',
    level: 'A1',
    type: 'vocabulary',
    xpReward: 50,
    questions: [
      {
        id: '1',
        text: 'How do you say "Olá" in English?',
        options: ['Hello', 'Goodbye', 'Thanks', 'Please'],
        correctAnswer: 0,
        explanation: '"Hello" is the most common way to greet someone in English.',
      },
      {
        id: '2',
        text: 'What is the correct response to "How are you?"',
        options: ['Yes', "I'm fine, thanks", 'Goodbye', 'Hello'],
        correctAnswer: 1,
        explanation: '"I\'m fine, thanks" or "I\'m good, thanks" are common responses.',
      },
    ],
  },
  {
    title: 'Numbers 1-100',
    content: 'Learn to count from 1 to 100 in English',
    level: 'A1',
    type: 'vocabulary',
    xpReward: 50,
    questions: [
      {
        id: '1',
        text: 'How do you say "20" in English?',
        options: ['Twelve', 'Twenty', 'Thirty', 'Forty'],
        correctAnswer: 1,
      },
      {
        id: '2',
        text: 'What comes after "fourteen"?',
        options: ['Thirteen', 'Fifteen', 'Sixteen', 'Seventeen'],
        correctAnswer: 1,
      },
    ],
  },
  {
    title: 'Present Simple Tense',
    content: 'Master the present simple tense for daily routines',
    level: 'A2',
    type: 'grammar',
    xpReward: 75,
    questions: [
      {
        id: '1',
        text: 'I ___ to work every day.',
        options: ['go', 'goes', 'going', 'went'],
        correctAnswer: 0,
        explanation: 'Use "go" with I, you, we, they in present simple.',
      },
      {
        id: '2',
        text: 'She ___ coffee every morning.',
        options: ['drink', 'drinks', 'drinking', 'drank'],
        correctAnswer: 1,
        explanation: 'Add "s" to verbs with he, she, it in present simple.',
      },
    ],
  },
  {
    title: 'Daily Routines',
    content: 'Talk about your daily activities',
    level: 'A2',
    type: 'conversation',
    xpReward: 75,
    questions: [
      {
        id: '1',
        text: 'What time do you usually wake up?',
        options: ['I wake up at 7 AM', 'I waking up at 7 AM', 'I woke up at 7 AM', 'I am wake up at 7 AM'],
        correctAnswer: 0,
      },
    ],
  },
  {
    title: 'Past Simple',
    content: 'Talk about past events and experiences',
    level: 'B1',
    type: 'grammar',
    xpReward: 100,
    questions: [
      {
        id: '1',
        text: 'I ___ to Paris last year.',
        options: ['go', 'goes', 'went', 'going'],
        correctAnswer: 2,
        explanation: '"Went" is the past simple form of "go".',
      },
      {
        id: '2',
        text: 'They ___ the movie yesterday.',
        options: ['watch', 'watched', 'watching', 'watches'],
        correctAnswer: 1,
        explanation: 'Regular verbs add "-ed" in past simple.',
      },
    ],
  },
  {
    title: 'Business Presentations',
    content: 'Learn how to deliver professional presentations',
    level: 'B2',
    type: 'conversation',
    xpReward: 125,
    questions: [
      {
        id: '1',
        text: 'How do you start a formal presentation?',
        options: [
          'Hey guys!',
          'Good morning, everyone. Today I will present...',
          'What\'s up?',
          'Let\'s begin!'
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    title: 'Conditional Sentences',
    content: 'Master first, second, and third conditionals',
    level: 'B2',
    type: 'grammar',
    xpReward: 125,
    questions: [
      {
        id: '1',
        text: 'If I ___ rich, I would travel the world.',
        options: ['am', 'were', 'be', 'was'],
        correctAnswer: 1,
        explanation: 'Second conditional uses "were" for all subjects.',
      },
    ],
  },
  {
    title: 'Academic Writing',
    content: 'Write formal essays and research papers',
    level: 'C1',
    type: 'grammar',
    xpReward: 150,
    questions: [
      {
        id: '1',
        text: 'Which phrase is most formal?',
        options: [
          'I think that...',
          'It can be argued that...',
          'I guess...',
          'Maybe...'
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    title: 'Advanced Idioms',
    content: 'Understand and use complex English idioms',
    level: 'C1',
    type: 'vocabulary',
    xpReward: 150,
    questions: [
      {
        id: '1',
        text: 'What does "beat around the bush" mean?',
        options: [
          'To hit something',
          'To avoid the main topic',
          'To work in a garden',
          'To run fast'
        ],
        correctAnswer: 1,
      },
    ],
  },
  {
    title: 'Native-Level Discourse',
    content: 'Master advanced rhetorical devices and discourse markers',
    level: 'C2',
    type: 'conversation',
    xpReward: 200,
    questions: [
      {
        id: '1',
        text: 'Which transition is most sophisticated?',
        options: [
          'Also',
          'Furthermore',
          'Notwithstanding the aforementioned considerations',
          'And'
        ],
        correctAnswer: 2,
      },
    ],
  },
];

export const seedPlans: Omit<Plan, 'id'>[] = [
  {
    name: 'Free',
    price: 0,
    features: [
      '3 lições por dia',
      'Níveis A1 e A2',
      'Feedback básico',
      'Progresso salvo',
    ],
    lessonsPerDay: 3,
  },
  {
    name: 'Premium',
    price: 49.90,
    features: [
      'Lições ilimitadas',
      'Todos os níveis (A1-C2)',
      'Feedback detalhado com IA',
      'Áudio com pronúncia nativa',
      'Sem anúncios',
      'Suporte prioritário',
    ],
  },
  {
    name: 'Unlimited',
    price: 99.90,
    features: [
      'Tudo do Premium',
      'Conversação ao vivo 1-on-1',
      'Plano de estudos personalizado',
      'Correção de redações',
      'Certificado de conclusão',
      'Acesso vitalício',
    ],
  },
];

export const achievementTemplates = [
  {
    name: 'Primeiro Passo',
    description: 'Complete sua primeira lição',
    icon: '🎯',
  },
  {
    name: 'Sequência de 7 Dias',
    description: 'Pratique por 7 dias consecutivos',
    icon: '🔥',
  },
  {
    name: 'Sequência de 30 Dias',
    description: 'Pratique por 30 dias consecutivos',
    icon: '🏆',
  },
  {
    name: 'Mestre do Nível A1',
    description: 'Complete todas as lições do nível A1',
    icon: '⭐',
  },
  {
    name: 'Colecionador de XP',
    description: 'Acumule 1000 pontos de experiência',
    icon: '💎',
  },
  {
    name: 'Gramática Expert',
    description: 'Complete 10 lições de gramática',
    icon: '📚',
  },
  {
    name: 'Conversador',
    description: 'Complete 10 lições de conversação',
    icon: '💬',
  },
];
