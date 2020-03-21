#include<Fire_Free.h>
#include<SoftwareSerial.h>

Fire_Free fire_free("Rafsun", "01711067", "203.112.209.148");

String GPS_DATA = "";

uint8_t _NEO6M_Tx_pin = 4;
uint8_t _NEO6M_Rx_pin = 5;
uint8_t _MQ2_Do_pin = 16;
uint8_t _MQ2_Ao_pin = A0;
uint8_t _buzzer_pin = 15;

SoftwareSerial gps(_NEO6M_Tx_pin, _NEO6M_Rx_pin);

void setup(){
    Serial.begin(115200);
    gps.begin(9600);

    pinMode(_MQ2_Do_pin, INPUT);
    pinMode(_MQ2_Ao_pin, INPUT);

    pinMode(_buzzer_pin, OUTPUT);

    fire_free.init();
}

void loop(){
    while(gps.available() > 0){
        GPS_DATA = fire_free.get_GPS_data(gps.read());
    }
    if(GPS_DATA != ""){
        fire_free.sendToServer(fire_free.get_MQ2_server(fire_free.get_MQ2_analog()), GPS_DATA);
    }
}