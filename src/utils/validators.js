const { z } = require('zod');

const registerSchema = z.object({
  nome: z.string().min(3, 'Nome deve ter pelo menos 3 caracteres'),
  email: z.string().email('Email inválido'),
  cpf: z.string().regex(/^\d{11}$/, 'CPF deve ter 11 dígitos'),
  telefone: z.string().min(8, 'Telefone deve ter pelo menos 8 dígitos'),
  password: z.string().min(6, 'Senha deve ter pelo menos 6 caracteres'),
});

const loginSchema = z.object({
  cpf: z.string().optional(),
  email: z.string().email().optional(),
  password: z.string(),
}).refine((data) => data.cpf || data.email, {
  message: 'CPF ou email é obrigatório',
});

const updateUserSchema = z.object({
  nome: z.string().min(3).optional(),
  email: z.string().email().optional(),
  telefone: z.string().min(8).optional(),
  password: z.string().min(6).optional(),
});

const createPetSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  species: z.string().min(2, 'Espécie deve ter pelo menos 2 caracteres'),
  breed: z.string().optional(),
  gender: z.enum(['M', 'F']).optional(),
  age: z.number().optional(),
  description: z.string().optional(),
  status: z.enum(['available', 'lost', 'adopted']).default('available'),
  location: z.string().optional(),
  dateLost: z.string().optional(),
  reward: z.number().optional(),
});

module.exports = {
  registerSchema,
  loginSchema,
  updateUserSchema,
  createPetSchema,
};