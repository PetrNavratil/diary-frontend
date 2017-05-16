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

  /**
   * For error message subsription
   */
  subscription: Subscription;
  /**
   * Displayed error message
   * @type {string}
   */
  errorMessage: string = '';
  /**
   * States which form is visible
   * @type {string}
   */
  show: string = 'login';
  /**
   * Holds state of register form
   * @type {string}
   */
  registerState = 'inactive';
  /**
   * Holds state of login form
   * @type {string}
   */
  loginState = 'active';

  /**
   * Enables visibility of change password after animations are done
   * @type {boolean}
   */
  showReset = false;

  constructor(private route: ActivatedRoute,
              private auth: AuthService) {
    // subscribe to activated route to decide which form to show
    this.route.params.subscribe(
      (params: Params) => {
        if (params['action']) {
          this.show = params['action'];
          if (this.show === 'register') {
            this.registerState = 'active';
            this.loginState = 'inactive';
          } else {
            this.registerState = 'inactive';
            this.loginState = 'active';
          }
        }
      }
    );
    // subscribes for error message
    this.subscription = this.auth.errorMessage$.subscribe(
      (message: string) => {
        if (message) {
          this.errorMessage = message;
        } else {
          this.errorMessage = 'Špatné heslo nebo email!'
        }
      }
    )
  }

  /**
   * Handles signing up of user
   * @param form
   */
  register(form): void {
    this.auth.signup(form.email, form.password, form.userName);
  }

  /**
   * Handles login of user
   * @param form
   */
  login(form): void {
    this.auth.login(form.userName, form.password);
  }

  /**
   * Handles Facebook login
   */
  fb(): void {
    this.auth.loginWithFacebook();
  }

  /**
   * Handles Google login
   */
  google(): void {
    this.auth.loginWithGoogle();
  }

  /**
   * Handles password reset
   * @param form
   */
  resetPassword(form): void {
    this.auth.changePassword(form.email);
  }

  /**
   * Called after animation of login form is done
   */
  loginDone(): void {
    this.showReset = this.loginState === 'active';
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
  }

}
