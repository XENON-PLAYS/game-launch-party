import { useState } from "react";

import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, ChevronLeft, ChevronRight } from "lucide-react";
import { RepackCard, type Repack } from "@/components/RepackCard";

const PAGE_SIZE = 30;

const Repacks = () => {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["repacks", query, page],
    queryFn: async () => {
      let q = (supabase as any)
        .from("merged_repacks")
        .select("id, title, uris, file_size, upload_date, cover_url", { count: "exact" });

      if (query.trim()) {
        q = q.ilike("title", `%${query.trim()}%`);
      }

      const from = page * PAGE_SIZE;
      const { data, count, error } = await q
        .order("upload_date", { ascending: false, nullsFirst: false })
        .range(from, from + PAGE_SIZE - 1);

      if (error) throw error;
      return { rows: (data ?? []) as Repack[], count: count ?? 0 };
    },
    placeholderData: keepPreviousData,
  });

  const rows = data?.rows ?? [];
  const total = data?.count ?? 0;
  const totalPages = Math.max(1, Math.ceil(total / PAGE_SIZE));

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(0);
    setQuery(search);
  };



  return (
    <div className="min-h-screen bg-background text-foreground">
      <SEO
        title="Repacks FitGirl - Lista Completa para Download"
        description="Lista atualizada de repacks FitGirl para PC. Busque, copie o link magnet e baixe via torrent de forma rápida."
        keywords="repacks fitgirl, download torrent jogos pc, magnet jogos"
      />
      <Header />

      <main className="container-responsive py-12 sm:py-20">
        <Breadcrumbs items={[{ label: "Catálogo", path: "/" }, { label: "Repacks" }]} />

        <div className="mt-8 space-y-3">
          <h1 className="text-responsive-h1 leading-none uppercase">Repacks para PC</h1>
          <div className="flex items-center gap-4">
            <span className="w-12 md:w-24 h-1.5 md:h-2 bg-primary rounded-full" />
            <span className="text-[10px] md:text-sm text-muted-foreground opacity-80">
              {total.toLocaleString("pt-BR")} jogos na lista
            </span>
          </div>
        </div>

        <form onSubmit={handleSearch} className="mt-8 flex gap-3 max-w-2xl">
          <div className="relative flex-1">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Buscar jogo..."
              className="pl-11 rounded-xl h-12"
            />
          </div>
          <Button type="submit" className="rounded-xl h-12 px-6 font-black uppercase tracking-wider">
            Buscar
          </Button>
        </form>

        <div className="mt-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 sm:gap-6">
          {isLoading ? (
            Array.from({ length: 10 }).map((_, i) => (
              <Skeleton key={i} className="aspect-[3/4] rounded-2xl" />
            ))
          ) : rows.length === 0 ? (
            <div className="col-span-full text-center py-20 text-muted-foreground">
              {query ? "Nenhum jogo encontrado para a sua busca." : "Nenhum repack cadastrado ainda."}
            </div>
          ) : (
            rows.map((r) => <RepackCard key={r.id} repack={r} />)
          )}
        </div>


        {totalPages > 1 && (
          <div className="mt-10 flex items-center justify-center gap-4">
            <Button
              variant="outline"
              className="rounded-xl gap-1"
              disabled={page === 0 || isFetching}
              onClick={() => setPage((p) => Math.max(0, p - 1))}
            >
              <ChevronLeft className="h-4 w-4" /> Anterior
            </Button>
            <span className="text-xs font-black uppercase tracking-widest text-muted-foreground">
              {page + 1} / {totalPages}
            </span>
            <Button
              variant="outline"
              className="rounded-xl gap-1"
              disabled={page >= totalPages - 1 || isFetching}
              onClick={() => setPage((p) => p + 1)}
            >
              Próxima <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        )}
      </main>
    </div>
  );
};

export default Repacks;
