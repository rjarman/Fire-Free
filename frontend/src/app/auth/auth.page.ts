import { Component } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RegularExpressionList } from '../shared/validator';
import { FormService } from '../services/form.service';
import { FormDataFormatter } from '../shared/formDataFormatter';
import { CookieService } from 'ngx-cookie-service';

@Component({
  selector: 'app-auth',
  templateUrl: './auth.page.html',
  styleUrls: ['./auth.page.scss'],
})
export class AuthPage {
  private profilePhoto: any;

  isRegistered: boolean;
  isValidEmail: boolean;
  isNotValidEmail: boolean;
  isLoadingEmail: boolean;
  isValidUserName: boolean;
  isNotValidUserName: boolean;
  isLoadingUserName: boolean;

  loginForm = this.formBuilder.group({
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(RegularExpressionList.regExp.email),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
  });
  registerForm = this.formBuilder.group({
    userName: [
      '',
      [
        Validators.required,
        Validators.pattern(RegularExpressionList.regExp.userName),
      ],
    ],
    email: [
      '',
      [
        Validators.required,
        Validators.pattern(RegularExpressionList.regExp.email),
      ],
    ],
    password: ['', [Validators.required, Validators.minLength(6)]],
    profile: [
      '',
      [
        Validators.required,
        Validators.pattern(RegularExpressionList.regExp.image),
      ],
    ],
  });

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService,
    private cookieService: CookieService
  ) {
    if (this.cookieService.get('isLoggedIn') === 'false') {
      this.isRegistered = true;
    } else {
      this.isRegistered = false;
    }

    this.isValidEmail = false;
    this.isNotValidEmail = false;
    this.isLoadingEmail = false;

    this.isValidUserName = false;
    this.isNotValidUserName = false;
    this.isLoadingUserName = false;
  }

  toRegister() {
    this.isRegistered = false;

    this.isValidEmail = false;
    this.isNotValidEmail = false;
    this.isLoadingEmail = false;
    this.loginForm.reset();
  }

  toLogin() {
    this.isRegistered = true;

    this.isValidEmail = false;
    this.isNotValidEmail = false;
    this.isLoadingEmail = false;

    this.isValidUserName = false;
    this.isNotValidUserName = false;
    this.isLoadingUserName = false;

    this.registerForm.reset();
  }

  checkLogin() {
    this.formService.formHandler(
      new FormDataFormatter(this.loginForm, null, 'login', false)
    );
  }

  checkRegister() {
    this.formService.formHandler(
      new FormDataFormatter(
        this.registerForm,
        this.profilePhoto,
        'signup',
        true
      )
    );
  }

  setImages(event) {
    if (event.target.files.length > 0) {
      this.profilePhoto = event.target.files;
    }
  }

  focused(valueType: string, value: string) {
    this.formService.focused(valueType, value);

    this.isValidEmail = this.formService.getAllVariables(
      'log-reg'
    ).isValidEmail;
    this.isNotValidEmail = this.formService.getAllVariables(
      'log-reg'
    ).isNotValidEmail;
    this.isLoadingEmail = this.formService.getAllVariables(
      'log-reg'
    ).isLoadingEmail;
    this.isValidUserName = this.formService.getAllVariables(
      'log-reg'
    ).isValidUserName;
    this.isNotValidUserName = this.formService.getAllVariables(
      'log-reg'
    ).isNotValidUserName;
    this.isLoadingUserName = this.formService.getAllVariables(
      'log-reg'
    ).isLoadingUserName;
  }

  notFocused(valueType: string, value: string) {
    this.formService.notFocused(valueType, value);

    this.isValidEmail = this.formService.getAllVariables(
      'log-reg'
    ).isValidEmail;
    this.isNotValidEmail = this.formService.getAllVariables(
      'log-reg'
    ).isNotValidEmail;
    this.isLoadingEmail = this.formService.getAllVariables(
      'log-reg'
    ).isLoadingEmail;
    this.isValidUserName = this.formService.getAllVariables(
      'log-reg'
    ).isValidUserName;
    this.isNotValidUserName = this.formService.getAllVariables(
      'log-reg'
    ).isNotValidUserName;
    this.isLoadingUserName = this.formService.getAllVariables(
      'log-reg'
    ).isLoadingUserName;
  }
}
