import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { AddComponent } from './add/add.component';
import { PromotionListComponent } from './promotion-list/promotion-list.component';
import { EditComponent } from './edit/edit.component';
import { ReactiveFormsModule } from '@angular/forms';
import { LocalStorageService } from './services/local-storage/local-storage.service';

@NgModule({
  declarations: [AppComponent, AddComponent, PromotionListComponent, EditComponent],
  imports: [BrowserModule, AppRoutingModule, ReactiveFormsModule],
  exports: [EditComponent],
  providers: [LocalStorageService],
  bootstrap: [AppComponent],
})
export class AppModule {}
