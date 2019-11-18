# WeatherStation

### Wiring and Schematics
[Wiring and Schematics](docs/SCHEMATICS.md)

### OBSERVE
All passwords and keys stored in plaintext in the source will not be the same for the actual WeatherStation, and if you wish to use this project for your own weather-station. I suggest you change keys and passwords aswell as mentioned in the , installing the software, section (TODO). 

## Conventions
#### In data collection and processing
##### WindBarb:
Wind direction is given in degrees (0 to 360), 0 is notherly wind, i.e pointing to the south. The Windbarb can give 16 directions, {N,NNE,NE,ENE,E,ESE,SE,SSE,S,SSW,SW,WSW,W,WNW,NW,NNW}, See Wind-Vane section of SEN-80422 datasheet for more information. 

The direction given in a datapoint is the average value of all meassured directions during the fetch period. Meassurements are made every 5 seconds.

##### WindSpeed:
Unit: [m/s]. Meassured by counting anemometer revolutions divided by time of fetch-period. See Anemometer section of SEN-80422 datasheet for more info.

##### Gust:
Unit: [m/s]. Given as highest avarage wind over a 2 sec period, new meassurement starts every 0.5 seconds. Calculated as anemometer revolutions during the 2 sec period divided by 2 seconds.

##### Humidity, Temperature and Pressure
Units: [%, &deg;C, hPa]. 

#### In data visualization


## Instructions

### Calibration of Winddir
Calibrate by starting in North (i.e pointing the tip of the to the north), then go clockwise meassuring voltages in every direction along the way. This can be done with test_winddir.ino, voltage array should correspond to m_Voltages in
windvane.h (TODO) might be necassary to implement modell 