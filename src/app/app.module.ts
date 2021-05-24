import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { IndexComponent } from './index/index.component';
import {MatToolbarModule} from '@angular/material/toolbar';
import {MatIconModule} from '@angular/material/icon';
import {MatSidenavModule} from '@angular/material/sidenav';
import {MatButtonModule} from '@angular/material/button';
import { HttpClientModule } from '@angular/common/http';
import {MatTableModule} from '@angular/material/table';
import { AddComponent } from './add/add.component';
import { IntroComponent } from './intro/intro.component';
import { MethodologyComponent } from './methodology/methodology.component';
import { AreadisplayComponent } from './areadisplay/areadisplay.component';
import { AreadetailComponent } from './areadetail/areadetail.component';
import { OverlayModule } from '@angular/cdk/overlay';
import { CustomToolTipComponent } from './areadisplay/custom-tool-tip.component';

import {MatInputModule} from '@angular/material/input';
import { AddmodalComponent } from './addmodal/addmodal.component';
import {MatDialogModule} from '@angular/material/dialog';
import {MatExpansionModule} from '@angular/material/expansion';
import {MatSelectModule} from '@angular/material/select';
import { TreelabelPipe } from './treelabel.pipe';
import {CdkTreeModule} from '@angular/cdk/tree';
import {MatTreeModule} from '@angular/material/tree';
import {MatTooltipModule} from '@angular/material/tooltip';
import {MatCheckboxModule} from '@angular/material/checkbox';
import {MatChipsModule} from '@angular/material/chips';

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    AddComponent,
    IntroComponent,
    MethodologyComponent,
    AreadisplayComponent,
    AreadetailComponent,
    CustomToolTipComponent,
    AddmodalComponent,
    TreelabelPipe,
  ],
  imports: [
    BrowserModule,
    AppRoutingModule,
    BrowserAnimationsModule,
    HttpClientModule,
    MatToolbarModule,
    MatIconModule,
    MatSidenavModule,
    MatButtonModule,
    MatTableModule,
    MatInputModule,
    OverlayModule,
    MatDialogModule,
    MatExpansionModule,
    MatSelectModule,
    CdkTreeModule,
    MatTreeModule,
    MatTooltipModule,
    MatCheckboxModule,
    MatChipsModule

  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
