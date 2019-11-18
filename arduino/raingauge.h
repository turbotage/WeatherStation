
#include "def.h"

class RainGauge {
private:
    volatile unsigned int* m_NumRainGauge;

    unsigned long m_TimeAtRainUpdate;
public:

    void setup(volatile unsigned int* numRainGauge) {
      	m_NumRainGauge = numRainGauge;
    }

    //=======================================================
    // Calculate the rain , and display it (or log it, whatever).
    // 1 bucket = 0.2794 mm
    //=======================================================
    float getRainFall() {
        float x = 0;
        x = 0.2794*(*m_NumRainGauge);
        float timer = 0.00000001;
        timer += (millis() - m_TimeAtRainUpdate)/1000; //get seconds since last raincallculation
        float rain = (3600 * x)/timer; //take volume per time and convert to right format (mm/h)
        m_NumRainGauge = 0;        // Reset counter
        m_TimeAtRainUpdate = millis(); //set last update to now so next rain callculation will be since this one
        return rain;
    }

};
