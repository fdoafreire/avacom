import React, { useState, useEffect, useTransition } from 'react';
import { evaluationService } from './service';
import { evaluationSchema } from './types';
import type { Evaluation, EvaluationFormData } from './types';

import Form from './Form';
import List from './List';
import Loading from '../../components/ui/Loading';
import Toaster from '../../components/ui/Toaster';
import ConfirmDialog from '../../components/ui/ConfirmDialog';

export default function EvaluationsPage() {
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedEvaluation, setSelectedEvaluation] = useState<Evaluation | null | undefined>(undefined);
  const [deleteTarget, setDeleteTarget] = useState<string | null>(null);
  const [isPending, startTransition] = useTransition();
  const [toast, setToast] = useState<{ message: string; type: 'success' | 'error' }>({ message: '', type: 'success' });

  const showToast = (message: string, type: 'success' | 'error' = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast({ message: '', type: 'success' }), 4000);
  };

  const fetchEvaluations = async () => {
    try {
      const data = await evaluationService.getAll();
      setEvaluations(Array.isArray(data) ? data : []);
    } catch {
      showToast('Error de comunicación con AWS API Gateway', 'error');
    }
  };

  useEffect(() => {
    startTransition(async () => {
      await fetchEvaluations();
    });
  }, []);

  const handleFormSubmit = async (data: EvaluationFormData): Promise<void> => {
    return new Promise((resolve) => {
      startTransition(async () => {
        try {
          if (selectedEvaluation) {
            await evaluationService.update(selectedEvaluation.evaluationId, data);
            showToast('Evaluación actualizada correctamente');
          } else {
            const payload: Evaluation = {
              evaluationId: crypto.randomUUID(),
              createdAt: new Date().toISOString(),
              ...data,
              dueDate: new Date(data.dueDate).toISOString()
            };
            await evaluationService.create(payload);
            showToast('Registro guardado con éxito');
          }
          setSelectedEvaluation(undefined);
          await fetchEvaluations();
        } catch {
          showToast('Error al persistir el registro en AWS Lambda', 'error');
        } finally {
          resolve();
        }
      });
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteTarget) return;
    startTransition(async () => {
      try {
        await evaluationService.delete(deleteTarget);
        showToast('Registro eliminado definitivamente');
        setDeleteTarget(null);
        await fetchEvaluations();
      } catch {
        showToast('Error al intentar remover el recurso', 'error');
      }
    });
  };

  const closeModal = () => setSelectedEvaluation(undefined);
  const isModalOpen = selectedEvaluation !== undefined;

  return (
    <div className="space-y-8 relative">
      {isPending && <Loading />}

      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 tracking-tight">Gestión de Evaluaciones</h1>
          <p className="text-sm text-slate-500 mt-1">Consola conectada a infraestructura Serverless (DynamoDB).</p>
        </div>
        <button
          onClick={() => setSelectedEvaluation(null)}
          className="px-4 py-2 text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 transition"
        >
          Nueva Evaluación
        </button>
      </div>

      <div className="w-full">
        <List evaluations={evaluations} onEdit={setSelectedEvaluation} onDeleteTrigger={setDeleteTarget} />
      </div>

      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40" onClick={closeModal}>
          <div className="bg-white rounded-xl shadow-xl w-full max-w-lg mx-4 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
            <Form onSubmit={handleFormSubmit} initialData={selectedEvaluation} onCancel={closeModal} />
          </div>
        </div>
      )}

      <ConfirmDialog
        isOpen={deleteTarget !== null}
        title="Eliminar Evaluación"
        message="¿Está seguro de eliminar esta evaluación de forma permanente?"
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeleteTarget(null)}
        isLoading={isPending}
      />

      <Toaster message={toast.message} type={toast.type} />
    </div>
  );
}
