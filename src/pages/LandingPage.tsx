import { MessageCircle, Zap, Target, Clock, CheckCircle, Star } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-white">
      <nav className="bg-white shadow-sm fixed w-full top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center gap-2">
              <MessageCircle className="h-8 w-8 text-green-600" />
              <span className="text-2xl font-bold text-gray-900">EnglishBot</span>
            </div>
            <a
              href="/admin"
              className="text-gray-700 hover:text-green-600 font-medium"
            >
              Admin
            </a>
          </div>
        </div>
      </nav>

      <section className="pt-24 pb-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-50 to-blue-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-3xl mx-auto">
            <h1 className="text-5xl md:text-6xl font-bold text-gray-900 mb-6">
              Aprenda Inglês no WhatsApp
            </h1>
            <p className="text-xl text-gray-600 mb-8">
              Pratique inglês todos os dias diretamente no seu WhatsApp. Lições personalizadas, exercícios interativos e feedback instantâneo.
            </p>
            <a
              href="/whatsapp-login"
              className="inline-flex items-center gap-2 bg-green-600 text-white px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-700 transition-colors shadow-lg hover:shadow-xl"
            >
              <MessageCircle className="h-6 w-6" />
              Começar Agora
            </a>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Por Que Usar o EnglishBot?
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-green-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <MessageCircle className="h-7 w-7 text-green-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Direto no WhatsApp
              </h3>
              <p className="text-gray-600">
                Não precisa instalar nada novo. Aprenda no app que você já usa todos os dias.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-blue-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Zap className="h-7 w-7 text-blue-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Feedback Instantâneo
              </h3>
              <p className="text-gray-600">
                Receba correções e dicas na hora. Aprenda com seus erros imediatamente.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-purple-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Target className="h-7 w-7 text-purple-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Conteúdo Personalizado
              </h3>
              <p className="text-gray-600">
                Lições adaptadas ao seu nível e objetivos de aprendizado.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-orange-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Clock className="h-7 w-7 text-orange-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Flexível
              </h3>
              <p className="text-gray-600">
                Aprenda no seu ritmo, no horário que for melhor para você.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-pink-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <CheckCircle className="h-7 w-7 text-pink-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Prática Diária
              </h3>
              <p className="text-gray-600">
                Receba exercícios todos os dias para criar o hábito de estudar.
              </p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
              <div className="bg-yellow-100 w-14 h-14 rounded-full flex items-center justify-center mb-4">
                <Star className="h-7 w-7 text-yellow-600" />
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Progresso Real
              </h3>
              <p className="text-gray-600">
                Acompanhe sua evolução e veja resultados concretos.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            Como Funciona
          </h2>
          <div className="grid md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                1
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Inicie a Conversa
              </h3>
              <p className="text-gray-600">
                Clique no botão e mande uma mensagem para o nosso WhatsApp.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                2
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Faça o Teste de Nível
              </h3>
              <p className="text-gray-600">
                Responda algumas perguntas para avaliarmos seu inglês atual.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-600 text-white w-12 h-12 rounded-full flex items-center justify-center text-xl font-bold mx-auto mb-4">
                3
              </div>
              <h3 className="text-xl font-bold text-gray-900 mb-3">
                Comece a Aprender
              </h3>
              <p className="text-gray-600">
                Receba lições diárias e pratique no seu ritmo.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-4xl font-bold text-center text-gray-900 mb-16">
            O Que Nossos Alunos Dizem
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Finalmente consegui criar o hábito de estudar inglês! As lições no WhatsApp são super práticas."
              </p>
              <p className="font-semibold text-gray-900">Maria Silva</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "O feedback instantâneo me ajuda muito. Sinto que estou evoluindo a cada dia."
              </p>
              <p className="font-semibold text-gray-900">João Santos</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "Muito melhor do que aplicativos tradicionais. Uso o WhatsApp o tempo todo mesmo."
              </p>
              <p className="font-semibold text-gray-900">Ana Costa</p>
            </div>

            <div className="bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="h-5 w-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>
              <p className="text-gray-700 mb-4">
                "As lições são curtas e objetivas. Perfeito para quem tem pouco tempo."
              </p>
              <p className="font-semibold text-gray-900">Pedro Oliveira</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-green-600 to-green-700 text-white">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl md:text-5xl font-bold mb-6">
            Pronto Para Melhorar Seu Inglês?
          </h2>
          <p className="text-xl mb-8 text-green-50">
            Comece hoje mesmo e veja resultados em semanas.
          </p>
          <a
            href="/whatsapp-login"
            className="inline-flex items-center gap-2 bg-white text-green-600 px-8 py-4 rounded-full text-lg font-semibold hover:bg-green-50 transition-colors shadow-lg hover:shadow-xl"
          >
            <MessageCircle className="h-6 w-6" />
            Começar Agora Grátis
          </a>
        </div>
      </section>

      <footer className="bg-gray-900 text-gray-300 py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <MessageCircle className="h-6 w-6 text-green-500" />
            <span className="text-xl font-bold text-white">EnglishBot</span>
          </div>
          <p className="text-sm text-gray-400">
            © 2025 EnglishBot. Todos os direitos reservados.
          </p>
        </div>
      </footer>
    </div>
  );
}
