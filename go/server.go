package main

import (
	"flag"
)

func commandLineHandler() {
	userPtr := flag.String("db_user", "unspecified", "the username for the mysql database")
	passPtr := flag.String("db_pass", "unspecified", "the password for the mysql database")
	dbPtr := flag.String("db_name", "unspecified", "the name of the database")
	connectionPtr := flag.String("db_connect", "127.0.0.1:3306", "the ip and port of the database format: ip:port example, 192.168.0.32:56700")

}

func initFetcher() {
	commandLineHandler()
	var fetcher Fetcher
	fetcher.initWeatherStationConnection()
	fetcher.initDatabaseConnection()
	fetcher.run()
}

func initWebServer() {

}

func main() {
	go initFetcher()

	go initWebServer()
}
