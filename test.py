import requests, json

obj = {"user": "J", "loc": "[1,0]" , "pas": "S+J"}
obj = {"deed": "check"}
url = "https://LikeAlert.jakeee51.repl.co/prp"
resp = requests.post(url, data=obj)
vals = json.loads(resp.text)
print(vals)
