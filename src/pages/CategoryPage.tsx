import { useParams, Link } from "react-router-dom";
import { Header } from "@/components/Header";
import { GameCard } from "@/components/GameCard";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery } from "@tanstack/react-query";
import { Skeleton } from "@/components/ui/skeleton";
import { Search } from "lucide-react";

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
      
      <main className="container mx-auto px-4 py-12">
        <Breadcrumbs 
          items={[
            { label: "Catálogo", path: "/" },
            { label: categoryName }
          ]} 
        />

        <div className="space-y-10">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 border-b border-white/5 pb-8">
            <div>
              <h1 className="text-4xl md:text-6xl font-bold tracking-tighter uppercase mb-2">
                {categoryName}
              </h1>
              <div className="flex items-center gap-3">
                <span className="w-16 h-1 bg-primary rounded-full" />
                <span className="text-[10px] text-muted-foreground font-bold uppercase tracking-[0.2em]">
                  {games.length} jogo{games.length !== 1 ? "s" : ""} encontrado{games.length !== 1 ? "s" : ""}
                </span>
              </div>
            </div>
          </div>

          {isLoading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {Array.from({ length: 10 }).map((_, i) => (
                <div key={i} className="bg-white/5 rounded-2xl overflow-hidden border border-white/5 p-1">
                  <Skeleton className="aspect-[3/4] w-full rounded-xl" />
                  <div className="p-4 space-y-3">
                    <Skeleton className="h-5 w-3/4" />
                    <div className="flex justify-between items-center">
                      <Skeleton className="h-6 w-20" />
                      <Skeleton className="h-8 w-16" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : games.length === 0 ? (
            <div className="text-center py-32 space-y-6">
              <div className="inline-flex p-6 rounded-full bg-white/5 border border-white/10 mb-4">
                <Search className="w-12 h-12 text-muted-foreground/30" />
              </div>
              <h3 className="text-3xl font-bold tracking-tighter uppercase">Nenhum tesouro encontrado</h3>
              <p className="text-muted-foreground max-w-sm mx-auto">
                Não encontramos nenhum jogo nesta categoria no momento.
              </p>
              <Link 
                to="/"
                className="px-8 py-3 bg-primary text-primary-foreground rounded-xl font-bold uppercase tracking-widest text-xs hover:scale-105 transition-transform"
              >
                Ver todo o catálogo
              </Link>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
              {games.map((game) => <GameCard key={game.id} game={game} />)}
            </div>
          )}
        </div>
      </main>

      <footer className="border-t border-white/5 bg-background py-16 mt-20">
        <div className="container mx-auto px-4 text-center text-muted-foreground text-[10px] font-bold uppercase tracking-[0.2em]">
          <p>© 2025 Jogos Piratas. Todos os tesouros reservados.</p>
        </div>
      </footer>
    </div>
  );
};

export default CategoryPage;