import requests, json, time, re

obj = {"user": "S", "loc": "[0, 1]" , "pas": "S+J"}

set_url = "http://jakeee51.pythonanywhere.com/setloc"
get_url = "http://jakeee51.pythonanywhere.com/getloc"
prp_url = "http://jakeee51.pythonanywhere.com/prp"

cmds = """
Commands:
  set S
  get
  prp done
  prp check
"""
cmd = ''

while True:
   obj = {"user": "S", "loc": "[0, 1]" , "pas": "S+J"}
   cmd = input("Enter API command: ")
   if "exit" in cmd:
      break
   elif "set" in cmd:
      args = cmd.split(' ')
      obj["user"] = args[1]
      loc = input("Enter coordinates: ").replace(' ', '').strip('[]')
      obj["loc"] = '[' + str(loc.replace(',', ', ')) + ']'
      print(obj)
      resp = requests.post(set_url, data=obj)
      vals = json.loads(resp.text)
      print(vals)
   elif "get" in cmd:
      runs = 1
      if re.search(r"get \d+", cmd):
         runs = int(cmd.split(' ')[1])
      for i in range(runs):
         resp = requests.post(get_url, data=obj)
         vals = json.loads(resp.text)
         print(vals)
         if runs > 1:
            time.sleep(5)
   elif "prp" in cmd:
      args = cmd.split(' ')
      obj = {"deed": ""}
      if "done" in cmd or "check" in cmd:
         obj["deed"] = args[1]
      resp = requests.post(prp_url, data=obj)
      vals = json.loads(resp.text)
      print(vals)
   else:
      continue
