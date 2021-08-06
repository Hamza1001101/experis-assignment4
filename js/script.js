/**
 * Laptop info
 */

const selectLaptops = document.getElementById("laptops");
const imageRandom = document.getElementById("imageRandom");
const laptopPrice = document.querySelector(".laptop-price");
const laptopName = document.querySelector(".text-header");
const laptopDescription = document.querySelector(".text-content");
const features = document.querySelector(".specs");
let LAPTOP_PRICE = 0;
let DATA = [];
let payBalance = 0;
let isLoanTaken = false;
let isLaptopBuy = false;
let currentBalance = 0;
let specs = [];

let loan = 0;

/**
 * Fetch Data and display it.
 * @returns
 */
const fetchData = async () => {
  try {
    const response = await fetch(
      "https://noroff-komputer-store-api.herokuapp.com/computers"
    );
    return await response.json();
  } catch (error) {
    console.log("Something went wrong", error);
  }
};

const getItemNames = async () => {
  DATA = await fetchData();

  //console.log(Array.isArray(DATA))
  for (let i = 0; i < DATA.length; i++) {
    let element = document.createElement("option");

    element.innerText = DATA[i].title;
    selectLaptops.append(element);
    displaySpecs(DATA[0].specs);
    getLaptopInformation(DATA[0]);
  }

  selectLaptops.addEventListener("change", handleLaptopContentChange);
};

/**
 * Display laptop info
 * @param {*} e
 */
const handleLaptopContentChange = (e) => {
  const selectedLaptop = DATA[e.target.selectedIndex];
  getLaptopInformation(selectedLaptop);

  DATA[e.target.selectedIndex].specs.forEach((element) => {
    specs.push(element);
  });

  displaySpecs(specs);
  specs = [];
};

getItemNames();

const getLaptopInformation = (laptopInfo) => {
  laptopPrice.innerText = laptopInfo.price;
  laptopName.innerText = laptopInfo.title;
  laptopDescription.innerText = laptopInfo.description;
  LAPTOP_PRICE = laptopInfo.price;
  imageRandom.src = `https://noroff-komputer-store-api.herokuapp.com/${laptopInfo.image}`;
};

const displaySpecs = (specs) => {
  features.innerText = "";
  specs.forEach((item) => {
    let li = document.createElement("li");
    li.innerText += "✔️" + item;
    features.appendChild(li);
  });
};

/**
 * Bank info related elements
 */

const displayBalance = document.querySelector(".current-balance");
const displayOutstandingLoan = document.querySelector(".standing-loan");

/**
 * Work related elements
 */

const displayPay = document.querySelector(".pay-amount");
const btnWork = document.querySelector(".btn-work");
const btnBank = document.querySelector(".btn-bank");
const btnLoan = document.querySelector(".btn-loan");
const btnBuy = document.querySelector(".btn-buy-now");

const btnRepay = document.querySelector(".repay-btn");
btnRepay.hidden = true;

/**
 * calculate percentage
 * @param {*} value
 * @returns
 */
const calcPercent = (value) => {
  return (value = value * (1 - 0.1));
};

const handlePay = () => {
  payBalance += 100;

  displayPay.innerText = payBalance;
};

const handleBank = () => {
  if (payBalance === 0) {
    alert("work more");
    return;
  }

  if (loan > 0.1) {
    let amountToBePaid = payBalance / 10;
    loan -= amountToBePaid;
    if (loan < 0) {
      currentBalance += Math.abs(loan);
      loan = 0;
      displayOutstandingLoan.innerText = `Your outstanding loan is ${-loan} Kr`;
      btnRepay.hidden = true;
    }

    payBalance = calcPercent(payBalance);
    displayOutstandingLoan.innerText = `Your outstanding loan is ${loan} Kr`;
  }
  currentBalance += payBalance;
  displayBalance.innerText = currentBalance;
  payBalance = 0;
  displayPay.innerText = 0;
};

const handleLoan = () => {
  let userInput = prompt("How much loan do you need?");

  if (userInput === "" || userInput === null || isNaN(userInput)) {
    return Toastify({
      text: "Sorry You need to enter a valid value",
      backgroundColor: "red",
      className: "info",
    }).showToast();
  }
  if (loan > 0) {
    return Toastify({
      text: "Pay the outstanding amount first!",
      backgroundColor: "red",
      className: "info",
    }).showToast();
  }

  loan = +userInput;
  let allowedLoan = currentBalance * 2;

  if (loan > allowedLoan) {
    loan = 0;
    // currentBalance = 0;
    return Toastify({
      text: "Sorry You cannot take that much loan 💵 ",
      backgroundColor: "red",
      className: "info",
    }).showToast();
  }

  if (isLaptopBuy === true) {
    loan = 0;
    return Toastify({
      text: "Sorry You need to buy a computer 💻 first ",
      backgroundColor: "red",
      className: "info",
    }).showToast();
  } else {
    currentBalance += loan;
    displayOutstandingLoan.innerText = `Your outstanding loan is ${loan} Kr`;
    displayBalance.innerText = currentBalance;
    btnRepay.hidden = false;
    isLaptopBuy = true;
  }
};

const handleRepay = () => {
  if (payBalance === 0) {
    return;
  }
  loan -= payBalance;
  if (loan <= 0) {
    displayPay.innerText = -loan;
    payBalance = -loan;
    loan = 0;
    displayOutstandingLoan.innerText = `Your outstanding loan is ${loan} Kr`;
    isLoanTaken = false;

    btnRepay.hidden = true;
  } else {
    isLoanTaken = true;
    payBalance = 0;
    displayOutstandingLoan.innerText = `Your outstanding loan is ${loan} Kr`;
    displayPay.innerText = payBalance;
  }
};

btnBuy.addEventListener("click", () => {
  if (LAPTOP_PRICE <= currentBalance) {
    Toastify({
      text: "You got a new computer 💻 CONGRATS! ",
      backgroundColor: "",
      position: "center",
      className: "info",
    }).showToast();

    isLaptopBuy = false;
    currentBalance -= LAPTOP_PRICE;
    displayBalance.innerText = currentBalance;
  } else {
    Toastify({
      text: "Insufficient Amount! Do some work or take a loan! 😊",
      backgroundColor: "linear-gradient(to right, #F01890, #F0004B)",
      className: "info",
    }).showToast();
   
  }
});

btnWork.addEventListener("click", handlePay);
btnBank.addEventListener("click", handleBank);
btnLoan.addEventListener("click", handleLoan);
btnRepay.addEventListener("click", handleRepay);
