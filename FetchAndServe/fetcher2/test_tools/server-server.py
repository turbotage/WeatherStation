import socketio

sio = socketio.Client()

@sio.event
def connect():
    print('connection established')

@sio.event
def disconnect():
    print('disconnected from server')


sio.connect('http://localhost:3000')

sio.emit('server-update-notice', {'hello': 'world', 'num': 42})

sio.wait()