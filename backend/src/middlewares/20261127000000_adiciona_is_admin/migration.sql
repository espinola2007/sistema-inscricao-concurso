ALTER TABLE "usuarios" ADD COLUMN "is_admin" BOOLEAN NOT NULL DEFAULT false;

UPDATE "usuarios" SET "is_admin" = true WHERE "email" = 'admin@concursos.com';