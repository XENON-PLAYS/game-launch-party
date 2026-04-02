import { Helmet } from "react-helmet-async";

interface SEOProps {
  title?: string;
  description?: string;
  keywords?: string;
  image?: string;
  url?: string;
}

export const SEO = ({ 
  title = "Jogos Piratas - O maior catálogo de jogos", 
  description = "A maior comunidade de compartilhamento de jogos. Descubra, jogue e compartilhe suas experiências.", 
  keywords = "jogos, games, download, grátis, pirata, jogos piratas, download de jogos",
  image = "/logo.png",
  url = "https://jogospiratas.com"
}: SEOProps) => {
  const fullTitle = title.includes("Jogos Piratas") ? title : `${title} | Jogos Piratas`;

  return (
    <Helmet>
      <title>{fullTitle}</title>
      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      
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