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
