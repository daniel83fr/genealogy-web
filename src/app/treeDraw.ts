export class TreeDraw{

    horizontal_offset = 30
    vertical_offset = 30
    rect_width = 140
    rect_height = 60
    
    draw(svgHolder:any, data:any){

   

    
        var posx = 10
        var posy = 10
    
        let svg =  svgHolder.append("svg")
    
        let row1 = data.spouses.length + data.siblings.length + 1
        let row2 = row1
        if(data.children.length > row2){
          row2 = data.children.length
        }
    
        svg.style("width", 2* posx + (row2 * this.rect_width + (row2-1) * this.horizontal_offset ) + 'px')
           .style("height", 400 + 'px');
    
        let posx_gen1 = posx + (row1 * this.rect_width + (row1-1) * this.horizontal_offset )/2 - this.horizontal_offset/2 - this.rect_width
    
    
        var horizontalShift = this.rect_width+this.horizontal_offset
        var verticalShift = this.rect_height+this.vertical_offset
        var id = data.currentPerson._id
        this.drawPerson(svg, posx_gen1 , posy, data.father, id)
        this.drawPerson(svg, posx_gen1 + horizontalShift , posy, data.mother, id)
        this.drawSpouse(svg, posx_gen1, posy, posx_gen1 + horizontalShift, posy)
        this.drawChild(svg, posx_gen1, posy, posx_gen1 + horizontalShift, posy)
     
    
     
        var idx = 0
        var siblingsBefore = data.siblings.filter(x=>x.BirthDate < data.currentPerson.BirthDate)
    
        for (let index = 0; index < siblingsBefore.length; index++) {
          this.drawPerson(svg, posx+ idx* horizontalShift, posy + verticalShift,siblingsBefore[index], id)
          this.drawParent(svg,   posx+ idx* horizontalShift, posy + verticalShift)
          idx++
        }
        
        var currentUserIdx = idx
        this.drawPerson(svg, posx+ idx*horizontalShift, posy + verticalShift, data.currentPerson, id)
        this.drawParent(svg,   posx+ idx* horizontalShift, posy + verticalShift)
        idx++
    
        if(data.spouses.length>0)
        {
          this.drawPerson(svg,posx+ idx*horizontalShift, posy +verticalShift,  data.spouses[0], id)
          idx++
          this.drawSpouse(svg, posx+ (idx-2)*horizontalShift, posy + verticalShift, posx+ (idx-1)*horizontalShift, posy +verticalShift)
          this.drawChild(svg, posx+ (idx-2)*horizontalShift, posy + verticalShift, posx+ (idx-1)*horizontalShift, posy +verticalShift)
    
        }
     
    
        
        var siblingsAfter = data.siblings.filter(x=>x.BirthDate > data.currentPerson.BirthDate)
        for (let index = 0; index < siblingsAfter.length; index++) {
          this.drawPerson(svg, posx+ idx*horizontalShift, posy +verticalShift,siblingsAfter[index],id)
          this.drawParent(svg,  posx+ idx*horizontalShift, posy +verticalShift)
          idx++
        }
    
       
    
        var idxend = idx-1
        if(siblingsAfter.length ==  0 && data.spouses.length > 0){
          idxend --;
        }
         this.drawSibling(svg,posx, posy + verticalShift, posx+ idxend*horizontalShift, posy + verticalShift)
        
    
         if(data.children.length>0)
         {
          let shiftChild = currentUserIdx * horizontalShift
    
          for (let index = 0; index < data.children.length; index++) {
           this.drawPerson(svg, shiftChild + posx+ index*horizontalShift, posy + 2* verticalShift,data.children[index], id)
           this.drawParent(svg, shiftChild  + posx+ index*horizontalShift, posy + 2 *verticalShift)
        
         }
         this.drawSibling(svg,
           shiftChild + posx, posy + 2* verticalShift,
           shiftChild + posx+ (data.children.length-1)*horizontalShift, posy + 2 *verticalShift
           )
         }
      }

      
  drawSpouse (svg:any, x1:number, y1:number, x2:number, y2:number ){
    var g = svg.append("g")
   


  g.append("line")
      .attr("x1",x1+ this.rect_width)
      .attr("y1",y1+ this.rect_height/2)
      .attr("x2",x2)
      .attr("y2",y2+ this.rect_height/2)
      .attr("stroke-width", 1.5)
      .attr("stroke", "#000000")
  }

  drawChild (svg:any, x1:number, y1:number, x2:number, y2:number ){
    var g = svg.append("g")
   


  g.append("line")
      .attr("x1",x1+this.rect_width+ this.horizontal_offset/2)
      .attr("y1",y1+this.rect_height/2)
      .attr("x2",x1+this.rect_width+this.horizontal_offset/2)
      .attr("y2",y1+this.rect_height + this.vertical_offset/2)
      .attr("stroke-width", 1.5)
      .attr("stroke", "#000000")
  }

  drawParent (svg:any, x:number, y:number){
    var g = svg.append("g")
   


  g.append("line")
      .attr("x1",x+ this.rect_width/2)
      .attr("y1",y)
      .attr("x2",x+ this.rect_width/2)
      .attr("y2",y- this.vertical_offset /2)
      .attr("stroke-width", 1.5)
      .attr("stroke", "#000000")
  }

  drawSibling (svg:any, x1:number, y1:number, x2:number, y2:number ){
    var g = svg.append("g")
   


  g.append("line")
      .attr("x1",x1+this.rect_width/2)
      .attr("y1",y1-this.vertical_offset/2)
      .attr("x2",x2+this.rect_width/2)
      .attr("y2",y1-this.vertical_offset/2)
      .attr("stroke-width", 1.5)
      .attr("stroke", "#000000")
  }

  drawPerson(svg:any, x:number, y:number, person:any, currentPersonId: string){

    if(!person){
      return
    }

    const currentUserMan = {"fill": "#0657f8", "foreground":"#FFFFFF", "stroke":"#f20408"}
    const currentUserWoman = {"fill": "#ff036c", "foreground":"#FFFFFF", "stroke":"#f20408"}
    const manStyle = { "fill": "#53a7fc", "foreground": "#000000", "stroke": "#000000" };
    const womanStyle = { "fill": "#ffaaff", "foreground": "#000000", "stroke": "#000000" };

    var style = {}
    if(person.Gender == 'Male'){
      style = manStyle
    }
    else{
      style = womanStyle
    }

    if(person._id == currentPersonId){
      if(person.Gender == 'Male'){
      style = currentUserMan
    }
    else{
      style = currentUserWoman
    }
     
    }
    var style1 = Object.assign(style)

    var year = person.BirthDate
    var g = svg.append("g")
    
    g.append("title")
    .text(person.FirstName )
    var baseUrl = "http://localhost:4200/person/"

    if(person._id != currentPersonId){
      g = g.append("a")
      .attr("href", baseUrl+person._id)
    }

 g.append("rect")
    .attr("x",x)
    .attr("y",y)
    .attr("height",this.rect_height)
    .attr("width",this.rect_width)
    .attr("stroke-width", 1 )
    .attr("fill",  style1.fill)
    .attr("stroke", style1.stroke  );

   g.append("text")
    .attr("font-size", "12")
    .attr("font-weight", "bold")
    .attr("y", y+20)
    .attr("x", x+10)
    .attr("fill", style1.foreground)
    .text(person.LastName)

    g.append("text")
    .attr("font-size", "12")
    .attr("font-weight", "bold")
    .attr("y", y+40)
    .attr("x", x+10)
    .attr("fill", style1.foreground)
    .text(person.FirstName)

    g.append("text")
    .attr("font-size", "12")
    .attr("y", y+55)
    .attr("x", x+55)
    .attr("fill", style1.foreground)
    .text(year)
  } 
}