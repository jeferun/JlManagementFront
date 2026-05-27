'use client';

import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

const contributionSchema = z.object({
  amount: z.number({ error: 'Debe ser un número' }).positive('El monto debe ser mayor a cero'),
  contribution_date: z.string().min(1, 'La fecha es obligatoria'),
  payment_method: z.enum(['CASH', 'TRANSFER', 'CARD'], { error: 'Seleccione un método de pago' }),
});

type ContributionFormValues = z.infer<typeof contributionSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: ContributionFormValues) => Promise<boolean>;
  isLoading: boolean;
}

export const ContributionFormModal = ({ isOpen, onClose, onSubmit, isLoading }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<ContributionFormValues>({
    resolver: zodResolver(contributionSchema),
    defaultValues: {
      payment_method: 'CASH',
      contribution_date: new Date().toISOString().split('T')[0],
    },
  });

  const handleFormSubmit = async (data: ContributionFormValues) => {
    const success = await onSubmit(data);
    if (success) {
      reset();
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Registrar Aporte</DialogTitle>
          <DialogDescription>
            Ingresa los detalles del nuevo aporte.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="amount">Monto (COP)</Label>
            <Input id="amount" type="number" placeholder="Ej. 50000" {...register('amount', { valueAsNumber: true })} />
            {errors.amount && <p className="text-xs text-red-500">{errors.amount.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="payment_method">Método de Pago</Label>
            <select
              id="payment_method"
              className="flex h-10 w-full items-center justify-between rounded-lg border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 shadow-sm transition-all duration-200"
              {...register('payment_method')}
            >
              <option value="CASH">Efectivo</option>
              <option value="TRANSFER">Transferencia</option>
              <option value="CARD">Tarjeta</option>
            </select>
            {errors.payment_method && <p className="text-xs text-red-500">{errors.payment_method.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="contribution_date">Fecha</Label>
            <Input id="contribution_date" type="date" {...register('contribution_date')} />
            {errors.contribution_date && <p className="text-xs text-red-500">{errors.contribution_date.message}</p>}
          </div>

          <DialogFooter className="pt-4 gap-2 sm:gap-0">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading} className="w-full sm:w-auto">
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading} className="w-full sm:w-auto">
              {isLoading ? 'Registrando...' : 'Registrar Aporte'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};
