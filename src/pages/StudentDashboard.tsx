import { Trophy, Target, TrendingUp, BookOpen, CheckCircle, Lock } from 'lucide-react';
import { mockAuth } from '../services/mockAuth';

export default function StudentDashboard() {
  const currentUser = mockAuth.getCurrentUser();

  const studentData = {
    level: 'Intermediate',
    levelProgress: 65,
    streak: 12,
    totalLessons: 48,
    completedLessons: 31,
    xp: 2450,
    nextLevelXP: 3000,
  };

  const learningPath = [
    {
      id: 1,
      title: 'Basic Grammar',
      lessons: 10,
      completed: 10,
      status: 'completed',
      icon: CheckCircle,
      color: 'green',
    },
    {
      id: 2,
      title: 'Conversation Skills',
      lessons: 8,
      completed: 8,
      status: 'completed',
      icon: CheckCircle,
      color: 'green',
    },
    {
      id: 3,
      title: 'Vocabulary Building',
      lessons: 12,
      completed: 9,
      status: 'in_progress',
      icon: Target,
      color: 'blue',
    },
    {
      id: 4,
      title: 'Advanced Grammar',
      lessons: 10,
      completed: 4,
      status: 'in_progress',
      icon: Target,
      color: 'blue',
    },
    {
      id: 5,
      title: 'Business English',
      lessons: 8,
      completed: 0,
      status: 'locked',
      icon: Lock,
      color: 'gray',
    },
  ];

  const recentActivity = [
    { id: 1, title: 'Completed: Present Perfect Exercises', time: '2 horas atrás', xp: 50 },
    { id: 2, title: 'New vocabulary words learned', time: '1 dia atrás', xp: 30 },
    { id: 3, title: 'Conversation practice completed', time: '2 dias atrás', xp: 40 },
  ];

  const getStatusColor = (status: string) => {
    if (status === 'completed') return 'bg-green-50 border-green-200';
    if (status === 'in_progress') return 'bg-blue-50 border-blue-200';
    return 'bg-gray-50 border-gray-200';
  };

  const getIconColor = (color: string) => {
    if (color === 'green') return 'text-green-600';
    if (color === 'blue') return 'text-blue-600';
    return 'text-gray-400';
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Olá, {currentUser?.name?.split(' ')[0]}!
        </h1>
        <p className="text-gray-600">Continue sua jornada de aprendizado</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Nível Atual</span>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{studentData.level}</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${studentData.levelProgress}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{studentData.levelProgress}% para o próximo</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Sequência</span>
            <Target className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{studentData.streak} dias</p>
          <p className="text-xs text-gray-500 mt-1">Continue praticando todos os dias!</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Lições</span>
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">
            {studentData.completedLessons}/{studentData.totalLessons}
          </p>
          <p className="text-xs text-gray-500 mt-1">
            {Math.round((studentData.completedLessons / studentData.totalLessons) * 100)}% completo
          </p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">XP Total</span>
            <Trophy className="h-5 w-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{studentData.xp}</p>
          <p className="text-xs text-gray-500 mt-1">
            Faltam {studentData.nextLevelXP - studentData.xp} XP
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Seu Caminho de Aprendizado</h2>
            <button className="text-sm text-green-600 hover:text-green-700 font-medium">
              Ver Tudo
            </button>
          </div>

          <div className="space-y-4">
            {learningPath.map((path, index) => {
              const Icon = path.icon;
              return (
                <div
                  key={path.id}
                  className={`p-4 rounded-lg border ${getStatusColor(path.status)} transition-all hover:shadow-md`}
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div
                        className={`w-12 h-12 rounded-full flex items-center justify-center ${
                          path.status === 'completed'
                            ? 'bg-green-100'
                            : path.status === 'in_progress'
                            ? 'bg-blue-100'
                            : 'bg-gray-100'
                        }`}
                      >
                        <Icon className={`h-6 w-6 ${getIconColor(path.color)}`} />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{path.title}</h3>
                        <p className="text-sm text-gray-600">
                          {path.completed}/{path.lessons} lições{' '}
                          {path.status === 'completed' && '✓'}
                        </p>
                      </div>
                    </div>
                    {path.status === 'locked' ? (
                      <span className="text-xs text-gray-500 bg-gray-200 px-3 py-1 rounded-full">
                        Bloqueado
                      </span>
                    ) : (
                      <button
                        className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
                          path.status === 'completed'
                            ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                            : 'bg-green-600 text-white hover:bg-green-700'
                        }`}
                      >
                        {path.status === 'completed' ? 'Revisar' : 'Continuar'}
                      </button>
                    )}
                  </div>
                  {path.status === 'in_progress' && (
                    <div className="mt-3">
                      <div className="w-full bg-gray-200 rounded-full h-2">
                        <div
                          className="bg-blue-600 h-2 rounded-full transition-all"
                          style={{ width: `${(path.completed / path.lessons) * 100}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        <div className="space-y-6">
          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Atividade Recente</h2>
            <div className="space-y-3">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="pb-3 border-b border-gray-100 last:border-0">
                  <p className="text-sm font-medium text-gray-900">{activity.title}</p>
                  <div className="flex items-center justify-between mt-1">
                    <span className="text-xs text-gray-500">{activity.time}</span>
                    <span className="text-xs font-medium text-green-600">+{activity.xp} XP</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-sm p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Lição Diária</h3>
            <p className="text-sm text-green-50 mb-4">
              Complete sua lição de hoje para manter sua sequência!
            </p>
            <button className="w-full bg-white text-green-600 px-4 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors">
              Começar Agora
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
