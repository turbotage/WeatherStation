package main

import (
	"github.com/tarm/serial"
	"time"
	"log"
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

var config *serial.Config
var port *serial.Port

func initWeatherStation() {
	config = &serial.Config{Name: "/dev/ttyACM0", Baud: 9600, ReadTimeout: time.Second * 2}
	s, err := serial.OpenPort(config)
    if err != nil {
    	log.Fatal(err)
    }
	port = s
}

func closeWeatherStation() {
	port.Close()
}

//updateWeatherData updates the gets wheatherStation data and
func updateWheaterData() WeatherData {
	var data WeatherData

	serialWrite := func(message string) {
		n, err := port.Write([]byte(message))
		if err != nil {
                log.Fatal(err)
        }
		log.Printf("%d", n)
	}

	serialRead := func() []byte {
		buffer := make([]byte, 128)
		n, err := port.Read(buffer)
		if err != nil {
                log.Fatal(err)
        }
        log.Printf("%q", buffer[:n])
		return buffer
	}
	
	serialWrite("1")
	s := string(serialRead())
	log.Printf(s)

	serialWrite("2")
	s = string(serialRead())
	log.Printf(s)

	serialWrite("3")
	s = string(serialRead())
	log.Printf(s)

	serialWrite("4")
	s = string(serialRead())
	log.Printf(s)

	serialWrite("5")
	s = string(serialRead())
	log.Printf(s)

	serialWrite("6")
	s = string(serialRead())
	log.Printf(s)

	serialWrite("6")
	s = string(serialRead())
	log.Printf(s)

	return data
}
