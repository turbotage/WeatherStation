#include <Wire.h>
#include <SPI.h>
#include <SoftwareSerial.h>
#include <avr\wdt.h>
#include "Adafruit_BME280.h"

#define GUST_TIME 5000

//Pins
#define PIN_ANEMOMETER 2  //Digital 2
#define PIN_RAINGAUGE 3 //Digital 3
#define PIN_DIRECTION A0 //Analog 5
#define BME_CS 10
#define BME_MOSI 11
#define BME_MISO 12
#define BME_SCK 13

#define SEALEVELPRESSURE_HPA (1013.25)

String lastError = "NO ERROR";

volatile long nextInteruptTime = 0;

//rain
volatile int numDropsRainGauge = 0;
volatile unsigned long timeAtRainUpdate = 0;
//wind
float currentWind;
volatile int numRevsAnemometer = 0;
volatile unsigned long timeAtWindUpdate = 0;

//wind gust
float highestGust = 0;
bool gustHasUpdated = false;
unsigned long timeAtLastGustUpdate = 0.0000001;
volatile int gustRevs = 0;

//wind dir
bool windDirHasUpdated = false;

bool humidityTemperaturePressureHasUpdated = false;
//humidity
int humidityCounter = 0;
float humidity = 0;
//temperature
int tempCounter = 0;
float temperature = 0;
//pressure
int pressureCounter = 0;
float pressure = 0;

Adafruit_BME280 bme(BME_CS, BME_MOSI, BME_MISO,  BME_SCK);

//=======================================================
// Interrupt handler for anemometer. Called each time the reed
// switch triggers (one revolution).
//=======================================================
void countAnemometer() {
    if(nextInteruptTime == 0 || nextInteruptTime < millis()){
        numRevsAnemometer++;
        gustRevs++;
        nextInteruptTime = millis() + 20; //this means that the windstation won't give accurate meassurments if wind speeds exceed 30 m/s;
    }
}
//=======================================================
// Interrupt handler for rain gauge. Called each time the reed
// switch triggers (one drop).
//=======================================================
void countRainGauge() {
	numDropsRainGauge++;
}
//=======================================================
// Calculate the wind speed, and display it (or log it, whatever).
// 1 rev/sec = 1.492 mph = 2.40114125 kph
//=======================================================

double calcWindSpeed() {
	double x = 0;
	x = 2.40114125*numRevsAnemometer/3.6;
	double timer = 0.00000001;
	timer += (millis() - timeAtWindUpdate)/1000; //seconds since last update
	x /= timer;
	numRevsAnemometer = 0;        // Reset counter
	timeAtWindUpdate = millis(); //set last update to now so next  wind callculation will be since this one
	if (x > 100 || x < 0) {
		return -1;
	}
	return x;
}
//=======================================================
// Calculate the rain , and display it (or log it, whatever).
// 1 bucket = 0.2794 mm
//=======================================================
double calcRainFall() {
	double x = 0;
	x = 0.2794*numDropsRainGauge; //get rainvolume since last measurement
	double timer = 0.00000001;
	timer += (millis() - timeAtRainUpdate)/1000; //get seconds since last raincallculation
	double rain = (3600 * x)/timer; //take volume per time and convert to right format (mm/h)
	numDropsRainGauge = 0;        // Reset counter
	timeAtRainUpdate = millis(); //set last update to now so next rain callculation will be since this one
	if (rain > 100 || rain < 0) {
		return -1;
	}
	return rain;
}

//===============================================================
//Calculate the max wind speed/gust
//===============================================================

void resetGust() {
	highestGust = 0;
	gustRevs = 0;
	timeAtLastGustUpdate = millis();
}

double calcWindGust(){
	unsigned long timer = millis() - timeAtLastGustUpdate;
	int timu = timer % 6000;
	if ((timu >= 0) && (timu <= 100)) {
		if (!gustHasUpdated) {
			gustHasUpdated = true;
			double currentGust = 0;
			currentGust = 2.40114125*gustRevs / 3.6;
			double deltaT = (timer / 1000) + 0.00000001;
			currentGust /= deltaT;
			gustRevs = 0;
			timeAtLastGustUpdate = timer;
			if (currentGust > 100 || currentGust < 0) {
				currentGust = -1;
			}
			if (currentGust > highestGust) {
				highestGust = currentGust;
			}
		}
	}
	else {
		gustHasUpdated = false;
	}
}

//=======================================================
// Find vane direction. dirDegrees[] values must be hardcoded, use directionTester.ino
//=======================================================
bool returnRange(int reading, int val) {
	if ((val + 4) >= reading  && reading >= (val - 4)) {
		return true;
	}
	return false;
}
//all wind dir things
int wind_dir_array[16];
String getWindDir() {
	String dirStrings[] = { "N", "NNO", "NO", "ONO", "O", "OSO", "SO", "SSO", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW" };
	int index = -1;
	int earlierNumber = 0;
	for (int i = 0; i < 16; ++i) {
		if (wind_dir_array[i] > earlierNumber) {
			earlierNumber = wind_dir_array[i];
			index = i;
		}
		wind_dir_array[i] = 0;
	}
	if (index == -1) {
		return "NO_DIR";
	}
	return dirStrings[index];
}

String calcWindDirOnce() {
	int reading = analogRead(PIN_DIRECTION);
	int dirValues[] = { 788, 407, 464, 83, 92, 65, 185, 126, 288, 245, 634, 603, 947, 830, 889, 706 };
	String dirStrings[] = { "N", "NNO", "NO", "ONO", "O", "OSO", "SO", "SSO", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW" };
	for (int i = 0; i < sizeof(dirValues) / sizeof(dirValues[0]); ++i) {
		if (returnRange(reading, dirValues[i])) {
			return dirStrings[i];
		}
	}
	return "ERROR";
}

String calcWindDir() {
	//values : 788, 408, 464, 83, 92, 65, 185, 126, 288, 245, 635, 603, 947, 830, 890, 704
	int reading = analogRead(PIN_DIRECTION);
	int dirValues[] = {788, 407, 464, 83, 92, 65, 185, 126, 288, 245, 634, 603, 947, 830, 889, 706};
	String dirStrings[] = { "N", "NNO", "NO", "ONO", "O", "OSO", "SO", "SSO", "S", "SSW", "SW", "WSW", "W", "WNW", "NW", "NNW" };
	for (int i = 0; i < sizeof(dirValues) / sizeof(dirValues[0]); ++i) {
		if (returnRange(reading, dirValues[i])) {
			wind_dir_array[i]++;
			return dirStrings[i];
		}
	}
	return "ERROR";
}

void updateWindDirArray() {
	unsigned long timu = millis() % 10000;
	if ((timu >= 0) && (timu <= 100)) {
		if (!windDirHasUpdated) {
			windDirHasUpdated = true;
			calcWindDir();
		}
	}
	else {
		windDirHasUpdated = false;
	}
}

void updateHumidityTempPressure() {
	unsigned long timu = millis() % 20000;
	if ((timu >= 0) && (timu <= 100)) {
		if (!humidityTemperaturePressureHasUpdated) {
			humidityTemperaturePressureHasUpdated = true;
			humidity += bme.readHumidity();
			humidityCounter++;
			pressure += bme.readPressure();
			pressureCounter++;
			temperature += bme.readTemperature();
			tempCounter++;
		}
	}
	else {
		humidityTemperaturePressureHasUpdated = false;
	}
}

void softwareReset() {
	wdt_enable(WDTO_2S);
	while (true);
	Serial.println("hello");
}

//setup
void setup(){
    Serial.begin(9600);
    pinMode(PIN_ANEMOMETER, INPUT);
    pinMode(PIN_RAINGAUGE, INPUT);
    pinMode(13, OUTPUT);
    digitalWrite(PIN_ANEMOMETER, HIGH);
    digitalWrite(PIN_RAINGAUGE, HIGH);
    attachInterrupt(digitalPinToInterrupt(PIN_ANEMOMETER), countAnemometer, FALLING);
    attachInterrupt(digitalPinToInterrupt(PIN_RAINGAUGE), countRainGauge, FALLING);
    timeAtRainUpdate = millis();
    timeAtWindUpdate = millis();
    if(!bme.begin()) {
		lastError = "NO BME280 SENSOR FOUND";
    }
}

void loop(){
    if(Serial.available() > 0){
		int c = Serial.read();
		switch (c) {
			case '1':
				{
					if (humidityCounter == 0) {
						Serial.println(bme.readHumidity());
					}
					else {
						float sender = humidity / humidityCounter;
						humidity = 0;
						humidityCounter = 0;
						Serial.println(sender);
					}
				}
				break;
			case '2':
				{	
					if (pressureCounter == 0) {
						Serial.println(bme.readPressure() / 100.0f);
					}
					else {
						float sender = pressure / pressureCounter;
						pressure = 0;
						pressureCounter = 0;
						Serial.println(sender / 100.0f);
					}
				}
				break;
			case '3':
				{
					if (tempCounter == 0) {
						Serial.println(bme.readTemperature());
					}
					else {
						float sender = temperature / tempCounter;
						temperature = 0;
						tempCounter = 0;
						Serial.println(sender);
					}
				}
				break;
			case '4':
				{
					String dir = getWindDir();
					if (dir == "NO_DIR") {
						dir = calcWindDirOnce();
					}
					Serial.println(dir);
				}
				break;
			case '5':
				currentWind = calcWindSpeed();
				Serial.println(currentWind);
				break;
			case '6':
				if (highestGust < currentWind) {
					highestGust = currentWind + currentWind*0.22; //if an error has occured the highest gust will probably be the upper standard deviation
				}
				Serial.println(highestGust);
				resetGust();
				break;
			case '7':
				Serial.println(calcRainFall());
				break;
			case 'E':
				Serial.println(lastError);
				lastError = "";
				break;
			case 'T':
				Serial.println(millis());
				break;
			case 'R':
				Serial.println("reset");
				softwareReset();
				break;
			default:
				Serial.println("NCC");
		}
    }
	calcWindGust();
	updateWindDirArray();
	updateHumidityTempPressure();
	if (millis() > 42944960000) {
		softwareReset(); //resets the arduino after aprox 49 days and 17 hours
	}
}
