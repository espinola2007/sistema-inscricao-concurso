-- CreateTable
CREATE TABLE "cargos" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "concurso_id" INTEGER NOT NULL,

    CONSTRAINT "cargos_pkey" PRIMARY KEY ("id")
);

-- AddForeignKey
ALTER TABLE "cargos" ADD CONSTRAINT "cargos_concurso_id_fkey" FOREIGN KEY ("concurso_id") REFERENCES "concursos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;
