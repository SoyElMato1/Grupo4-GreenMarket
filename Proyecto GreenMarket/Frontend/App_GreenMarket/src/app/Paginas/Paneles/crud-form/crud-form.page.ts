import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-crud-form',
  templateUrl: './crud-form.page.html',
  styleUrls: ['./crud-form.page.scss'],
})
export class CrudFormPage implements OnInit {

  items: any[] = []; // Almacena los elementos del CRUD
  item = { name: '', description: '' }; // Modelo para el formulario

  constructor(private router: Router) {}

  onSubmit() {
    if (this.item.name && this.item.description) {
      this.items.push({ ...this.item }); // Agregar el nuevo elemento a la lista
      this.item = { name: '', description: '' }; // Reiniciar el formulario
    }
  }

  onEdit(selectedItem: any) {
    this.item = { ...selectedItem }; // Cargar el elemento seleccionado en el formulario
  }

  onDelete(selectedItem: any) {
    this.items = this.items.filter(item => item !== selectedItem); // Eliminar el elemento
  }

  ngOnInit() {
  }

}
