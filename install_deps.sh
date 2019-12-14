rm -rf FetchAndServe/fetcher/node_modules
rm -rf FetchAndServe/server/node_modules
cd FetchAndServe/fetcher/
npm install forever
npm install mysql
npm install minimist
npm install random
npm install date-and-time
npm install serialport
chmod +x run_fetcher_test.sh
chmod +x run_fetcher.sh
cd ..
cd server/
npm install forever
npm install express
npm install mysql
npm install minimist
npm install socket.io
chmod +x run_server_test.sh
chmod +x run_server.sh
cd ..
cd ..
