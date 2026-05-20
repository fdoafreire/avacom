import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { evaluationSchema } from './types';
import type { EvaluationFormData, Evaluation } from './types';

import { toInputDateFormat } from '../../utils/formatDate';

interface FormProps {
  onSubmit: (data: EvaluationFormData) => Promise<void>;
  initialData: Evaluation | null;
  onCancel: () => void;
}

export default function Form({ onSubmit, initialData, onCancel }: FormProps) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm<EvaluationFormData>({
    resolver: zodResolver(evaluationSchema),
    defaultValues: { status: 'active', description: '' },
  });

  useEffect(() => {
    if (initialData) {
      reset({
        courseId: initialData.courseId,
        title: initialData.title,
        description: initialData.description,
        dueDate: toInputDateFormat(initialData.dueDate),
        status: initialData.status,
      });
    } else {
      reset({ courseId: '', title: '', description: '', dueDate: '', status: 'active' });
    }
  }, [initialData, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="p-6 space-y-4">
      <h2 className="text-lg font-bold text-slate-800 border-b pb-3">
        {initialData ? 'Modificar Evaluación' : 'Registrar Evaluación'}
      </h2>
      
      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase">ID Curso</label>
        <input 
          type="text" 
          {...register('courseId')}
          className="mt-1 block w-full rounded-lg border-slate-300 text-sm p-2.5 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
        />
        {errors.courseId && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.courseId.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase">Título</label>
        <input 
          type="text" 
          {...register('title')}
          className="mt-1 block w-full rounded-lg border-slate-300 text-sm p-2.5 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
        />
        {errors.title && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.title.message}</p>}
      </div>

      <div>
        <label className="block text-xs font-bold text-slate-600 uppercase">Descripción</label>
        <textarea 
          rows={2} 
          {...register('description')}
          className="mt-1 block w-full rounded-lg border-slate-300 text-sm p-2.5 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
        />
        {errors.description && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.description.message}</p>}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase">Vencimiento</label>
          <input 
            type="date" 
            {...register('dueDate')}
            className="mt-1 block w-full rounded-lg border-slate-300 text-sm p-2.5 border focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none" 
          />
          {errors.dueDate && <p className="text-rose-500 text-xs mt-1 font-medium">{errors.dueDate.message}</p>}
        </div>

        <div>
          <label className="block text-xs font-bold text-slate-600 uppercase">Estado</label>
          <select 
            {...register('status')}
            className="mt-1 block w-full rounded-lg border-slate-300 text-sm p-2.5 border bg-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none"
          >
            <option value="active">active</option>
            <option value="completed">completed</option>
            <option value="cancelled">cancelled</option>
          </select>
        </div>
      </div>

      <div className="flex justify-end space-x-2 pt-4 border-t border-slate-100">
        <button 
          type="button" 
          onClick={onCancel} 
          className="px-4 py-2 border border-slate-300 text-sm font-medium rounded-lg text-slate-700 bg-white hover:bg-slate-50 transition"
        >
          Cancelar
        </button>
        <button 
          type="submit" 
          disabled={isSubmitting}
          className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition disabled:opacity-50"
        >
          {initialData ? 'Guardar Cambios' : 'Crear'}
        </button>
      </div>
    </form>
  );
}
