package main

import "github.com/tarm/serial"
import "log"

type WeatherData struct {
	humidity    float32
	temperature float32
	pressure    float32
	rainfall    float32
	wind        float32
	gust        float32
	direction   string
}

//updateWeatherData updates the gets wheatherStation data and
func updateWheaterData(p *serial.Port) WeatherData {
	var data WeatherData

	serialWrite := func(message string) {
		n, err := p.Write([]byte(message))
		log.Fatal(err)
	}

	serialRead := func() string {

	}

}
