
#define PIN_DIRECTION A0 


unsigned int ADCValue;
double Voltage;
double Vcc;

String dir[16] = {"N","NNW","NW","ENE","E","ESE","SE","SSE","S","SSW","SW","WSW","W","WNW","NW","NNW"};
double volts[16] = {1.0408,0.7648,1.5152,1.3167,3.1272,2.9819,4.5939,4.0469,4.3277,3.4612,3.8485,2.0719,2.3284,0.5664,0.6099,0.4841};

void setup() {
  // put your setup code here, to run once:
  Serial.begin(9600);
}

bool inIntervall(double reading, int i) {
  if ( (volts[i]*0.975 < reading) && (reading < volts[i]*1.025) ) {
    return true;
  }
  return false;
}

void loop() {
  // put your main code here, to run repeatedly:
  delay(500);
  
  Vcc = readVcc()/1000.0;
  ADCValue = analogRead(PIN_DIRECTION);
  Voltage = (ADCValue / 1024.0) * Vcc;
  
  for (int i = 0; i < 16; ++i) {
    if (inIntervall(Voltage,i)) {
      //Serial.println(volts[i]);
      Serial.println(dir[i]);
    }
  }
  Serial.println("BAR");
  
  //Serial.println(Voltage, 4);
}
