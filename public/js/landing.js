
const url = "http://localhost:2000"

function createLeadServer(lead) {
  var leadData = "email=" + encodeURIComponent(lead.email);
  leadData += "&dateSubmitted=" + encodeURIComponent(lead.dateSubmitted);
  return fetch(`${url}/leads`, {
    method: "POST",
    body: leadData,
    headers: {
      "Content-Type": "application/x-www-form-urlencoded"
    }
  });
}

var app = new Vue ({
	el: "#app",
	data: {
		email: '',
	},

	methods: {
	    submitLead: function () {
	      createLeadServer({
	        email: this.email,
	      }).then((response) => {
	        if (response.status == 201) {
	        	alert("Thank you for your submission, we'll announce on social media once our website is nearing the launch date; we'll be sure to send out a coupon, thanks!")
	        	document.getElementById("emailsub").style.display = "none";
	        } else {
	          console.log("Lead Capture Failed");
	        }
	      });
	      this.email = "";
	    },
	},

	created: function () {
		console.log("it worked");
	}
})