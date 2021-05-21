import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ListComponent } from './list/list.component';
import { DetailComponent } from './detail/detail.component';
import { AddComponent } from './add/add.component';
import { SourceRoutingModule } from './source-routing.module';
import { MatTableModule } from '@angular/material/table';
import { MatToolbarModule } from '@angular/material/toolbar';
import { MatExpansionModule } from '@angular/material/expansion';
import { DatasetModule } from '../dataset/dataset.module';
import {MatChipsModule} from '@angular/material/chips';



@NgModule({
  declarations: [ListComponent, DetailComponent, AddComponent],
  imports: [
    CommonModule,
    MatTableModule,
    SourceRoutingModule,
    MatToolbarModule,
    MatExpansionModule,
    DatasetModule,
    MatChipsModule,
  ]
})
export class SourceModule { }
