import { Component, OnDestroy } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { Subscription } from 'rxjs';
import { AuthService } from '../shared/auth.service';
import { trigger, state, style, transition, animate } from '@angular/animations';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.scss'],
  animations: [
    trigger('login', [
      state('inactive', style({
        opacity: '0',
        height: '0'
      })),
      state('active', style({
        opacity: '1',

      })),
      transition('inactive => active', animate('500ms ease-in')),
      transition('active => inactive', animate('500ms ease-out'))
    ]),
    trigger('register', [
      state('inactive', style({
        opacity: '0',
        height: '0'
      })),
      state('active', style({
        opacity: '1',
      })),
      transition('inactive => active', animate('500ms ease-in')),
      transition('active => inactive', animate('500ms ease-out'))
    ])
  ],
})
export class LandingComponent implements OnDestroy {

  subscription: Subscription;
  errorMessage: string = '';
  show: string = 'login';
  registerState = 'inactive';
  loginState = 'active';
  showReset = false;

  constructor(private route: ActivatedRoute,
              private auth: AuthService) {
    this.route.params.subscribe(
      (params: Params) => {
        if (params['action']) {
          this.show = params['action'];
          if(this.show === 'register'){
            this.registerState =  'active';
            this.loginState = 'inactive';
          } else {
            this.registerState = 'inactive';
            this.loginState = 'active';
          }
        }
      }
    );
    this.subscription = this.auth.errorMessage$.subscribe(
      (message: string) => {
        if(message){
          this.errorMessage = message;
        } else {
          this.errorMessage = 'Špatné heslo nebo email!'
        }
      }
    )
  }

  register(form) {
    this.auth.signup(form.email, form.password, form.userName);
  }

  login(form) {
    this.auth.login(form.userName, form.password);
  }

  ngOnDestroy(){
    this.subscription.unsubscribe();
  }

  fb(){
    this.auth.loginWithFacebook();
  }
  google(){
    this.auth.loginWithGoogle();
  }

  resetPassword(form){
    this.auth.changePassword(form.email);
  }

  loginDone(){
    this.showReset = this.loginState === 'active';
  }

}
