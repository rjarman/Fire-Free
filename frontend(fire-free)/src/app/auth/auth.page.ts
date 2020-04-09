import { Component, OnInit } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';
import { FormBuilder, Validators, FormControl, AbstractControl } from '@angular/forms';
import { Login } from '../shared/login';
import { CookieService } from 'ngx-cookie-service';
import { RegularExpressionList } from '../shared/validator';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage implements OnInit {
  public isRegistered: boolean;

  public isValidEmail: boolean;
  public isNotValidEmail: boolean;
  public isLoadingEmail: boolean;

  public isValidUserName: boolean;
  public isNotValidUserName: boolean;
  public isLoadingUserName: boolean;

  private profilePhoto: any;

  loginForm = this.formBuilder.group({
    email: ['', [Validators.required, Validators.pattern(RegularExpressionList.regExp.email)]],
    password: ['', [Validators.required, Validators.minLength(6)]]
  });
  registerForm = this.formBuilder.group({
    userName: ['', [Validators.required, Validators.pattern(RegularExpressionList.regExp.userName)]],
    email: ['', [Validators.required, Validators.pattern(RegularExpressionList.regExp.email)]],
    password: ['', [Validators.required, Validators.minLength(6)]],
    profile: ['', [Validators.required, Validators.pattern(RegularExpressionList.regExp.image)]]
  });

  constructor(private authService: AuthService, private router: Router, private cookieService: CookieService,
              private formBuilder: FormBuilder) {
                this.isRegistered = false;

                this.isValidEmail = false;
                this.isNotValidEmail = false;
                this.isLoadingEmail = false;

                this.isValidUserName = false;
                this.isNotValidUserName = false;
                this.isLoadingUserName = false;
              }
  ngOnInit() { }
  public toRegister() {
    this.isRegistered = false;

    this.isValidEmail = false;
    this.isNotValidEmail = false;
    this.isLoadingEmail = false;
    this.loginForm.reset();
  }
  public toLogin() {
    this.isRegistered = true;

    this.isValidEmail = false;
    this.isNotValidEmail = false;
    this.isLoadingEmail = false;

    this.isValidUserName = false;
    this.isNotValidUserName = false;
    this.isLoadingUserName = false;

    this.registerForm.reset();
  }
  public checkLogin() {
    const loginData: Login = {email: this.loginForm.value.email, password: this.loginForm.value.password};
    this.authService.login(loginData);
  }
  public checkRegister() {
    this.authService.register(this.registerForm, this.profilePhoto);
  }

  setImages(event) {
    if (event.target.files.length > 0) {
      this.profilePhoto = event.target.files;
    }
  }

  focused(valueType: string, value: string) {
    if (valueType === 'email') {
      this.isValidEmail = false;
      this.isNotValidEmail = false;
      this.isLoadingEmail = true;

      const regularExpressionList = new RegExp(RegularExpressionList.regExp.email);
      if (regularExpressionList.test(value)) {
        this.isLoadingEmail = false;
        this.isValidEmail = true;
        this.isNotValidEmail = false;
      } else {
        this.isValidEmail = false;
      }

    } else if (valueType === 'userName') {
      this.isValidUserName = false;
      this.isNotValidUserName = false;
      this.isLoadingUserName = true;

      const regularExpressionList = new RegExp(RegularExpressionList.regExp.userName);
      if (regularExpressionList.test(value)) {
        this.isLoadingUserName = false;
        this.isValidUserName = true;
        this.isNotValidUserName = false;
      } else {
        this.isValidUserName = false;
      }
    }
  }

  notFocused(valueType: string, value: string) {
    if (valueType === 'email') {
      this.isValidEmail = false;
      this.isNotValidEmail = false;
      this.isLoadingEmail = false;

      const regularExpressionList = new RegExp(RegularExpressionList.regExp.email);
      if (regularExpressionList.test(value)) {
        this.isValidEmail = true;
        this.isNotValidEmail = false;
      } else {
        this.isValidEmail = false;
        this.isNotValidEmail = true;
      }

    } else if (valueType === 'userName') {
      this.isValidUserName = false;
      this.isNotValidUserName = false;
      this.isLoadingUserName = false;

      const regularExpressionList = new RegExp(RegularExpressionList.regExp.userName);
      if (regularExpressionList.test(value)) {
        this.isValidUserName = true;
        this.isNotValidUserName = false;
      } else {
        this.isValidUserName = false;
        this.isNotValidUserName = true;
      }

    }
  }
}
