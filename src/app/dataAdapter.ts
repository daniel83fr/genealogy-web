import { DataModel } from './dataModel';

export class DataAdapter{
  
    members = []
    links = []
  
    adapt(data: any){
      let obj = new DataModel()
      this.members = data.members;
      this.links = data.links;
  
      
      var id = this.members[0]._id
      obj.currentPerson = this.getMemberById(id)
      obj.father = this.getFather(id)
      obj.mother = this.getMother(id)
      obj.children = this.getChildren(id)
      obj.siblings = this.getSiblings(id).sort((a,b) => (a.BirthDate > b.BirthDate) ? 1 : ((b.BirthDate > a.BirthDate) ? -1 : 0));
      obj.spouses = this.getSpouses(id)
  
      return obj
    }
  
    private getMemberById(id:string){
      return this.members.filter(x=>x._id == id)[0];
    }
    
    private getFather(id:string){
    
      var parentLinks =     this.links.filter(x=>x.Person2 == id && x.Type == 'Parent' )
      for (let element of parentLinks) {
        var memberInfo = this.getMemberById(element.Person1)
        if(memberInfo.Gender == "Male"){
          return memberInfo
        }
      }
      return {}
      
    }
  
    private getMother(id:string){
    
      var parentLinks =     this.links.filter(x=>x.Person2 == id && x.Type == 'Parent' )
      for (let element of parentLinks) {
        var memberInfo = this.getMemberById(element.Person1)
        if(memberInfo.Gender == "Female"){
          return memberInfo
        }
      }
      return {}
      
    }
  
    private getChildren(id:string){
      var items = []
      var parentLinks =     this.links.filter(x=>x.Person1 == id && x.Type == 'Parent' )
      for (let element of parentLinks) {
        var memberInfo = this.getMemberById(element.Person2)
        items.push(memberInfo)
       
      }
      return items
    }
  
    private getSiblings(id:string){
      var items = []
      var fatherId = this.getFather(id)._id
      var parentLinks =     this.links.filter(x=>x.Person1 == fatherId && x.Type == 'Parent' )
      for (let element of parentLinks) {
        if(element.Person2 != id)
        {
          var memberInfo = this.getMemberById(element.Person2)
          items.push(memberInfo)
        }
        
       
      }
      return items
    }
  
    private getSpouses(id:string){
      var items = []
      var parentLinks =     this.links.filter(x=>(x.Person1 == id || x.Person2 == id) && x.Type == 'Spouse' )
      for (let element of parentLinks) {
        if(element.Person1 == id){
          var memberInfo = this.getMemberById(element.Person2)
          items.push(memberInfo)
        }
        else{
          var memberInfo = this.getMemberById(element.Person1)
          items.push(memberInfo)
        }
        
       
      }
      return items
    }
  }