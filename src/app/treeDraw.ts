import { TreeItem } from './treeItem';
import { TreeData } from './treeData';

export class TreeDraw {

  children: any[];
  siblingsAndSpouses: any[];
  treeData: TreeData;
  settings: { horizontalOffset: number; verticalOffset: number; rectangleWidth: number; rectangleHeight: number; };

  drawBorder(svg: any, height: any, width: any) {
    const g = svg.append('g');
    g.append('g')
      .append('rect')
      .attr('x', 0)
      .attr('y', 0)
      .attr('height', height)
      .attr('width', width)
      .attr('stroke-width', 1)
      .attr('fill', '#FFFFFF')
      .attr('stroke', '#000000');
  }

  draw(svg: any, data: any) {
    if (data.currentPerson == null) {
      return;
    }


    this.settings = {
      horizontalOffset: 30,
      verticalOffset: 30,
      rectangleWidth: 140,
      rectangleHeight: 60
    };
    const treeData = new TreeData(data, this.settings);

    const height = treeData.getHeight();
    const width = treeData.getWidth();

    this.drawBorder(svg, height, width);

    svg
      .style('width', width  + 'px')
      .style('height', height + 'px');

    const id = data.currentPerson?.profileId;

    treeData.row1.forEach(element => {
      this.drawPerson2(svg, element, id);
    });

    treeData.row2.forEach(element => {
      this.drawPerson2(svg, element, id);
    });

    treeData.row3.forEach(element => {
      this.drawPerson2(svg, element, id);
    });

    this.drawSpouse(svg, treeData.father, treeData.mother);
    this.drawChild(svg, treeData.father, treeData.mother);

    if (treeData.spouses.length > 0) {
      this.drawSpouse(svg, treeData.spouses[0], treeData.currentPerson);
    }

    if (data.children.length > 0) {
      this.drawChild(svg, treeData.spouses[0], treeData.currentPerson);
      treeData.children.forEach(x => {
        this.drawParent(svg, x);
      });

      this.drawSibling(svg, treeData.children[0], treeData.children[treeData.children.length - 1]);
    }

    if (treeData.currentPersonWithSiblings.length > 0) {
      treeData.currentPersonWithSiblings.forEach(x => {
        this.drawParent(svg, x);
      });

      this.drawSibling(svg, treeData.currentPersonWithSiblings[0], treeData.currentPersonWithSiblings[treeData.currentPersonWithSiblings.length - 1]);
    }
  }

  drawSpouse(svg: any, i1: TreeItem, i2: TreeItem) {
    const g = svg.append('g');
    g.append('line')
      .attr('x1', (i1.x > i2.x ? i2.x : i1.x) + this.settings.rectangleWidth)
      .attr('y1', i1.y + this.settings.rectangleHeight / 2)
      .attr('x2', (i1.x > i2.x ? i1.x : i2.x) )
      .attr('y2', i2.y + this.settings.rectangleHeight / 2)
      .attr('stroke-width', 1.5)
      .attr('stroke', '#000000');
  }

  drawChild(svg: any, i1: TreeItem, i2: TreeItem) {
    const g = svg.append('g');
    g.append('line')
      .attr('x1', (i1.x > i2.x ? i2.x : i1.x) + this.settings.rectangleWidth + this.settings.horizontalOffset / 2)
      .attr('y1', i1.y + this.settings.rectangleHeight / 2)
      .attr('x2', (i1.x > i2.x ? i2.x : i1.x) + this.settings.rectangleWidth + this.settings.horizontalOffset / 2)
      .attr('y2', i1.y + this.settings.rectangleHeight + this.settings.verticalOffset / 2)
      .attr('stroke-width', 1.5)
      .attr('stroke', '#000000');
  }

  drawParent(svg: any, i: TreeItem) {
    const g = svg.append('g');



    g.append('line')
      .attr('x1', i.x + this.settings.rectangleWidth / 2)
      .attr('y1', i.y)
      .attr('x2', i.x + this.settings.rectangleWidth / 2)
      .attr('y2', i.y - this.settings.verticalOffset / 2)
      .attr('stroke-width', 1.5)
      .attr('stroke', '#000000');
  }

  drawSibling(svg: any, i1: TreeItem, i2: TreeItem) {
    const g = svg.append('g');
    g.append('line')
      .attr('x1', i1.x + this.settings.rectangleWidth / 2)
      .attr('y1', i1.y - this.settings.verticalOffset / 2)
      .attr('x2', i2.x + this.settings.rectangleWidth / 2)
      .attr('y2', i1.y - this.settings.verticalOffset / 2)
      .attr('stroke-width', 1.5)
      .attr('stroke', '#000000');
  }

  drawPerson2(svg: any, treeItem: TreeItem, currentPersonId: string) {
    this.drawPerson(svg, treeItem.x, treeItem.y, treeItem.data, currentPersonId);
  }

  drawPerson(svg: any, x: number, y: number, person: any, currentPersonId: string) {

    if (!person) {
      const unknown = { fill: '#A5A6A6', foreground: '#FFFFFF', stroke: '#000000' };
      const g1 = svg.append('g');
      g1.append('rect')
        .attr('x', x)
        .attr('y', y)
        .attr('height', this.settings.rectangleHeight)
        .attr('width', this.settings.rectangleWidth)
        .attr('stroke-width', 1)
        .attr('fill', unknown.fill)
        .attr('stroke', unknown.stroke);

      return;
    }

    const currentUserMan = { fill: '#0657f8', foreground: '#FFFFFF', stroke: '#f20408' };
    const currentUserWoman = { fill: '#ff036c', foreground: '#FFFFFF', stroke: '#f20408' };
    const manStyle = { fill: '#53a7fc', foreground: '#000000', stroke: '#000000' };
    const womanStyle = { fill: '#ffaaff', foreground: '#000000', stroke: '#000000' };

    let style = {};
    if (person.gender === 'Male') {
      style = manStyle;
    } else {
      style = womanStyle;
    }

    if (person.profileId === currentPersonId) {
      if (person.gender === 'Male') {
        style = currentUserMan;
      } else {
        style = currentUserWoman;
      }

    }
    const style1 = Object.assign(style);

    const year = person.yearOfBirth ?? '';
    const year2 = person.yearOfDeath ?? '';
    let yearText = `${year}-${year2}`;
    if (yearText === '-') {
      yearText = '';
    }

    let g = svg.append('g');

    g.append('title')
      .text(person.firstName);
    const baseUrl = 'person/';

    if (person.profileId !== currentPersonId) {
      g = g.append('a')
        .attr('href', baseUrl + person.profileId);
    }

    g.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('height', this.settings.rectangleHeight)
      .attr('width', this.settings.rectangleWidth)
      .attr('stroke-width', 1)
      .attr('fill', style1.fill)
      .attr('stroke', style1.stroke);

    g.append('text')
      .attr('font-size', '12')
      .attr('font-weight', 'bold')
      .attr('y', y + 20)
      .attr('x', x + 10)
      .attr('fill', style1.foreground)
      .text(person.lastName);

    g.append('text')
      .attr('font-size', '12')
      .attr('font-weight', 'bold')
      .attr('y', y + 40)
      .attr('x', x + 10)
      .attr('fill', style1.foreground)
      .text(person.firstName);

    g.append('text')
      .attr('font-size', '12')
      .attr('y', y + 55)
      .attr('x', x + 55)
      .attr('fill', style1.foreground)
      .text(yearText);
  }
}
