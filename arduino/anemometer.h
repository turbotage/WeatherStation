
#define GUST_TIME 2000

//pins
#define PIN_ANEMOMETER 2  //Digital 2

class Anemometer {
private:
    //wind speed
    volatile int m_WindSpeedRevs = 0;

    unsigned long m_TimeAtWindUpdate = 0;

    float m_LastWindSpeed = 1;


    //wind gust
    float m_HighestGust = 0;
    bool m_GustHasUpdated = false;
    unsigned long m_TimeAtLastGustUpdate = 0;
    volatile int m_GustRevs[4];
    int m_GustPeriodCounter = 0;

public:

    void incrementWindSpeedRevs() {
        ++m_NumRevs;
    }

    void incrementGustRevs() {
        for(int i = 0; sizeof(m_GustRevs)/sizeof(m_GustRevs[0]); ++i){
            ++m_NumRevs[i];
        }
    }

    //===============================================================
    //Calculate the max wind speed/gust
    //===============================================================
    void updateWindGust(){
        unsigned long timer = millis() - m_TimeAtLastGustUpdate;
        int timu = timer % GUST_TIME / (sizeof(m_GustRevs)/sizeof(m_GustRevs[0]));
        if ((timu >= 0) && (timu <= 40)) {
            if(!gustHasUpdated){
                m_GustHasUpdated = true;
                float currentGust = 0.0f;
                int num = m_GustRevs[gustNumCounter];
                currentGust = 2.40114124f * m_GustRevs / 3.6f;
                float deltaT = (timer / 1000) + 0.000001f;
                currentGust /= deltaT;
                if(currentGust > highestGust) {
                    highestGust = currentGust;
                }
                m_GustRevs[m_GustNumCounter] = 0;
                ++m_GustNumCounter;
                if(m_GustNumCounter == 4){
                    m_GustNumCounter = 0;
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
    // 1 rev/sec = 1.492 mph = 2.40114125 kph, 0,6669836806 m/s
    //=======================================================
    float getWindSpeed() {
	    float windspeed = 0;
	    windspeed = 2.40114125*m_NumRevs/3.6;
	    float timer = 0.00000001;
	    timer += (millis() - m_TimeAtWindUpdate)/1000; //seconds since last update
	    windspeed /= timer;
	     
	    m_NumRevs = 0;        // Reset counter
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
        if (tempGust <= m_LastWindSpeed) {
            //shouldn't happen if this happens 
        }
        return tempGust;
    }

}





