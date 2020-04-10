import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RegularExpressionList } from 'src/app/shared/validator';
import { FormService } from 'src/app/services/form.service';
import { FormDataFormatter } from 'src/app/shared/formDataFormatter';
import { Router } from '@angular/router';

@Component({
  selector: 'app-registration',
  templateUrl: './registration.page.html',
  styleUrls: ['./registration.page.scss'],
})
export class RegistrationPage implements OnInit, OnDestroy {

  isValidEmail: boolean;
  isNotValidEmail: boolean;
  isLoadingEmail: boolean;

  isValidConsumerName: boolean;
  isNotValidConsumerName: boolean;
  isLoadingConsumerName: boolean;

  isValidMACAddress: boolean;
  isNotValidMACAddress: boolean;
  isLoadingMACAddress: boolean;

  isValidContactNumber: boolean;
  isNotValidContactNumber: boolean;
  isLoadingContactNumber: boolean;

  private consumerImage: FileList;

 registrationForm = this.formBuilder.group({
  consumerName: ['', [Validators.required, Validators.pattern(RegularExpressionList.regExp.consumerName)]],
  email: ['', [Validators.required, Validators.pattern(RegularExpressionList.regExp.email)]],
  contactNumber: ['', [Validators.required, Validators.pattern(RegularExpressionList.regExp.contactNumber)]],
  macAddress: ['', [Validators.required, Validators.pattern(RegularExpressionList.regExp.macAddress)]],
  profile: ['', [Validators.required, Validators.pattern(RegularExpressionList.regExp.image)]]
});

  constructor(
    private formBuilder: FormBuilder,
    private formService: FormService
  ) {
    this.isValidEmail = false;
    this.isNotValidEmail = false;
    this.isLoadingEmail = false;

    this.isValidConsumerName = false;
    this.isNotValidConsumerName = false;
    this.isLoadingConsumerName = false;

    this.isValidMACAddress = false;
    this.isNotValidMACAddress = false;
    this.isLoadingMACAddress = false;

    this.isValidContactNumber = false;
    this.isNotValidContactNumber = false;
    this.isLoadingContactNumber = false;
  }

  ngOnInit() {
  }

  public checkRegistration() {
    this.formService.formHandler(new FormDataFormatter(this.registrationForm, this.consumerImage, 'consumerReg', true));
    this.formService.isRedirect.subscribe(isRedirect => {
      if (!isRedirect) {
        this.isValidMACAddress = false;
        this.isNotValidMACAddress = true;
        this.isLoadingMACAddress = false;
      }
    });
  }

  set setImage(event: any) {
    if (event.target.files.length > 0) {
      this.consumerImage = event.target.files;
    } else {
      this.consumerImage = null;
    }
  }

  get setImage() {
    return this.consumerImage;
  }

  public focused(valueType: string, value: string) {
    this.formService.focused(valueType, value);

    this.isValidEmail = this.formService.getAllVariables('consumerReg').isValidEmail;
    this.isNotValidEmail = this.formService.getAllVariables('consumerReg').isNotValidEmail;
    this.isLoadingEmail = this.formService.getAllVariables('consumerReg').isLoadingEmail;

    this.isValidConsumerName = this.formService.getAllVariables('consumerReg').isValidConsumerName;
    this.isNotValidConsumerName = this.formService.getAllVariables('consumerReg').isNotValidConsumerName;
    this.isLoadingConsumerName = this.formService.getAllVariables('consumerReg').isLoadingConsumerName;

    this.isValidContactNumber = this.formService.getAllVariables('consumerReg').isValidContactNumber;
    this.isNotValidContactNumber = this.formService.getAllVariables('consumerReg').isNotValidContactNumber;
    this.isLoadingContactNumber = this.formService.getAllVariables('consumerReg').isLoadingContactNumber;

    this.isValidMACAddress = this.formService.getAllVariables('consumerReg').isValidMACAddress;
    this.isNotValidMACAddress = this.formService.getAllVariables('consumerReg').isNotValidMACAddress;
    this.isLoadingMACAddress = this.formService.getAllVariables('consumerReg').isLoadingMACAddress;
  }

  public notFocused(valueType: string, value: string) {
    this.formService.notFocused(valueType, value);

    this.isValidEmail = this.formService.getAllVariables('consumerReg').isValidEmail;
    this.isNotValidEmail = this.formService.getAllVariables('consumerReg').isNotValidEmail;
    this.isLoadingEmail = this.formService.getAllVariables('consumerReg').isLoadingEmail;

    this.isValidConsumerName = this.formService.getAllVariables('consumerReg').isValidConsumerName;
    this.isNotValidConsumerName = this.formService.getAllVariables('consumerReg').isNotValidConsumerName;
    this.isLoadingConsumerName = this.formService.getAllVariables('consumerReg').isLoadingConsumerName;

    this.isValidContactNumber = this.formService.getAllVariables('consumerReg').isValidContactNumber;
    this.isNotValidContactNumber = this.formService.getAllVariables('consumerReg').isNotValidContactNumber;
    this.isLoadingContactNumber = this.formService.getAllVariables('consumerReg').isLoadingContactNumber;

    this.isValidMACAddress = this.formService.getAllVariables('consumerReg').isValidMACAddress;
    this.isNotValidMACAddress = this.formService.getAllVariables('consumerReg').isNotValidMACAddress;
    this.isLoadingMACAddress = this.formService.getAllVariables('consumerReg').isLoadingMACAddress;
  }

  ngOnDestroy() {
    this.formService.resetAllValidators();
    this.registrationForm.reset();
  }
}
