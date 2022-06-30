# WYMMS

A mobile app for the WYMMS Project that triggers robot arm movements based on voice recognition and turns on lights based on the geolocational proximity of 2 devices.

### Features:
* Trigger robot arm movement by uttering a specific phrase.
* Box that can be opened by robot arm
* Light up circle of rope lights when both devices get within close proximity
* Red rose petals drop upon uttering phrase

### Components:
- [x] Raspberry Pi
- [x] REST API to handle communicating geolocation and other info (duck data) (http://jakeee51.pythonanywhere.com/)
- [x] Robot Arm
- [x] Android & iOS compatible application with LikeAlert and speech recognition functionailities
- [x] LED Rope Strip Lights (white and or yellow)
- [x] Battery (9-10A, 5V)
- [x] Battery (3A, 5.1V, 15.3W)
- [ ] Red Rose Petals
- [ ] Box with a lid
- [ ] Something to strap robot arm to tree or somewhat hidden above both parties

### Workflow:
- [x] Create LikeAlert app for Android & iOS
- [x] Refine & beautify LikeAlert app
- [x] Put LikeAlert app on her device
- [x] Create replit for hosting user data (may also handle robot arm communication) (https://www.pythonanywhere.com/user/jakeee51/files/home/jakeee51/mysite/main.py?edit)
- [x] Implement speech recognition into LikeAlert (listen on button press)
- [x] Implement bluetooth or internet communication between device and Raspberry Pi
- [x] Construct robot arm & attach Raspberry Pi
- [x] Get robot arm to move using Raspberry Pi
- [x] Get robot arm to move using voice by talking into LikeAlert (send information via Bluetooth)
- [x] Order remote controlled or 3-pin battery powered rope lights
- [x] Get rope lights or light strips & attach to Raspberry Pi
- [x] Get lights to light up using geolocation of 2 devices with LikeAlert (send information via API & Bluetooth)
- [x] Order battery for Raspberry Pi
- [x] Fasten components together
- [x] Get or make box that's easy to open
- [x] Test in dev with shredded paper and w/o Wifi
- [x] Order red rose petals
- [x] Acquire date, time, place (7/1; Afternoon; Thrid Ward Park, Passaic NJ)
- [x] Acquire materials to bond project to tree (bungie cables?)
- [ ] Test in stage
- [ ] Setup: During setup have someone take her to ICPC for 1 rose.
      Then have that someone take them "somewhere else" for pictures before the party.
      Before arriving, sneakily have that person's phone already running the app.
      The "somewhere else" would be to me (holding other 4 roses) and voice listener ready.
- [ ] Do the thing
