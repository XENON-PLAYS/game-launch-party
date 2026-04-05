import { Helmet } from "react-helmet-async";

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
  title = "JOGOS PIRATAS - O Melhor Catálogo de Jogos", 
  description = "O melhor catálogo de jogos diretos e verificados para download rápido e seguro.", 
  keywords = "jogos, games, download, grátis, download de jogos",
  image = "/logo.png",
  url = "https://jogogratis.com",
  preloadImage,
  preloadPoster
}: SEOProps) => {
  const fullTitle = title.includes("JOGOS PIRATAS") ? title : `${title} | JOGOS PIRATAS`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
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
            "ratingValue": "4.5",
            "ratingCount": "88"
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
      <meta property="og:url" content={url} />
      <meta property="og:title" content={fullTitle} />
      <meta property="og:description" content={description} />
      <meta property="og:image" content={image} />

      {/* Twitter */}
      <meta property="twitter:card" content="summary_large_image" />
      <meta property="twitter:url" content={url} />
      <meta property="twitter:title" content={fullTitle} />
      <meta property="twitter:description" content={description} />
      <meta property="twitter:image" content={image} />
    </Helmet>
  );
};