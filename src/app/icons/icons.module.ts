import { NgModule } from '@angular/core';
 
import { BootstrapIconsModule } from 'ng-bootstrap-icons';
import {  
  People, 
  CameraFill,
  Receipt,
  Calendar,
  QuestionCircle,
  Link,
  PersonFill,
  Pencil,
  CloudUpload,
  RssFill,
  Diagram3Fill
} from 'ng-bootstrap-icons/icons';
 
// Select some icons (use an object, not an array)
const icons = {
  People,
  Calendar,
  CameraFill,
  QuestionCircle,
  CloudUpload,
  Link,
  Receipt,
  Pencil,
  PersonFill,
  RssFill,
  Diagram3Fill
};
 
@NgModule({
  imports: [
    BootstrapIconsModule.pick(icons)
  ],
  exports: [
    BootstrapIconsModule
  ]
})
export class IconsModule { }