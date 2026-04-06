import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";

const DMCA = () => {
  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <SEO title="DMCA - Jogos Grátis" description="Política de DMCA e termos de uso" />
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8 bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              DMCA <span className="text-[#ff0000]">& TERMOS</span>
            </h1>
            <div className="w-24 h-1 bg-[#ff0000] mx-auto rounded-full shadow-[0_0_15px_#ff0000]" />
          </div>

          <div className="space-y-8 text-gray-400 leading-relaxed text-sm md:text-base">
            <div className="space-y-4">
              <p>
                O <strong>Jogos Grátis</strong> atua exclusivamente como um agregador de links, funcionando de forma semelhante ao Google, organizando e reunindo links externos disponíveis na internet.
              </p>
              <p>
                Os links fornecidos neste site são encontrados online, e os arquivos não são hospedados em nossos servidores. O Jogos Grátis não se responsabiliza por quaisquer arquivos disponibilizados na web.
              </p>
              <p>
                Todos os links P2P (torrent) são criados por usuários e disponibilizados na internet; nosso papel é apenas localizar esses links e adicioná-los ao site. Agradecemos a sua compreensão.
              </p>
            </div>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Remoção de Conteúdo</h2>
              <p>
                Se desejar solicitar a remoção de algum jogo do nosso site por questões de direitos autorais, entre em contato pelo e-mail:
                <br />
                <a href="mailto:varaver90@gmail.com" className="text-[#ff0000] hover:underline font-bold">varaver90@gmail.com</a>
              </p>
              <p>
                Caso você acredite que algum conteúdo em nosso site infringe seus direitos autorais, envie uma notificação DMCA com as devidas informações.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Uso do Site</h2>
              <p>
                O site Jogos Grátis tem como objetivo apenas indexar jogos de outras plataformas. Não hospedamos, distribuímos ou armazenamos qualquer conteúdo ilegal, nem possuímos controle sobre fotos, dados ou links externos.
              </p>
              <p>
                Criamos o site exclusivamente para organização e direcionamento de informações. Ao utilizar nosso site, você reconhece e concorda que o uso é de sua total responsabilidade, não nos responsabilizando por qualquer uso indevido.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Propriedade Intelectual</h2>
              <p>
                Todo o conteúdo do site, incluindo, mas não se limitando a textos, gráficos, imagens, logotipos, ícones, vídeos e software, é de nossa propriedade ou de nossos licenciantes, sendo protegido por leis de direitos autorais e outras legislações aplicáveis.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Cookies</h2>
              <p>
                O site Jogos Grátis utiliza cookies e tecnologias semelhantes para melhorar a experiência do usuário e personalizar o conteúdo de acordo com seus interesses. Ao continuar navegando, você concorda com o uso dessas tecnologias.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Isenção de Responsabilidade</h2>
              <p>
                Não nos responsabilizamos por quaisquer danos ou prejuízos decorrentes do uso do site ou das informações nele contidas. Não oferecemos garantias quanto à qualidade, precisão, confiabilidade ou adequação do site ou de seu conteúdo.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Alterações nos Termos</h2>
              <p>
                Reservamos o direito de modificar estes Termos de Serviço a qualquer momento, sem aviso prévio. Ao continuar utilizando o site após eventuais alterações, você concorda com os novos termos.
              </p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Lei Aplicável</h2>
              <p>
                Estes Termos de Serviço são regidos e interpretados de acordo com as leis do Brasil.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DMCA;
