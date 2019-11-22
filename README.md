# WeatherStation

## Data collection and processing
##### WindBarb:
Wind direction is given in degrees (0 to 360), 0 is northerly wind, i.e pointing to the south. The Windbarb can give 16 directions, {N,NNE,NE,ENE,E,ESE,SE,SSE,S,SSW,SW,WSW,W,WNW,NW,NNW}. See Wind-Vane section of SEN-80422 datasheet for more information. 

The direction given in a datapoint is the average value of all measured directions during the fetch-period. Meassurements are made every 5 seconds.

##### WindSpeed:
Unit: [m/s]. Measured by counting anemometer revolutions divided by time of fetch-period. See Anemometer section of SEN-80422 datasheet for more info.

##### Gust:
Unit: [m/s]. Given as highest avarage wind over a 2 sec period. New meassurement starts every 62.5 miliseconds. That is, 32 sperate counters, each calculating it's own 2 sec period and each period starts 62.5 miliseconds after the one before. This is to guarantee that the highest possible gust is retrieved. Calculated as anemometer revolutions during the 2 sec period divided by 2 seconds.

##### Humidity, Temperature and Pressure:
Units: [%, &deg;C, hPa]. Values in a datapoint is the average of all measured values during the fetch-period. Obviously understood as average of humidity, temperature and pressure separately.

##### Rainfall:
Units: [mm/h]. Implementation is straight forward following SEN-80422 datasheet.

### In data visualization

## Instructions

### OBSERVE!!
All passwords and keys stored in plain text in the source will not be the same for the actual WeatherStation, and if you wish to use this project for your own weather-station. I suggest you change keys and passwords as well as mentioned in the, installing the software section (TODO). Ofcourse not allowing public connections would resolve the possible security issues with using the same keys and password (depending on your LAN situation).

### Calibration of Winddir
Calibrate by starting in North (i.e pointing the tip of the to the north), then go clockwise measuring voltages in every direction along the way. This can be done with test_winddir.ino, voltage array should correspond to m_Voltages in
windvane.h (TODO) might be necassary to implement model

### Wiring and Schematics
[Wiring and Schematics](docs/SCHEMATICS.md)

### Arduino Commands
[Commands and expected respones](docs/ARDUINO.md)

### Running the Software
[Fetcher and Server, installation and running](docs/INSTALLING_SOFTWARE.md)


### Database sturcture

