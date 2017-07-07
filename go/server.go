package main

import (
	"log"

	"github.com/tarm/serial"
)

func updateSQL()

func main() {
	c := &serial.Config{Name: "/dev/ttyACM0", Baud: 9600}
	s, err := serial.OpenPort(c)
	if err != nil {
		log.Fatal(err)
	}
}
