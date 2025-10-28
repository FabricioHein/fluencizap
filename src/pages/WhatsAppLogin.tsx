import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageCircle, Smartphone, ArrowRight } from 'lucide-react';
import { firebaseService } from '../services/firebaseService';

export default function WhatsAppLogin() {
  const navigate = useNavigate();
  const [phone, setPhone] = useState('');
  const [name, setName] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<'phone' | 'verify'>('phone');
  const [code, setCode] = useState('');

  const handlePhoneSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const formattedPhone = phone.startsWith('+') ? phone : `+55${phone.replace(/\D/g, '')}`;
      await firebaseService.initializeRecaptcha('recaptcha-container');
      const success = await firebaseService.sendVerificationCode(formattedPhone);

      if (success) {
        setStep('verify');
      } else {
        setError('Erro ao enviar código. Tente novamente.');
      }
    } catch (err) {
      console.error('Error sending code:', err);
      setError('Erro ao enviar código. Verifique o número e tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  const handleCodeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const user = await firebaseService.verifyCode(code);

      if (user) {
        if (!user.name && name) {
          await firebaseService.createUser({ ...user, name });
        }
        navigate('/student/dashboard');
      } else {
        setError('Código inválido. Tente novamente.');
      }
    } catch (err) {
      console.error('Error verifying code:', err);
      setError('Código inválido. Tente novamente.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-blue-50 flex items-center justify-center px-4">
      <div id="recaptcha-container"></div>
      <div className="max-w-md w-full">
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="h-10 w-10 text-green-600" />
            <span className="text-3xl font-bold text-gray-900">EnglishBot</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 mb-2">
            {step === 'phone' ? 'Login via WhatsApp' : 'Verificação'}
          </h1>
          <p className="text-gray-600">
            {step === 'phone'
              ? 'Digite seu número de telefone para começar'
              : 'Digite o código enviado via WhatsApp'}
          </p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8">
          {step === 'phone' ? (
            <form onSubmit={handlePhoneSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <div>
                <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-2">
                  Nome Completo
                </label>
                <input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                  placeholder="Seu nome"
                  required
                />
              </div>

              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                  Número de WhatsApp
                </label>
                <div className="relative">
                  <Smartphone className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <input
                    id="phone"
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all"
                    placeholder="+55 11 99999-1111"
                    required
                  />
                </div>
                <p className="mt-1 text-xs text-gray-500">
                  Formato: +55 (código do país) seguido do DDD e número
                </p>
              </div>

              <button
                type="submit"
                disabled={loading}
                className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? 'Enviando...' : 'Continuar'}
                {!loading && <ArrowRight className="h-5 w-5" />}
              </button>
            </form>
          ) : (
            <form onSubmit={handleCodeSubmit} className="space-y-6">
              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-sm text-red-700">
                  {error}
                </div>
              )}

              <div className="text-center mb-6">
                <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-4">
                  <p className="text-sm text-green-700">
                    Código enviado para <span className="font-medium">{phone}</span>
                  </p>
                </div>
              </div>

              <div>
                <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                  Código de Verificação
                </label>
                <input
                  id="code"
                  type="text"
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                  className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent outline-none transition-all text-center text-2xl tracking-widest"
                  placeholder="123456"
                  maxLength={6}
                  required
                />
              </div>

              <div className="space-y-3">
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition-colors shadow-md hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? 'Verificando...' : 'Verificar'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setStep('phone');
                    setCode('');
                    setError('');
                  }}
                  className="w-full text-gray-600 hover:text-gray-900 py-2 text-sm"
                >
                  Voltar
                </button>
              </div>
            </form>
          )}
        </div>

        <div className="text-center mt-6">
          <a href="/" className="text-sm text-gray-600 hover:text-green-600">
            Voltar para o site
          </a>
        </div>
      </div>
    </div>
  );
}
