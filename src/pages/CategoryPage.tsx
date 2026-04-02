import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { GameCard } from "@/components/GameCard";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";
import logo from "@/assets/logo.png";

const CategoryPage = () => {
  const { category } = useParams();
  
  const { data: games = [], isLoading } = useQuery({
    queryKey: ["games-category", category],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("games")
        .select("*")
        .contains("categorias", [category])
        .order("nome");
      if (error) throw error;
      return data;
    },
    enabled: !!category,
  });

  const categoryName = category ? category.charAt(0).toUpperCase() + category.slice(1) : "";

  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO 
        title={`Jogos de ${categoryName}`} 
        description={`Confira os melhores jogos de ${categoryName} disponíveis para download. A maior comunidade de compartilhamento de jogos.`}
        keywords={`jogos de ${categoryName}, download ${categoryName}, games ${categoryName}`}
      />
      <Header />
      
      <main className="container-responsive py-12 sm:py-20 lg:py-32">
        <Breadcrumbs 
          items={[
            { label: "Catálogo", path: "/" },
            { label: categoryName }
          ]} 
        />

        <div className="space-y-12 sm:space-y-20 lg:space-y-32">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-8 border-b border-border pb-12 sm:pb-20">
            <div className="space-y-4">
              <h1 className="text-responsive-h1 leading-none uppercase">
                {categoryName}
              </h1>
              <div className="flex items-center gap-6">
                <span className="w-16 sm:w-24 h-2 bg-primary rounded-full shadow-lg shadow-primary/20" />
                <span className="text-responsive-small text-muted-foreground opacity-80">
                  {games.length} jogo{games.length !== 1 ? "s" : ""} na frota de {categoryName}
                </span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-4 sm:gap-6 lg:gap-8">
              {Array.from({ length: 12 }).map((_, i) => (
                <div key={i} className="bg-card rounded-2xl overflow-hidden border border-border p-1 shadow-lg">
                  <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-4 w-3/4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-5 w-16" />
                      <Skeleton className="h-8 w-12" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-20 sm:py-40 space-y-8 max-w-2xl mx-auto">
              <div className="inline-flex p-8 sm:p-12 rounded-full bg-primary/5 border border-primary/10 mb-6">
                <Search className="w-16 h-16 sm:w-24 sm:h-24 text-primary/30" />
              </div>
              <h3 className="text-responsive-h3 uppercase">Nenhum tesouro encontrado</h3>
              <p className="text-responsive-body text-muted-foreground">
                Não encontramos nenhum jogo nesta categoria no momento. Tente explorar outros mares da nossa frota.
              </p>
              <Link 
                to="/"
                className="px-10 py-5 bg-primary text-primary-foreground rounded-2xl font-black uppercase tracking-[0.2em] text-xs sm:text-sm hover:scale-105 transition-all shadow-2xl shadow-primary/20"
              >
                Ver todo o catálogo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 3xl:grid-cols-8 gap-4 sm:gap-6 lg:gap-8">
              {games.map((game) => <GameCard key={game.id} game={game} />)}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-border bg-card py-20 sm:py-32 lg:py-48 mt-32 md:mt-60">
        <div className="container-responsive text-center space-y-10">
          <Link to="/" className="inline-flex items-center gap-5 group mx-auto">
            <img src={logo} alt="Jogos Piratas" className="w-16 h-16 sm:w-20 sm:h-20" />
            <div className="flex flex-col text-left">
              <span className="font-black text-2xl sm:text-3xl tracking-tighter leading-none">JOGOS</span>
              <span className="font-black text-2xl sm:text-3xl tracking-tighter leading-none text-primary">PIRATAS</span>
            </div>
          </Link>
          <div className="pt-16 border-t border-border flex flex-col md:flex-row justify-between items-center gap-10 text-responsive-small text-muted-foreground opacity-60">
            <p>© 2025 Jogos Piratas — Navegando pelos Sete Mares dos Games desde 1715.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default CategoryPage;