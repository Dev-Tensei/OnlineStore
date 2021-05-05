console.log('working');
// const url = "https://damp-badlands-22454.herokuapp.com"
const url = "http://localhost:2000"


// retrieve session, return the session when page loads, "am i logged in today".
function getSession() {
  return fetch("http://localhost:2000/session", {
    credentials: "include",
  });
}

function deleteSession() {
  return fetch("http://localhost:2000/session", {
    method: "DELETE",
    credentials: "include",
  });
}

function authenticateUser(userEmail, plainPassword) {
  let data = "email=" + encodeURIComponent(userEmail);
  data += "&plainPassword=" + encodeURIComponent(plainPassword);
  return fetch("http://localhost:2000/session", {
    method: "POST",
    body: data,
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

function createItemServer(item) {
  var itemData = "item_name=" + encodeURIComponent(item.item_name);
  itemData += "&item_price=" + encodeURIComponent(item.item_price);
  itemData += "&item_points=" + encodeURIComponent(item.item_points);
  itemData += "&item_quantity=" + encodeURIComponent(item.item_quantity);
  itemData += "&img_url=" + encodeURIComponent(item.img_url);
  itemData += "&dateSubmitted=" + encodeURIComponent(item.dateSubmitted);
  return fetch(`${url}/items`, {
    method: "POST",
    body: itemData,
    credentials: "include",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

function getItemListFromServer() {
  return fetch(`${url}/items`, {
    credentials: 'include'
  });
}

function getShippingListFromServer() {
  return fetch(`${url}/shippings`, {
    credentials: 'include'
  });
}

var app = new Vue({
  el: '#app',
  data: {
    item_name: '',
    item_price: '',
    item_points: '',
    item_quantity: '',
    img_url: '',
    dateSubmitted: '',
    userEmail: '',
    userFirstName: '',
    userLastName: '',
    plainPassword: '',
    authenticated: false,
    itemInfo: [],
    shippingInfo: [],
    //  UI State
    loggedIn: false,
    itemsPage: true,
    signUp: false,
    addMode: false,
    addUserMode: false,
    viewMode: true,
    item: null,
    errorMessages: [],
    signUpMessages: [],
    signInMessages: [],
  },
  methods: {
    purchasePage: function () {
      this.itemsPage = false;
    },
    productsPage: function () {
      this.itemsPage = true;
    },
    addItem: function () {
      this.addMode = true;
    },
    closeAddItem: function () {
      this.addMode = false;
    },
    validateItem: function () {
      // this will validate the pizza inputs
      this.errorMessages = [];

      if (this.item_name.length == 0) {
        this.errorMessages.push("Item Name is required.");
      }
      if (this.item_price.length == 0) {
        this.errorMessages.push("Item Price is required.");
      }
      if (this.item_points.length == 0) {
        this.errorMessages.push("Item Points is required.");
      }
      if (this.item_quantity.length == 0) {
        this.errorMessages.push("Item Quantity is required.");
      }
      if (this.img_url.length == 0) {
        this.errorMessages.push("Item URL is required.");
      }
      return this.errorMessages == 0;
    },
    // moment: function () {
    //   return moment();
    // },
    submitItemName: function () {
      if (!this.validateItem()) {
        // don't send data, show errors instead
        return;
      }
      createItemServer({
        item_name: this.item_name,
        item_price: this.item_price,
        item_points: this.item_points,
        item_quantity: this.item_quantity,
        img_url: this.img_url,
      }).then((response) => {
        if (response.status == 201) {
          this.loadItems();
        } else {
          alert("Load Items Failed");
        }
      });
      this.item_name = "";
      this.item_price = "";
      this.item_points = "";
      this.item_quantity = "";
      this.img_url = "";
      this.addMode = false;
    },
    submitLogin: function () {
      // if (!this.validateSignup()) {
      //   return;
      // }
      // alert(document.querySelector("#inputEmail").value);
      authenticateUser(document.querySelector("#inputEmail").value, document.querySelector("#inputPassword").value).then((response) => {
        if (response.status == 401) {
          // this.plainPassword = "";
          alert ("Password is incorrect, try again");
        }else {
          // alert ("Login Successfull");
          console.log("Login Successfull");
          // this.loadLeads();
          this.checkLoggedIn();
          this.loggedIn = true;
        }
      });
      this.userEmail = "";
      this.plainPassword = "";
    },
    logoutUser: function () { 
      deleteSession().then((response) => {
        if (response.status == 200) {
          // alert("User Logged Out");
          console.log("User Logged Out");
          this.loggedIn = false;
        } else {
          alert("can't log out for some reason");
        }
      });
    },
    // use function keyword for function methods and arrows for methods (this applies inside vue not the outside functions)
    loadItems: function () { 
      getItemListFromServer().then((response) => {
          response.json().then((data) => {
            console.log("items loaded from server", data);
            this.itemInfo = data;
          });  
      });
    },
    loadPurchases: function () { 
      getShippingListFromServer().then((response) => {
          response.json().then((data) => {
            console.log("items loaded from server", data);
            this.shippingInfo = data;
          });  
      });
    },
    deleteItem: function ( item ) {
      console.log( "Deleting Item" );
      fetch( `${url}/items/${ item._id }`, {
        method: "DELETE"
      }).then( function ( response ) {
        if ( response.status == 404 ) {
          response.json( ).then( function ( data ) {
            alert( data.msg );
          });
        } else if ( response.status == 200 ) {
          app.loadItems();
          console.log('deleted lets goo');
        }
      });
      // this.loadLeads();
    },
    updateItem: function ( item ) {
      console.log( "Editing item name" );
      var req_body = {
        item_name: item.item_name,
        item_price: item.item_price,
        item_points: item.item_points,
        item_quantity: item.item_quantity,
        img_url: item.img_url
      };
      console.log(req_body)
      fetch( `${url}/items/${ _id }`, {
        method: "PUT",
        credentials: "include",
        body: JSON.stringify(req_body),
        headers: {"Content-Type": "application/x-www-form-urlencoded"}
      }).then( function ( response ) {
        if ( response.status == 400 || response.status == 404 ) {
          response.json( ).then( function ( data ) {
            alert( data.msg );
          });
        } else if ( response.status == 200 ) {
          console.log('aight finished')
          app.loaditems();
        }
      });
    },
    checkLoggedIn: function () {
      getSession().then(response => {
        if (response.status == 401) {
          // not logged in
          console.log('user is not logged in checkLoggedIn');
          
        } else if (response.status == 200) {
          // am logged in
          console.log('user is logged in');
          this.loadItems();
          this.loadPurchases();
          this.loggedIn = true;
        }
      });
    },
    closeCurrItem: function () {
      // this.viewMode = true;
      this.item = null;
    },
    showCurrItem: function (item) {
      // this.viewMode = false;
      console.log(item)
      this.item = item;
      console.log(this.item);
    }
  },
filters: {
    format: function (date) {
      return moment(date).format('L');
    }
  },
  created: function () {
    // called when the Vue app is loaded and ready
    // load the pizzas then the page loads
    this.checkLoggedIn();

  }
});