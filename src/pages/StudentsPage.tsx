import { useState } from 'react';
import { Search, Filter, MoreVertical, User, CheckCircle, Clock, XCircle } from 'lucide-react';

export default function StudentsPage() {
  const [searchTerm, setSearchTerm] = useState('');

  const students = [
    {
      id: 1,
      name: 'Maria Silva',
      phone: '+55 11 99999-1111',
      level: 'Intermediário',
      status: 'active',
      streak: 15,
      lastActivity: '2 horas atrás',
      completedLessons: 42,
    },
    {
      id: 2,
      name: 'João Santos',
      phone: '+55 11 99999-2222',
      level: 'Básico',
      status: 'active',
      streak: 7,
      lastActivity: '1 hora atrás',
      completedLessons: 18,
    },
    {
      id: 3,
      name: 'Ana Costa',
      phone: '+55 11 99999-3333',
      level: 'Avançado',
      status: 'active',
      streak: 23,
      lastActivity: '30 min atrás',
      completedLessons: 87,
    },
    {
      id: 4,
      name: 'Pedro Oliveira',
      phone: '+55 11 99999-4444',
      level: 'Intermediário',
      status: 'inactive',
      streak: 0,
      lastActivity: '3 dias atrás',
      completedLessons: 34,
    },
    {
      id: 5,
      name: 'Lucas Ferreira',
      phone: '+55 11 99999-5555',
      level: 'Básico',
      status: 'active',
      streak: 5,
      lastActivity: '5 horas atrás',
      completedLessons: 12,
    },
  ];

  const getStatusIcon = (status: string) => {
    if (status === 'active') return <CheckCircle className="h-5 w-5 text-green-500" />;
    if (status === 'inactive') return <Clock className="h-5 w-5 text-gray-400" />;
    return <XCircle className="h-5 w-5 text-red-500" />;
  };

  const getStatusLabel = (status: string) => {
    if (status === 'active') return 'Ativo';
    if (status === 'inactive') return 'Inativo';
    return 'Bloqueado';
  };

  const getLevelColor = (level: string) => {
    if (level === 'Básico') return 'bg-blue-100 text-blue-700';
    if (level === 'Intermediário') return 'bg-yellow-100 text-yellow-700';
    return 'bg-purple-100 text-purple-700';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Alunos</h1>
        <p className="text-gray-600">Gerencie seus alunos e acompanhe o progresso</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="Buscar alunos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
            />
          </div>
          <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
            <Filter className="h-5 w-5" />
            Filtros
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {students.map((student) => (
          <div
            key={student.id}
            className="bg-white rounded-xl shadow-sm border border-gray-100 p-6 hover:shadow-md transition-shadow"
          >
            <div className="flex items-start justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className="bg-green-100 w-12 h-12 rounded-full flex items-center justify-center">
                  <User className="h-6 w-6 text-green-600" />
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900">{student.name}</h3>
                  <p className="text-sm text-gray-500">{student.phone}</p>
                </div>
              </div>
              <button className="text-gray-400 hover:text-gray-600">
                <MoreVertical className="h-5 w-5" />
              </button>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Nível</span>
                <span className={`text-xs font-medium px-2 py-1 rounded-full ${getLevelColor(student.level)}`}>
                  {student.level}
                </span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Status</span>
                <div className="flex items-center gap-1">
                  {getStatusIcon(student.status)}
                  <span className="text-sm font-medium text-gray-900">
                    {getStatusLabel(student.status)}
                  </span>
                </div>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Sequência</span>
                <span className="text-sm font-semibold text-gray-900">{student.streak} dias</span>
              </div>

              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Lições completas</span>
                <span className="text-sm font-semibold text-gray-900">{student.completedLessons}</span>
              </div>

              <div className="pt-3 border-t border-gray-100">
                <p className="text-xs text-gray-500">
                  Última atividade: {student.lastActivity}
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
