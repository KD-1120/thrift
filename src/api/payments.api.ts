import { api } from './base';

export const initializePayment = async (orderId: string) => {
  const response = await api.post('/payments/initialize', { orderId });
  return response.data;
};
