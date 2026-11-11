import type { CapituloManual, Credito, RegistroNarrativo, VistaJuego } from '../types/manual';
import { cadenas, registro, texto } from './validacion';

export function mapearCapitulo(raw: unknown): CapituloManual {
  const r = registro(raw);
  return { id: texto(r.id), titulo: texto(r.titulo), categoria: texto(r.categoria), contenido: texto(r.contenido), fuente: texto(r.fuente), actualizadoEn: texto(r.actualizadoEn) };
}
export function mapearRegistro(raw: unknown): RegistroNarrativo {
  const r = registro(raw);
  if (!Number.isSafeInteger(r.numero) || (r.numero as number) < 1 || typeof r.relacionadoConIssac !== 'boolean') throw new Error('Registro narrativo inválido.');
  return { id: texto(r.id), numero: r.numero as number, nombre: texto(r.nombre), rol: texto(r.rol), resumen: texto(r.resumen),
    funcionNarrativa: texto(r.funcionNarrativa), ubicacion: texto(r.ubicacion), texto: texto(r.texto), relacionadoConIssac: r.relacionadoConIssac };
}
export function mapearVista(raw: unknown): VistaJuego {
  const r = registro(raw);
  const nodoFigma = texto(r.nodoFigma);
  if (!/^\d+:\d+$/.test(nodoFigma)) throw new Error('Referencia de vista inválida.');
  return { id: texto(r.id), titulo: texto(r.titulo), categoria: texto(r.categoria), descripcion: texto(r.descripcion), nodoFigma, capituloIds: cadenas(r.capituloIds) };
}
export function mapearCredito(raw: unknown): Credito {
  const r = registro(raw);
  return { id: texto(r.id), rol: texto(r.rol), nombre: texto(r.nombre) };
}
