export interface Carta {
  /** ID del diseño, por ejemplo "CAR-013". */
  id: string;
  /** Código de cuatro dígitos que escribe el jugador, por ejemplo "0013". */
  codigoJuego?: string;
  nombre: string;
  /** Supervivencia, Batería, Linterna, Combate, Movimiento o Interacción. */
  categoria: string;
  /** Efecto de cada nivel; los niveles se acumulan. */
  efecto: string;
  disponibilidad?: string;
  nivelMaximo?: number;
}

export interface Personaje {
  id: string;
  nombre: string;
  alias?: string;
  rol: string;
  descripcion: string;
  habilidades?: string;
  debilidades: string[];
  historia: string;
  cartasRelacionadas: string[];
}

export interface Enemigo {
  id: string;
  nombre: string;
  tipo: string;
  dificultad?: 'baja' | 'media' | 'alta';
  descripcion: string;
  comportamiento?: string;
  debilidades: string[];
  historia: string;
  cartasRelacionadas: string[];
}

export interface Infraestructura {
  id: string;
  nombre: string;
  tipo: string;
  ubicacion?: string;
  descripcion: string;
  funcionJugable?: string;
  historia: string;
}
