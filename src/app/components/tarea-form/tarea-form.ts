import { Component, OnInit, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import { TareaService } from '../../services/tarea';
import { Tarea, Paso } from '../../models/tarea'; // Importamos también Paso

@Component({
  selector: 'app-tarea-form',
  standalone: true,
  imports: [FormsModule, RouterLink],
  templateUrl: './tarea-form.html',
  styleUrl: './tarea-form.css'
})
export class TareaForm implements OnInit {

  private tareaService = inject(TareaService);
  private router = inject(Router);
  private route = inject(ActivatedRoute);

  tarea: Tarea = {
    titulo: '',
    descripcion: '',
    completado: false,
    pasos: [] // Inicializamos la lista vacía
  };

  esEdicion: boolean = false;

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    if (id) {
      this.esEdicion = true;
      this.tareaService.getById(id).subscribe(data => {
        this.tarea = data;
        // Si viene null la lista de pasos, la ponemos vacía para evitar errores
        if (!this.tarea.pasos) {
          this.tarea.pasos = [];
        }
      });
    }
  }

  // --- NUEVAS FUNCIONES PARA EL CHECKLIST ---

  agregarPaso() {
    // Empujamos un nuevo paso vacío al array
    this.tarea.pasos.push({
      descripcion: '',
      completado: false
    });
  }

  eliminarPaso(index: number) {
    // Quitamos el paso de la lista según su posición (index)
    this.tarea.pasos.splice(index, 1);
  }

  // ------------------------------------------

guardar() {
    // 1. VALIDACIÓN BÁSICA: ¿Tiene título?
    if (!this.tarea.titulo || this.tarea.titulo.trim() === '') {
      alert('La tarea necesita un título obligatoriamente.');
      return; // Detenemos la función aquí. No se envía nada.
    }

    // 2. SANITIZACIÓN: Limpiar pasos vacíos
    // El método .filter() crea una nueva lista solo con los pasos que tengan texto
    this.tarea.pasos = this.tarea.pasos.filter(paso => paso.descripcion.trim() !== '');

    // 3. ENVÍO AL BACKEND (Esto sigue igual)
    if (this.esEdicion) {
      this.tareaService.update(this.tarea.id!, this.tarea).subscribe(() => {
        this.router.navigate(['/tareas']);
      });
    } else {
      this.tareaService.create(this.tarea).subscribe(() => {
        this.router.navigate(['/tareas']);
      });
    }
  }
}
