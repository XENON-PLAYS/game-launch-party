import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

type SchemaType = "WebSite" | "SoftwareApplication" | "WebPage";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  preloadImage?: string;
  preloadPoster?: string;
  schemaType?: SchemaType;
  ratingValue?: number;
  ratingCount?: number;
}

const SITE_URL = "https://game-launch-party.lovable.app";
const DEFAULT_IMAGE = `${SITE_URL}/logo-pirate.png`;

const toAbsolute = (img: string) => {
  if (!img) return DEFAULT_IMAGE;
  if (/^https?:\/\//i.test(img)) return img;
  return `${SITE_URL}${img.startsWith("/") ? "" : "/"}${img}`;
};

export const SEO = ({
  title = "Jogos Grátis - Catálogo de Jogos para PC",
  description = "Baixe os melhores jogos de PC de forma rápida, segura e gratuita. Catálogo atualizado com lançamentos e clássicos verificados.",
  keywords = "jogos grátis, download jogos pc, gta v download, minecraft grátis, red dead redemption 2 pc, jogos leves pc",
  image,
  url = SITE_URL,
  preloadImage,
  preloadPoster,
  schemaType,
  ratingValue,
  ratingCount,
}: SEOProps) => {
  const { pathname } = useLocation();
  const currentUrl = `${url}${pathname === "/" ? "" : pathname}`;
  const fullTitle = title.toLowerCase().includes("jogos grátis") ? title : `${title} | Jogos Grátis`;
  const absImage = toAbsolute(image || DEFAULT_IMAGE);

  // Decide schema: explicit -> use it; home -> WebSite+Organization; else none
  const isHome = pathname === "/";
  const effectiveSchema: SchemaType | null = schemaType ?? (isHome ? "WebSite" : null);

  const schemas: object[] = [];
  if (effectiveSchema === "WebSite") {
    schemas.push({
      "@context": "https://schema.org",
      "@type": "WebSite",
      name: "Jogos Grátis",
      url: SITE_URL,
      potentialAction: {
        "@type": "SearchAction",
        target: `${SITE_URL}/?search={search_term_string}`,
        "query-input": "required name=search_term_string",
      },
    });
    schemas.push({
      "@context": "https://schema.org",
      "@type": "Organization",
      name: "Jogos Grátis",
      url: SITE_URL,
      logo: DEFAULT_IMAGE,
    });
  } else if (effectiveSchema === "SoftwareApplication") {
    const app: Record<string, unknown> = {
      "@context": "https://schema.org",
      "@type": "SoftwareApplication",
      name: title,
      description,
      applicationCategory: "GameApplication",
      operatingSystem: "Windows",
      image: absImage,
      offers: { "@type": "Offer", price: "0", priceCurrency: "BRL" },
    };
    if (ratingValue && ratingCount && ratingCount > 0) {
      app.aggregateRating = {
        "@type": "AggregateRating",
        ratingValue: String(ratingValue),
        ratingCount: String(ratingCount),
      };
    }
    schemas.push(app);
  }

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Jogos Grátis Team" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={currentUrl} />

      {preloadImage && (
        <link rel="preload" as="image" href={preloadImage} fetchPriority="high" />
      )}
      {preloadPoster && (
        <link rel="preload" as="image" href={preloadPoster} fetchPriority="high" />
      )}

      {schemas.map((s, i) => (
        <script key={i} type="application/ld+json">{JSON.stringify(s)}</script>
      ))}

      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={absImage} />

      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={absImage} />

      <meta name="theme-color" content="#ff0000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </Helmet>
  );
};
