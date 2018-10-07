import { Component, OnInit } from '@angular/core';

import { AlertService } from '../_services';

@Component({
  selector: 'app-success',
  templateUrl: './success.component.html',
  styleUrls: ['./success.component.css']
})
export class SuccessComponent implements OnInit {

  constructor(private alertService: AlertService) { }

  ngOnInit() {
  	this.alertService.clear();
  }

}
