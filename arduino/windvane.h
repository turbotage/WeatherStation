
#include <math.h>

#define VANE_UPDATE_TIME

#define PIN_DIRECTION A0 //Analog 0  

class WindVane {
private:
    float m_X;
    float m_Y;

    int m_NumOfUpdateCycles;
    bool m_WindDirHasUpdated = false;

    float m_CorrespX[16] = { 
		0, 0.38268343, 0.70710678, 0.92387953, 
		1, 0.92387953, 0.70710678, 0.38268343, 
		0, -0.38268343, -0.70710678, -0.92387953, 
		-1, -0.92387953, -0.70710678, -0.38268343
	}
	float m_CorrespY[16] = { 
		1, 0.92387953, 0.70710678, 0.38268343,
		0, -0.38268343, -0.70710678, -0.92387953,
		-1, -0.92387953, -0.70710678, -0.38268343,
		0, 0.38268343, 0.70710678, 0.92387953
	}

    int m_DirValues[] = { 788, 407, 464, 83, 92, 65, 185, 126, 288, 245, 634, 603, 947, 830, 889, 706 };

    int getDirectionIndex(int reading) {
        for (int i = 0; i < (sizeof(m_DirValues)/sizeof(m_DirValues[0])); ++i) {
            if ( (reading <= (m_DirValues[i] + 4)) && (reading >= (m_DirValues[i] - 4)) ) {
                return i;
            }
        }
        return -1;
    }

public:
    
    void updateWindDirection(int reading) {
        
        int dirIndex = getDirectionIndex(reading);
        if(dirIndex == -1){
            return;
        }
        m_X += m_CorrespX[dirIndex];
        m_Y += m_CorrespY[dirIndex];
        ++m_NumOfUpdateCycles;
    }

    float getWindDirection() {
        if (m_X >= 0) && (m_Y >= 0) {
		    degree = 90 - atan2(m_Y, m_X)
	    } 
        else if m_Y < 0 {
		    degree = (-1 * atan2(m_Y, m_X)) + 90
	    }
        else if (m_X < 0) && (m_Y >= 0) {
		    degree = 460 - atan2(m_Y, m_X);
	    }
        m_X = 0;
        m_Y = 0;
        m_NumOfUpdateCycles = 0;
        return degree;
    }

}