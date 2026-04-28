-- CreateSchema
CREATE SCHEMA IF NOT EXISTS "public";

-- CreateEnum
CREATE TYPE "PetSpecies" AS ENUM ('dog', 'cat', 'other');

-- CreateEnum
CREATE TYPE "PetStatus" AS ENUM ('available', 'adopted', 'lost', 'found');

-- CreateTable
CREATE TABLE "usuarios" (
    "id" SERIAL NOT NULL,
    "nome" TEXT NOT NULL,
    "email" TEXT NOT NULL,
    "cpf" TEXT NOT NULL,
    "telefone" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "imagem" BYTEA,
    "imagemMimeType" TEXT,
    "tipo" TEXT NOT NULL DEFAULT 'usuario',
    "status" TEXT DEFAULT 'ativo',
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pets" (
    "id" SERIAL NOT NULL,
    "name" TEXT NOT NULL,
    "species" "PetSpecies",
    "breed" TEXT,
    "age" INTEGER,
    "description" TEXT,
    "status" "PetStatus" NOT NULL DEFAULT 'available',
    "gender" TEXT,
    "image" BYTEA,
    "imagemMimeType" TEXT,
    "location" TEXT,
    "dateLost" TIMESTAMP(3),
    "reward" DECIMAL(10,2),
    "userName" TEXT,
    "userType" TEXT,
    "userId" INTEGER,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pets_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_cpf_key" ON "usuarios"("cpf");

-- CreateIndex
CREATE INDEX "pets_status_idx" ON "pets"("status");

-- CreateIndex
CREATE INDEX "pets_userId_idx" ON "pets"("userId");

-- AddForeignKey
ALTER TABLE "pets" ADD CONSTRAINT "pets_userId_fkey" FOREIGN KEY ("userId") REFERENCES "usuarios"("id") ON DELETE SET NULL ON UPDATE CASCADE;
