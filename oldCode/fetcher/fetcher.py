import serial
import serial.tools.list_ports
import time
from datetime import date, datetime, timedelta
import MySQLdb
import sys


arduino_ports = [
	p.device
	for p in serial.tools.list_ports.comports()
	if 'Arduino' in p.description
]

if not arduino_ports:
	raise IOError("No Arduino found")
if len(arduino_ports) > 1:
	warnings.warn('Multiple Arduinos found - using first')

port = serial.Serial(arduino_ports[0], baudrate=9600)

db = MySQLdb.connect("localhost","secret","secret","secret" )
cursor = db.cursor()

typeStrings = ['humidity', 'pressure', 'temperature', 'wind_direction', 'wind', 'wind_max', 'rainfall']

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
	cursor.execute(sql)
	db.commit()
	print(cursor._last_executed)

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

try:
	start()
except:
	#print(cursor._last_executed)
	db.rollback()
	port.close()
	db.close()
	print(time.strftime("%Y-%m-%d") + " : " + time.strftime("%H:%M:%S"))
	print "Unexpected error:", sys.exc_info()[0]	
