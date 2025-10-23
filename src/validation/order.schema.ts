import { z } from 'zod';

import { z } from 'zod';

export const createOrderFormSchema = z.object({
  tailorId: z.string(),
  garmentType: z.string().min(1, { message: 'Garment type is required' }),
  fabricType: z.string().optional(),
  estimatedCost: z.number().positive(),
  description: z.string().optional(),
  useSavedMeasurements: z.boolean(),
  selectedMeasurement: z.object({ id: z.string() }).nullable(),
  customMeasurements: z.object({
    chest: z.string(),
    waist: z.string(),
    hips: z.string(),
    shoulder: z.string(),
    sleeveLength: z.string(),
    shirtLength: z.string(),
  }),
  referenceImages: z.array(z.string()).optional(),
  specialInstructions: z.string().optional(),
}).superRefine((data, ctx) => {
  if (data.useSavedMeasurements) {
    if (!data.selectedMeasurement) {
      ctx.addIssue({
        code: 'custom',
        path: ['selectedMeasurement'],
        message: 'Please select a saved measurement profile.',
      });
    }
  } else {
    if (data.customMeasurements.chest.trim() === '') {
       ctx.addIssue({
        code: 'custom',
        path: ['customMeasurements.chest'],
        message: 'Chest measurement is required.',
      });
    }
    if (data.customMeasurements.waist.trim() === '') {
       ctx.addIssue({
        code: 'custom',
        path: ['customMeasurements.waist'],
        message: 'Waist measurement is required.',
      });
    }
    if (data.customMeasurements.chest && isNaN(parseFloat(data.customMeasurements.chest))) {
         ctx.addIssue({
        code: 'custom',
        path: ['customMeasurements.chest'],
        message: 'Must be a valid number.',
      });
    }
     if (data.customMeasurements.waist && isNaN(parseFloat(data.customMeasurements.waist))) {
         ctx.addIssue({
        code: 'custom',
        path: ['customMeasurements.waist'],
        message: 'Must be a valid number.',
      });
    }
  }
});

export type CreateOrderFormData = z.infer<typeof createOrderFormSchema>;
