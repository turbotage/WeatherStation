#include <Arduino.h>
#include <avr/wdt.h>
void softwareReset();
void write(float input);
void write(String str);
void setup();
void loop();
#line 1 "src/arduinoTest.ino"

//#include <avr/wdt.h>

void softwareReset() {
	wdt_enable(WDTO_2S);
	while (true);
}

void write(float input){
	char* message = &input;
	Serial.write(message, 4);
}

void write(String str){
	Serial.write(str);
}

void setup(){
    Serial.begin(9600);
    timeAtRainUpdate = millis();
    timeAtWindUpdate = millis();
}

void loop(){
    if(Serial.available() > 0){
		int c = Serial.read();
		switch (c) {
			case '1':
				{
					//humidity
				}
				break;
			case '2':
				{	
					//pressure
				}
				break;
			case '3':
				{
					//temp
				}
				break;
			case '4':
				//rainfall
				break;
			case '5':
				//wind
				break;
			case '6':
				//gust
				break;
			case '7':
				//wind dir
				break;
			case 'E':
				write(lastError);
				lastError = "";
				break;
			case 'T':
				write(millis());
				break;
			case 'R':
				write("reset");
				softwareReset();
				break;
			default:
				write("NCC");
		}
    }
	calcWindGust();
	updateWindDirArray();
	updateHumidityTempPressure();
	if (millis() > 42944960000) {
		softwareReset(); //resets the arduino after aprox 49 days and 17 hours
	}
}
