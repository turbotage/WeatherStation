
#include "def.h"

#define GUST_CONSTANT (1.0f/(GUST_TIME / 1000.0f)) * 0.66698368f;

class Anemometer {
private:
    //wind speed
    volatile unsigned int* m_WindSpeedRevs;
    unsigned long m_TimeAtWindUpdate = 0;
    float m_LastWindSpeed = 1;



    //wind gust
    float m_HighestGust = 0;
    bool m_GustHasUpdated = false;
    unsigned long m_TimeAtLastGustUpdate = 0;
    int m_GustPeriodCounter = 0;
	volatile unsigned int m_GustRevs[NUM_GUST_COUNTERS];

public:

    void setup(volatile unsigned int* windSpeedRevs) {
		for (int i = 0; i < NUM_GUST_COUNTERS; ++i){
			gustRevs[i] = 0;
		}
		m_WindSpeedRevs = windSpeedRevs;
    }

    //===============================================================
    //Calculate the max wind speed/gust
    //===============================================================
    void updateWindGust(unsigned int revsSinceLastUpdate){
		for (int i = 0; i < NUM_GUST_COUNTERS; ++i) {
			m_GustRevs[i] += revsSinceLastUpdate;
		}
        unsigned long timer = millis() - m_TimeAtLastGustUpdate;
        int timu = timer % (int)(GUST_TIME / NUM_GUST_COUNTERS);
        if ((timu >= 0) && (timu <= 20)) {
            if(!m_GustHasUpdated){
                m_GustHasUpdated = true;
                float currentGust = GUST_CONSTANT * m_GustRevs[m_GustPeriodCounter];
                if(currentGust > m_HighestGust) {
                    m_HighestGust = currentGust;
                }
                m_GustRevs[m_GustPeriodCounter] = 0;
                ++m_GustPeriodCounter;
                if(m_GustPeriodCounter == NUM_GUST_COUNTERS){
                    m_GustPeriodCounter = 0;
                }
                m_TimeAtLastGustUpdate = timer;
            }
        }
        else {
            m_GustHasUpdated = false;
        }
    }

    //=======================================================
    // Calculate the wind speed, and display it (or log it, whatever).
    // 1 rev/sec = 1.492 mph = 2.40114125 kph, 0.6669836806 m/s
    //=======================================================
    float getWindSpeed() {
	    float windspeed = 0.001f*(0.66698368f * (*m_WindSpeedRevs)) / (millis() - m_TimeAtWindUpdate);
	    //float timer = 0.00000001f;
	    //timer += (millis() - m_TimeAtWindUpdate)/1000; //seconds since last update
	    //windspeed /= timer;
	    *m_WindSpeedRevs = 0;        // Reset counter
	    m_TimeAtWindUpdate = millis(); //set last update to now so next  wind callculation will be since this one
		/*
	    if (windspeed > 160 || windspeed < 0) {
		    return -1;
	    }
		*/
      	m_LastWindSpeed = windspeed;
	    return windspeed;
    }

    //=======================================================
    // Get the highest gust speed during this cycle
    //=======================================================
    float getGust() {
        float tempGust = m_HighestGust;
        m_HighestGust = 0;
        //if (tempGust <= m_LastWindSpeed) { //shouldn't happen by mean value theorem
			
        //}
        return tempGust;
    }

};





