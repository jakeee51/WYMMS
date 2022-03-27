import socket

hostMACAddress = "DC:A6:32:CD:2C:4F" # The MAC address of a Bluetooth adapter on the server. The server might have multiple Bluetooth adapters.
port = 1 # 1 is an arbitrary choice. However, it must match the port used by the client.
backlog = 1
size = 1024
s = socket.socket(socket.AF_BLUETOOTH, socket.SOCK_STREAM, socket.BTPROTO_RFCOMM)
s.bind((hostMACAddress, port))
s.listen(backlog)
print("Listening on ble")
try:
    client, address = s.accept()
    while True:
        data = client.recv(size)
        if data:
            print(data.decode())
            client.send(data)
except Exception as e:	
    print("Closing socket\n", e)	
    client.close()
    s.close()
