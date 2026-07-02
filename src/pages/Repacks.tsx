import { useState } from "react";
import { Header } from "@/components/Header";
import { SEO } from "@/components/SEO";
import { Breadcrumbs } from "@/components/Breadcrumbs";
import { supabase } from "@/integrations/supabase/client";
import { useQuery, keepPreviousData } from "@tanstack/react-query";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Search, Download, Copy, HardDrive, Calendar, ChevronLeft, ChevronRight } from "lucide-react";
import { toast } from "sonner";

const PAGE_SIZE = 30;

interface Repack {
  id: string;
  title: string;
  uris: string[];
  file_size: string | null;
  upload_date: string | null;
}

const Repacks = () => {
  const [search, setSearch] = useState("");
  const [query, setQuery] = useState("");
  const [page, setPage] = useState(0);

  const { data, isLoading, isFetching } = useQuery({
    queryKey: ["repacks", query, page],
    queryFn: async () => {
      let q = supabase
        .from("source_repacks")
        .select("id, title, uris, file_size, upload_date", { count: "exact" });

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

  const copyMagnet = async (uri: string) => {
    try {
      await navigator.clipboard.writeText(uri);
      toast.success("Link magnet copiado!");
    } catch {
      toast.error("Não foi possível copiar.");
    }
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

        <div className="mt-8 space-y-3">
          {isLoading ? (
            Array.from({ length: 8 }).map((_, i) => (
              <Skeleton key={i} className="h-20 rounded-2xl" />
            ))
          ) : rows.length === 0 ? (
            <div className="text-center py-20 text-muted-foreground">
              {query ? "Nenhum jogo encontrado para a sua busca." : "Nenhum repack cadastrado ainda."}
            </div>
          ) : (
            rows.map((r) => (
              <div
                key={r.id}
                className="rounded-2xl border border-border bg-card/40 p-4 sm:p-5 flex flex-col sm:flex-row sm:items-center gap-4"
              >
                <div className="flex-1 min-w-0">
                  <h2 className="font-bold truncate text-sm sm:text-base">{r.title}</h2>
                  <div className="flex flex-wrap items-center gap-x-4 gap-y-1 mt-1.5 text-[11px] text-muted-foreground">
                    {r.file_size && (
                      <span className="flex items-center gap-1.5">
                        <HardDrive className="h-3.5 w-3.5" /> {r.file_size}
                      </span>
                    )}
                    {r.upload_date && (
                      <span className="flex items-center gap-1.5">
                        <Calendar className="h-3.5 w-3.5" />
                        {new Date(r.upload_date).toLocaleDateString("pt-BR")}
                      </span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0">
                  <Button
                    variant="outline"
                    size="sm"
                    className="rounded-xl gap-2"
                    onClick={() => copyMagnet(r.uris[0])}
                  >
                    <Copy className="h-4 w-4" /> Copiar
                  </Button>
                  <Link to={`/repack/${r.id}`}>
                    <Button size="sm" className="rounded-xl gap-2 font-black uppercase tracking-wider">
                      <Download className="h-4 w-4" /> Baixar
                    </Button>
                  </Link>
                </div>
              </div>
            ))
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
