import { useState } from 'react';
import { QrCode, Smartphone, CheckCircle, XCircle, RefreshCw, MessageSquare } from 'lucide-react';

export default function WhatsAppPage() {
  const [isConnected] = useState(true);

  const messages = [
    {
      id: 1,
      student: 'Maria Silva',
      message: 'Completed exercise: Present Perfect #3',
      time: '10:30 AM',
      type: 'success',
    },
    {
      id: 2,
      student: 'João Santos',
      message: 'Started new lesson',
      time: '10:25 AM',
      type: 'info',
    },
    {
      id: 3,
      student: 'Ana Costa',
      message: 'Question: How do I use "since" vs "for"?',
      time: '10:15 AM',
      type: 'question',
    },
    {
      id: 4,
      student: 'Pedro Oliveira',
      message: 'Failed exercise attempt',
      time: '10:05 AM',
      type: 'error',
    },
  ];

  const getMessageTypeColor = (type: string) => {
    if (type === 'success') return 'bg-green-50 border-green-200';
    if (type === 'error') return 'bg-red-50 border-red-200';
    if (type === 'question') return 'bg-blue-50 border-blue-200';
    return 'bg-gray-50 border-gray-200';
  };

  return (
    <div className="p-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">WhatsApp Integration</h1>
        <p className="text-gray-600">Gerencie a conexão e monitore mensagens</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-gray-900">Status da Conexão</h2>
            {isConnected ? (
              <div className="flex items-center gap-2 text-green-600">
                <CheckCircle className="h-5 w-5" />
                <span className="font-medium">Conectado</span>
              </div>
            ) : (
              <div className="flex items-center gap-2 text-red-600">
                <XCircle className="h-5 w-5" />
                <span className="font-medium">Desconectado</span>
              </div>
            )}
          </div>

          {isConnected ? (
            <div className="space-y-4">
              <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg border border-green-200">
                <Smartphone className="h-6 w-6 text-green-600" />
                <div>
                  <p className="font-medium text-green-900">WhatsApp Ativo</p>
                  <p className="text-sm text-green-700">+55 11 99999-0000</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Mensagens Enviadas</p>
                  <p className="text-2xl font-bold text-gray-900">1,234</p>
                </div>
                <div className="p-4 bg-gray-50 rounded-lg">
                  <p className="text-sm text-gray-600 mb-1">Mensagens Recebidas</p>
                  <p className="text-2xl font-bold text-gray-900">987</p>
                </div>
              </div>

              <button className="w-full flex items-center justify-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">
                <RefreshCw className="h-4 w-4" />
                Desconectar
              </button>
            </div>
          ) : (
            <div className="text-center py-8">
              <div className="bg-gray-100 w-48 h-48 mx-auto rounded-lg flex items-center justify-center mb-4">
                <QrCode className="h-24 w-24 text-gray-400" />
              </div>
              <p className="text-gray-600 mb-4">
                Escaneie o QR Code com seu WhatsApp para conectar
              </p>
              <button className="flex items-center gap-2 bg-green-600 text-white px-6 py-2 rounded-lg hover:bg-green-700 transition-colors mx-auto">
                <RefreshCw className="h-4 w-4" />
                Gerar Novo QR Code
              </button>
            </div>
          )}
        </div>

        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
          <h2 className="text-xl font-bold text-gray-900 mb-6">Configurações</h2>
          <div className="space-y-4">
            <div>
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Respostas Automáticas</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Responder automaticamente a mensagens recebidas
              </p>
            </div>

            <div>
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Notificações</span>
                <input type="checkbox" className="toggle" defaultChecked />
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Receber notificações de novas mensagens
              </p>
            </div>

            <div>
              <label className="flex items-center justify-between">
                <span className="text-sm font-medium text-gray-700">Modo Manutenção</span>
                <input type="checkbox" className="toggle" />
              </label>
              <p className="text-xs text-gray-500 mt-1">
                Pausar envio de mensagens automáticas
              </p>
            </div>

            <div className="pt-4 border-t border-gray-200">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Mensagem de Boas-vindas
              </label>
              <textarea
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none"
                defaultValue="Olá! 👋 Bem-vindo ao EnglishBot. Vamos começar sua jornada de aprendizado?"
              />
            </div>

            <button className="w-full bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700 transition-colors">
              Salvar Configurações
            </button>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-xl font-bold text-gray-900">Log de Mensagens</h2>
          <button className="flex items-center gap-2 text-gray-600 hover:text-gray-900">
            <RefreshCw className="h-4 w-4" />
            Atualizar
          </button>
        </div>

        <div className="space-y-3">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`p-4 rounded-lg border ${getMessageTypeColor(message.type)}`}
            >
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <MessageSquare className="h-5 w-5 text-gray-500 mt-0.5" />
                  <div>
                    <p className="font-medium text-gray-900">{message.student}</p>
                    <p className="text-sm text-gray-600 mt-1">{message.message}</p>
                  </div>
                </div>
                <span className="text-xs text-gray-500">{message.time}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
