
DROP MATERIALIZED VIEW IF EXISTS public.merged_repacks;

CREATE MATERIALIZED VIEW public.merged_repacks AS
SELECT
  m.*,
  (
    NULLIF(substring(m.file_size from '([0-9]+(?:\.[0-9]+)?)'), '')::numeric
    * CASE
        WHEN m.file_size ~* 'tb' THEN 1024
        WHEN m.file_size ~* 'mb' THEN 1.0/1024
        WHEN m.file_size ~* 'kb' THEN 1.0/1048576
        WHEN m.file_size ~* 'gb' THEN 1
        ELSE NULL
      END
  ) AS size_gb,
  (m.base_key = ANY (ARRAY(
    SELECT public.repack_base_title(t)
    FROM unnest(ARRAY[
      'Black Myth: Wukong','Hogwarts Legacy','Star Wars Jedi: Fallen Order','Star Wars Jedi: Survivor',
      'Star Wars Outlaws','Resident Evil 2 Remake','Resident Evil 2 2019','Resident Evil 3 Remake',
      'Resident Evil 3 2020','Resident Evil 4 Remake','Resident Evil 4 2023','Resident Evil 7 Biohazard',
      'Resident Evil Village','Assassin''s Creed Origins','Assassin''s Creed Odyssey','Assassin''s Creed Valhalla',
      'Assassin''s Creed Mirage','Assassin''s Creed Shadows','Mortal Kombat 1','Mortal Kombat 11','Tekken 7',
      'Tekken 8','Dragon''s Dogma 2','Final Fantasy VII Remake','Final Fantasy VII Rebirth','Final Fantasy XV',
      'Final Fantasy XVI','Sonic Frontiers','Sonic Superstars','Sonic X Shadow Generations','Yakuza: Like a Dragon',
      'Like a Dragon: Infinite Wealth','Like a Dragon: Ishin','Like a Dragon Gaiden: The Man Who Erased His Name',
      'Dead Space Remake','Dead Space Remake 2023','Dead Space 2023','Hitman 3','Hitman World of Assassination',
      'EA Sports FC 24','EA Sports FC 25','FIFA 21','FIFA 22','FIFA 23','F1 23','F1 24','F1 25',
      'Need for Speed Unbound','Lords of the Fallen','The Callisto Protocol','Atomic Heart','Returnal','Forspoken',
      'Wo Long: Fallen Dynasty','Street Fighter 6','Tales of Arise','Monster Hunter Rise','Monster Hunter Wilds',
      'Silent Hill 2 Remake','Dragon Age: The Veilguard','Avatar: Frontiers of Pandora','Prince of Persia: The Lost Crown',
      'Warhammer 40000: Space Marine 2','Warhammer 40,000: Space Marine 2','Metaphor: ReFantazio','Persona 3 Reload',
      'Persona 5 Tactica'
    ]) t
  ))) AS is_denuvo
FROM (
  SELECT base_key,
    (array_agg(id ORDER BY (upload_date IS NULL), s.upload_date DESC))[1] AS id,
    (array_agg(title ORDER BY (upload_date IS NULL), s.upload_date DESC))[1] AS title,
    (array_agg(file_size ORDER BY (file_size IS NULL), (upload_date IS NULL), s.upload_date DESC))[1] AS file_size,
    max(upload_date) AS upload_date,
    (array_agg(cover_url ORDER BY (cover_url IS NULL), (upload_date IS NULL), s.upload_date DESC))[1] AS cover_url,
    array_agg(DISTINCT uri) AS uris,
    array_agg(DISTINCT source) AS sources,
    (array_agg(banner_url ORDER BY (banner_url IS NULL), (upload_date IS NULL), s.upload_date DESC))[1] AS banner_url,
    (array_agg(description ORDER BY (description IS NULL), (upload_date IS NULL), s.upload_date DESC))[1] AS description,
    (array_agg(trailer_url ORDER BY (trailer_url IS NULL), (upload_date IS NULL), s.upload_date DESC))[1] AS trailer_url,
    ( SELECT sr.screenshots
        FROM source_repacks sr
       WHERE repack_base_title(sr.title) = s.base_key AND sr.screenshots IS NOT NULL
       ORDER BY (sr.upload_date IS NULL), sr.upload_date DESC
       LIMIT 1) AS screenshots,
    (array_agg(steam_appid ORDER BY (steam_appid IS NULL), (upload_date IS NULL), s.upload_date DESC))[1] AS steam_appid
  FROM (
    SELECT source_repacks.id, source_repacks.title, source_repacks.source, source_repacks.file_size,
      source_repacks.upload_date, source_repacks.cover_url, source_repacks.banner_url, source_repacks.description,
      source_repacks.trailer_url, source_repacks.steam_appid,
      repack_base_title(source_repacks.title) AS base_key,
      unnest(source_repacks.uris) AS uri
    FROM source_repacks
  ) s
  WHERE base_key <> ''::text
  GROUP BY base_key
) m;

CREATE UNIQUE INDEX idx_merged_repacks_base_key ON public.merged_repacks USING btree (base_key);
CREATE INDEX idx_merged_repacks_id ON public.merged_repacks USING btree (id);
CREATE INDEX idx_merged_repacks_upload_date ON public.merged_repacks USING btree (upload_date DESC NULLS LAST);
CREATE INDEX idx_merged_repacks_size_gb ON public.merged_repacks USING btree (size_gb DESC NULLS LAST);
CREATE INDEX idx_merged_repacks_denuvo ON public.merged_repacks USING btree (upload_date DESC NULLS LAST) WHERE is_denuvo;
CREATE INDEX idx_merged_repacks_title_trgm ON public.merged_repacks USING gin (title extensions.gin_trgm_ops);

GRANT SELECT ON public.merged_repacks TO anon, authenticated;
GRANT ALL ON public.merged_repacks TO service_role;
