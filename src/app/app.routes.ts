import { Routes } from '@angular/router';
// IMPORTANTE: Aquí importamos los componentes para que Angular los encuentre
// Como tus logs dicen que el archivo se llama "tarea-list.ts", importamos desde ".../tarea-list"
import { TareaList } from './components/tarea-list/tarea-list';
import { TareaForm } from './components/tarea-form/tarea-form';

export const routes: Routes = [
    { path: '', redirectTo: 'tareas', pathMatch: 'full' },
    { path: 'tareas', component: TareaList },
    { path: 'tareas/nuevo', component: TareaForm },
    { path: 'tareas/editar/:id', component: TareaForm

     }
];
