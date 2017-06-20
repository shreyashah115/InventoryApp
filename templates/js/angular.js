var app = angular.module('myApp', [])
    
app.controller('HomeCtrl', ['$scope', '$http', function($scope, $http) {

    console.log("hello");
    var x = 0;
    $scope.total = 0; // Sum of things in cart
    
    // Show/Hide Search bar
    $scope.searchBar = function(){
        if(x==1) {
            document.getElementById('searchBar').style.display = "none";
            x = 0;
        }
        else{
            document.getElementById('searchBar').style.display = "block";
            x = 1;
        }
    };

    // Fill the table with items availbale in database
    $scope.showwData = function(){
        x = 1; $scope.searchBar();
        $http({method: 'POST', url: '/getList'}).then(function(response){
            $scope.items = response.data;
            for(var i=0;i<$scope.items.length;i++){
                $scope.items[i].qt_value = 0; // denotes quantity of item in Cart
                $scope.items[i].tempqtvalue = 0; // denotes the input text in main page to add certain quantity to Cart
                $scope.title = "Home"; // Set heading of Table on top left side
                $scope.cart = []; // Initialising Empty cart
            }
        });
    };

    // Opens an alert window to confirm your action
    $scope.confirmdelete = function (i) {
        x = 1; $scope.searchBar(); // keep search bar hidden
        $scope.itemdelete = i; // Set which element to delete from cart
        $('#deleteconfirm').modal('show'); // Confirming delete action
    };

    // Removing item from the cart
    $scope.deleteitem = function () {
        $scope.tableCart();
        $('#deleteconfirm').modal('hide'); // Hiding the alert window
        
        for(var i=0;i<$scope.cart.length;i++){ // iterating through the cart to find the item to be deleted
            if($scope.itemdelete.id == $scope.cart[i].id){ 
                $scope.cart[i].itemquantity += $scope.cart[i].qt_value; // Undo the total quantity of that item to normal
                $scope.total -= ($scope.cart[i].qt_value * $scope.cart[i].price) // Update the Total sum
                $scope.cart.splice(i,1); // Removing the item from cart
            }else{}
        }
    };

    // Main page, changing the input box Quantity to be added to Cart
    $scope.decrease_qt_value = function(item){
        if(item.tempqtvalue == 0){} // If the Quantity is already zero, dont go into negative
        else{
            item.tempqtvalue -= 1; // else decrement
        }
    };

    // Main page, changing the input box Quantity to be added to Cart
    $scope.increase_qt_value = function(item){
        if(item.tempqtvalue < item.itemquantity){ // Only increment it to the limit of available quantity
            item.tempqtvalue += 1;
        }
        else{}
    };

    // Changing item's quantity from the cart for final purchase
    $scope.decreaseFromCart = function(item){
        item.qt_value -= 1; // decrease by one
        if(item.qt_value == 0){ // If the counter becomes zero
            $scope.itemdelete = item; // Set the item to be deleted from cart
            $scope.deleteitem(); // Call the remove from Cart function
            if($scope.cart.length == 0){ // If after removing an item there is nothing in cart, then route to main page
                $scope.tableMain();
            }
        }
        item.itemquantity = item.itemquantity + 1; // Increase the quantity
        $scope.total = $scope.total - item.price; // decrease the total price
        
    };

    // Changing item's quantity from the cart for final purchase
    $scope.increaseFromCart = function(item){
        if(item.itemquantity!=0){ // Only increase if the item is in stock and available for purchase
            item.qt_value += 1; // Increase the count of how many to purcahse
            item.itemquantity = item.itemquantity - 1; // Update the total quantity of that item
            $scope.total = $scope.total + item.price; /// Increase the Total Sum
        }
        else{}
    };

    // Adding things to cart for checkout
    $scope.addToCart = function(item){

        if($scope.cart.indexOf(item) != -1){ // If the item is already in cart
            $('#sameInCart').modal('show'); // Open a modal window to decide next action
            item.tempqtvalue = 0;
        }
        else{
            item.qt_value = item.tempqtvalue; // Set the value of quantity of item to purchase
            item.itemquantity = item.itemquantity - item.qt_value; // Decrease the total that was available
            y = item;

            if(y.qt_value!=0){ // push the item to cart
                $scope.cart.push(y);
            } else{}

            item.tempqtvalue = 0;
            $scope.total  += y.qt_value * y.price; // Update the total
        }
    };

    $scope.checkout = function(){
        if($scope.cart.length == 0){ //If cart is empty and clicking checkout
            $('#emptyCart').modal('show');
            // $scope.tableMain(); // Route to Main page
        }
        else{
            $('#checkingOut').modal('show'); // open a Confirmation Modal
        }
    };

    $scope.checkoutFinal = function(){ // Final Checkout
        $('#checkingOut').modal('hide'); // Hide the Confirmation Modal
        $http({method: 'POST', url: '/checkout', data: {cart: $scope.cart}}).then(function(response){
            console.log(response.data);
            // alert("Thank you for purchasing!");
            $scope.tableMain();
            $scope.showwData();
        });
    }

    $scope.showwData();
    $scope.tableMain1 = 1;

    $scope.tableMain = function(){ // Decide which table to show, This shows Main Page
        $('#emptyCart').modal('hide');
        $scope.title = "Home";
        $scope.tableMain1 = 1;
    };
    $scope.tableCart = function(){ // This shows Cart Page
        $('#sameInCart').modal('hide');
        $scope.title = "Cart";
        $scope.tableMain1 = 0;
    };

}]);

// Controller for admin
app.controller('AdminCtrl',['$scope', '$http', function($scope,$http){

    var x = 0;
    $scope.searchBar = function(){ // Show and Hide Search bar
        if(x==1) {
            document.getElementById('searchBar').style.display = "none";
            x = 0;
        }
        else{
            document.getElementById('searchBar').style.display = "block";
            x = 1;
        }
    };

    // Fill the table with items availbale in database
    $scope.showwData = function(){
        x = 1; $scope.searchBar(); // Hide Search bar
        $http({method: 'POST', url: '/getList'}).then(function(response){
            $scope.items = response.data;
        });
    };

    $scope.confirmdelete = function (id) { // Opens up a modal for confirmation of deletion from database
        x = 1; $scope.searchBar();
        $scope.deleteitemid = id;
        $('#deleteconfirm').modal('show');
    };

    $scope.deleteitem = function () { // Post a delete request to server
        console.log($scope.deleteitemid);
        $http({method: 'POST', url: '/deleteitem',data: {id:$scope.deleteitemid}}).then(function (response) {
            $scope.deleteitemid = '';
            $('#deleteconfirm').modal('hide');
        });
        $scope.showwData();
    };

    $scope.addNew = function(){
        $('#addItem').modal('show');
        $scope.temp = "";
    };

    $scope.addItemFinal = function(){
        $('#addItem').modal('hide');
        console.log($scope.temp);
        $http({method: 'POST', url: '/additem',data: {data:$scope.temp}}).then(function (response) {
            console.log(response.data);
            $scope.showwData();
        });

    }

    $scope.editItem = function(x){
        $('#editItem').modal('show');
        $scope.temp = angular.copy(x);
    };

    $scope.editFinal = function(){
        $('#editItem').modal('hide');
        console.log($scope.temp);
        $http({method: 'POST', url: '/edititem',data: {data:$scope.temp}}).then(function (response) {
            console.log(response.data);
            $scope.showwData();
        });
    }

    $scope.showwData();

}]);