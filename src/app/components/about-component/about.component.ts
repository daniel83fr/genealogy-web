import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})


export class AboutComponent {
  
  @Output() onSetTitle = new EventEmitter<string>();
  setTitle(){
     this.onSetTitle.emit('About');
    
  }

  constructor() {

  }
}
