export class RegularExpressionList {
    static regExp = {
        // tslint:disable-next-line: max-line-length
        email: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
        userName: /^[A-Z][a-zA-Z0-9_]{4,24}$/,
        image: /[\s\S]{1,50}\.(png|jpg|jpeg|PNG|JPG|JPEG)$/
    };
}
