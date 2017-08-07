package main

import (
	"encoding/json"
	"log"
	"net/http"

	"github.com/googollee/go-socket.io"
	"github.com/kabukky/httpscerts"
	"github.com/ziutek/mymysql/mysql"
	_ "github.com/ziutek/mymysql/thrsafe"
)

type WebServer struct {
	server *socketio.Server
	fs     http.Handler
	db     mysql.Conn
}

func (w *WebServer) init(c *CmdArgs) {

	w.db = mysql.New("tcp", "", *c.dbConPtr, *c.dbUserPtr, *c.dbPassPtr, *c.dbNamePtr)
	err := w.db.Connect()
	if err != nil {
		panic(err)
	}

	serv, err := socketio.NewServer(nil)
	w.server = serv
	if err != nil {
		log.Fatal(err)
	}

	err = httpscerts.Check(*c.httpsCertFilePtr, *c.httpsKeyFilePtr)
	if err != nil {
		conStr := "127.0.0.1:" + *c.httpsPortPtr
		err = httpscerts.Generate(*c.httpsCertFilePtr, *c.httpsKeyFilePtr, conStr)
		if err != nil {
			log.Fatal("Error: Couldn't create https certs.")
		}
	}
	w.fs = http.FileServer(http.Dir(*c.httpsFolderName))
}

type ClientData struct {
	weatherType string
	startDate   string
	endDate     string
	chart       int
}

type Vec2_sf struct {
	x string  'json:"x"'
	y float32 'json:"y"'
}

type Vec2_ss struct {
	x string 'json:"x"'
	y string 'json:"y"'
}

type ServerData struct {
	data1 []Vec2_sf 	'json:"data1"'
	data2 []Vec2_sf 	'json:"data2"'
	data3 []Vec2_ss		'json:"data3"'
	weatherType string  'json:"weatherType"'
	chart int 			'json:"chart"'
}

func (w *WebServer) handleRequest(so *socketio.Socket, c *ClientData) {
	
}

func (w *WebServer) run(c *CmdArgs) {

	w.server.On("connection", func(so socketio.Socket) {
		log.Println("on connection")
		
		so.Join("weather")

		so.On("request", func(msg string) {
			var dat map[string]interface{}
			byt := []byte(msg)
			if err := json.Unmarshal(byt, &dat); err != nil {
				log.Fatal(err)
			}
			var c ClientData
			c.weatherType := dat["type"].(string)
			c.startDate := dat["startDate"].(string)
			c.endDate := dat["endDate"].(string)
			c.chart := dat["chart"].(int)
			handleRequest(&so, &c)
			log.Println("emit:", so.Emit("chat message", msg))
			so.BroadcastTo("chat", "chat message", msg)
		})

		so.On("disconnection", func() {
			log.Println("on disconnect")
		})

	})

	w.server.On("error", func(so socketio.Socket, err error) {
		log.Println("error:", err)
	})

	http.Handle("/socket.io/", w.server)
	http.Handle("/", w.fs)
	log.Println("Seving at https://localhost:" + *c.httpsPortPtr)
	log.Fatal(http.ListenAndServeTLS(":"+*c.httpsPortPtr, *c.httpsCertFilePtr, *c.httpsKeyFilePtr, nil))
}
