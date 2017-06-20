from flask import Flask, render_template, json, jsonify
from flask_pymongo import PyMongo
from flask import request
from bson import ObjectId

app = Flask(__name__)
app.config['MONGO_DBNAME'] = 'inventory11'
app.config['MONGO_URI'] = 'mongodb://seller:seller@ds127872.mlab.com:27872/inventory11'
mongo = PyMongo(app)


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/admin', methods=['GET'])
def admin():
    return render_template('admin.html')


# Fetch data from database and pass it to html + js
@app.route("/getList", methods=['POST'])
def inventory():
    try:
        items = mongo.db.items.find()
        itemlist = []
        for i in items:
            output = {
                'itemname': i['itemname'],
                'itemcategory': i['itemcategory'],
                'itemquantity': i['itemquantity'],
                'price': int(i['price']),
                'id': str(i['_id'])
            }
            itemlist.append(output)
    except Exception, e:
        return str(e)
    return json.dumps(itemlist)


# Not in use, Since admin Control is not created yet
@app.route("/deleteitem", methods=['POST'])
def deleteitem():
    try:
        itemid = request.json['id']
        mongo.db.items.remove({'_id': ObjectId(itemid)})
        return jsonify(status='OK', message='deletion successful')
    except Exception, e:
        return jsonify(status='ERROR', message=str(e))


# Add new Item to Database
@app.route('/additem', methods=['POST'])
def additem():
    try:
        data = request.json['data']
        # print data['itemname']
        mongo.db.items.insert_one(
            {"itemname": data['itemname'], "itemcategory": data['itemcategory'], "itemquantity": data['itemquantity'],
             "price": int(data['price'])})
        return jsonify(status='OK', message='Insertion Successful')
    except Exception, e:
        return jsonify(status='OK', message=str(e))


# Edit data
@app.route("/edititem", methods=['POST'])
def edititem():
    try:
        data = request.json['data']
        id = data['id']
        name = data['itemname']
        category = data['itemcategory']
        quantity = data['itemquantity']
        price = data['price']
        mongo.db.items.update_one({'_id': ObjectId(id)}, {
            '$set': {'itemname': name, 'itemcategory': category, 'itemquantity': quantity, 'price': int(price)}})
        return jsonify(status='OK', message='Updated successfully')
    except Exception, e:
        return jsonify(status='ERROR', message=str(e))


# Updating Value in database about quantity of item sold
@app.route("/checkout", methods=['POST'])
def checkout():
    try:
        cart = request.json['cart']
        for item in cart:
            x = item['itemquantity']
            id = item['id']
            mongo.db.items.update_one({'_id': ObjectId(id)}, {'$set': {'itemquantity': x}})
        return jsonify(status='OK', message='deletion successful')
    except Exception, e:
        return jsonify(status='ERROR', message=str(e))


if __name__ == '__main__':
    app.run(debug=True)
