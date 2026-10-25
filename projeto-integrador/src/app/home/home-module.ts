import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '../shared/shared-module';
import { HomeRoutingModule } from './home-routing-module';
import { Home } from './home/home';

@NgModule({
  declarations: [Home],
  imports: [CommonModule, SharedModule, HomeRoutingModule],
})
export class HomeModule {}