
#include "../lib/Adafruit_BME280/Adafruit_BME280.h"

#define BME_UPDATE_TIME 10000

//Pins
#define BME_CS 10
#define BME_MOSI 11
#define BME_MISO 12
#define BME_SCK 13

#define SEALEVELPRESSURE_HPA (1013.25)


class BME280 {
private:
    Adafruit_BME280 bme;

    bool m_HasUpdated = false;
    
    //humidity
    int m_HumidityCounter = 0;
    float m_Humidity = 0;
    //temperature
    int m_TemperatureCounter = 0;
    float m_Temperature = 0;
    //pressure
    int m_PressureCounter = 0;
    float m_Pressure = 0;
public:

    BME280() 
    : bme(BME_CS, BME_MOSI, BME_MISO, BME_SCK)
    {

    }

    bool setup() {
        if(!bme.begin()) {
            return false;
        }
        return true;
    }

    void updateHumidityTempPressure() {
        unsigned long timu = millis() % BME_UPDATE_TIME;
        if ((timu >= 0) && (timu <= 40)) {
            if (!m_HasUpdated) {
                m_HasUpdated = true;
                m_Humidity += bme.readHumidity();
                ++m_HumidityCounter;
                m_Pressure += bme.readPressure();
                ++m_PressureCounter;
                m_Temperature += bme.readTemperature();
                ++m_TemperatureCounter;
            }
        }
        else {
            m_HasUpdated = false;
        }
    }

    float getHumidity() {
        if(m_HumidityCounter != 0){
            float humid = m_Humidity / m_HumidityCounter;
            m_Humidity = 0;
            m_HumidityCounter = 0;
            return humid;
        }
        else {
            return bme.readHumidity();
        }
    }

    float getPressure() {
        if(m_PressureCounter != 0) {
            float press = m_Pressure / m_PressureCounter;
            m_Pressure = 0;
            m_PressureCounter = 0;
            return press;
        }
        else {
            return bme.readPressure();
        }
    }

    float getTemperature() {
        if(m_TemperatureCounter != 0) {
            float temp = m_Temperature / m_TemperatureCounter;
            m_Pressure = 0;
            m_PressureCounter = 0;
            return temp;
        }
        else {
            return bme.readTemperature();
        }
    }

}