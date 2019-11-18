#include <math.h>

unsigned long startTime = 0;
unsigned long endTime = 0;

long readVcc() {
	long result;
	// Read 1.1V reference against AVcc
	ADMUX = _BV(REFS0) | _BV(MUX3) | _BV(MUX2) | _BV(MUX1);
	delay(2); // Wait for Vref to settle
	ADCSRA |= _BV(ADSC); // Convert
	while (bit_is_set(ADCSRA,ADSC));
	result = ADCL;
	result |= ADCH<<8;
	result = 1126400L / result; // Back-calculate AVcc in mV
	return result;
}

float updateWindGust(unsigned int revsSinceLastUpdate) {
	float c = 2;
	for (int i = 0; i < 2; ++i){
		for(int j = 0; j < revsSinceLastUpdate; ++j) {
			c += (revsSinceLastUpdate % j) + sin(j);
		}
	}
	c += readVcc();
	return c;
}

void setup() {
	// put your setup code here, to run once:
	Serial.begin(9600);
}


void loop() {
	if (Serial.available() > 0) {
		int c = Serial.read();
		if (c == '1') {
			startTime = micros();
			// STARTS
			float b = updateWindGust(15);
			float d = updateWindGust(15);
      		b = b + d;
			Serial.println(b);
			// ENDS
			endTime = micros();
			Serial.println(endTime - startTime);
		}
	}
}
