
CREATE OR REPLACE FUNCTION public.repack_base_title(t text)
 RETURNS text
 LANGUAGE sql
 IMMUTABLE
 SET search_path TO 'public'
AS $function$
  SELECT regexp_replace(
    regexp_replace(
      lower(t),
      '(?i)\s*(–|\(|\[|,|\+|free download|digital deluxe edition|deluxe edition|ultimate edition|gold edition|complete edition|goty edition|game of the year edition|definitive edition|premium edition|standard edition|digital edition|enhanced edition|anniversary edition|collector''?s edition|special edition|edition|crack only|denuvowo|bonus content|all dlcs|dlcs|dlc|\mbuild\s|\mv\d).*$',
      ''
    ),
    '[^a-z0-9]+', '', 'g'
  );
$function$;
