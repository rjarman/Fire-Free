export class FormDataFormatter {
    textData: any;
    imageData: any;
    formType: string;
    hasImage: boolean;

    constructor(textData: any, imageData: any, formType: string, hasImage: boolean) {
        this.textData = textData;
        this.imageData = imageData;
        this.formType = formType;
        this.hasImage = hasImage;
    }
}

