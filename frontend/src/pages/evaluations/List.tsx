import React from 'react';
import { evaluationSchema } from './types';
import type { EvaluationStatus, Evaluation } from './types';
import { formatDate } from '../../utils/formatDate';

interface ListProps {
  evaluations: Evaluation[];
  onEdit: (item: Evaluation) => void;
  onDeleteTrigger: (id: string) => void;
}

export default function List({ evaluations, onEdit, onDeleteTrigger }: ListProps) {
  const statusBadges: Record<EvaluationStatus, string> = {
    active: 'bg-emerald-50 text-emerald-700 border-emerald-200',
    completed: 'bg-blue-50 text-blue-700 border-blue-200',
    cancelled: 'bg-rose-50 text-rose-700 border-rose-200',
  };

  if (evaluations.length === 0) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl p-12 text-center text-slate-400 text-sm">
        No existen evaluaciones registradas en la tabla de DynamoDB.
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-xs border border-slate-200 overflow-hidden">
      <table className="min-w-full divide-y divide-slate-200 text-left text-sm">
        <thead className="bg-slate-50 text-slate-700 uppercase text-xs font-semibold">
          <tr>
            <th className="px-6 py-4">Evaluación</th>
            <th className="px-6 py-4">Vencimiento</th>
            <th className="px-6 py-4">Estado</th>
            <th className="px-6 py-4 text-right">Acciones</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-200 bg-white">
          {evaluations.map((item) => (
            <tr key={item.evaluationId} className="hover:bg-slate-50/50 transition">
              <td className="px-6 py-4">
                <span className="font-bold text-slate-900 block">{item.title}</span>
                <span className="text-slate-500 text-xs block truncate max-w-xs">{item.description || 'Sin descripción'}</span>
                <span className="inline-block bg-slate-100 text-slate-600 font-mono text-[10px] px-2 py-0.5 rounded mt-1">
                  Curso: {item.courseId}
                </span>
              </td>
              <td className="px-6 py-4 text-slate-600 whitespace-nowrap">
                {formatDate(item.dueDate)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${statusBadges[item.status]}`}>
                  {item.status}
                </span>
              </td>
              <td className="px-6 py-4 text-right whitespace-nowrap space-x-1">
                <button onClick={() => onEdit(item)} className="text-indigo-600 hover:text-indigo-900 font-medium px-2 py-1 rounded-md hover:bg-indigo-50 transition">
                  Editar
                </button>
                <button onClick={() => onDeleteTrigger(item.evaluationId)} className="text-rose-600 hover:text-rose-900 font-medium px-2 py-1 rounded-md hover:bg-rose-50 transition">
                  Eliminar
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
