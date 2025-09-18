-- Add indexes for better performance
-- These indexes will be applied when running the database migration

-- User indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "users_email_idx" ON "users"("email");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "users_role_idx" ON "users"("role");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "users_created_at_idx" ON "users"("created_at");

-- Product indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_category_id_idx" ON "products"("category_id");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_in_stock_idx" ON "products"("in_stock");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_rating_idx" ON "products"("rating");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_price_idx" ON "products"("price");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_name_idx" ON "products"("name");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "products_created_at_idx" ON "products"("created_at");

-- Order indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "orders_user_id_idx" ON "orders"("user_id");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "orders_status_idx" ON "orders"("status");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "orders_created_at_idx" ON "orders"("created_at");

-- Cart item indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "cart_items_user_id_idx" ON "cart_items"("user_id");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "cart_items_product_id_idx" ON "cart_items"("product_id");

-- Testimonial indexes
CREATE INDEX CONCURRENTLY IF NOT EXISTS "testimonials_rating_idx" ON "testimonials"("rating");
CREATE INDEX CONCURRENTLY IF NOT EXISTS "testimonials_created_at_idx" ON "testimonials"("created_at");
