-- Plain-English category names.
--
-- `products.categories` is a text[] of the exact strings in
-- PRODUCT_CATEGORIES, and the shop only renders a filter pill for a
-- category that some product actually carries — so renaming the constants
-- without rewriting the stored rows would make the renamed pills vanish
-- and their products unfilterable. Both halves have to land together.
--
-- Renames are readability only. Each new name is still a body system or
-- molecular class, never an outcome for the reader: a research chemical
-- becomes an unlicensed medicine by presentation the moment a category
-- tells a visitor what the compound will do to them.
update products
set categories = (
  select array_agg(
    case element
      when 'Endocrine Research' then 'Hormone Research'
      when 'Gastrointestinal Research' then 'Digestive Research'
      when 'Dermatological Research' then 'Skin Research'
      when 'Neurological Research' then 'Brain & Nervous System Research'
      when 'Musculoskeletal Research' then 'Muscle & Bone Research'
      else element
    end
    order by ordinality
  )
  from unnest(categories) with ordinality as t(element, ordinality)
)
where categories && array[
  'Endocrine Research',
  'Gastrointestinal Research',
  'Dermatological Research',
  'Neurological Research',
  'Musculoskeletal Research'
];
