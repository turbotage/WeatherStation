//#include <avr\wdt.h>¨
//#include "/Applications/Arduino.app/Contents/Java/hardware/tools/avr/avr/include/avr/wdt.h"
#include <avr/wdt.h>
#include "raingauge.h"
#include "anemometer.h"
#include "windvane.h"
#include "bme280.h"


WindVane vane;
Anemometer anemometer;
RainGauge raingauge;


BME280 bme;


unsigned int loopTime = 0;
unsigned int highestLoopTime = 0;

volatile unsigned long lastAnemometerTime = 0;
volatile unsigned long lastRaingaugeTime = 0;

volatile unsigned int gustRevsSinceLastUpdate = 0;
volatile unsigned int windSpeedRevs = 0;

volatile unsigned int numRainDrops = 0;

//=======================================================
// Interrupt handler for anemometer. Called each time the reed
// switch triggers (one revolution). won't work if windspeed exceed 166,7430555556 m/s
//=======================================================
void countAnemometer() {
    if(lastRaingaugeTime == 0 || ((unsigned long)(millis() - lastAnemometerTime) > 4)){
        ++windSpeedRevs;
		++gustRevsSinceLastUpdate;
        lastAnemometerTime = millis();
    }
}
//=======================================================
// Interrupt handler for rain gauge. Called each time the reed
// switch triggers (one drop).
//=======================================================
void countRainGauge() {
	if (lastRaingaugeTime == 0 || ((unsigned long)(millis() - lastRaingaugeTime) > 20)) {
    	++numRainDrops;
		lastRaingaugeTime = millis();
	}
}

void softwareReset() {
	wdt_enable(WDTO_2S);
	while (true);
}

void onLoop() {
	anemometer.updateWindGust(gustRevsSinceLastUpdate);
	gustRevsSinceLastUpdate = 0;
	vane.updateWindDirection(); //
	bme.updateHumidityTempPressure(); //will do something every BME_UPDATE_TIME milliseconds
}


void handleComms() {
	if(Serial.available() > 0){
		int c = Serial.read();
		switch (c) {
			case '1':
				Serial.println(bme.getHumidity());
				break;
			case '2':
				Serial.println(bme.getPressure());
				break;
			case '3':
				Serial.println(bme.getTemperature());
				break;
			case '4':
				Serial.println(vane.getWindDirection());
				break;
			case '5':
				Serial.println(anemometer.getWindSpeed(windSpeedRevs));
				windSpeedRevs = 0;
				break;
			case '6':
				Serial.println(anemometer.getGust());
				break;
			case '7':
				Serial.println(raingauge.getRainFall(numRainDrops));
				numRainDrops = 0;
				break;
			case 'E':
				Serial.println("not implemented yet");
				break;
			case 'T':
				Serial.println(millis());
				break;
			case 'L':
				Serial.println(highestLoopTime);
				highestLoopTime = 0;
				break;
			case 'M':
				Serial.println("not implemented yet");
				break;
			case 'R':
				Serial.println("Reseting");
				softwareReset();
				break;
			default:
				Serial.println("NCC");
		}
  	}
}

//setup
void setup(){
	Serial.begin(9600);
	pinMode(PIN_ANEMOMETER, INPUT);
	pinMode(PIN_RAINGAUGE, INPUT);

	digitalWrite(PIN_ANEMOMETER, HIGH);
	digitalWrite(PIN_RAINGAUGE, HIGH);
	
	attachInterrupt(digitalPinToInterrupt(PIN_ANEMOMETER), countAnemometer, FALLING);
	attachInterrupt(digitalPinToInterrupt(PIN_RAINGAUGE), countRainGauge, FALLING);
	
	bme.setup();
  	anemometer.setup();
  	raingauge.setup();

}

void loop(){
	loopTime = micros();
  	handleComms();
	onLoop();
	loopTime = (unsigned long)(micros()- loopTime);
	if (loopTime > highestLoopTime){
		highestLoopTime = loopTime;
	}
}
