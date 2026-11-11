export interface CapituloManual {
  id: string; titulo: string; categoria: string; contenido: string; fuente: string; actualizadoEn: string;
}
export interface RegistroNarrativo {
  id: string; numero: number; nombre: string; rol: string; resumen: string; funcionNarrativa: string;
  ubicacion: string; texto: string; relacionadoConIssac: boolean;
}
export interface VistaJuego {
  id: string; titulo: string; categoria: string; descripcion: string; nodoFigma: string; capituloIds: string[];
}
export interface Credito { id: string; rol: string; nombre: string }
