#include <avr\wdt.h>
#include <Wire.h>
#include <SPI.h>
#include <SoftwareSerial.h>
#include "../lib/Adafruit_BME280/Adafruit_BME280.h"

#define GUST_TIME 5000

//Pins
#define PIN_ANEMOMETER 2  //Digital 2
#define PIN_RAINGAUGE 3 //Digital 3
#define PIN_DIRECTION A0 //Analog 0  
#define BME_CS 10
#define BME_MOSI 11
#define BME_MISO 12
#define BME_SCK 13

#define SEALEVELPRESSURE_HPA (1013.25)

String lastError = "NO ERROR";
String message = "";
String lastWindDir;
bool debug = false;

volatile long nextInteruptTime = 0;

//rain
volatile int numDropsRainGauge = 0;
unsigned long timeAtRainUpdate = 0;
//wind
float currentWind = 0;
volatile int numRevsAnemometer = 0;
unsigned long timeAtWindUpdate = 0;

//wind gust
float highestGust = 0;
bool gustHasUpdated = false;
unsigned long timeAtLastGustUpdate = 0;
volatile int gustRevs[4];
int gustPeriodCounter = 0;

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
        ++numRevsAnemometer;
        ++gustRevs[0];
        ++gustRevs[1];
        ++gustRevs[2];
        ++gustRevs[3];
        nextInteruptTime = millis() + 20; //this means that the windstation won't give accurate meassurments if wind speeds exceed 50 m/s;
    }
}
//=======================================================
// Interrupt handler for rain gauge. Called each time the reed
// switch triggers (one drop).
//=======================================================
void countRainGauge() {
	numDropsRainGauge++;
}

void addMessage(const char* m){
	message += m;
}

//=======================================================
// Calculate the wind speed, and display it (or log it, whatever).
// 1 rev/sec = 1.492 mph = 2.40114125 kph
//=======================================================
float calcWindSpeed() {
	float x = 0;
	unsigned int num = numRevsAnemometer;
	x = 2.40114125*num/3.6;
	float timer = 0.00000001;
	timer += (millis() - timeAtWindUpdate)/1000; //seconds since last update
	x /= timer;
	if(debug){
		Serial.print("numRevsAnemometer: ");
		Serial.println(numDropsRainGauge);
		Serial.print("time since last calcWindSpeed() : ");
		Serial.println(timer);
	}
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
float calcRainFall() {
	float x = 0;
	unsigned int num = numDropsRainGauge; //get rainvolume since last measurement
	x = 0.2794*num;
	float timer = 0.00000001;
	timer += (millis() - timeAtRainUpdate)/1000; //get seconds since last raincallculation
	float rain = (3600 * x)/timer; //take volume per time and convert to right format (mm/h)
	if(debug){
		Serial.print("numDropsRainGauge: ");
		Serial.println(num);
		Serial.print("time since last calcRainFall() : ");
		Serial.println(timer);
	}
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
void calcWindGust(){
  unsigned long timer = millis() - timeAtLastGustUpdate;
  int timu = timer % 500;
  if ((timu >= 0) && (timu <= 40)) {
    if(!gustHasUpdated){
      gustHasUpdated = true;
      float currentGust = 0.0f;
      int num = gustRevs[gustNumCounter];
      currentGust = 2.40114124f * num / 3.6f;
      float deltaT = (timer / 1000) + 0.000001f;
      currentGust /= deltaT;
      if(currentGust > 100 || currentGust < 0){
        currentGust = -1;
      }
      if(currentGust > highestGust) {
        highestGust = currentGust;
      }
      
      gustRevs[gustNumCounter] = 0;
      ++gustNumCounter;
      if(gustNumCounter == 4){
      	gustNumCounter = 0;
      }
      timeAtLastGustUpdate = timer;
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
	String str1 = "CALCINDIR ERROR, reading, " + String(reading) + "; ";
	addMessage(str1.c_str());
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

void resetWindDirArray(){
  for(int i = 0; i < 16; ++i){
    wind_dir_array[i] = 0;
  }
}

void updateWindDirArray() {
	unsigned long timu = millis() % 3000;
	if ((timu >= 0) && (timu <= 50)) {
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
	unsigned long timu = millis() % 10000;
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
	  //attachInterrupt(0, countAnemometer, FALLING);
    //attachInterrupt(1, countRainGauge, FALLING);
    timeAtRainUpdate = millis();
    timeAtWindUpdate = millis();
    if(!bme.begin()) {
		  lastError = "NO BME280 SENSOR FOUND";
    }
	  delay(10000);
	  currentWind = calcWindSpeed();
}

void loop(){
    if(Serial.available() > 0){
		int c = Serial.read();
		switch (c) {
			case '1':
				{
					if (debug){
						Serial.println(bme.readHumidity());
					}
					else if (humidityCounter == 0) {
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
					if (debug){
						Serial.println(bme.readPressure() / 100.0f);
					}
					else if (pressureCounter == 0) {
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
					if (debug){
						Serial.println(bme.readTemperature());
					}
					else if (tempCounter == 0) {
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
					if(debug){
						Serial.println(calcWindDirOnce());
					}
					else {
						String dir = getWindDir();
						if (dir == "NO_DIR") {
							dir = calcWindDirOnce();
							if(dir == "ERROR"){
								dir = lastWindDir;
							}
						}
						lastWindDir = dir;
           					resetWindDirArray();
						Serial.println(dir);
					}
				}
				break;
			case '5':
				currentWind = calcWindSpeed();
				Serial.println(currentWind);
				break;
			case '6':
				if (highestGust < currentWind) {
					highestGust = currentWind + currentWind*0.22; //if an error has occured the highest gust will probably be the upper standard deviation
					addMessage("WARNING 6; ");
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
			case 'M':
				Serial.println(message);
				message = "";
				break;
			case 'R':
				Serial.println("Reseting");
				softwareReset();
				break;
			case 'D':
				if(debug){
					Serial.println("turned off debug mode");
				}
				else {
					Serial.println("turned on debug mode");
				}
				debug = !debug;
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
