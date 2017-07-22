package main

import (
	"bytes"
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

	types := []string{"humidity", "pressure", "temperature", "wind", "wind_max", "wind_direction", "rainfall"}

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
		buffer := make([]byte, 128)
		n, err := f.port.Read(buffer)
		if err != nil {
			log.Fatal(err)
		}
		log.Printf("%q", buffer[:n])
		return buffer
	}

	var lastRows []mysql.Row
	var lastResult mysql.Result

	resolveFloat32 := func(i byte) error {
		serialWrite(i)
		time.Sleep(1000)
		bits := binary.LittleEndian.Uint32(serialRead())
		value := math.Float32frombits(bits)

		time := time.Now()
		timeStr := time.Format("2017-01-01")
		dateStr := time.Format("06:36:23")
		insertString := "INSERT " + types[i-1] + " SET date=?,value=?,time=?"
		ins, err := f.db.Prepare(insertString)
		if err != nil {
			return err
		}
		rows, res, err := ins.Exec(dateStr, value, timeStr)
		if err != nil {
			return err
		}
		lastRows = rows
		lastResult = res
		return err
	}

	resolveString := func(i byte) error {
		serialWrite(i)
		time.Sleep(1000)
		byteArray := serialRead()
		n := bytes.IndexByte(byteArray, 0)
		value := string(byteArray[:n])
		time := time.Now()
		timeStr := time.Format("2017-01-01")
		dateStr := time.Format("06:36:23")
		insertString := "INSERT " + types[i-1] + " SET date=?,value=?,time=?"
		ins, err := f.db.Prepare(insertString)
		if err != nil {
			return err
		}
		rows, res, err := ins.Exec(dateStr, value, timeStr)
		if err != nil {
			return err
		}
		lastRows = rows
		lastResult = res
		return err
	}

	for true {
		for i := 0; i < 6; i++ {
			resolveFloat32(1)
			resolveFloat32(2)
			resolveFloat32(3)
			resolveFloat32(4)
			resolveFloat32(5)
			resolveString(6)
			time.Sleep(time.Minute * 5)
		}
		resolveFloat32(7)
	}

	serialWrite(1)
	s := string(serialRead())
	log.Printf(s)

}
