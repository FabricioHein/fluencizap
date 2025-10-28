import { useEffect, useState } from 'react';
import { Trophy, Target, TrendingUp, BookOpen, CheckCircle, Lock, MessageCircle } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { firebaseService, Lesson, Achievement } from '../services/firebaseService';

export default function StudentDashboard() {
  const { currentUser } = useAuth();
  const [lessons, setLessons] = useState<Lesson[]>([]);
  const [achievements, setAchievements] = useState<Achievement[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadData();
  }, [currentUser]);

  const loadData = async () => {
    if (!currentUser) return;

    try {
      const [userLessons, userAchievements] = await Promise.all([
        firebaseService.getLessonsByLevel(currentUser.level),
        firebaseService.getUserAchievements(currentUser.uid),
      ]);

      setLessons(userLessons);
      setAchievements(userAchievements);
    } catch (error) {
      console.error('Error loading data:', error);
    } finally {
      setLoading(false);
    }
  };

  const getLevelProgress = () => {
    const levels = ['A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
    const currentIndex = levels.indexOf(currentUser?.level || 'A1');
    return ((currentIndex + 1) / levels.length) * 100;
  };

  const getXPForNextLevel = () => {
    const xpPerLevel = 500;
    const currentXP = currentUser?.xp || 0;
    const nextLevelXP = Math.ceil(currentXP / xpPerLevel) * xpPerLevel + xpPerLevel;
    return nextLevelXP;
  };

  const startWhatsAppTraining = () => {
    const message = encodeURIComponent('Olá! Quero começar a treinar inglês agora.');
    window.open(`https://wa.me/5511999999999?text=${message}`, '_blank');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Olá, {currentUser?.name || 'Estudante'}!
        </h1>
        <p className="text-gray-600">Continue sua jornada de aprendizado</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Nível Atual</span>
            <TrendingUp className="h-5 w-5 text-green-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900 mb-1">{currentUser?.level}</p>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div
              className="bg-green-600 h-2 rounded-full transition-all"
              style={{ width: `${getLevelProgress()}%` }}
            />
          </div>
          <p className="text-xs text-gray-500 mt-1">{getLevelProgress().toFixed(0)}% para C2</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Sequência</span>
            <Target className="h-5 w-5 text-orange-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{currentUser?.streak || 0} dias</p>
          <p className="text-xs text-gray-500 mt-1">Continue praticando todos os dias!</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">Lições</span>
            <BookOpen className="h-5 w-5 text-blue-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{currentUser?.lessonsCompleted || 0}</p>
          <p className="text-xs text-gray-500 mt-1">Lições completadas</p>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm text-gray-600">XP Total</span>
            <Trophy className="h-5 w-5 text-yellow-600" />
          </div>
          <p className="text-2xl font-bold text-gray-900">{currentUser?.xp || 0}</p>
          <p className="text-xs text-gray-500 mt-1">
            Faltam {getXPForNextLevel() - (currentUser?.xp || 0)} XP
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Lições do Nível {currentUser?.level}</h2>
            <span className="text-sm text-gray-500">{lessons.length} disponíveis</span>
          </div>

          {lessons.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="h-12 w-12 text-gray-400 mx-auto mb-4" />
              <p className="text-gray-600">Nenhuma lição disponível ainda</p>
              <p className="text-sm text-gray-500 mt-2">Novas lições em breve!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="p-4 rounded-lg border border-gray-200 hover:border-green-500 transition-all hover:shadow-md"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-full flex items-center justify-center bg-blue-100">
                        <BookOpen className="h-6 w-6 text-blue-600" />
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                        <p className="text-sm text-gray-600">{lesson.content}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className="text-xs bg-blue-100 text-blue-700 px-2 py-1 rounded">
                            {lesson.type}
                          </span>
                          <span className="text-xs text-gray-500">+{lesson.xpReward} XP</span>
                        </div>
                      </div>
                    </div>
                    <button className="px-4 py-2 rounded-lg font-medium text-sm transition-colors bg-green-600 text-white hover:bg-green-700">
                      Iniciar
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="space-y-6">
          <div className="bg-gradient-to-br from-green-600 to-green-700 rounded-xl shadow-sm p-6 text-white">
            <h3 className="text-lg font-bold mb-2">Treinar no WhatsApp</h3>
            <p className="text-sm text-green-50 mb-4">
              Comece uma sessão de treino interativa direto no WhatsApp!
            </p>
            <button
              onClick={startWhatsAppTraining}
              className="w-full bg-white text-green-600 px-4 py-3 rounded-lg font-semibold hover:bg-green-50 transition-colors flex items-center justify-center gap-2"
            >
              <MessageCircle className="h-5 w-5" />
              Iniciar Treino
            </button>
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Conquistas</h2>
            {achievements.length === 0 ? (
              <div className="text-center py-8">
                <Trophy className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600">Nenhuma conquista ainda</p>
                <p className="text-xs text-gray-500 mt-1">Complete lições para ganhar conquistas!</p>
              </div>
            ) : (
              <div className="space-y-3">
                {achievements.slice(0, 5).map((achievement) => (
                  <div key={achievement.id} className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
                    <span className="text-2xl">{achievement.icon}</span>
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{achievement.name}</p>
                      <p className="text-xs text-gray-500">{achievement.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Seu Plano</h2>
            <div className="text-center py-4">
              <p className="text-2xl font-bold text-gray-900 capitalize">{currentUser?.plan}</p>
              {currentUser?.plan === 'free' && (
                <>
                  <p className="text-sm text-gray-600 mt-2 mb-4">
                    Faça upgrade para Premium e tenha acesso ilimitado!
                  </p>
                  <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 transition-colors">
                    Fazer Upgrade
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
