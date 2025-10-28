import { Users, MessageSquare, TrendingUp, CheckCircle } from 'lucide-react';

export default function AdminDashboard() {
  const stats = [
    {
      label: 'Alunos Ativos',
      value: '248',
      change: '+12%',
      icon: Users,
      color: 'bg-blue-500',
    },
    {
      label: 'Mensagens Hoje',
      value: '1,423',
      change: '+8%',
      icon: MessageSquare,
      color: 'bg-green-500',
    },
    {
      label: 'Taxa de Resposta',
      value: '94%',
      change: '+3%',
      icon: TrendingUp,
      color: 'bg-purple-500',
    },
    {
      label: 'Exercícios Completos',
      value: '512',
      change: '+15%',
      icon: CheckCircle,
      color: 'bg-orange-500',
    },
  ];

  const recentActivity = [
    { student: 'Maria Silva', action: 'Completou lição "Present Perfect"', time: '5 min atrás' },
    { student: 'João Santos', action: 'Iniciou novo módulo', time: '12 min atrás' },
    { student: 'Ana Costa', action: 'Respondeu exercício de vocabulário', time: '18 min atrás' },
    { student: 'Pedro Oliveira', action: 'Alcançou 7 dias de sequência', time: '25 min atrás' },
    { student: 'Lucas Ferreira', action: 'Completou teste de nível', time: '32 min atrás' },
  ];

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Dashboard</h1>
        <p className="text-gray-600">Visão geral do desempenho da plataforma</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
              <div className="flex items-center justify-between mb-4">
                <div className={`${stat.color} w-12 h-12 rounded-lg flex items-center justify-center`}>
                  <Icon className="h-6 w-6 text-white" />
                </div>
                <span className="text-green-600 text-sm font-semibold">{stat.change}</span>
              </div>
              <p className="text-gray-600 text-sm mb-1">{stat.label}</p>
              <p className="text-3xl font-bold text-gray-900">{stat.value}</p>
            </div>
          );
        })}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Atividade Recente</h2>
          <div className="space-y-4">
            {recentActivity.map((activity, index) => (
              <div key={index} className="flex items-start gap-4 pb-4 border-b border-gray-100 last:border-0">
                <div className="bg-green-100 w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-green-600 font-semibold">
                    {activity.student.charAt(0)}
                  </span>
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{activity.student}</p>
                  <p className="text-sm text-gray-600">{activity.action}</p>
                  <p className="text-xs text-gray-400 mt-1">{activity.time}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Engajamento Semanal</h2>
          <div className="space-y-4">
            {['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom'].map((day, index) => {
              const values = [85, 92, 78, 95, 88, 65, 45];
              const value = values[index];
              return (
                <div key={day} className="flex items-center gap-4">
                  <span className="text-sm font-medium text-gray-600 w-8">{day}</span>
                  <div className="flex-1 bg-gray-100 rounded-full h-3 overflow-hidden">
                    <div
                      className="bg-green-500 h-full rounded-full transition-all"
                      style={{ width: `${value}%` }}
                    />
                  </div>
                  <span className="text-sm font-semibold text-gray-900 w-12 text-right">
                    {value}%
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
