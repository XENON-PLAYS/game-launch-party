import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <SEO title="Política de Privacidade - Jogos Grátis" description="Nossa política de privacidade e proteção de dados" />
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8 bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              POLÍTICA DE <span className="text-[#ff0000]">PRIVACIDADE</span>
            </h1>
            <div className="w-24 h-1 bg-[#ff0000] mx-auto rounded-full shadow-[0_0_15px_#ff0000]" />
          </div>

          <div className="space-y-8 text-gray-400 leading-relaxed text-sm md:text-base">
            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Introdução</h2>
              <p>
                A sua privacidade é importante para nós. É política do Jogos Grátis respeitar a sua privacidade em relação a qualquer informação sua que possamos coletar no site Jogos Grátis, e outros sites que possuímos e operamos.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Coleta de Informações</h2>
              <p>
                Solicitamos informações pessoais apenas quando realmente precisamos delas para lhe fornecer um serviço. Fazemo-lo por meios justos e legais, com o seu conhecimento e consentimento. Também informamos por que estamos coletando e como será usado.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Uso de Dados</h2>
              <p>
                Apenas retemos as informações coletadas pelo tempo necessário para fornecer o serviço solicitado. Quando armazenamos dados, os protegemos dentro de meios comercialmente aceitáveis ​​para evitar perdas e roubos, bem como acesso, divulgação, cópia, uso ou modificação não autorizados.
              </p>
              <p>
                Não compartilhamos informações de identificação pessoal publicamente ou com terceiros, exceto quando exigido por lei.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Cookies</h2>
              <p>
                Utilizamos cookies para fornecer uma melhor experiência aos nossos usuários. Você pode optar por recusar os cookies através das configurações do seu navegador, mas isso pode afetar a funcionalidade de algumas partes do site.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Links Externos</h2>
              <p>
                O nosso site pode ter links para sites externos que não são operados por nós. Esteja ciente de que não temos controle sobre o conteúdo e práticas desses sites e não podemos aceitar responsabilidade por suas respectivas políticas de privacidade.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Compromisso do Usuário</h2>
              <p>
                O usuário se compromete a fazer uso adequado dos conteúdos e da informação que o Jogos Grátis oferece no site e com caráter enunciativo, mas não limitativo.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Contato</h2>
              <p>
                Se você tiver alguma dúvida sobre como lidamos com dados do usuário e informações pessoais, entre em contato conosco através do e-mail:
                <br />
                <a href="mailto:varaver90@gmail.com" className="text-[#ff0000] hover:underline font-bold">varaver90@gmail.com</a>
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;