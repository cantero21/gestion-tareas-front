export interface Paso {
  id?: number;
  descripcion: string;
  completado: boolean;
}

export interface Tarea {
    id?: number;
    titulo: string;
    descripcion: string;
    completado: boolean;
    // Agregamos la lista de pasos (inicializada opcionalmente)
    pasos: Paso[];
}
