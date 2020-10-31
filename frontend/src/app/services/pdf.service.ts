import { Injectable } from '@angular/core';
import pdfMake from 'pdfmake/build/pdfmake';
import pdfFonts from 'pdfmake/build/vfs_fonts';
import { environment } from 'src/environments/environment';
pdfMake.vfs = pdfFonts.pdfMake.vfs;

@Injectable({
  providedIn: 'root'
})
export class PdfService {

  private consumerImagePath: string;

  constructor() {
    this.consumerImagePath = environment.custom.PATH.CONSUMER_PATH;
  }

  private getBase64ImageFromURL(url) {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.setAttribute('crossOrigin', 'anonymous');

      img.onload = () => {
        const canvas = document.createElement('canvas');
        img.width = img.width;
        img.height = img.height;

        canvas.width = img.width;
        canvas.height = img.height;
        const ctx = canvas.getContext('2d');
        ctx.drawImage(img, 0, 0);

        const dataURL = canvas.toDataURL('image/png');

        resolve(dataURL);
      };

      img.onerror = error => {
        reject(error);
      };

      img.src = url;
    });
  }

  async generatePDF(notificationDatum: any) {
    let warningStyle = '';
    let warningState = '';
    let solvedHeader = '';
    let solvedBy = '';

    if (notificationDatum.hardwareState === 'warning') {
      warningStyle = 'warning';
      warningState = 'WARNING';
    } else {
      warningStyle = 'solved';
      warningState = 'SOLVED';
      solvedHeader = 'Solved By: ';
      solvedBy = notificationDatum.solvedBy;
    }
    const pdfDefinition =  {
        watermark: { text: 'RAFSUN', color: 'blue', opacity: 0.1, bold: true, italics: false },
        footer: {
            stack: [
              {
                text: 'Rafsun Jany Arman\n', alignment: 'right', fontSize: '14'},
              { text: 'Director of Bangladesh Fire Service and Civil Defence', alignment: 'right', fontSize: '10'}
            ],
            margin: [0, -30, 30, 0],
            alignment: 'left'
        },
      content: [
        {
          stack: [
            'It\'s a printed copy of the Fire-Free h/w project\'s cunsumer report',
            {
                text: [
                    {text: 'MAC Address: ', style: 'subheader'},
                    {text: `${notificationDatum.consumerData.macAddress}`, style: 'subheader2'}
                ]
            }
          ],
          style: 'header'
        },
        {
          alignment: 'justify',
          columns: [
                  {
                  image: await this.getBase64ImageFromURL(this.consumerImagePath + notificationDatum.consumerData.imagePath),
                  width: 100,
                  height: 100,
                  style: 'profile'
                },
            {
                text: []
            },
            {
                text: []
            },
                {
                    text: [
                      {text: 'State: ', style: 'fieldValue'},
                      {
                        text: `${warningState}\n`,
                        style: `${warningStyle}`
                      },
                      {text: `${notificationDatum.consumerData.consumerName}\n`, style: 'fieldValue'},
                      {text: `${notificationDatum.consumerData.email}\n`, style: 'email'},
                      {text: `${notificationDatum.consumerData.contactNumber}\n`, style: 'email'},
                      {
                        text: `${solvedHeader}`,
                        style: 'fieldValue'
                      },
                      {
                        text: `${solvedBy}`,
                        style: 'email'
                      }
                    ],
                    style: 'consumer',
                width: 'auto'
                }
          ]
        },
        {
            style: 'tableExample',
          table: {
            headerRows: 1,
            body: [
              [
                  {text: 'Hydrogen', style: 'tableHeader'},
                  {text: 'LPG', style: 'tableHeader'},
                  {text: 'Methane', style: 'tableHeader'},
                  {text: 'Carbonmonooxide', style: 'tableHeader'},
                  {text: 'Alcohol', style: 'tableHeader'},
                  {text: 'Smoke', style: 'tableHeader'},
                  {text: 'Propane', style: 'tableHeader'}
              ],
              [
                `${notificationDatum.hardwareData.mq2Data.hydrogen}`,
                `${notificationDatum.hardwareData.mq2Data.lpg}`,
                `${notificationDatum.hardwareData.mq2Data.methane}`,
                `${notificationDatum.hardwareData.mq2Data.carbonMonoxide}`,
                `${notificationDatum.hardwareData.mq2Data.alcohol}`,
                `${notificationDatum.hardwareData.mq2Data.smoke}`,
                `${notificationDatum.hardwareData.mq2Data.propane}`,
              ]
            ]
          },
          layout: 'lightHorizontalLines'
        }
      ],
      styles: {
        header: {
          fontSize: 18,
          bold: true,
          alignment: 'right',
          margin: [0, 190, 0, 60]
        },
        subheader: {
          fontSize: 10,
          bold: false
        },
        subheader2: {
          fontSize: 10,
          bold: false,
          italics: true
        },
        field: {
            fontSize: 12,
            bold: true
        },
        fieldValue: {
            fontSize: 12
        },
        profile: {
            margin: [0, 0, 0, 10]
        },
        consumer: {
            alignment: 'justify'
        },
        email: {
            italics: true
        },
        emailServed: {
            decoration: ['underline']
        },
        underline: {
            decoration: ['underline']
        },
        tableExample: {
          margin: [15, 50, 0, 15]
        },
        tableHeader: {
          bold: true,
          fontSize: 13,
          color: 'black'
        },
        warning: {
            color: 'red'
        },
        solved: {
            color: 'green'
        }
      }
    };

    pdfMake.createPdf(pdfDefinition).download('fire-free', () => {
      // console.log('res');
    });
  }
}
