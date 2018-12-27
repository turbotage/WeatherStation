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

typeStrings = ['humidity', 'pressure', 'temperature', 'rainfall', 'wind', 'gust', 'wind_direction']

def readlineCR(port):
	rv = ""
	while True:
		ch = port.read()
		if ch=='\n':
			rv = rv[:-1]
			return rv
		else:
			rv += ch

def insertInDatabase(i, reading):
	sql = "INSERT INTO " + typeStrings[i] + "(date, value, time)" + " VALUES(\'" + time.strftime("%Y-%m-%d") + "\'," + str(reading) + ",\'" + time.strftime("%H:%M:%S") + "\')"
	if i == 3:
		sql = "INSERT INTO " + typeStrings[i] + "(date, value, time)" + " VALUES(\'" + time.strftime("%Y-%m-%d") + "\',\'" + str(reading) + "\',\'" + time.strftime("%H:%M:%S") + "\')"
	#cursor.execute(sql)
	#db.commit()
	#print(cursor._last_executed)
	print(sql)

def allButRain():
	for i in range (6):
		print(str(i))
		port.write(str(i + 1))
		rcv = readlineCR(port)
		print(rcv)
		time.sleep(0.01)
		insertInDatabase(i, rcv)

def rain():
	print(str(6))
	port.write(str(6))
	rcv = readlineCR(port)
	print(rcv)
	insertInDatabase(6, rcv)
	time.sleep(0.01)

def start():
	print('started')
	time.sleep(60)
	port.write('1')
	rcv = port.readlineCR()
	while True:
		allButRain()
		time.sleep(600)
		allButRain()
		time.sleep(600)
		allButRain()
		time.sleep(600)
		rain()
		print("iteration")

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
