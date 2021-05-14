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
    MatDialogModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
