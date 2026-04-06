import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { motion } from "framer-motion";

const DMCA = () => {
  return (
    <div className="min-h-screen bg-[#070707] text-white">
      <SEO title="DMCA - Jogos Piratas" description="Política de DMCA e direitos autorais" />
      <Header />
      
      <main className="container mx-auto px-4 py-20">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="max-w-4xl mx-auto space-y-8 bg-white/5 p-8 md:p-12 rounded-3xl border border-white/10 backdrop-blur-xl shadow-2xl"
        >
          <div className="text-center space-y-4">
            <h1 className="text-4xl md:text-6xl font-black tracking-tighter uppercase italic">
              DMCA <span className="text-[#ff0000]">POLICY</span>
            </h1>
            <div className="w-24 h-1 bg-[#ff0000] mx-auto rounded-full shadow-[0_0_15px_#ff0000]" />
          </div>

          <div className="space-y-6 text-gray-400 leading-relaxed text-sm md:text-base">
            <p>
              O site <strong>Jogos Piratas</strong> respeita a propriedade intelectual de terceiros e espera que seus usuários façam o mesmo. Em conformidade com a Lei de Direitos Autorais do Milênio Digital (DMCA), responderemos rapidamente a avisos de alegada violação de direitos autorais.
            </p>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Como reportar uma violação?</h2>
              <p>
                Se você é o proprietário de um direito autoral ou agente do mesmo e acredita que qualquer conteúdo postado aqui infringe seus direitos autorais, você pode enviar uma notificação por escrito contendo as seguintes informações:
              </p>
              <ul className="list-disc list-inside space-y-2 ml-4">
                <li>Uma assinatura física ou eletrônica da pessoa autorizada a agir em nome do proprietário.</li>
                <li>Identificação do trabalho com direitos autorais que alegadamente foi infringido.</li>
                <li>Identificação do material que se alega estar infringindo para que possamos localizá-lo.</li>
                <li>Informações de contato (endereço, telefone e e-mail).</li>
                <li>Uma declaração de que você tem boa fé que o uso do material não é autorizado.</li>
                <li>Uma declaração de que as informações na notificação são precisas.</li>
              </ul>
            </section>

            <section className="space-y-4">
              <h2 className="text-xl font-bold text-white uppercase tracking-wider">Contato</h2>
              <p>
                Envie suas solicitações de DMCA para o nosso e-mail oficial de suporte ou utilize o formulário de contato em nosso Discord oficial.
              </p>
            </section>
          </div>
        </motion.div>
      </main>
    </div>
  );
};

export default DMCA;
