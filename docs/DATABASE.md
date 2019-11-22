```
DATABASES AND TYPES:
If not given, standard values are none

Username: weatherusr,
Password: Weather!212

DatabaseName: weather
    TableName: fetchstart
        Column 1: 
	        Name: datetime
            Type: datetime
        Column 2:
            Name: lasterror
            Type: text (Col = utf8_swedish_ci)
    TableName: gust
        Column 1: 
            Name: datetime
            Type: datetime
        Column 2:
            Name: value
            Type: float
    TableName: humidity
        Column 1: 
            Name: datetime
            Type: datetime
        Column 2:
            Name: value
            Type: float
    TableName: pressure
        Column 1: 
            Name: datetime
            Type: datetime
        Column 2:
            Name: value
            Type: float
    TableName: rainfall
        Column 1: 
            Name: datetime
            Type: datetime
        Column 2:
            Name: value
            Type: float
    TableName: temperature
        Column 1: 
            Name: datetime
            Type: datetime
        Column 2:
            Name: value
            Type: float
    TableName: wind
        Column 1: 
            Name: datetime
            Type: datetime
        Column 2:
            Name: wind
            Type: float
        Column 3:
            Name: direction
            Type: float
    

One database with the exact same properties as above but with name weather_test can be created to use for testing, i.e gen data to
with fetcher and do some testing with the website and so on
```