import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-cerrar-sesion',
  standalone: true,
  imports: [],
  templateUrl: './cerrar-sesion.component.html',
  styleUrl: './cerrar-sesion.component.css'
})
export class CerrarSesionComponent {
  @Output() confirm = new EventEmitter<void>();
  @Output() cancelAction = new EventEmitter<void>();

  confirmLogout() {
    this.confirm.emit();
  }

  cancelar() {
    this.cancelAction.emit();
  }
}
