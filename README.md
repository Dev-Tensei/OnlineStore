# LoReyna

A web app that allows users to view and purchase items available. This project also has a backend tool that has a CRUD structured server in order to manage inventory and display purchasing information.

The backend tool has a login/registration functionality via Passport middleware and its 'local' strategy.

## Technologies Used:

* HTML, CSS, Bootstrap (Client)
* Vue.js (Client)
* Node.js (Server)
* Express (Server)
* Passport (Server)
* MongoDB (Database)

![DragonBall Roster Show Case](https://github.com/Dev-Tensei/QuickReference/blob/main/client/images/homepage.png?raw=true)

## Items Resource

Attributes:

* item_name (string)
* item_price (string)
* item_points (string)
* item_quantity (string)
* img_url (string)
* dateSubmitted (date)



## REST Endpoints

Name                           			  | Method | Path
------------------------------------------|--------|------------------
Retrieve an item        				  | GET    | /items
Retrieve an individual item record		  | GET    | /items/:id
Create an individual item record    	  | POST   | /items
Update an individual item record		  | PUT    | /items/:id
Delete an individual item record		  | DELETE | /items/:id




## Shippings Resource

Attributes:

* product (string)
* full_name (string)
* ship_email (string)
* address (string)
* suite (string)
* city (date)
* state (string)
* zip (string)
* amount (date)
* dateSubmitted (date)

## REST Endpoints

Name                           			  | Method | Path
------------------------------------------|--------|------------------
Retrieve a shipping record        		  | GET    | /shippings
Create an individual shipping record      | POST   | /shippings




## Users Resource

Attributes:

* email (string)
* firstName (string)
* lastName (string)
* cellNumber (string)
* admin (boolean)
* encryptedPassword



## REST Endpoints

Name                           			  | Method | Path
------------------------------------------|--------|------------------
Create a User     	  					  | POST   | /users



## Leads Resource

Attributes:

* email (string)
* dateSubmitted (date)



## REST Endpoints

Name                           			  | Method | Path
------------------------------------------|--------|------------------
Retrieve a Lead     	  				  | GET    | /leads
Create a Lead     	  					  | POST   | /leads

## Backend Login/Registration Functionality
![DragonBall Roster Show Case](https://github.com/Dev-Tensei/QuickReference/blob/main/client/images/homepage.png?raw=true)

## Item View Display
![DragonBall Roster Show Case](https://github.com/Dev-Tensei/QuickReference/blob/main/client/images/homepage.png?raw=true)

## Purchasing Functionality
![DragonBall Roster Show Case](https://github.com/Dev-Tensei/QuickReference/blob/main/client/images/homepage.png?raw=true)


### This is a work in progress, potential future updates include:

* Shopping Cart Implementation
* Multi-page implementation via vue exports (currently is a single page web app)
* More payment options
* Designated checkout page.
