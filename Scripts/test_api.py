import requests, json

obj = {"user": "S", "loc": "[0, 1]" , "pas": "S+J"}
##obj = {"deed": "check"}

url = "http://jakeee51.pythonanywhere.com/setloc"
##url = "http://jakeee51.pythonanywhere.com/prp"

resp = requests.post(url, data=obj)
##print("resp:", resp.text)
vals = json.loads(resp.text)
print(vals)
