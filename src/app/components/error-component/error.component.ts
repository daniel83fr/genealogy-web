import { Component, Inject, Optional, APP_ID, PLATFORM_ID, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { isPlatformBrowser } from '@angular/common';
import {  RESPONSE } from '@nguniversal/express-engine/tokens';
import {  Response } from 'express';
@Component({
  selector: 'app-error',
  templateUrl: './error.component.html',
  styleUrls: ['./error.component.css']
})

export class ErrorComponent implements OnInit {

  constructor(
    @Inject(PLATFORM_ID) private platformId: Object,
    @Inject(APP_ID) private appId: string,
    @Optional() @Inject(RESPONSE) private response: Response,
    private titleService: Title
  ) {
    this.titleService.setTitle('Res01 - Page Not Found');
  }

  ngOnInit() {
    if (!isPlatformBrowser(this.platformId)) {
      this.response.status(404);
    }
  }
}
