import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { StatusComponent } from './status/status.component';
import { ManagementComponent } from './management/management.component';
import {HttpClientModule} from "@angular/common/http";
import {FormsModule} from "@angular/forms";
import {NgxEchartsModule} from "ngx-echarts";
import {PublicOpinionResponseRoutingModule} from "./public-opinion-response-routing.module";
import {EmergencyEventService} from "../emergency-event/emergency-event.service";
@NgModule({
  providers:[EmergencyEventService],
  imports: [
    CommonModule,
    PublicOpinionResponseRoutingModule,
    NgxEchartsModule,
    HttpClientModule,
    FormsModule
  ],
  declarations: [StatusComponent, ManagementComponent]
})
export class PublicOpinionResponseModule { }