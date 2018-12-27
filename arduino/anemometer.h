
#define GUST_TIME 2000

//pins
#define PIN_ANEMOMETER 2  //Digital 2

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
    volatile unsigned int* m_GustRevs;
    int m_GustPeriodCounter = 0;

public:

    void setup(volatile unsigned int* windSpeedRevs, volatile unsigned int* gustRevs) {
      m_WindSpeedRevs = windSpeedRevs;
      m_GustRevs = gustRevs;
    }

    //===============================================================
    //Calculate the max wind speed/gust
    //===============================================================
    void updateWindGust(){
        unsigned long timer = millis() - m_TimeAtLastGustUpdate;
        int timu = timer % GUST_TIME / (sizeof(m_GustRevs)/sizeof(m_GustRevs[0]));
        if ((timu >= 0) && (timu <= 40)) {
            if(!m_GustHasUpdated){
                m_GustHasUpdated = true;
                float currentGust = 0.0f;
                currentGust = 2.40114124f * m_GustRevs[m_GustPeriodCounter] / 3.6f;
                float deltaT = (timer / 1000) + 0.000001f;
                currentGust /= deltaT;
                if(currentGust > m_HighestGust) {
                    m_HighestGust = currentGust;
                }
                m_GustRevs[m_GustPeriodCounter] = 0;
                ++m_GustPeriodCounter;
                if(m_GustPeriodCounter == 4){
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
	    float windspeed = 0;
	    windspeed = 2.40114125 * (*m_WindSpeedRevs) / 3.6;
	    float timer = 0.00000001f;
	    timer += (millis() - m_TimeAtWindUpdate)/1000; //seconds since last update
	    windspeed /= timer;
	     
	    m_WindSpeedRevs = 0;        // Reset counter
	    m_TimeAtWindUpdate = millis(); //set last update to now so next  wind callculation will be since this one
	    if (windspeed > 160 || windspeed < 0) {
		    return -1;
	    }
      m_LastWindSpeed = windspeed;
	    return windspeed;
    }

    //=======================================================
    // Get the highest gust speed during this cycle
    //=======================================================
    float getGust() {
        float tempGust = m_HighestGust;
        m_HighestGust = 0;
        if (tempGust <= m_LastWindSpeed) { //shouldn't happen by mean value theorem
          
        }
        return tempGust;
    }

};





