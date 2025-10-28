import { useState } from 'react';
import { User, CreditCard, Bell, Shield, Globe, Save, Check } from 'lucide-react';
import { mockAuth } from '../services/mockAuth';

export default function StudentSettings() {
  const currentUser = mockAuth.getCurrentUser();
  const [activeTab, setActiveTab] = useState<'profile' | 'payment' | 'notifications' | 'security'>('profile');
  const [saved, setSaved] = useState(false);

  const tabs = [
    { id: 'profile', name: 'Perfil', icon: User },
    { id: 'payment', name: 'Pagamento', icon: CreditCard },
    { id: 'notifications', name: 'Notificações', icon: Bell },
    { id: 'security', name: 'Segurança', icon: Shield },
  ];

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-gray-900 mb-2">Configurações</h1>
        <p className="text-gray-600">Gerencie seu perfil e preferências</p>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="border-b border-gray-200">
          <div className="flex overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-4 font-medium text-sm border-b-2 transition-colors whitespace-nowrap ${
                    activeTab === tab.id
                      ? 'border-green-600 text-green-600'
                      : 'border-transparent text-gray-600 hover:text-gray-900'
                  }`}
                >
                  <Icon className="h-4 w-4" />
                  {tab.name}
                </button>
              );
            })}
          </div>
        </div>

        <div className="p-6">
          {activeTab === 'profile' && (
            <div className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nome Completo</label>
                <input
                  type="text"
                  defaultValue={currentUser?.name}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Telefone</label>
                <input
                  type="tel"
                  defaultValue={currentUser?.phone}
                  disabled
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg bg-gray-50 text-gray-500"
                />
                <p className="text-xs text-gray-500 mt-1">Telefone não pode ser alterado</p>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email (opcional)</label>
                <input
                  type="email"
                  placeholder="seu@email.com"
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Nível de Inglês</label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
                  <option>Beginner</option>
                  <option selected>Intermediate</option>
                  <option>Advanced</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  <Globe className="h-4 w-4 inline mr-2" />
                  Idioma da Interface
                </label>
                <select className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none">
                  <option selected>Português (BR)</option>
                  <option>English</option>
                  <option>Español</option>
                </select>
              </div>
            </div>
          )}

          {activeTab === 'payment' && (
            <div className="space-y-6">
              <div className="bg-gradient-to-br from-green-50 to-blue-50 rounded-lg p-6 border border-green-200">
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 mb-1">Plano Premium</h3>
                    <p className="text-sm text-gray-600">Acesso ilimitado a todas as lições</p>
                  </div>
                  <span className="bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full">
                    ATIVO
                  </span>
                </div>
                <div className="flex items-baseline gap-1 mb-4">
                  <span className="text-3xl font-bold text-gray-900">R$ 49,90</span>
                  <span className="text-gray-600">/mês</span>
                </div>
                <p className="text-sm text-gray-600 mb-4">Próxima cobrança: 15 de novembro de 2025</p>
                <button className="w-full bg-white text-gray-700 px-4 py-2 rounded-lg font-medium hover:bg-gray-50 transition-colors border border-gray-300">
                  Alterar Plano
                </button>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Métodos de Pagamento</h3>
                <div className="space-y-3">
                  <div className="p-4 border border-gray-200 rounded-lg flex items-center justify-between hover:border-green-500 transition-colors">
                    <div className="flex items-center gap-3">
                      <div className="w-12 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded flex items-center justify-center text-white text-xs font-bold">
                        VISA
                      </div>
                      <div>
                        <p className="font-medium text-gray-900">•••• •••• •••• 4242</p>
                        <p className="text-sm text-gray-500">Expira 12/2026</p>
                      </div>
                    </div>
                    <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                      Principal
                    </span>
                  </div>

                  <button className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg text-gray-600 hover:border-green-500 hover:text-green-600 transition-colors font-medium">
                    + Adicionar Novo Cartão
                  </button>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Histórico de Pagamentos</h3>
                <div className="space-y-2">
                  {[
                    { date: '01/10/2025', amount: 'R$ 49,90', status: 'Pago' },
                    { date: '01/09/2025', amount: 'R$ 49,90', status: 'Pago' },
                    { date: '01/08/2025', amount: 'R$ 49,90', status: 'Pago' },
                  ].map((payment, index) => (
                    <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium text-gray-900">{payment.amount}</p>
                        <p className="text-sm text-gray-500">{payment.date}</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                        {payment.status}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'notifications' && (
            <div className="space-y-6">
              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Notificações via WhatsApp</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">Lembrete de Lição Diária</p>
                      <p className="text-sm text-gray-500">Receba lembretes para praticar todos os dias</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">Novas Lições Disponíveis</p>
                      <p className="text-sm text-gray-500">Seja notificado quando novas lições forem adicionadas</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">Conquistas e Progresso</p>
                      <p className="text-sm text-gray-500">Receba atualizações sobre seu progresso</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">Dicas de Aprendizado</p>
                      <p className="text-sm text-gray-500">Receba dicas semanais para melhorar seu inglês</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </label>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Horário dos Lembretes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Manhã</label>
                    <input
                      type="time"
                      defaultValue="09:00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Noite</label>
                    <input
                      type="time"
                      defaultValue="20:00"
                      className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 flex items-start gap-3">
                <Shield className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <p className="font-medium text-blue-900">Sua conta está protegida</p>
                  <p className="text-sm text-blue-700 mt-1">
                    Você faz login via WhatsApp com verificação de código
                  </p>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Sessões Ativas</h3>
                <div className="space-y-3">
                  <div className="p-4 border border-gray-200 rounded-lg">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="font-medium text-gray-900">iPhone 14 Pro</p>
                        <p className="text-sm text-gray-500">São Paulo, Brasil • Ativo agora</p>
                      </div>
                      <span className="text-xs bg-green-100 text-green-700 px-3 py-1 rounded-full font-medium">
                        Esta sessão
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Privacidade</h3>
                <div className="space-y-4">
                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">Compartilhar Progresso</p>
                      <p className="text-sm text-gray-500">Permitir que outros vejam seu progresso</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </label>

                  <label className="flex items-center justify-between p-4 bg-gray-50 rounded-lg cursor-pointer">
                    <div>
                      <p className="font-medium text-gray-900">Aparecer no Ranking</p>
                      <p className="text-sm text-gray-500">Mostrar sua posição no ranking de alunos</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </label>
                </div>
              </div>

              <div className="pt-4 border-t border-gray-200">
                <button className="text-red-600 hover:text-red-700 font-medium">
                  Deletar Conta
                </button>
                <p className="text-sm text-gray-500 mt-2">
                  Esta ação é permanente e não pode ser desfeita
                </p>
              </div>
            </div>
          )}

          {saved && (
            <div className="fixed bottom-6 right-6 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-2 animate-fade-in">
              <Check className="h-5 w-5" />
              Alterações salvas com sucesso!
            </div>
          )}

          <div className="flex justify-end pt-6 border-t border-gray-200">
            <button
              onClick={handleSave}
              className="flex items-center gap-2 bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors"
            >
              <Save className="h-5 w-5" />
              Salvar Alterações
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
