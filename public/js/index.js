console.log('working');

function deleteItemFromServer(item) {
  return fetch("http://localhost:2000/items/" + pet, {
    method: "DELETE",
    // body: petData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

// function createItemServer(item) {
//   var itemData = "item_name=" + encodeURIComponent(item.item_name);
//   itemData += "&item_price=" + encodeURIComponent(item.item_price);
//   itemData += "&item_points=" + encodeURIComponent(item.item_points);
//   itemData += "&item_quantity=" + encodeURIComponent(item.item_quantity);
//   itemData += "&img_url=" + encodeURIComponent(item.img_url);
//   return fetch("http://localhost:2000/items", {
//     method: "POST",
//     body: itemData,
//     headers: {
//       "Content-Type": "application/x-www-form-urlencoded"
//     }
//   });
// }

function getItemListFromServer() {
  return fetch("http://localhost:2000/items");
}

function createItemServer(shipping) {
  var shippingData = "product=" + encodeURIComponent(shipping.product);
  shippingData += "&full_name=" + encodeURIComponent(shipping.full_name);
  shippingData += "&ship_email=" + encodeURIComponent(shipping.ship_email);
  shippingData += "&address=" + encodeURIComponent(shipping.address);
  shippingData += "&suite=" + encodeURIComponent(shipping.suite);
  shippingData += "&city=" + encodeURIComponent(shipping.city);
  shippingData += "&state=" + encodeURIComponent(shipping.state);
  shippingData += "&zip=" + encodeURIComponent(shipping.zip);
  shippingData += "&amount=" + encodeURIComponent(shipping.amount);
  return fetch("http://localhost:2000/shippings", {
    method: "POST",
    body: shippingData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

var app = new Vue({
  el: '#app',
  vuetify: new Vuetify(),
  data: {
    itemName: '',
    itemPrice: '',
    itemPoints: '',
    itemQuantity: '',
    itemImg: '',
    itemInfo: [],
    product: '',
    full_name: '',
    ship_email: '',
    address: '',
    suite: '',
    city: '',
    state: '',
    zip: '',
    amount: '',
    currentItem: null,
    homePage: true,
    shopPage: false,
    addMode: false,
    loginMode: false,
    greeting: "Vuetify",
    loading: false,
  },
  methods: {
    addOwner: function() {
      // about to add a person
      console.log('adding owner mode is true')
      this.addMode = true;
    },
    submitShipping: function () {
      createItemServer({
        product: this.product,
        full_name: this.full_name,
        ship_email: this.ship_email,
        address: this.address,
        suite: this.suite,
        city: this.city,
        state: this.state,
        zip: this.zip,
        amount: this.amount
      }).then((response) => {
        if (response.status == 201) {
          console.log("shipping posted")
        } else {
          alert("Shipping Post Failed");
        }
      });
      this.product = "";
      this.full_name = "";
      this.ship_email = "";
      this.address = "";
      this.suite = "";
      this.city = "";
      this.state = "";
      this.zip = "";
      this.amount = "";
    },
    // submitNewItem: function () {
    //   createItemServer({
    //     item_name: this.itemName,
    //     item_price: this.itemPrice,
    //     item_points: this.itemPoints,
    //     item_quantity: this.itemQuantity,
    //     item_quantity: this.itemQuantity
    //   }).then((response) => {
    //     if (response.status == 201) {
    //       this.loadItems();
    //     } else {
    //       alert("Loading items Failed");
    //     }
    //   });
    //   this.itemName = "";
    //   this.itemPrice = "";
    //   this.itemPoints = "";
    //   this.itemQuantity = "";
    //   this.addMode = false;
    // },
    // use function keyword for function methods and arrows for methods (this applies inside vue not the outside functions)
    loadItems: function () { 
      getItemListFromServer().then((response) => {
        response.json().then((data) => {
          console.log("items loaded from server", data);
          this.itemInfo = data;
        });
      });
    },
    closeItemDetails: function () {
      this.homePage = true;
      this.currentItem = null;
    },
    showItemDetails: function (item) {
      this.product = item.item_name;
      console.log(this.product);
      this.homePage = false;
      this.currentItem = item;
    },
    closeLogin: function () {
      this.loginMode = false;
      this.homePage = true;
    },
    showLogin: function () {
      this.loginMode = true;
      this.homePage = false;
    },
    showShop: function () {
      this.shopPage = true;
      this.homePage = false;
    },
    deleteItem: function () { 
      deleteItemFromServer().then((response) => {
        response.json().then((data) => {
          // console.log("pets loaded from server", data);
          this.itemInfo = {};
        });
      });
    }
  },
  created: function () {
    // called when the Vue app is loaded and ready
    // load the pizzas then the page loads
    this.loadItems();
  }
});