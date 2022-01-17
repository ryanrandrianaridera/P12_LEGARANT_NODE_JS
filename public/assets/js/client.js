console.log("Client-side code running");

// Variables declaration
var emailInput = document.getElementById("inputEmail");
var passwordInput = document.getElementById("inputPassword");
var registerButton = document.getElementById("registerButton");
var loginButton = document.getElementById("loginButton");
var deconnectButton = document.getElementById("deconnectButton");
var firstNameInput = document.getElementById("inputFirstName");
var lastNameInput = document.getElementById("inputLastName");
var footerLogin = document.getElementById("footerLogin");
var footerRegister = document.getElementById("footerRegister");
var createAccountTitle = document.getElementById("createAccountLogin");
var loginTitle = document.getElementById("loginTitle");
var loginLink = document.getElementById("loginLink");
var registerLink = document.getElementById("signInLink");
var blocRegister = document.getElementById("blocRegister");
var blocLogin = document.getElementById("blocLogin");
var updateButton = document.getElementById("updateButton");
var blocProductDetails = document.getElementById("blocProductDetails");
var welcomePage = document.getElementById("welcomePage");
var informationsPage = document.getElementById("informationsPage");
var contactSalutation = document.getElementById("salesSalutation");
var contactFirstName = document.getElementById("salesFirstName");
var contactLastName = document.getElementById("salesLastName");
var contactEmail = document.getElementById("salesEmail");
var contactPhone = document.getElementById("salesPhoneNumber");
var contactStreet = document.getElementById("salesStreet");
var contactCity = document.getElementById("salesCity");
var contactCountry = document.getElementById("salesCountry");
var contactSalesforceId = document.getElementById("salesSalesforceId");

/*-----------------------------------------------------------------------*/

// Display resister page Fields
registerLink.addEventListener("click", displayRegisterPage);

// Back to login page
loginLink.addEventListener("click", displayLoginPage);

// display register page
function displayRegisterPage() {
  blocRegister.style.display = "block";
  createAccountTitle.style.display = "block";
  footerLogin.style.display = "block";
  registerButton.style.display = "block";
  registerButton.style.margin = "auto";
  loginTitle.style.display = "none";
  footerRegister.style.display = "none";
  loginButton.style.display = "none";
  //cancelButton.style.display = "none";
}
// display login page
function displayLoginPage() {
  blocRegister.style.display = "none";
  createAccountTitle.style.display = "none";
  footerLogin.style.display = "none";
  registerButton.style.display = "none";
  loginTitle.style.display = "block";
  footerRegister.style.display = "block";
  loginButton.style.display = "block";
  loginButton.style.margin = "auto";
}

/*-----------------------------------------------------------------------*/

// REQUESTS TO SERVER

// Log a contact already registered
loginButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (emailInput.value == "" || passwordInput.value == "") {
    alert("Email and Password are required! ");
  } else {
    //Create our request
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        var token = xhr.getResponseHeader("authorization");
        if (!!token && token.startsWith("Bearer ")) {
          token = token.slice(7, token.length);
          //console.log(token);
          sessionStorage.setItem("token", token);
        }
        if (xhr.status == 200 && xhr.responseText != "") {
          var response = JSON.parse(xhr.response);
          //console.log(response);

          // Call function to display contact details
          displayContactDetails(response);

          // Call function to display contract details
          displayContractDetails(response.sfid);

          // Call function to display Legarant products
          displayLegarantProduct();

          // display contact informations
          displayContactInformations(response.firstname);
        } else {
          document.getElementById("errorMessage").innerHTML =
            "Sorry but we couldn't find your account, please verify email or password.";
          //alert("Sorry but we couldn't find your account, please verify email or password.");
        }
      }
    };
    xhr.open("POST", "/api/sign/login", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(
      JSON.stringify({
        password: passwordInput.value,
        email: emailInput.value,
      })
    );
  }
});

// Deconnect Button
deconnectButton.addEventListener("click", function (e) {
  e.preventDefault();
  location.reload();
});

// Register a new contact
registerButton.addEventListener("click", function (e) {
  e.preventDefault();
  if (
    inputFirstName.value == "" ||
    inputLastName.value == "" ||
    inputEmail.value == "" ||
    inputPassword.value == ""
  ) {
    document.getElementById("errorMessage").innerHTML =
      "FirstName & LastName & Email & Password are required";
    //alert("FirstName & LastName & Email & Password are required");
  } else {
    //Create our request
    var xhr = new XMLHttpRequest();
    xhr.onreadystatechange = function () {
      if (xhr.readyState == 4) {
        if (xhr.status == 201 && xhr.responseText != "") {
          var response = JSON.parse(xhr.response);
          document.getElementById("errorMessage").innerHTML =
            "Your Account has been registered with success ! Please Log In";
          //alert("Your Account has been registered with success ! Please Log In");
          location.reload();
          sessionStorage.clear();
        } else {
          document.getElementById("errorMessage").innerHTML =
            "Sorry but we couldn't find your account with these informations.";
          // alert("Sorry but we couldn't find your account with these informations.");
        }
      }
    };
    xhr.open("POST", "/api/sign/register", true);
    xhr.setRequestHeader("Content-type", "application/json");
    xhr.send(
      JSON.stringify({
        salutation: inputSalutation.value,
        firstname: inputFirstName.value,
        lastname: inputLastName.value,
        email: inputEmail.value,
        password: inputPassword.value,
      })
    );
  }
});

// Update contacts details
updateButton.addEventListener("click", function (e) {
  e.preventDefault();
  //Create our request
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200) {
        var response = JSON.parse(xhr.response);
        document.getElementById("updateMessage").textContent = response.message;
        //alert("Your informations are updated.");
      } else {
        document.getElementById("updateMessage").textContent =
          "Sorry, but your contact details are no updated";
        document.getElementById("updateMessage").style.color = "Red";
        //alert("Sorry, but your contact details are no updated.");
      }
    }
  };
  xhr.open("PATCH", "/api/contact/update", true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(
    JSON.stringify({
      salutation: contactSalutation.value,
      firstname: contactFirstName.value,
      lastname: contactLastName.value,
      email: contactEmail.value,
      phone: contactPhone.value,
      mailingstreet: contactStreet.value,
      mailingcity: contactCity.value,
      mailingcountry: contactCountry.value,
      sfid: contactSalesforceId.value,
    })
  );
});

/*-----------------------------------------------------------------------*/

// FUNCTIONS
function displayContactInformations(firstName) {
  welcomePage.style.display = "none";
  informationsPage.style.display = "block";
  document.getElementById("welcomePersonalSpace").textContent =
    "Welcome " + firstName + " to my personal space";
}

function displayContactDetails(contact) {
  contactSalutation.value = contact.salutation;
  contactFirstName.value = contact.firstname;
  contactLastName.value = contact.lastname;
  contactEmail.value = contact.email;
  contactPhone.value = contact.phone;
  contactStreet.value = contact.mailingstreet;
  contactCity.value = contact.mailingcity;
  contactCountry.value = contact.mailingcountry;
  contactSalesforceId.value = contact.sfid;
}

function displayContractDetails(salesforceId) {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200 && xhr.responseText != "") {
        var response = JSON.parse(xhr.response);

        // display contract informations
        document.getElementById("contactContractNumber").innerHTML =
          "Contract Number: " + response.contractnumber;
        document.getElementById("contactContractStartDate").innerHTML =
          "Contract Start Date: " + response.startdate.split("T")[0];
        document.getElementById("contactContractEndDate").innerHTML =
          "Contract End Date: " + response.enddate.split("T")[0];
        document.getElementById("contactContractTerm").innerHTML =
          "Contract Term (months): " + response.contractterm;
      } else {
        document.getElementById("contactContractNumber").innerHTML =
          "We could" +
          't find a contract related to your account.</br>Please <a href="mailto:sales@legarant.com"> contact your seller</a>';
      }
    }
  };
  xhr.open("POST", "/api/contract/getContract", true);
  xhr.setRequestHeader("Content-type", "application/json");
  xhr.send(
    JSON.stringify({
      sfid: salesforceId,
    })
  );
}

function displayLegarantProduct() {
  var xhr = new XMLHttpRequest();
  xhr.onreadystatechange = function () {
    if (xhr.readyState == 4) {
      if (xhr.status == 200 && xhr.responseText != "") {
        var response = JSON.parse(xhr.response);

        // display product informations
        for (var product in response) displayProducts(response[product]);
      } else {
        blocProductDetails.style.display = "none";
      }
    }
  };
  xhr.open("POST", "/api/product/getProduct", true);
  xhr.send();
}

function displayProducts(product) {
  var productName = product.name;
  var productCode = product.productcode;
  var productPrice = product.unitprice;

  var productItem = document.createElement("div");
  productItem.className = "productItem";
  blocProductDetails.appendChild(productItem);

  var productNameItem = document.createElement("p");
  productNameItem.className = "productNameItem";
  productItem.appendChild(productNameItem);

  var productPriceItem = document.createElement("p");
  productPriceItem.className = "productPriceItem";
  productItem.appendChild(productPriceItem);

  var productCodeItem = document.createElement("p");
  productCodeItem.className = "productCodeItem";
  productItem.appendChild(productCodeItem);

  productNameItem.innerHTML = productName;
  productPriceItem.innerHTML = "Unit Price: " + euro.format(productPrice);
  productCodeItem.innerHTML = "Product Code: " + productCode;
}

// FORMATING THE PRODUCT PRICE
const euro = new Intl.NumberFormat("fr-FR", {
  style: "currency",
  currency: "EUR",
  minimumFractionDigits: 2,
});
