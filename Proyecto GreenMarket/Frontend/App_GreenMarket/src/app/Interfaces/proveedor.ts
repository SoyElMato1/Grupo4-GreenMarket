export interface Proveedor {
  rut: string;
  dv: string;
  correo_electronico: string;
  contrasena: string;
  foto?: string;
  nombre: string;
  apellido: string;
  verificacion?: boolean;
  recompensa?: number;
}
