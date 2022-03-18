import requests, json

obj = {"user": "S", "loc": "[0, 1]" , "pas": "S+J"}
##obj = {"deed": "check"}
url = "https://LikeAlert.jakeee51.repl.co/setloc"
resp = requests.post(url, data=obj, verify=False)
vals = json.loads(resp.text)
print(vals)
