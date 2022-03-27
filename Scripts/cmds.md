sudo systemctl daemon-reload
sudo systemctl restart bluetooth
sudo sdptool add SP
sudo hciconfig hci0 piscan

sudo apt install build-essential libdbus-glib-1-dev libgirepository1.0-dev
sudo apt install build-essential libpython3-dev libdbus-1-dev
pip install dbus-python