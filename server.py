import simplejson as json
import model
import ast
from flask import Flask, render_template, request
app = Flask(__name__)

@app.route('/')
def index():
  return render_template('index.html')

@app.route('/query/', methods=['POST'])
def query():
  if request.method == 'POST':
    data_dict = ast.literal_eval(request.data)
    with open('data/dr.json', 'r') as f:
      data = f.read()
      return json.dumps(data)
  return [] 

if __name__ == '__main__':
  app.debug = True
  app.run()
