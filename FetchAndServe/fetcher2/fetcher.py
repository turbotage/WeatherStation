import PyMySQL
import serial
import time
from datetime import date, datetime, timedelta
import sys
import argparse

parser = argparse.ArgumentParser(description='Fetcher for WeatherStation')

parser.add_argument("-p", "--port", required=True, help="name of the port to fetch from")
parser.add_argument("-b", "--baud", required=True, help="baudrate")
parser.add_argument("-i", "--db_address", required=True, help="ip address of the database")
parser.add_argument("-u", "--user", required=True, help="username to the database")
parser.add_argument("-k", "--pass", required=True, help="password to the database")
parser.add_argument("-d", "--db_name", required=True, help="name of the database")

args = vars(parser.parse_args())

port = None #serial.Serial(arduino_ports[0], baudrate=9600)

# host, user, passwd, dbname
db = None #MySQLdb.connect("localhost","secret","secret","secret" )
cursor = None# db.cursor()

last_error = "Manual Start"

def readlineCR(port):
	rv = ""
	while True:
		ch = port.read()
		if ch=='\n':
			rv = rv[:-1]
			return rv
		else:
			rv += ch


def updateHumidity()
	port.write("1")
	humidity = readlineCR(port)
	sql = "INSERT INTO humidty (datetime,humidity) VALUES(\'" + time.strftime("%Y-%m-%d") + ":" + time.strftime("%H:%M:%S") + "\'," + str(humidity) + ")"
	return sql

def updatePressure()
	port.write("2")
	pressure = readlineCR(port)
	sql = "INSERT INTO pressure (datetime,pressure) VALUES(\'" + time.strftime("%Y-%m-%d") + ":" + time.strftime("%H:%M:%S") + "\'," + str(pressure) + ")"
	return sql

def updateTemperature()
	port.write("3")
	temperature = readlineCR(port)
	sql = "INSERT INTO temperature (datetime,temperature) VALUES(\'" + time.strftime("%Y-%m-%d") + ":" + time.strftime("%H:%M:%S") + "\'," + str(temperature) + ")"
	return sql

def updateWind()
	port.write("4")
	direction = readlineCR(port)
	port.write("5")
	wind = readlineCR(port)
	sql = "INSERT INTO wind (datetime,wind,direction) VALUES(\'" + time.strftime("%Y-%m-%d") + ":" + time.strftime("%H:%M:%S") + "\'," + str(wind) + "," + str(direction) + + ")"
	return sql

def updateGust()
	port.write("1")
	gust = readlineCR(port)
	sql = "INSERT INTO gust (datetime,gust) VALUES(\'" + time.strftime("%Y-%m-%d") + ":" + time.strftime("%H:%M:%S") + "\'," + str(gust) + ")"
	return sql

def updateRainfall()
	port.write("1")
	rainfall = readlineCR(port)
	sql = "INSERT INTO rainfall (datetime,rainfall) VALUES(\'" + time.strftime("%Y-%m-%d") + ":" + time.strftime("%H:%M:%S") + "\'," + str(rainfall) + ")"
	return sql


def updateFetchStart()
	sql = "INESRT INTO fetchstart (datetime,lasterror) VALUES(\'" + time.strftime("%Y-%m-%d") + ":" + time.strftime("%H:%M:%S") + "\'," +  last_error + ")"
	return sql

def start():
	#send start message with last error
	print("started: " + time.strftime("%Y-%m-%d") + ":" + time.strftime("%H:%M:%S") + "  LastError:" + last_error)

	#update first fetch
	sql = updateFetchStart()
	cursor.execute(sql)
	db.commit()

	# wait some initial time to let the arduino
	time.sleep(60)
	
	# rainfall
	sql = updateRainfall()
	cursor.execute(sql)
	db.commit()
	while True:
		sql = 
		for i in range(3)
			# humidity
			sql = updateHumidity()
			cursor.execute(sql)
			db.commit()
			# pressure
			sql = updatePressure()
			cursor.execute(sql)
			db.commit()
			# temperature
			sql = updateTemperature()
			cursor.execute(sql)
			db.commit()
			# wind
			sql = updateWind()
			cursor.execute(sql)
			db.commit()
			# gust
			sql = updateGust()
			cursor.execute(sql)
			db.commit()

			#wait
			time.sleep(600)


def init(argsIn):
	port = serial.Serial(argsIn["port"], argsIn["baud"])
	db = PyMySQL.connect(argsIn["db_address"], argsIn["user"], argsIn["pass"], argsIn["db_name"])
	cursor = db.cursor()

#start of script
#---------------------------------------------

while True:
	try:
		init(args)
		start()
	except:
		#print(cursor._last_executed)
		db.rollback()
		port.close()
		db.close()
		print(time.strftime("%Y-%m-%d") + " : " + time.strftime("%H:%M:%S"))
		print("Unexpected error:", sys.exc_info()[0])
