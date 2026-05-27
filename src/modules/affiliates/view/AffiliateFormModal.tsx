'use client';

import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/shared/components/ui/dialog';
import { Button } from '@/shared/components/ui/button';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';

const affiliateSchema = z.object({
  full_name: z.string().min(3, 'El nombre debe tener al menos 3 caracteres'),
  document_type: z.enum(['CC', 'CE', 'NIT'], { error: 'Seleccione un tipo de documento' }),
  document_number: z.string().min(5, 'Número de documento inválido'),
  email: z.string().email('Correo electrónico inválido'),
});

type AffiliateFormValues = z.infer<typeof affiliateSchema>;

interface Props {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: AffiliateFormValues) => Promise<boolean>;
  isLoading: boolean;
  initialData?: AffiliateFormValues;
}

const defaultValues: AffiliateFormValues = {
  full_name: '',
  document_type: 'CC',
  document_number: '',
  email: '',
};

export const AffiliateFormModal = ({ isOpen, onClose, onSubmit, isLoading, initialData }: Props) => {
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<AffiliateFormValues>({
    resolver: zodResolver(affiliateSchema),
    defaultValues: initialData || defaultValues,
  });

  useEffect(() => {
    if (isOpen) {
      reset(initialData || defaultValues);
    }
  }, [isOpen, initialData, reset]);

  const handleFormSubmit = async (data: AffiliateFormValues) => {
    const success = await onSubmit(data);
    if (success) {
      reset(defaultValues);
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>{initialData ? 'Actualizar Afiliado' : 'Registrar Afiliado'}</DialogTitle>
          <DialogDescription>
            {initialData 
              ? 'Actualiza los datos del afiliado.' 
              : 'Ingresa los datos del nuevo afiliado para registrarlo en el sistema.'}
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleSubmit(handleFormSubmit)} className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="full_name">Nombre Completo</Label>
            <Input id="full_name" placeholder="Ej. Juan Pérez" {...register('full_name')} />
            {errors.full_name && <p className="text-xs text-red-500">{errors.full_name.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="document_type">Tipo de Documento</Label>
            <select
              id="document_type"
              className="flex h-10 w-full items-center justify-between rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
              {...register('document_type')}
            >
              <option value="CC">Cédula de Ciudadanía</option>
              <option value="CE">Cédula de Extranjería</option>
              <option value="NIT">NIT</option>
            </select>
            {errors.document_type && <p className="text-xs text-red-500">{errors.document_type.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="document_number">Número de Documento</Label>
            <Input id="document_number" placeholder="Ej. 123456789" {...register('document_number')} />
            {errors.document_number && <p className="text-xs text-red-500">{errors.document_number.message}</p>}
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Correo Electrónico</Label>
            <Input id="email" type="email" placeholder="ejemplo@correo.com" {...register('email')} />
            {errors.email && <p className="text-xs text-red-500">{errors.email.message}</p>}
          </div>

          <div className="pt-4 flex justify-end space-x-2">
            <Button type="button" variant="outline" onClick={onClose} disabled={isLoading}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Guardando...' : 'Guardar Afiliado'}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};
