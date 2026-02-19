-- ============================================
-- Migration 005: Update prices to TZS
-- ============================================
-- Converting from USD to TZS (~2,500 rate)
-- Pearl Suite: $120 → TZS 300,000
-- Coral Residence: $180 → TZS 450,000
-- Gold Penthouse: $280 → TZS 700,000

UPDATE apartments SET price_per_night = 300000 WHERE slug = 'pearl-suite';
UPDATE apartments SET price_per_night = 450000 WHERE slug = 'coral-residence';
UPDATE apartments SET price_per_night = 700000 WHERE slug = 'gold-penthouse';
