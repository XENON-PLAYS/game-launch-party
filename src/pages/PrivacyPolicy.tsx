import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";
import { MeteorBackground } from "@/components/MeteorBackground";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen space-background text-foreground flex flex-col">
      <SEO title="Política de Privacidade - Jogos Grátis" description="Nossa política de privacidade e proteção de dados" />
      <Header />
      <MeteorBackground />
      
      <main className="container mx-auto px-4 py-20 relative z-10 flex-1">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8 bg-card/80 p-8 md:p-12 rounded-3xl border border-border backdrop-blur-xl shadow-2xl"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              POLÍTICA DE <span className="text-[#ff0000]">PRIVACIDADE</span>
            </h1>
            <div className="w-24 h-1 bg-[#ff0000] mx-auto rounded-full shadow-[0_0_15px_#ff0000]" />
          </div>

          <div className="space-y-8 text-muted-foreground leading-relaxed text-sm md:text-base">
            <p className="text-foreground font-medium">
              A Jogos Grátis valoriza a privacidade e a proteção dos dados pessoais de seus usuários. Esta Política de Privacidade descreve como as informações são coletadas, utilizadas, armazenadas e protegidas ao acessar e utilizar nosso site. Ao utilizar o site, você declara estar ciente e de acordo com os termos aqui descritos.
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wider">1. Coleta de Informações</h2>
              <p>A coleta de informações ocorre de forma limitada e pode incluir:</p>
              
              <div className="ml-4 space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-foreground/90">1.1 Dados de Navegação (Anônimos)</h3>
                  <p>Podemos coletar informações não identificáveis por meio de ferramentas de análise, como o Google Analytics, incluindo, mas não se limitando a:</p>
                  <ul className="list-disc ml-6 mt-2 space-y-1">
                    <li>Endereço IP (anonimizado)</li>
                    <li>Tipo de navegador e dispositivo</li>
                    <li>Páginas acessadas</li>
                    <li>Tempo de navegação</li>
                  </ul>
                  <p className="mt-2 italic">Esses dados são utilizados exclusivamente para fins estatísticos e não permitem a identificação direta do usuário.</p>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-foreground/90">1.2 Conteúdo Fornecido pelo Usuário</h3>
                  <p>Ao interagir com o site, o usuário poderá fornecer informações voluntariamente, como comentários, avaliações ou mensagens. Tais conteúdos, quando publicados, poderão ser visualizados por outros usuários.</p>
                  <p className="mt-2 font-semibold text-[#ff0000]/80">A Jogos Grátis não se responsabiliza por informações pessoais compartilhadas publicamente pelo usuário.</p>
                </div>
              </div>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wider">2. Uso das Informações</h2>
              <p>As informações coletadas são utilizadas para:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Melhorar o desempenho e a funcionalidade do site</li>
                <li>Aprimorar a experiência do usuário</li>
                <li>Monitorar a segurança e prevenir atividades indevidas</li>
                <li>Gerar estatísticas internas de uso</li>
              </ul>
              <p className="font-semibold text-foreground/90">Não comercializamos, alugamos ou compartilhamos dados pessoais com terceiros, salvo quando exigido por lei.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wider">3. Armazenamento e Segurança</h2>
              <p>Adotamos medidas técnicas e organizacionais adequadas para proteger os dados contra acesso não autorizado, perda, alteração ou divulgação indevida. As informações são armazenadas em ambientes seguros, com acesso restrito e utilização de tecnologias como:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Criptografia SSL (Secure Socket Layer)</li>
                <li>Firewalls e sistemas de proteção</li>
                <li>Controle de acesso baseado em níveis de permissão</li>
              </ul>
              <p className="italic">Apesar dos esforços, nenhum sistema é completamente seguro, e não podemos garantir segurança absoluta.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wider">4. Cookies e Tecnologias Semelhantes</h2>
              <p>Utilizamos cookies e tecnologias semelhantes para:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Garantir o funcionamento adequado do site</li>
                <li>Personalizar conteúdos e preferências</li>
                <li>Analisar o comportamento de navegação</li>
              </ul>
              <p>Ao continuar utilizando o site, você concorda com o uso dessas tecnologias. O usuário pode gerenciar ou desativar cookies diretamente em seu navegador.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wider">5. Direitos do Usuário</h2>
              <p>Dependendo da legislação aplicável, o usuário poderá ter direitos relacionados aos seus dados, incluindo:</p>
              <ul className="list-disc ml-6 space-y-1">
                <li>Solicitar acesso às informações coletadas</li>
                <li>Solicitar correção ou exclusão de dados</li>
                <li>Revogar consentimentos, quando aplicável</li>
              </ul>
              <p>Para exercer esses direitos, entre em contato pelos canais informados abaixo.</p>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wider">6. Alterações nesta Política</h2>
              <p>A Jogos Grátis reserva-se o direito de modificar esta Política de Privacidade a qualquer momento, visando sua atualização ou adequação legal. As alterações entrarão em vigor a partir de sua publicação no site. O uso contínuo do serviço será interpretado como concordância com os novos termos.</p>
            </section>

            <section className="space-y-4 border-t border-border pt-8">
              <h2 className="text-xl font-bold text-foreground uppercase tracking-wider">7. Contato</h2>
              <p>Em caso de dúvidas, solicitações ou questões relacionadas à privacidade e proteção de dados, entre em contato:</p>
              <a 
                href="mailto:contato@jogosgratis.com" 
                className="inline-flex items-center gap-2 text-primary hover:text-primary/80 transition-colors font-bold text-lg"
              >
                📧 contato@jogosgratis.com
              </a>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default PrivacyPolicy;
