-- ═══════════════════════════════════════════
-- Seed Apartments
-- ═══════════════════════════════════════════

insert into public.apartments (slug, name, description, price_per_night, bedrooms, max_guests, min_nights, amenities, gradient) values
(
  'pearl-suite',
  'The Pearl Suite',
  'A spacious one-bedroom apartment with a modern kitchen, living area, and private balcony overlooking the neighborhood.',
  120, 1, 2, 2,
  array['Wi-Fi', 'Air Conditioning', 'Kitchen', 'Balcony', 'Smart TV', 'Washer'],
  'from-[#1a1a1a] to-[#2a2520]'
),
(
  'coral-residence',
  'The Coral Residence',
  'Our two-bedroom apartment perfect for families or groups, featuring a full kitchen, dining area, and cozy lounge.',
  180, 2, 4, 2,
  array['Wi-Fi', 'Air Conditioning', 'Full Kitchen', 'Dining Area', 'Smart TV', 'Washer', 'Workspace'],
  'from-[#2a2520] to-[#1a1a1a]'
),
(
  'gold-penthouse',
  'The Gold Penthouse',
  'The premium three-bedroom penthouse with panoramic views, luxury finishes, and a spacious open-plan living area.',
  280, 3, 6, 2,
  array['Wi-Fi', 'Air Conditioning', 'Gourmet Kitchen', 'Panoramic Views', 'Smart TV', 'Washer', 'Workspace', 'Premium Linens', 'Espresso Machine'],
  'from-[#1a1a1a] to-[#2a2018]'
);
