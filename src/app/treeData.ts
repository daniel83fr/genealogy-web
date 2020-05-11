import { TreeItem } from './treeItem';

export class TreeData {

    row1: TreeItem[] = [];
    row2: TreeItem[] = [];
    row3: TreeItem[] = [];

    settings: any;

    father: any;
    mother: any;
    children: TreeItem[] = [];
    siblingsBefore: TreeItem[] = [];
    currentPerson: TreeItem;
    spouses: TreeItem[] = [];
    siblingsAfter: TreeItem[] = [];
    currentPersonWithSiblings: TreeItem[] = [];

    constructor(data: any, settings: any) {

      this.settings = settings;

      this.ExtractData(data);

      this.row1 = [this.father, this.mother];
      this.row2 = [...this.siblingsBefore, this.currentPerson, ...this.spouses, ...this.siblingsAfter];
      this.shiftRow(this.row2, 0, (this.settings.rectangleHeight + this.settings.verticalOffset));
      this.row3 = [...this.children];
      this.shiftRow(this.row3, 0, (this.settings.rectangleHeight + this.settings.verticalOffset) * 2);

      this.shiftXEachItems(this.row1);
      this.shiftXEachItems(this.row2);
      this.shiftXEachItems(this.row3);

      let toShift = (this.currentPersonWithSiblings[0].x - this.currentPersonWithSiblings[this.currentPersonWithSiblings.length - 1].x) / 2;
      toShift += (this.settings.rectangleWidth + this.settings.horizontalOffset) / 2;
      this.shiftRow(this.row2, toShift , 0);

      const toShift2 = (this.children.length > 0)
        ? ((this.children[0].x + this.children[this.children.length - 1].x) / 2)
        : 0;

      const toShift3 = (this.spouses.length > 0) ?
        ((this.currentPerson.x + this.spouses[0].x) / 2) : 0;
      this.shiftRow(this.row3, toShift3 - toShift2  , 0);



      this.shiftMin();
      this.shiftRow(this.row1, this.settings.horizontalOffset, this.settings.verticalOffset);
      this.shiftRow(this.row2, this.settings.horizontalOffset, this.settings.verticalOffset);
      this.shiftRow(this.row3, this.settings.horizontalOffset, this.settings.verticalOffset);
    }

    private ExtractData(data: any) {
      this.father = new TreeItem(0, 0, data.father, 'father');
      this.mother = new TreeItem(0, 0, data.mother, 'mother');
      // Add current user, spouse and siblings
      const siblingsBefore = data.siblings.filter(x => x.yearOfBirth < data.currentPerson.yearOfBirth);
      if (siblingsBefore?.length > 0) {
        for (const sibling of siblingsBefore) {
          this.siblingsBefore.push(new TreeItem(0, 0, sibling, 'sibling'));
        }
      }
      this.currentPerson = new TreeItem(0, 0, data.currentPerson, 'current');
      if (data.spouses?.length > 0) {
        for (const spouse of data.spouses) {
          this.spouses.push(new TreeItem(0, 0, spouse, 'spouse'));
        }
      } else if (data.children?.length > 0) {
        this.spouses.push(new TreeItem(0, 0, null, 'spouse'));
      }

      const siblingsAfter = data.siblings.filter(x => x.yearOfBirth >= data.currentPerson.yearOfBirth);
      if (siblingsAfter?.length > 0) {
        for (const sibling of siblingsAfter) {
          this.siblingsAfter.push(new TreeItem(0, 0, sibling, 'sibling'));
        }
      }
      // Add children
      if (data.children != null) {
        for (const child of data.children) {
          this.children.push(new TreeItem(0, 0, child, 'child'));
        }
      }
      this.currentPersonWithSiblings = [...this.siblingsBefore, this.currentPerson, ...this.siblingsAfter];
    }

    getWidth() {
      return Math.max(
        this.row1[this.row1.length - 1].x + this.settings.rectangleWidth,
        this.row2[this.row2.length - 1].x + this.settings.rectangleWidth,
        this.row3.length > 0 ? this.row3[this.row3.length - 1].x + this.settings.rectangleWidth : 0
        ) +  this.settings.horizontalOffset;
    }

    getHeight() {
      return (this.children.length === 0 ? 2 : 3) * 
      (this.settings.rectangleHeight + this.settings.verticalOffset) + this.settings.verticalOffset;
    }

    shiftRow(row: TreeItem[], shiftX: number, shiftY: number) {
      row.forEach(elm => {
        elm.x += shiftX;
        elm.y += shiftY;
      });
    }

    shiftXEachItems(row: TreeItem[]) {
      let idx = 0;
      for (const rowItem of row) {
        rowItem.x += idx * (this.settings.rectangleWidth + this.settings.horizontalOffset);
        idx++;
      }
    }

    shiftMin() {
      let min = 0;
      for (const i of this.row1) {
        if (i.x < min) {
          min = i.x;
        }
      }
      for (const i of this.row2) {
        if (i.x < min) {
          min = i.x;
        }
      }
      for (const i of this.row3) {
        if (i.x < min) {
          min = i.x;
        }
      }

      this.shiftRow(this.row1, -min, 0);
      this.shiftRow(this.row2, -min, 0);
      this.shiftRow(this.row3, -min, 0);
    }
  }
