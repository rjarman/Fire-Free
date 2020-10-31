export class FormDataFormatter {
  textData: any;
  imageData: any;
  formType: string;
  hasImage: boolean;

  constructor(
    textData: any,
    imageData: any,
    formType: string,
    hasImage: boolean
  ) {
    this.textData = textData;
    this.imageData = imageData;
    this.formType = formType;
    this.hasImage = hasImage;
  }
}

export interface CommonValues {
  event: any;
  popoverType: string;
}

export class Popover<PopoverType> {
  popoverData: PopoverType;

  constructor(popoverData: PopoverType) {
    this.popoverData = popoverData;
  }
}

export class RegularExpressionList {
  static regExp = {
    // tslint:disable-next-line: max-line-length
    email: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
    userName: /^[A-Z][a-zA-Z0-9_ ]{4,24}$/,
    image: /[\s\S]{1,50}\.(png|jpg|jpeg|PNG|JPG|JPEG)$/,
    consumerName: /^[A-Z][a-zA-Z. ]{4,24}$/,
    contactNumber: /^([+])(8801)(3|4|5|6|7|8|9)([1-9]){8}$/,
    macAddress: /(([0-9A-Fa-f]{2}[-:]){5}[0-9A-Fa-f]{2})|(([0-9A-Fa-f]{4}\.){2}[0-9A-Fa-f]{4})$/,
  };
}

export interface AdminDatum {
  imagePath: string;
  username: string;
  email: string;
  branch: string;
  contactNumber: string;
  designation: string;
  gender: string;
}

export interface ConsumerDatum {
  imagePath: string;
  consumerName: string;
  email: string;
  contactNumber: string;
  macAddress: string;
  servedBy: string;
}

interface GPSData {
  date: string;
  time: string;
  latitude: string;
  longitude: string;
  altitude: string;
}

interface MQ2Data {
  hydrogen: string;
  lpg: string;
  methane: string;
  carbonMonoxide: string;
  alcohol: string;
  smoke: string;
  propane: string;
  air: string;
}

export interface HardwareData {
  mq2: MQ2Data;
  gps: GPSData;
}

export interface NotificationDatum {
  hardwareState: string;
  solvedBy: string;
  consumerData: ConsumerDatum;
  hardwareData: HardwareData;
}

export class ViewerDataFormatter<Interface> {
  viewerData: Interface;
  constructor(viewerData: Interface) {
    this.viewerData = viewerData;
  }
}
