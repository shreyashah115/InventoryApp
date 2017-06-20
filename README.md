# InventoryApp
Developed using Flask web framework, html and angularJS, like a simple point on sale system, which helps the shop owner to add, modify and remove the products, along with an option to view the updated amount of products in stock.
### Prerequisites

You need to have [Python](https://www.python.org/downloads/).


## How to Run the App

1. Open cmd in the current directory where the files have been extracted. And type...
```
  pip install
```
* Install all the required packages, eg. Flask and flask_pymongo.

2. There's no need to create a database, I have already created one and provided the credentials in the Mongo-URI.

4. Open terminal, go to the path where the project directory exists, type
```
python server.py
```

5. Open up your browser and type 
```
127.0.0.1:5000/
```
* This should start the system, where the seller can view the items available and add them to the cart according to the customer's needs, the cart view will let the seller and customer know the total amount. Only the quantity available will be added to the cart.

6. Now, go to the admin page, to check the inventory, type
```
127.0.0.1:5000/admin
```
* Here, the seller will be able to view all the items, add new items, modify the items and remove the items.
