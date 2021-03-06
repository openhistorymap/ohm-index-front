import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DetailComponent } from './detail/detail.component';
import { AddComponent } from './add/add.component';
import { ListComponent } from './list/list.component';
import {DatasetRoutingModule} from './dataset-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import {MatExpansionModule} from '@angular/material/expansion';
import { TreelabelPipe } from './treelabel.pipe';

@NgModule({
  declarations: [
    ListComponent,
    AddComponent,
    DetailComponent,
    TreelabelPipe
  ],
  imports: [
    CommonModule,
    MatTableModule,
    DatasetRoutingModule,
    MatToolbarModule,
    MatExpansionModule,
  ],
  exports:[
    ListComponent
  ]
})
export class DatasetModule { }
