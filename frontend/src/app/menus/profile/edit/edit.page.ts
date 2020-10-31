import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { RegularExpressionList } from 'src/app/shared/validator';
import { ToastController } from '@ionic/angular';
import { FormService } from 'src/app/services/form.service';
import { FormDataFormatter } from 'src/app/shared/formDataFormatter';
import { ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'app-edit',
  templateUrl: './edit.page.html',
  styleUrls: ['./edit.page.scss'],
})
export class EditPage implements OnInit, OnDestroy {
  private profilePhoto;

  isValidUserName: boolean;
  isNotValidUserName: boolean;
  isLoadingUserName: boolean;

  isValidContactNumber: boolean;
  isNotValidContactNumber: boolean;
  isLoadingContactNumber: boolean;

  defaultImagePath: string;
  isDefault: boolean;

  imagePath: string;
  adminEmail: string;

  addImageForm = this.formBuilder.group({
    image: [
      '',
      [
        Validators.required,
        Validators.pattern(RegularExpressionList.regExp.image),
      ],
    ],
  });

  adminForm = this.formBuilder.group({
    userName: [
      '',
      [
        Validators.required,
        Validators.pattern(RegularExpressionList.regExp.userName),
      ],
    ],
    gender: ['', [Validators.required]],
    contactNumber: [
      '',
      [
        Validators.required,
        Validators.pattern(RegularExpressionList.regExp.contactNumber),
      ],
    ],
    designation: ['', [Validators.required]],
    branch: ['', [Validators.required]],
  });

  constructor(
    private formBuilder: FormBuilder,
    private toastConroller: ToastController,
    private formService: FormService,
    private activatedRoute: ActivatedRoute
  ) {
    this.profilePhoto = 'default';
    this.defaultImagePath = environment.custom.PATH.ADMIN_PATH;
    this.isDefault = false;
    this.formService.resetAllValidators();
  }

  ngOnDestroy(): void {
    this.formService.resetAllValidators();
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params) => {
      const parsedAdminData = JSON.parse(params.adminData);
      if (Object.keys(parsedAdminData).length > 0) {
        this.adminForm.get('userName').setValue(parsedAdminData.username);
        this.adminForm.get('gender').setValue(parsedAdminData.gender);
        this.adminForm
          .get('contactNumber')
          .setValue(parsedAdminData.contactNumber);
        this.adminForm.get('branch').setValue(parsedAdminData.branch);
        this.adminForm.get('designation').setValue(parsedAdminData.designation);
      }
      if (parsedAdminData.imagePath === 'default') {
        this.isDefault = true;
      } else {
        this.isDefault = false;
        this.imagePath = parsedAdminData.imagePath;
        this.profilePhoto = parsedAdminData.imagePath;
      }
      this.adminEmail = parsedAdminData.email;
    });
  }

  addImage() {
    document.getElementById('addImage').click();
  }

  discardImage() {
    document
      .getElementById('profileEdit')
      .setAttribute('src', '../../../assets/icon/profile-2.png');
    this.profilePhoto = 'default';
  }

  updateAdmin() {
    this.formService.userEmail = this.adminEmail;
    this.formService.formHandler(
      new FormDataFormatter(this.adminForm, this.profilePhoto, 'admin', true)
    );
  }

  setImages(event: any) {
    const preview = document.getElementById('profileEdit');
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      preview.setAttribute('src', reader.result.toString());
    };

    if (this.addImageForm.status === 'VALID') {
      reader.readAsDataURL(file);
      this.profilePhoto = event.target.files;
    } else {
      preview.setAttribute('src', '../../../assets/icon/profile-2.png');
      this.showToast();
    }
  }

  async showToast() {
    const toast = await this.toastConroller.create({
      message: 'Image format is INVALID!',
      duration: 1500,
    });
    toast.present();
  }

  focused(valueType: string, value: string) {
    this.formService.focused(valueType, value);

    this.isValidUserName = this.formService.getAllVariables(
      'admin'
    ).isValidUserName;
    this.isNotValidUserName = this.formService.getAllVariables(
      'admin'
    ).isNotValidUserName;
    this.isLoadingUserName = this.formService.getAllVariables(
      'admin'
    ).isLoadingUserName;

    this.isValidContactNumber = this.formService.getAllVariables(
      'admin'
    ).isValidContactNumber;
    this.isNotValidContactNumber = this.formService.getAllVariables(
      'admin'
    ).isNotValidContactNumber;
    this.isLoadingContactNumber = this.formService.getAllVariables(
      'admin'
    ).isLoadingContactNumber;
  }
  
  notFocused(valueType: string, value: string) {
    this.formService.notFocused(valueType, value);

    this.isValidUserName = this.formService.getAllVariables(
      'admin'
    ).isValidUserName;
    this.isNotValidUserName = this.formService.getAllVariables(
      'admin'
    ).isNotValidUserName;
    this.isLoadingUserName = this.formService.getAllVariables(
      'admin'
    ).isLoadingUserName;

    this.isValidContactNumber = this.formService.getAllVariables(
      'admin'
    ).isValidContactNumber;
    this.isNotValidContactNumber = this.formService.getAllVariables(
      'admin'
    ).isNotValidContactNumber;
    this.isLoadingContactNumber = this.formService.getAllVariables(
      'admin'
    ).isLoadingContactNumber;
  }
}
