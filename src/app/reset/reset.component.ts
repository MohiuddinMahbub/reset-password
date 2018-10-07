import { Component, OnInit } 		from '@angular/core';
import { Router, ActivatedRoute } 	from '@angular/router';
import { HttpClient, HttpHeaders, HttpErrorResponse } 	from '@angular/common/http';
import { FormControl, FormBuilder, FormGroup, Validators } from '@angular/forms';

import { Observable, forkJoin, throwError }      from 'rxjs';
import { map, first, retry, catchError }		from 'rxjs/operators';
import { FormsModule, ReactiveFormsModule }    from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';

import { AlertService } 			from '../_services';

const httpOptions = {
	headers: new HttpHeaders({ 
		'Content-Type': 'application/json'
	})
};

@Component({
  selector: 'app-reset',
  templateUrl: './reset.component.html',
  styleUrls: ['./reset.component.css']
})
export class ResetComponent implements OnInit {

    resetForm: FormGroup;
    submitted = false;
    loading = false;
    show = true;

    userId: string;
    oldPassword: string;
    loginName: string;
    configData: any;
    userData: any;
	private subscriptions = [];

  constructor(
  	    private formBuilder: FormBuilder,
        private route: ActivatedRoute,
        private router: Router,
        private alertService: AlertService,
        private http: HttpClient) {}

    ngOnInit() {
        this.resetForm = this.formBuilder.group({
            password: ['', Validators.required],
            re_password: ['', [Validators.required, Validators.minLength(6)]]
        });

        this.getJSON();
    }

    // convenience getter for easy access to form fields
    get f() { return this.resetForm.controls; }

	guid() {
		return this.s4() + this.s4() + '-' + this.s4() + '-' + this.s4() + '-' +
		this.s4() + '-' + this.s4() + this.s4() + this.s4();
	}

	s4() {
		return Math.floor((1 + Math.random()) * 0x10000).toString(16).substring(1);
	}

    onSubmit() {
        this.submitted = true;

        // stop here if form is invalid
        if (this.resetForm.invalid) {
            return;
        }

        this.show = false;
        this.loading = true;
		
		let resetValue = this.resetForm.value;

		if(resetValue.password !== resetValue.re_password){
			this.alertService.error("Password mismatch.");
		}
		else{
			
			if(null == this.userData){
				console.log(this.userData);
			}
			else{
				
				let jsonString = {
					header: {
						userName: null,
						userId: this.userData.userId,
						secretId: this.guid(),
						source: this.configData.source,
						contentType: this.configData.contentType,
						actionType: this.configData.actionType,
						destination: this.configData.destination
					},
					payload: {
						isDefault: 0, //isDefault to recognize that it is for forgot password
						userModKey: this.userData.userId,
						loginName: this.userData.loginName,
						password: this.userData.password,
						newPassword: resetValue.password
					}
				};			

				this.dispatcher(jsonString).subscribe(
					data => {
						let response = data.payload[1].payload;					
						
						this.loading = false;

						if(null != response.errMsg){
							this.show = true;
							this.alertService.error(response.errMsg);
						}
						else{
							this.router.navigate(['/success']);
						}
					},
					error => {
						this.alertService.error(error);
						this.show = true;
						this.loading = false;
					}
				);
			}
		}
    }

    onFocus(){
    	this.alertService.clear();
    }

    // Dispataches single request to server
	public dispatcher(arg){
		let body = JSON.stringify(arg);

		return this.http.post<any>(this.configData.url, body, httpOptions)
		.pipe(
			retry(3), // retry a failed request up to 3 times
			catchError(this.handleError) // then handle the error
		)
	};

	public handleError(error: HttpErrorResponse) {
		if (error.error instanceof ErrorEvent) {
			// A client-side or network error occurred. Handle it accordingly.
			console.error('An error occurred:', error.error.message);
		} else {
			// The backend returned an unsuccessful response code.
			// The response body may contain clues as to what went wrong,
			console.error( `Backend returned code ${error.status}, ` + `body was: ${error.error}`);
		}
		// return an observable with a user-facing error message
		return throwError( 'Something bad happened; please try again later.');
	};

	public getJSON(){

		this.http.get('assets/config.json').subscribe(
			data => {
				
				this.configData = data;
				
				console.log(this.configData);
				
				if(null != data){
	  				this.getResetData(data);
	  			}
			},
			(err: HttpErrorResponse) => {
				console.log (err.message);
			}
		);
    };

    public getResetData(data){

     	let jsonString = {

			header: {
				userName: null,
				userId: null,
				secretId: this.guid(),
				source: data.source,
				contentType: data.contentType,
				actionType: data.anotherAction,
				destination: data.destination
			},
			payload: {}
		};			

		this.dispatcher(jsonString).subscribe(
			data => {
				let response = data.payload[1].payload;					

				this.userData = response;
			},
			error => {
				console.error(error);
				this.alertService.error(error);
			}
		);
    };
}
