import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/operators';
import { MatIconModule } from '@angular/material/icon';
import { ConfigurationService } from './_services/ConfigurationService';
import { Title, Meta } from '@angular/platform-browser';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'Res01 - Family Tree';

  constructor(private titleService: Title, private metaService: Meta) {
  }

  ngOnInit() {
    this.titleService.setTitle(this.title);
    this.metaService.addTags([
      { name: 'keywords', content: 'Angular, Universal, Example' },
      { name: 'description', content: 'Angular Universal Example' },
      { name: 'robots', content: 'index, follow' }
    ]);
  }
}
