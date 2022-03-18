import socket

s = socket.socket(socket.AF_BLUETOOTH, socket.SOCK_STREAM, socket.BTPROTO_RFCOMM)
s.connect(("DC:A6:32:CD:2C:4F", 1))
print("Running ble client")
while True:
    text = input()
    if text == "exit":
        break
    s.send(bytes(text, "UTF-8"))
    data = s.recv(1024)
    print(data.decode())
s.close()
