import { Component, OnInit, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TareaService } from '../../services/tarea';
import { Tarea } from '../../models/tarea';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-tarea-list',
  standalone: true,
  imports: [RouterLink, CommonModule, FormsModule],
  templateUrl: './tarea-list.html',
  styleUrl: './tarea-list.css'
})
export class TareaList implements OnInit {

  private tareaService = inject(TareaService);
  tareas: Tarea[] = [];

  // 1. Creamos un "Set" para guardar los IDs de las tareas que tienen el acordeón abierto
  tareasAbiertas = new Set<number>();

  ngOnInit(): void {
    this.cargarTareas();
  }

  cargarTareas() {
    this.tareaService.getAll().subscribe({
      next: (datos) => this.tareas = datos,
      error: (error) => console.error(error)
    });
  }

  eliminarTarea(id: number) {
    if(confirm('¿Borrar tarea y todos sus pasos?')) {
      this.tareaService.delete(id).subscribe(() => this.cargarTareas());
    }
  }

  getProgreso(t: Tarea): number {
    if (!t.pasos || t.pasos.length === 0) return 0;
    const completados = t.pasos.filter(p => p.completado).length;
    return Math.round((completados / t.pasos.length) * 100);
  }

  actualizarEstado(tarea: Tarea) {
    const total = tarea.pasos?.length || 0;
    const completados = tarea.pasos?.filter(p => p.completado).length || 0;

    // Si quieres que se marque como completada automáticamente al terminar los pasos:
    if (total > 0 && total === completados) {
      tarea.completado = true;
    } else {
      // Opcional: si desmarca un paso, la tarea vuelve a estar pendiente
      // tarea.completado = false;
    }

    this.tareaService.update(tarea.id!, tarea).subscribe({
      next: () => console.log('Sincronizado'),
      error: (e) => console.error(e)
    });
  }

  // --- 2. NUEVA LÓGICA DE APERTURA ---

  // Función que llama el botón para abrir/cerrar
  toggleAcordeon(id: number) {
    if (this.tareasAbiertas.has(id)) {
      this.tareasAbiertas.delete(id); // Si está abierto, lo borramos (cierra)
    } else {
      this.tareasAbiertas.add(id);    // Si está cerrado, lo agregamos (abre)
    }
  }

  // Función para que el HTML sepa si debe mostrar la lista
  estaAbierto(id: number): boolean {
    return this.tareasAbiertas.has(id);
  }
}
