import { z } from 'zod';

export const evaluationSchema = z.object({
  courseId: z.string().min(1, 'El ID del curso es requerido'),
  title: z.string().min(3, 'El título debe tener al menos 3 caracteres'),
  description: z.string().max(250, 'La descripción no puede superar los 250 caracteres').default(''),
  dueDate: z.string().refine((val) => !isNaN(Date.parse(val)), {
    message: 'Debe ingresar una fecha válida',
  }),
  status: z.enum(['active', 'completed', 'cancelled']),
});

export type EvaluationFormData = z.infer<typeof evaluationSchema>;

export interface Evaluation {
  evaluationId: string;
  courseId: string;
  title: string;
  description: string;
  dueDate: string;
  status: 'active' | 'completed' | 'cancelled';
  createdAt: string;
}
