import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'app-modal',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './modal.component.html',
  styleUrl: './modal.component.css'
})
export class ModalComponent {
 @Input() title: string = '';
  @Input() message: string = '';
  @Input() showModal: boolean = false;
  
  @Output() closeModal = new EventEmitter<void>();
  @Output() confirmSave = new EventEmitter<void>();

  close() {
    this.closeModal.emit();
  }

  confirm() {
    this.confirmSave.emit();
  }
  
}
