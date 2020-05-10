import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import {MatIconModule} from '@angular/material/icon';
import { ConfigurationService } from './_services/ConfigurationService';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'GenealogyFrontEnd';

  constructor() { 

    
  }
}
