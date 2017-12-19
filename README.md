# WeatherStation

## I havn't checked any spelling or grammer FYI

## Layout

#### Breadboard view
![Alt text](layout/BreadBoard.png?raw=true "Breadboard view")

#### Schematic view
![Alt text](layout/Schematic.png?raw=true "Breadboard view")

#### PCB view
![Alt text](layout/PCB.png?raw=true "Breadboard view")

### OBSERVE
all passwords and keys stored in plaintext in the source will not be the same for the actual WeatherStation, and if you wish to use this project for your own weather-station, i suggest you change keys and passwords aswell as mentioned in the section installing the software, this project is mainly done for a linux server, but to make it work for windows or mac shouldn't be to much work.

### INSTALLING THE SOFTWARE

1: Upload the arduino code to the arduino

2: In FetchAndServe/server/sketch.js and FetchAndServe/server/weather_data.js , change PUT_IP_HERE to the ip of your server

3: In FetchAndServe/server/server.js, in mysql.createConnection({}) change value of host: to the host ip of your db, value of user: to the username of your db, value of password: to the password for your user to the db and value of database: to the name of the database in which you store the data

4: Repeat step 3 but in FetchAndServe/fetcher/fetcher.py, the order of things is the same as in step 3

5: run the FetchAndServe/fetcher/gen_key.sh script and follow the steps to create an encryption key for the websites tls

6: run the FetchAndServe/fetcher/gen_cert.sh script and follow the steps to create an
self signed certificate for the websites tls, get a verified cert if you don't wan't webbrowsers to say your website is unsafe.

run start_fetcher.sh in a new screen session.

run start_server.sh in a new screen session

DONE DEAL