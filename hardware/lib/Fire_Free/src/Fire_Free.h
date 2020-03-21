#ifndef Fire_Free_h
#define Fire_Free_h
#include "Arduino.h"

class Fire_Free
{
private:
    // server and WiFi credentials
    char* _ssid;
    char* _password;
    char* _host;
    void connectToWiFi();

    uint8_t _NEO6M_Tx_pin = 4;
    uint8_t _NEO6M_Rx_pin = 5;
    uint8_t _MQ2_Do_pin = 16;
    uint8_t _MQ2_Ao_pin = A0;
    uint8_t _buzzer_pin = 15;

    // mq2 functions and variables
    uint16_t _number_of_sample;
    uint16_t _duration_of_delay_MS;
    float _fresh_air_Rs_R0_ratio;

    bool _getting_R0_status;

    float _RL;
    float _R0;
    float _Rs;
    float get_Rs();
    float get_R0();
    float get_m(float x1, float y1, float x2, float y2);
    float get_b(float x, float y, float m);
    float get_x(float Rs, float Ro, float b, float m);

    // gps functions and variables

    String get_GPS_date(char data);
    String get_GPS_time(char data);
    String get_GPS_latitude(char data);
    String get_GPS_longitude(char data);
    String get_GPS_altitude(char data);

    
public:
    Fire_Free(char* ssid, char* password, char* host);
    void init();
    void sendToServer(String mq2, String gps);

    void soundBuzzer(uint16_t frequency, uint16_t duration);

    bool get_MQ2_digital();
    float* get_MQ2_analog();
    String get_MQ2_server(float* params);

    String get_GPS_data(char data);
};

#endif