/***
 *     _______           _______ _________ _______  _______ 
 *    (  ____ \|\     /|(  ____ \\__   __/(  ____ \(       )
 *    | (    \/( \   / )| (    \/   ) (   | (    \/| () () |
 *    | (_____  \ (_) / | (_____    | |   | (__    | || || |
 *    (_____  )  \   /  (_____  )   | |   |  __)   | |(_)| |
 *          ) |   ) (         ) |   | |   | (      | |   | |
 *    /\____) |   | |   /\____) |   | |   | (____/\| )   ( |
 *    \_______)   \_/   \_______)   )_(   (_______/|/     \|
 *                                                          
 */


#include "Arduino.h"
#include "Fire_Free.h"
#include "ESP8266WiFi.h"
#include "TinyGPS++.h"

TinyGPSPlus _GPS;

Fire_Free::Fire_Free(char* ssid, char* password, char* host){

    // wifi and server credentials
    this->_ssid = ssid;
    this->_password = password;
    this->_host = host;

    // mq2 functions and variables
    this->_getting_R0_status = false;
    this->_number_of_sample = 1000;
    this->_duration_of_delay_MS = .1;
    this->_fresh_air_Rs_R0_ratio = 9.8;
    this->_RL = 10.0;
}

void Fire_Free::init(){

    this->connectToWiFi();

    Serial.print("calibrating MQ-2 for fresh air resistance");
    this->_R0 = this->get_R0();
    Serial.printf("\nFinal constant Air resistance is %f\n\n", this->_R0);
}

/***
 *             _________ _______ _________
 *    |\     /|\__   __/(  ____ \\__   __/
 *    | )   ( |   ) (   | (    \/   ) (   
 *    | | _ | |   | |   | (__       | |   
 *    | |( )| |   | |   |  __)      | |   
 *    | || || |   | |   | (         | |   
 *    | () () |___) (___| )      ___) (___
 *    (_______)\_______/|/       \_______/
 *                                        
 */

void Fire_Free::connectToWiFi(){
    Serial.printf("connecting to '%s'", this->_ssid);

    WiFi.begin(this->_ssid, this->_password);

    while (WiFi.status() != WL_CONNECTED)
    {
        delay(500);
        Serial.print(".");
        // WiFi.begin(this->_ssid, this->_password);
    }

    Serial.printf("\nconnected successfully!");
}

/***
 *     _______  _______  _______           _______  _______ 
 *    (  ____ \(  ____ \(  ____ )|\     /|(  ____ \(  ____ )
 *    | (    \/| (    \/| (    )|| )   ( || (    \/| (    )|
 *    | (_____ | (__    | (____)|| |   | || (__    | (____)|
 *    (_____  )|  __)   |     __)( (   ) )|  __)   |     __)
 *          ) || (      | (\ (    \ \_/ / | (      | (\ (   
 *    /\____) || (____/\| ) \ \__  \   /  | (____/\| ) \ \__
 *    \_______)(_______/|/   \__/   \_/   (_______/|/   \__/
 *                                                          
 */

void Fire_Free::sendToServer(String mq2, String gps){
    String data = "{\"mq2\": {" + mq2 + "}, " + "\"gps\": {" + gps + "}" + "\"}";

    Serial.printf("\n\nyour final data is: \n");
    Serial.println(data);
    Serial.println("ready to send to the server....");

    WiFiClient client;

    Serial.printf("connecting to server: '%s'\n", this->_host);

    if(client.connect(this->_host, 80)){
        Serial.printf("connected successfully to: '%s'\n", this->_host);
        Serial.printf("Sending data.....\n\n\n");

        client.println("POST /RklSRS1GUkVF HTTP/1.1");
        client.println(String("Host: ") + this->_host);
        client.println("Cache-Control: no-cache");
        client.println("Content-Type: application/x-www-form-urlencoded");
        client.println("Connection: close");
        client.print("Content-Length: ");
        client.println(data.length());
        client.println();
        client.println(data);
        Serial.println("Response:");

        while (client.connected() || client.available())
        {
            if (client.available())
            {
                String responses = client.readStringUntil('\n');
                if(responses == "200"){
                    Serial.println("data successfully send to server!");
                }else if(responses == "warning") {
                    this->soundBuzzer(1000, 5000);
                }
            }
        }

        client.stop();
        Serial.println("\ndisconnected from server");

    }else {
        Serial.println("sorry, connection failed!");
        client.stop();
    }
    delay(1000);
}

/***
 *     ______            _______  _______  _______  _______ 
 *    (  ___ \ |\     /|/ ___   )/ ___   )(  ____ \(  ____ )
 *    | (   ) )| )   ( |\/   )  |\/   )  || (    \/| (    )|
 *    | (__/ / | |   | |    /   )    /   )| (__    | (____)|
 *    |  __ (  | |   | |   /   /    /   / |  __)   |     __)
 *    | (  \ \ | |   | |  /   /    /   /  | (      | (\ (   
 *    | )___) )| (___) | /   (_/\ /   (_/\| (____/\| ) \ \__
 *    |/ \___/ (_______)(_______/(_______/(_______/|/   \__/
 *                                                          
 */

void Fire_Free::soundBuzzer(uint16_t frequency, uint16_t duration){
    tone(this->_buzzer_pin, frequency, duration);
}

/***
 *     _______  _______         _______ 
 *    (       )(  ___  )       / ___   )
 *    | () () || (   ) |       \/   )  |
 *    | || || || |   | | _____     /   )
 *    | |(_)| || |   | |(_____)  _/   / 
 *    | |   | || | /\| |        /   _/  
 *    | )   ( || (_\ \ |       (   (__/\
 *    |/     \|(____\/_)       \_______/
 *                                      
 */

bool Fire_Free::get_MQ2_digital(){
    if(digitalRead(this->_MQ2_Do_pin) == HIGH){
        return 1;
    }
    return 0;
}

float* Fire_Free::get_MQ2_analog(){
    static float mq2Data[8];

    float h2 = this->get_x(this->get_Rs(), this->_R0, this->get_b(5000, 0.46, this->get_m(200, 2.1, 10000, 0.33)), this->get_m(200, 2.1, 10000, 0.33));
    float lpg = this->get_x(this->get_Rs(), this->_R0, this->get_b(5000, 0.37, this->get_m(200, 1.6, 10000, 0.27)), this->get_m(200, 1.6, 10000, 0.27));
    float ch4 = this->get_x(this->get_Rs(), this->_R0, this->get_b(5000, 0.94, this->get_m(200, 3, 10000, 0.7)), this->get_m(200, 3, 10000, 0.7));
    float co = this->get_x(this->get_Rs(), this->_R0, this->get_b(5000, 1.8, this->get_m(200, 5.1, 10000, 1.35)), this->get_m(200, 5.1, 10000, 1.35));
    float alcohol = this->get_x(this->get_Rs(), this->_R0, this->get_b(5000, 0.85, this->get_m(200, 2.8, 10000, 0.65)), this->get_m(200, 2.8, 10000, 0.65));
    float smoke = this->get_x(this->get_Rs(), this->_R0, this->get_b(5000, 0.95, this->get_m(200, 3.4, 10000, 0.6)), this->get_m(200, 3.4, 10000, 0.6));
    float propane = this->get_x(this->get_Rs(), this->_R0, this->get_b(5000, 0.385, this->get_m(200, 1.7, 10000, 0.28)), this->get_m(200, 1.7, 10000, 0.28));
    float air = this->get_x(this->get_Rs(), this->_R0, this->get_b(5000, 9.8, this->get_m(200, 9.8, 10000, 9.8)), this->get_m(200, 9.8, 10000, 9.8));

    mq2Data[0] = h2;
    mq2Data[1] = lpg;
    mq2Data[2] = ch4;
    mq2Data[3] = co;
    mq2Data[4] = alcohol;
    mq2Data[5] = smoke;
    mq2Data[6] = propane;
    mq2Data[7] = air;

    return mq2Data;
}

String Fire_Free::get_MQ2_server(float* params){
    String data = "\"hydrogen\": \"" + String(params[0]) + "\", ";
    data += "\"lpg\": \"" + String(params[1]) + "\", ";
    data += "\"methane\": \"" + String(params[2]) + "\", ";
    data += "\"carbonMonoxide\": \"" + String(params[3]) + "\", ";
    data += "\"alcohol\": \"" + String(params[4]) + "\", ";
    data += "\"smoke\": \"" + String(params[5]) + "\", ";
    data += "\"propane\": \"" + String(params[6]) + "\", ";
    data += "\"air\": \"" + String(params[7]) + "\"";

    return data;
}

float Fire_Free::get_Rs(){
    float analogData = 0;
    for(uint16_t i = 0; i < this->_number_of_sample; i++){
        analogData += analogRead(this->_MQ2_Ao_pin);
        delay(this->_duration_of_delay_MS);
        if(this->_getting_R0_status){
            Serial.print(".");
        }
    }
    analogData = analogData / this->_number_of_sample;
    float vout = (analogData * 5) / 1023;
    // float vout = ((1023 - analogData)/analogData) * this->_RL;
    return (5 - vout) / vout;
}

float Fire_Free::get_R0(){
    float temp_R0 = 0;
    this->_getting_R0_status = true;
    temp_R0 = (this->get_Rs()) / this->_fresh_air_Rs_R0_ratio;
    this->_getting_R0_status = false;
    return temp_R0;
}

float Fire_Free::get_m(float x1, float y1, float x2, float y2){
    return (log(y2/y1))/(log(x2/x1));
}

float Fire_Free::get_b(float x, float y, float m){
    return log(y) - m * log(x);
}

float Fire_Free::get_x(float Rs, float Ro, float b, float m){
    return pow(10, ((log(Rs/Ro) - b) / m));
}

/***
 *     _______  _______  _______ 
 *    (  ____ \(  ____ )(  ____ \
 *    | (    \/| (    )|| (    \/
 *    | |      | (____)|| (_____ 
 *    | | ____ |  _____)(_____  )
 *    | | \_  )| (            ) |
 *    | (___) || )      /\____) |
 *    (_______)|/       \_______)
 *                               
 */

String Fire_Free::get_GPS_date(char data){
    String date = "";
    if(_GPS.date.isValid()){
        date += String(_GPS.date.day()) + String("-") + String(_GPS.date.month()) + String("-") + String(_GPS.date.year());
    }
    return date;
}

String Fire_Free::get_GPS_time(char data){
    String time = "";
    if(_GPS.time.isValid()){
        time += _GPS.time.hour() + 6 + String(":") + _GPS.time.minute() + String(":") + _GPS.time.second();
    }
    return time;
}

String Fire_Free::get_GPS_latitude(char data){
    String latitude = "";
    if(_GPS.location.isValid()){
        latitude += _GPS.location.lat();
    }
    return latitude;
}

String Fire_Free::get_GPS_longitude(char data){
    String longitude = "";
    if(_GPS.location.isValid()){
        longitude += _GPS.location.lng();
    }
    return longitude;
}

String Fire_Free::get_GPS_altitude(char data){
    String altitude = "";
    if(_GPS.location.isValid()){
        altitude += _GPS.altitude.meters();
    }
    return altitude;
}

String Fire_Free::get_GPS_data(char data){
    String specifiedData = "";
    if (_GPS.encode(data)){
        if(this->get_GPS_date(data) != "" && this->get_GPS_time(data) != "" && this->get_GPS_latitude(data) != "" && this->get_GPS_longitude(data) != "" && this->get_GPS_altitude(data) != ""){
            specifiedData += "\"date\": " + this->get_GPS_date(data);
            specifiedData += ", \"time\": " + this->get_GPS_time(data);
            specifiedData += ", \"latitude\": " + this->get_GPS_latitude(data);
            specifiedData += ", \"longitude\": " + this->get_GPS_longitude(data);
            specifiedData += ", \"altitude\": " + this->get_GPS_altitude(data);

            return specifiedData;
        }
    }

    return "";
}