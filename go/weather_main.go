package main

import (
	"flag"
)

type CmdArgs struct {
	//database
	dbUserPtr *string
	dbPassPtr *string
	dbNamePtr *string
	dbConPtr  *string

	//webserver
	httpsPortPtr     *string
	httpsKeyFilePtr  *string
	httpsCertFilePtr *string
	//weatherstation
	wsPortPtr        *string
	wsBaudPtr        *int
	wsReadTimeoutPtr *int
}

func (c *CmdArgs) commandLineHandler() {
	//database
	c.dbUserPtr = flag.String("db_user", "unspecified", "the username for the mysql database")
	c.dbPassPtr = flag.String("db_pass", "unspecified", "the password for the mysql database")
	c.dbNamePtr = flag.String("db_name", "unspecified", "the name of the database")
	c.dbConPtr = flag.String("db_connect", "127.0.0.1:3306", "the ip and port of the database format: ip:port example, 192.168.0.32:56700")
	//webserver
	c.httpsPortPtr = flag.String("https_port", "443", "the port to serve https at")
	c.httpsKeyFilePtr = flag.String("https_keyfile", "key.pem", "the file that contains the key for tls")
	c.httpsCertFilePtr = flag.String("https_certfile", "cert.pem", "the file that contains the certification for tls")
	//weatherstation
	c.wsPortPtr = flag.String("ws_port", "/dev/ttyACM0", "arduino serial port")
	c.wsBaudPtr = flag.Int("ws_baudrate", 9600, "the baudrate to use for serial comms with arduino")
	c.wsReadTimeoutPtr = flag.Int("ws_readtimeout", 2000, "the amount of milliseconds the connection shall wait before ending an atempt to read")

	flag.Parse()
}

func runFetcher(c *CmdArgs) {

	var fetcher Fetcher
	fetcher.initWeatherStationConnection(c)
	defer fetcher.db.Close()
	fetcher.initDatabaseConnection(c)
	defer fetcher.port.Close()
	fetcher.run()
}

func runWebServer(c *CmdArgs) {
	var webServer WebServer
	webServer.init(c)
	webServer.run()
}

func main() {
	var cmdArgs CmdArgs
	cmdArgs.commandLineHandler()

	go runFetcher(&cmdArgs)

	go runWebServer(&cmdArgs)

}
