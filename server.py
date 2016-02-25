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
    metadata = []
    with open('data/metadata.json', 'r') as f:
      metadata = eval(f.read())
    with open('data/dr.json', 'r') as f:
      data = eval(f.read())
      return json.dumps({'metadata':metadata, 'data':data})

  return josn.dumps([]) 

if __name__ == '__main__':
  app.debug = True
  app.run()
