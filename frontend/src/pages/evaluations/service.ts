import { api } from '../../services/api';
import type { Evaluation, EvaluationFormData } from './types';

export const evaluationService = {
  getAll: (): Promise<Evaluation[]> => 
    api.get<Evaluation[]>('/evaluations').then(res => res.data),
    
  create: (data: Evaluation): Promise<Evaluation> => 
    api.post<Evaluation>('/evaluations', data).then(res => res.data),
    
  update: (id: string, data: Partial<EvaluationFormData>): Promise<Evaluation> => 
    api.put<Evaluation>(`/evaluations/${id}`, data).then(res => res.data),
    
  delete: (id: string): Promise<void> => 
    api.delete(`/evaluations/${id}`).then(res => res.data),
};
