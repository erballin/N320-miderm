import PDFGenerator from "./PDFGenerator.js";

const nameInput = document.getElementById("input-name");
const emailInput = document.getElementById("input-email");
const viewButton = document.getElementById("viewPdf");
const saveButton = document.getElementById("downloadPdf");

let cart = [
  {
    product: "Propulsion Gel [1gal]",
    price: 249.99,
    quantity: 0,
  },
  {
    product: "Aperture Science Handheld Portal Device",
    price: 1499.99,
    quantity: 0,
  },
  {
    product: "Companion Cube",
    price: 99.99,
    quantity: 0,
  },
  {
    product: "Sentry Turret",
    price: 99.99,
    quantity: 0,
  },
];

// Handle the button getting disabled / enabled
nameInput.addEventListener("change", () => {
  doInputCheck();
});
emailInput.addEventListener("change", () => {
  doInputCheck();
});

function doInputCheck() {
  if (nameInput.value != "" && emailInput.value != "") {
    viewButton.disabled = false;
    saveButton.disabled = false;
  } else {
    viewButton.disabled = true;
    saveButton.disabled = true;
  }
}
doInputCheck();

// Handle adding items to cart.
function addProductToCart(productName) {
  let Index = cart.findIndex((item) => item.product == productName);
  if (Index == -1) return;
  cart[Index].quantity += 1;
}

document.querySelectorAll(".addToCart").forEach(function (element) {
  element.addEventListener("click", function () {
    addProductToCart(this.getAttribute("data-product"));
  });
});

viewButton.addEventListener("click", () => {
  const invoicePdf = new PDFGenerator("invoice-ApertureGoods");
  invoicePdf.addHeader("Aperture Goods");
  invoicePdf.addText("", null, null, 2);
  invoicePdf.addText("Contact us at: 317-555-5555 OR aperturegoods@noreply.com");
  invoicePdf.addText("Customer Info");
  invoicePdf.addText(`name: ${nameInput.value}`, 14, null, 6);
  invoicePdf.addText(`email: ${emailInput.value}`, 14, null, 6);
  invoicePdf.addText(`Invoice Number: ${generateRandomString(8)}`, 10, null, 10);
  invoicePdf.addText(`Date of Purchase: ${getDateAndTime()}`, 10, null, 10);

  invoicePdf.addTableLabels();
  let preTaxTotal = 0;
  cart.forEach((product) => {
    if (product.quantity == 0) return;
    let productCost = product.price * product.quantity;
    invoicePdf.addTableRow(
      `${product.product}`,
      `$${product.price}`,
      `${product.quantity}`,
      `${formatMoneyDecimal(productCost)}`
    );
    preTaxTotal += productCost;
  });
  invoicePdf.beforeTaxTotal(`$${formatMoneyDecimal(preTaxTotal)}`);
  let tax = preTaxTotal * 0.07;
  invoicePdf.addedTax(`$${formatMoneyDecimal(tax)}`);
  invoicePdf.totalPrice(`$${formatMoneyDecimal(preTaxTotal + tax)}`);
  invoicePdf.updatePreview();
});

function generateRandomString(length) {
  const characters = "0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * characters.length));
  }
  return result;
}

function getDateAndTime() {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, "0"); // Month is 0-indexed
  const day = String(now.getDate()).padStart(2, "0");
  const hours = String(now.getHours()).padStart(2, "0");
  const minutes = String(now.getMinutes()).padStart(2, "0");
  const seconds = String(now.getSeconds()).padStart(2, "0");

  const formattedDateTime = `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
  return formattedDateTime;
}

function formatMoneyDecimal(input) {
  return Math.round(input * 100) / 100;
}
