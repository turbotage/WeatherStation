
## Fetcher dependencies

#### navigate to fetcher directory and run these

npm install mysql

npm install minimist

npm install random

npm install date-and-time

npm install serialport

## Server dependencies

#### navigate to server directory and run these

npm install express

npm install mysql

npm install minimist

npm install socket.<nolink>io

## Running the software

### Fetcher

##### test
node .\fetcher.js  --db_user weatherusr --db_pass Weather!212 --db_name weather_test --gen_data --time 300
##### real deal
node .\fetcher.js  --db_user weatherusr --db_pass Weather!212 --db_name weather --serial_port "/dev/ttyACM0" --time 300

### Server
##### test
node .\server.js --db_host localhost --db_user weatherusr --db_pass Weather!212 --db_name weather_test
##### real deal
node .\server.js --db_host localhost --db_user weatherusr --db_pass Weather!212 --db_name weather
