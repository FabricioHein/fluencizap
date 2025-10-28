import { useState } from 'react';
import { Plus, BookOpen, Edit, Trash2, Copy } from 'lucide-react';

export default function ContentPage() {
  const [activeTab, setActiveTab] = useState<'lessons' | 'exercises'>('lessons');

  const lessons = [
    {
      id: 1,
      title: 'Present Perfect',
      level: 'Intermediário',
      exercises: 8,
      students: 45,
      status: 'published',
    },
    {
      id: 2,
      title: 'Common Phrasal Verbs',
      level: 'Avançado',
      exercises: 12,
      students: 28,
      status: 'published',
    },
    {
      id: 3,
      title: 'Basic Greetings',
      level: 'Básico',
      exercises: 5,
      students: 92,
      status: 'published',
    },
    {
      id: 4,
      title: 'Business English',
      level: 'Avançado',
      exercises: 15,
      students: 0,
      status: 'draft',
    },
  ];

  const exercises = [
    {
      id: 1,
      title: 'Fill in the blanks - Present Perfect',
      type: 'Fill in the blanks',
      lesson: 'Present Perfect',
      difficulty: 'Médio',
    },
    {
      id: 2,
      title: 'Multiple Choice - Phrasal Verbs',
      type: 'Multiple Choice',
      lesson: 'Common Phrasal Verbs',
      difficulty: 'Difícil',
    },
    {
      id: 3,
      title: 'Conversation Practice',
      type: 'Open Question',
      lesson: 'Basic Greetings',
      difficulty: 'Fácil',
    },
  ];

  const getLevelColor = (level: string) => {
    if (level === 'Básico') return 'bg-blue-100 text-blue-700';
    if (level === 'Intermediário') return 'bg-yellow-100 text-yellow-700';
    return 'bg-purple-100 text-purple-700';
  };

  const getStatusColor = (status: string) => {
    if (status === 'published') return 'bg-green-100 text-green-700';
    return 'bg-gray-100 text-gray-700';
  };

  const getDifficultyColor = (difficulty: string) => {
    if (difficulty === 'Fácil') return 'bg-green-100 text-green-700';
    if (difficulty === 'Médio') return 'bg-yellow-100 text-yellow-700';
    return 'bg-red-100 text-red-700';
  };

  return (
    <div className="p-8">
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Conteúdo</h1>
          <p className="text-gray-600">Gerencie lições e exercícios</p>
        </div>
        <button className="flex items-center gap-2 bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
          <Plus className="h-5 w-5" />
          Criar Novo
        </button>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 mb-6">
        <div className="border-b border-gray-200">
          <div className="flex">
            <button
              onClick={() => setActiveTab('lessons')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'lessons'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Lições
            </button>
            <button
              onClick={() => setActiveTab('exercises')}
              className={`px-6 py-4 font-medium transition-colors ${
                activeTab === 'exercises'
                  ? 'text-green-600 border-b-2 border-green-600'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              Exercícios
            </button>
          </div>
        </div>

        {activeTab === 'lessons' && (
          <div className="p-6">
            <div className="space-y-4">
              {lessons.map((lesson) => (
                <div
                  key={lesson.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-4 flex-1">
                      <div className="bg-green-100 w-12 h-12 rounded-lg flex items-center justify-center flex-shrink-0">
                        <BookOpen className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="font-semibold text-gray-900">{lesson.title}</h3>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getLevelColor(lesson.level)}`}>
                            {lesson.level}
                          </span>
                          <span className={`text-xs font-medium px-2 py-1 rounded-full ${getStatusColor(lesson.status)}`}>
                            {lesson.status === 'published' ? 'Publicado' : 'Rascunho'}
                          </span>
                        </div>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <span>{lesson.exercises} exercícios</span>
                          <span>•</span>
                          <span>{lesson.students} alunos</span>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-green-600 hover:bg-green-50 rounded-lg transition-colors">
                        <Copy className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'exercises' && (
          <div className="p-6">
            <div className="space-y-4">
              {exercises.map((exercise) => (
                <div
                  key={exercise.id}
                  className="border border-gray-200 rounded-lg p-4 hover:border-green-300 transition-colors"
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <h3 className="font-semibold text-gray-900">{exercise.title}</h3>
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${getDifficultyColor(exercise.difficulty)}`}>
                          {exercise.difficulty}
                        </span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-gray-600">
                        <span className="font-medium">{exercise.type}</span>
                        <span>•</span>
                        <span>Lição: {exercise.lesson}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <button className="p-2 text-gray-400 hover:text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                        <Edit className="h-4 w-4" />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors">
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
