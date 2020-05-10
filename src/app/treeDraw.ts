class TreeItem{
  x: any;
  y: any;
  data: any;
  type: any;
  constructor(x: any, y: any, data: any, type: string) {
    this.x = x;
    this.y = y;
    this.data = data;
    this.type = type;
  }
}
export class TreeDraw {

  horizontalOffset = 30;
  verticalOffset = 30;
  rectangleWidth = 140;
  rectangleHeight = 60;
  father: TreeItem;
  mother: TreeItem;
  children: any[];
  siblingsAndSpouses: any[];


  getWidth(data: any) {
    const row1Size = 2;
    const row2Size = (data.spouses?.length ?? 0) + (data.siblings?.length ?? 0) + 1;
    const row3Size = data.children?.length ?? 0;
    const maxRowSize = Math.max(row1Size, row2Size, row3Size);
    return maxRowSize * (this.rectangleWidth + 2 * this.horizontalOffset);
  }

  getHeight(data: any) {
    const rowCount = (data.children?.length ?? 0)  > 0 ? 3 : 2;
    return rowCount * (this.rectangleHeight + 2 * this.verticalOffset);
  }

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

    const height = this.getHeight(data);
    const width = this.getWidth(data);

    this.drawBorder(svg, height, width);

    svg
      .style('width', width + 'px')
      .style('height', height + 'px');

    const id = data.currentPerson?._id;

    const horizontalShift = this.rectangleWidth + this.horizontalOffset;
    const verticalShift = this.rectangleHeight + this.verticalOffset;

    this.father = new TreeItem(this.horizontalOffset, this.verticalOffset, data.father, 'father');
    this.mother = new TreeItem(this.father.x + horizontalShift, this.father.y, data.mother, 'mother');

    this.drawPerson2(svg, this.father, id);
    this.drawPerson2(svg, this.mother, id);

    const row1 = data.spouses?.length + data.siblings?.length + 1;
    let row2 = row1;
    if (data.children?.length > row2) {
      row2 = data.children.length;
    }




    let posx_gen1 = this.horizontalOffset + (row1 * this.rectangleWidth + (row1 - 1) * this.horizontalOffset) / 2 - this.horizontalOffset / 2 - this.rectangleWidth;

    
    //this.drawPerson(svg, posx_gen1, this.verticalOffset, data.father, id);
    //this.drawPerson(svg, posx_gen1 + horizontalShift, this.verticalOffset, data.mother, id);
    this.drawSpouse(svg, posx_gen1, this.verticalOffset, posx_gen1 + horizontalShift, this.verticalOffset);
    this.drawChild(svg, posx_gen1, this.verticalOffset, posx_gen1 + horizontalShift, this.verticalOffset);


    this.siblingsAndSpouses = []
    let idx = 0;
    const siblingsBefore = data.siblings.filter(x => x.yearOfBirth < data.currentPerson.yearOfBirth);

    for (let index = 0; index < siblingsBefore.length; index++) {
      let person = new TreeItem(this.father.x + idx * horizontalShift, this.father.y + verticalShift, siblingsBefore[index], 'sibling')
      this.siblingsAndSpouses.push(person);
      // this.drawPerson(svg, this.horizontalOffset + idx * horizontalShift, this.verticalOffset + verticalShift, siblingsBefore[index], id);
      this.drawParent(svg, this.horizontalOffset + idx * horizontalShift, this.verticalOffset + verticalShift);
      idx++;
    }

    const currentUserIdx = idx;
    //this.drawPerson(svg, this.horizontalOffset + idx * horizontalShift, this.verticalOffset + verticalShift, data.currentPerson, id);
    let cperson = new TreeItem(this.father.x + idx * horizontalShift, this.father.y + verticalShift, data.currentPerson, 'currentPerson')
      this.siblingsAndSpouses.push(cperson);
     
   
    this.drawParent(svg, this.horizontalOffset + idx * horizontalShift, this.verticalOffset + verticalShift);
    idx++;

    if (data.spouses.length > 0) {
      let sperson = new TreeItem(this.father.x + idx * horizontalShift, this.father.y + verticalShift, data.spouses[0], 'spouse')
      this.siblingsAndSpouses.push(sperson);
   
     // this.drawPerson(svg, this.horizontalOffset + idx * horizontalShift, this.verticalOffset + verticalShift, data.spouses[0], id);
      idx++;
      this.drawSpouse(svg, this.horizontalOffset + (idx - 2) * horizontalShift, this.verticalOffset + verticalShift, this.horizontalOffset + (idx - 1) * horizontalShift, this.verticalOffset + verticalShift);
      this.drawChild(svg, this.horizontalOffset + (idx - 2) * horizontalShift, this.verticalOffset + verticalShift, this.horizontalOffset + (idx - 1) * horizontalShift, this.verticalOffset + verticalShift);

    }



    const siblingsAfter = data.siblings.filter(x => x.yearOfBirth > data.currentPerson.yearOfBirth);
    for (let index = 0; index < siblingsAfter.length; index++) {

      let person = new TreeItem(this.father.x + idx * horizontalShift, this.father.y + verticalShift, siblingsAfter[index], 'sibling')
      this.siblingsAndSpouses.push(person);

      //this.drawPerson(svg, this.horizontalOffset + idx * horizontalShift, this.verticalOffset + verticalShift, siblingsAfter[index], id);
      this.drawParent(svg, this.horizontalOffset + idx * horizontalShift, this.verticalOffset + verticalShift);
      idx++;
    }



    let idxend = idx - 1;
    if (siblingsAfter.length == 0 && data.spouses.length > 0) {
      idxend--;
    }
    this.drawSibling(svg, this.horizontalOffset, this.verticalOffset + verticalShift, this.horizontalOffset + idxend * horizontalShift, this.verticalOffset + verticalShift);

    this.siblingsAndSpouses.forEach(person => {
      this.drawPerson2(svg, person, id);
    });



    this.children = [];
    if (data.children.length > 0) {
      const shiftChild = currentUserIdx * horizontalShift;

      for (let index = 0; index < data.children.length; index++) {

        var person = new TreeItem(this.father.x + index * horizontalShift, this.father.y + 2 * verticalShift, data.children[index],  'child');
        this.children.push(person);
        
       // this.drawPerson(svg, shiftChild + this.horizontalOffset + index * horizontalShift, this.verticalOffset + 2 * verticalShift, data.children[index], id);
        this.drawParent(svg, shiftChild + this.horizontalOffset + index * horizontalShift, this.verticalOffset + 2 * verticalShift);

      }
      this.drawSibling(svg,
        shiftChild + this.horizontalOffset, this.verticalOffset + 2 * verticalShift,
        shiftChild + this.horizontalOffset + (data.children.length - 1) * horizontalShift, this.verticalOffset + 2 * verticalShift
      );
    }
    this.children.forEach(child => {
      this.drawPerson2(svg, child, id);
    });
  }


  drawSpouse(svg: any, x1: number, y1: number, x2: number, y2: number) {
    const g = svg.append('g');



    g.append('line')
      .attr('x1', x1 + this.rectangleWidth)
      .attr('y1', y1 + this.rectangleHeight / 2)
      .attr('x2', x2)
      .attr('y2', y2 + this.rectangleHeight / 2)
      .attr('stroke-width', 1.5)
      .attr('stroke', '#000000');
  }

  drawChild(svg: any, x1: number, y1: number, x2: number, y2: number) {
    const g = svg.append('g');



    g.append('line')
      .attr('x1', x1 + this.rectangleWidth + this.horizontalOffset / 2)
      .attr('y1', y1 + this.rectangleHeight / 2)
      .attr('x2', x1 + this.rectangleWidth + this.horizontalOffset / 2)
      .attr('y2', y1 + this.rectangleHeight + this.verticalOffset / 2)
      .attr('stroke-width', 1.5)
      .attr('stroke', '#000000');
  }

  drawParent(svg: any, x: number, y: number) {
    const g = svg.append('g');



    g.append('line')
      .attr('x1', x + this.rectangleWidth / 2)
      .attr('y1', y)
      .attr('x2', x + this.rectangleWidth / 2)
      .attr('y2', y - this.verticalOffset / 2)
      .attr('stroke-width', 1.5)
      .attr('stroke', '#000000');
  }

  drawSibling(svg: any, x1: number, y1: number, x2: number, y2: number) {
    const g = svg.append('g');



    g.append('line')
      .attr('x1', x1 + this.rectangleWidth / 2)
      .attr('y1', y1 - this.verticalOffset / 2)
      .attr('x2', x2 + this.rectangleWidth / 2)
      .attr('y2', y1 - this.verticalOffset / 2)
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
        .attr('height', this.rectangleHeight)
        .attr('width', this.rectangleWidth)
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
    if (person.gender == 'Male') {
      style = manStyle;
    } else {
      style = womanStyle;
    }

    if (person._id == currentPersonId) {
      if (person.gender == 'Male') {
        style = currentUserMan;
      } else {
        style = currentUserWoman;
      }

    }
    const style1 = Object.assign(style);

    const year = person.yearOfBirth;
    const year2 = person.yearOfDeath ?? '';
    let g = svg.append('g');

    g.append('title')
      .text(person.firstName);
    const baseUrl = 'person/';

    if (person._id != currentPersonId) {
      g = g.append('a')
        .attr('href', baseUrl + person._id);
    }

    g.append('rect')
      .attr('x', x)
      .attr('y', y)
      .attr('height', this.rectangleHeight)
      .attr('width', this.rectangleWidth)
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
      .text(year + '-' + year2);
  }
}
