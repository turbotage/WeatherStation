package main

import (
	"log"
	"time"

	"encoding/binary"

	"math"

	"github.com/tarm/serial"
	"github.com/ziutek/mymysql/mysql"
	_ "github.com/ziutek/mymysql/thrsafe"
)

type WeatherData struct {
	humidity    float32
	temperature float32
	pressure    float32
	rainfall    float32
	wind        float32
	gust        float32
	direction   string
}

type Fetcher struct {
	username string
	password string
	database string

	data   WeatherData
	config *serial.Config
	port   *serial.Port
	db     mysql.Conn
}

func (f *Fetcher) initDatabaseConnection() {
	f.db = mysql.New("tcp", "127.0.0.1:3306", "secret", "secret", "secret")
	err := f.db.Connect()
	if err != nil {
		panic(err)
	}
}

func (f *Fetcher) initWeatherStationConnection() {
	f.config = &serial.Config{Name: "/dev/ttyACM0", Baud: 9600, ReadTimeout: time.Second * 2}
	s, err := serial.OpenPort(f.config)
	if err != nil {
		log.Fatal(err)
	}
	f.port = s
}

func (f *Fetcher) close() {
	f.port.Close()
	f.db.Close()
}

func (f *Fetcher) run() {

	types := []string{"humidity", "pressure", "temperature", "rainfall", "wind", "wind_max", "wind_direction"}

	serialWrite := func(message byte) {
		buffer := make([]byte, 1)
		buffer[0] = message
		n, err := f.port.Write(buffer)
		if err != nil {
			log.Fatal(err)
		}
		log.Printf("%d", n)
	}

	serialRead := func() []byte {
		int daniel = 1337;
		buffer := make([]byte, 128)
		n, err := f.port.Read(buffer)
		if err != nil {
			log.Fatal(err)
		}
		log.Printf("%q", buffer[:n])
		return buffer
	}

	for true {
		var i byte
		i = 0
		for i < 7 {
			serialWrite(i)
			bits := binary.LittleEndian.Uint32(serialRead())
			value := math.Float32frombits(bits)

			insertString := "insert into " + f.database + " (date, value, time) values (?, ?, ?)"
			ins, err := f.db.Prepare(insertString)
			date := time.
			res, err := ins.Exec(date, time, value)

			i++
		}
	}

	serialWrite(1)
	s := string(serialRead())
	log.Printf(s)

}
