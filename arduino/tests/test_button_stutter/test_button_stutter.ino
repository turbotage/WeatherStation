#define PIN_ANEMOMETER 2
#define PIN_RAINGAUGE 3

volatile unsigned long currentAnemometerTime = 0;
volatile unsigned long lastAnemometerTime = 0;
volatile unsigned long anemometerTimeDifference = 0;
volatile bool newAnemometerTimeDifference = false;

volatile unsigned long currentRaingaugeTime = 0;
volatile unsigned long lastRainGaugeTime = 0;
volatile unsigned long raingaugeTimeDifference = 0;
volatile bool newRaingaugeTimeDifference = false;

//=======================================================
// Interrupt handler for anemometer. Called each time the reed
// switch triggers (one revolution). won't work if windspeed exceed 166,7430555556 m/s
//=======================================================
void countAnemometer() {
	currentAnemometerTime = micros();
	anemometerTimeDifference = currentAnemometerTime - lastAnemometerTime;
	lastAnemometerTime = currentAnemometerTime;
	newAnemometerTimeDifference = true;
}

//=======================================================
// Interrupt handler for rain gauge. Called each time the reed
// switch triggers (one drop).
//=======================================================
void countRainGauge() {
	currentRaingaugeTime = micros();
	raingaugeTimeDifference = currentRaingaugeTime - lastRainGaugeTime;
	lastRainGaugeTime = currentRaingaugeTime;
	newTimeDifference = true;
}

void setup() {
	// put your setup code here, to run once:
	Serial.begin(9600);
	pinMode(PIN_ANEMOMETER, INPUT);
	pinMode(PIN_RAINGAUGE, INPUT);
	digitalWrite(PIN_ANEMOMETER, HIGH);
	digitalWrite(PIN_RAINGAUGE, HIGH);
	attachInterrupt(digitalPinToInterrupt(PIN_ANEMOMETER), countAnemometer, FALLING);
	attachInterrupt(digitalPinToInterrupt(PIN_RAINGAUGE), countRainGauge, FALLING);
}

void loop() {
	if (newAnemometerTimeDifference) {
		Serial.println(anemometerTimeDifference);
		newAnemometerTimeDifference = false;
	}
	if (newRaingaugeTimeDifference) {
		Serial.println(raingaugeTimeDifference);
		newRaingaugeTimeDifference = false;
	}
}