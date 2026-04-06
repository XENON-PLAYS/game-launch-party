import { Helmet } from "react-helmet-async";
import { useLocation } from "react-router-dom";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
  preloadImage?: string;
  preloadPoster?: string;
}

export const SEO = ({ 
  title = "Jogos Piratas - O Melhor Catálogo de Jogos Grátis para PC", 
  description = "Baixe os melhores jogos de PC de forma rápida, segura e 100% gratuita. Catálogo atualizado diariamente com os maiores lançamentos e clássicos verificados.", 
  keywords = "jogos grátis, download jogos pc, jogos piratas, gta v download, minecraft grátis, red dead redemption 2 pc, jogos leves pc",
  image = "/logo-pirate.png",
  url = "https://jogos-piratas.com",
  preloadImage,
  preloadPoster
}: SEOProps) => {
  const { pathname } = useLocation();
  const currentUrl = `${url}${pathname === "/" ? "" : pathname}`;
  const fullTitle = title.toLowerCase().includes("jogos piratas") ? title : `${title} | Jogos Piratas`;

  return (
    <Helmet>
      {/* Primary Meta Tags */}
      <title>{fullTitle}</title>
      <meta name="title" content={fullTitle} />
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content="Jogos Piratas Team" />
      <meta name="robots" content="index, follow" />
      <link rel="canonical" href={currentUrl} />
      
      {/* Preload critical assets */}
      {preloadImage && (
        <link rel="preload" as="image" href={preloadImage} fetchPriority="high" />
      )}
      {preloadPoster && (
        <link rel="preload" as="image" href={preloadPoster} fetchPriority="high" />
      )}
      
      {/* Structured Data */}
      <script type="application/ld+json">
        {JSON.stringify({
          "@context": "https://schema.org",
          "@type": "SoftwareApplication",
          "name": title,
          "description": description,
          "applicationCategory": "GameApplication",
          "operatingSystem": "Windows",
          "screenshot": image,
          "aggregateRating": {
            "@type": "AggregateRating",
            "ratingValue": "4.9",
            "ratingCount": "1542"
          },
          "offers": {
            "@type": "Offer",
            "price": "0",
            "priceCurrency": "BRL"
          }
        })}
      </script>

      {/* Open Graph / Facebook */}
      <meta property="og:type" content="website" />
      <meta property="og:url" content={currentUrl} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={currentUrl} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />

      {/* Mobile Meta */}
      <meta name="theme-color" content="#ff0000" />
      <meta name="apple-mobile-web-app-capable" content="yes" />
      <meta name="apple-mobile-web-app-status-bar-style" content="black-translucent" />
    </Helmet>
  );
};