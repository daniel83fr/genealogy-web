import { Component, OnInit, Input } from '@angular/core';
import * as d3 from 'd3';
import { TreeDraw } from '../../treeDraw';


@Component({
  selector: 'app-tree',
  templateUrl: './tree.component.html',
  styleUrls: ['./tree.component.css']
})

export class TreeComponent implements OnInit {


@Input('data')
data: any = {};

  constructor() {

  }

  ngOnInit(): void {


  }

  ngAfterContentInit() {
    let svg = d3.select('.familyTree');
    new TreeDraw().draw(svg, this.data);
  }

  openShareSheet() {


  }
}

