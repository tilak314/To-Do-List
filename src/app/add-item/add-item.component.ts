import { Component, OnInit, OnChanges } from '@angular/core';
import { debounceTime, Subject } from 'rxjs';


@Component({
  selector: 'app-add-item',
  standalone: false,
  
  templateUrl: './add-item.component.html',
  styleUrl: './add-item.component.scss'
})
export class AddItemComponent implements OnInit, OnChanges  {

  items: { value: string, done: boolean }[] = []; // Add 'done' property
  private saveSubject: Subject<void> = new Subject<void>();


  ngOnInit() {
    console.log("ngOnInit called");
    this.loadItems();
    this.saveSubject.pipe(debounceTime(500)).subscribe(() => {
      this.saveItems();
    });
  }

  ngOnChanges(){
    console.log("onchanges called");
  }

  addItem(event: any) {
    this.items.push({ value: '', done: false });
    console.log("button clicked");
    console.log(event.type);
    this.saveItems();
  }

  deleteItem(index: number) {
    this.items.splice(index, 1); // Remove item at the given index
    this.saveItems();
  }

  toggleDone(index: number) {
    this.items[index].done = !this.items[index].done; // Toggle 'done' property
    this.sortItems();
    this.saveItems();
  }

  onInputChange() {
    this.saveSubject.next();
  }

  saveItems() {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('items', JSON.stringify(this.items));
    }
  }

  loadItems() {
    if (typeof localStorage !== 'undefined') {
      const savedItems = localStorage.getItem('items');
      if (savedItems) {
        this.items = JSON.parse(savedItems);
        this.sortItems();
      }
    }
  }

  sortItems() {
    this.items.sort((a, b) => Number(a.done) - Number(b.done));
  }
}
