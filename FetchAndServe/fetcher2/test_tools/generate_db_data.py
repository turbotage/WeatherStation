import pymysql
import serial
import time
from datetime import date, datetime, timedelta
import sys
import argparse
import random

parser = argparse.ArgumentParser(description='Fetcher for WeatherStation')

parser.add_argument("-i", "--db_address", required=True, help="ip address of the database")
parser.add_argument("-u", "--user", required=True, help="username to the database")
parser.add_argument("-k", "--pass", required=True, help="password to the database")
parser.add_argument("-d", "--db_name", required=True, help="name of the database")

argsIn = vars(parser.parse_args())


random.seed()

last_error = "Manual Start"

last_humidity = 70
def updateHumidity():
	humidity = random.uniform(last_humidity - 4, last_humidity + 4)
	while (humidity < 0) or (100 < humidity):
		humidity = random.uniform(last_humidity - 4, last_humidity + 4)

	last_humidity = humidity

	sql = "INSERT INTO humidty (datetime,humidity) VALUES(\'" + time.strftime("%Y-%m-%d") + ":" + time.strftime("%H:%M:%S") + "\'," + str(humidity) + ")"
	return sql

last_pressure = 1013
def updatePressure():
	pressure = random.uniform(last_pressure - 3, last_pressure + 3)
	while (pressure < 950) or (1050 < pressure):
		pressure = random.uniform(last_pressure - 3, last_pressure + 2)
	
	last_pressure = pressure

	sql = "INSERT INTO pressure (datetime,pressure) VALUES(\'" + time.strftime("%Y-%m-%d") + ":" + time.strftime("%H:%M:%S") + "\'," + str(pressure) + ")"
	return sql

last_temperature = 10
def updateTemperature():
	temperature = random.uniform(last_temperature - 4, last_temperature + 4)
	while temperature < -30 or 35 < temperature:
		temperature = random.uniform(last_temperature - 4, last_temperature + 4)

	last_temperature = temperature

	sql = "INSERT INTO temperature (datetime,temperature) VALUES(\'" + time.strftime("%Y-%m-%d") + ":" + time.strftime("%H:%M:%S") + "\'," + str(temperature) + ")"
	return sql

last_wind = 3
last_direction = 0
def updateWind():
	direction = random.uniform(last_direction - 50, last_direction + 50)
	while direction < 0 or 360 < direction:
		direction = random.uniform(last_direction - 50, last_direction + 50)

	wind = random.uniform(last_wind - 4, last_wind + 4)
	while wind < 0 or 35 < wind:
		wind = random.uniform(last_wind - 4, last_wind + 4)

	last_wind = wind
	last_direction = direction

	sql = "INSERT INTO wind (datetime,wind,direction) VALUES(\'" + time.strftime("%Y-%m-%d") + ":" + time.strftime("%H:%M:%S") + "\'," + str(wind) + "," + str(direction) + + ")"
	return sql

def updateGust():
	gust = random.uniform(last_wind + 0.5, last_wind + 6)
	while gust < 0.4 or 45 < gust:
		gust = random.uniform(last_wind + 0.5, last_wind + 6)

	sql = "INSERT INTO gust (datetime,gust) VALUES(\'" + time.strftime("%Y-%m-%d") + ":" + time.strftime("%H:%M:%S") + "\'," + str(gust) + ")"
	return sql

last_rainfall = 0
def updateRainfall():
	rainfall = random.uniform(last_rainfall - 0.6, last_rainfall + 0.5)
	while last_rainfall > 30:
		rainfall = random.uniform(last_rainfall - 0.6, last_rainfall + 0.5)
	if last_rainfall < 0:
		rainfall = 0

	last_rainfall = rainfall

	sql = "INSERT INTO rainfall (datetime,rainfall) VALUES(\'" + time.strftime("%Y-%m-%d") + ":" + time.strftime("%H:%M:%S") + "\'," + str(rainfall) + ")"
	return sql

def updateFetchStart():
	sql = "INESRT INTO fetchstart (datetime,lasterror) VALUES(\'" + time.strftime("%Y-%m-%d") + ":" + time.strftime("%H:%M:%S") + "\'," +  last_error + ")"
	return sql

def start(connection):
	# host, user, passwd, dbname

	cursor = connection.cursor()

	#send start message with last error
	print("started: " + time.strftime("%Y-%m-%d") + ":" + time.strftime("%H:%M:%S") + "  LastError:" + last_error)

	#update first fetch
	sql = updateFetchStart()
	cursor.execute(sql)

	# wait some initial time to let the arduino
	time.sleep(60)
	
	while True:
		# rainfall
		sql = updateRainfall()
		cursor.execute(sql)
		db.commit()
		for i in range(3):
			# humidity
			sql = updateHumidity()
			cursor.execute(sql)

			# pressure
			sql = updatePressure()
			cursor.execute(sql)

			# temperature
			sql = updateTemperature()
			cursor.execute(sql)

			# wind
			sql = updateWind()
			cursor.execute(sql)

			# gust
			sql = updateGust()
			cursor.execute(sql)

			#wait
			time.sleep(60)

#def init(argsIn):

def run():
	connection = None
	while True:
		try:
			connection = pymysql.connect(
				host=argsIn["db_address"], 
				user=argsIn["user"], 
				password=argsIn["pass"], 
				db=argsIn["db_name"],
				cursorclass=pymysql.cursors.DictCursor,
				autocommit=True)

			start(connection)
		except:
			connection.rollback()
			connection.close()
			print(time.strftime("%Y-%m-%d") + " : " + time.strftime("%H:%M:%S"))
			print("Unexpected error:", sys.exc_info()[0])
			last_error = str(sys.exc_info()[0])


run()

