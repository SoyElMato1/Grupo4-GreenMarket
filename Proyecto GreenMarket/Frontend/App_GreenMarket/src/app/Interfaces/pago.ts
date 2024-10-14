export interface Pago {
  success: boolean;
  token: string;
  transaction_url: string;
  message?: string; // Opcional, en caso de que haya un mensaje de error
  monto?: number; // Opcional, si deseas incluir el monto también
}
