import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './index/index.component';
import { IntroComponent } from './intro/intro.component';
import { MethodologyComponent } from './methodology/methodology.component';
import { AddComponent } from './add/add.component';

const routes: Routes = [
  
  {path: '', component: IntroComponent},
  {path: 'methodology', component: MethodologyComponent},
  {path: 'index', component: IndexComponent},
  {path: 'add', component: AddComponent},
  {path: 'sources', loadChildren: () => import('./source/source.module').then(m => m.SourceModule)},
  {path: 'datasets', loadChildren: () => import('./dataset/dataset.module').then(m => m.DatasetModule)}
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
