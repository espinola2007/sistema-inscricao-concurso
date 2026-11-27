ALTER TABLE "usuarios" ADD COLUMN IF NOT EXISTS "is_admin" BOOLEAN NOT NULL DEFAULT false;
UPDATE "usuarios" SET "is_admin" = true WHERE "email" = 'admin@concursos.com';
