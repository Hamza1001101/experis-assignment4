/**
 * Laptop info
 */

const selectLaptops = document.getElementById("laptops");
const imageRandom = document.getElementById("imageRandom");
const laptopPrice = document.querySelector(".laptop-price");
const laptopName = document.querySelector(".text-header");
const laptopDescription = document.querySelector(".text-content");

let LAPTOP_PRICE = 0;
let DATA = [];
let payBalance = 0;
let isLoanTaken = false;
let isLaptopBuy = false;
let currentBalance = 0;
let specs = [];
//let totalBalance = 0;

//let outstandingLoan = 0;
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

const features = document.querySelector(".specs");

const getItemNames = async () => {
  DATA = await fetchData();

  //console.log(Array.isArray(DATA))
  for (let i = 0; i < DATA.length; i++) {
    let element = document.createElement("option");

    element.innerText = DATA[i].title; // DATA[i] //.title;

    selectLaptops.append(element);

    displaySpecs(DATA[0].specs);
    getLaptopInformation(DATA[0]);
  }

  selectLaptops.addEventListener("change", handleLaptopContentChange);
};

const handleLaptopContentChange = (e) => {
  const selectedLaptop = DATA[e.target.selectedIndex];
  getLaptopInformation(selectedLaptop);
  /*laptopPrice.innerText = selectedLaptop.price;
  laptopName.innerText = selectedLaptop.title;
  laptopDescription.innerText = selectedLaptop.description;

  imageRandom.src = `https://noroff-komputer-store-api.herokuapp.com/${selectedLaptop.image}`;*/
  //LAPTOP_PRICE = selectedLaptop.price;
  DATA[e.target.selectedIndex].specs.forEach((element) => {
    specs.push(element);
  });

  displaySpecs(specs);
  specs = [];
  //console.log(DATA[e.target.selectedIndex].specs)
};

getItemNames();
const getLaptopInformation = (laptopInfo) => {
  laptopPrice.innerText = laptopInfo.price;
  laptopName.innerText = laptopInfo.title;
  laptopDescription.innerText = laptopInfo.description;
  LAPTOP_PRICE = laptopInfo.price;
  imageRandom.src = `https://noroff-komputer-store-api.herokuapp.com/${laptopInfo.image}`;
};
/*function content(i) {
  laptopPrice.innerText = DATA[i].price
  laptopDescription.innerText = DATA[i].description
  laptopName.innerText = DATA[i].title
  imageRandom.src = `https://noroff-komputer-store-api.herokuapp.com/${DATA[i].image}`;
}*/

const displaySpecs = (specs) => {
  features.innerText = "";
  specs.forEach((item) => {
    let li = document.createElement("li");
    li.innerText += '✔️' +item ;
    features.appendChild(li);
  });
};

/**
 * Bank info
 */

const displayBalance = document.querySelector(".current-balance");
const displayOutstandingLoan = document.querySelector(".standing-loan");
/*const remainingBalancePlusLoan = document.querySelector(
     ".remaining-balance-plus-loan"
 );*/

/**
 * Work info
 */

const displayPay = document.querySelector(".pay-amount");
const btnWork = document.querySelector(".btn-work");
const btnBank = document.querySelector(".btn-bank");
const btnLoan = document.querySelector(".btn-loan");
const btnBuy = document.querySelector(".btn-buy-now");

const btnRepay = document.querySelector(".repay-btn");
btnRepay.hidden = true;
/**
 * * Work & Pay
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

    console.log("Loan " + loan);
    console.log("Paybalance " + payBalance);
    console.log("amount to be paid", amountToBePaid);

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

//let currentBalancePlustLoan = 0;

const handleLoan = () => {
  let userInput = prompt("How much loan do you need?");

  if (userInput === "" || userInput === null || isNaN(userInput)) {
    return alert("Sorry You Need to enter a valid value");
  }
  if (loan > 0) {
    alert("Pay the outstanding amount first");
    return;
  }

  loan = +userInput;
  let allowedLoan = currentBalance * 2;

  if (loan > allowedLoan) {
    loan = 0;
    // currentBalance = 0;
    return alert("Sorry You cannot take that much loan!");
  }

  if (isLaptopBuy === true) {
    loan = 0;
    return alert("hehe catch ya");
  } else {
    currentBalance += loan;
    displayOutstandingLoan.innerText = `Your outstanding loan is ${loan} Kr`;
    displayBalance.innerText = currentBalance;
    btnRepay.hidden = false;
    isLaptopBuy = true;
  }
  console.log(isLaptopBuy);
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
    displayOutstandingLoan.innerText = `Your outstanding loan is ${loan} Kr`; //loan;
    isLoanTaken = false;
    //displayOutstandingLoan.hidden = true;
    btnRepay.hidden = true;
  } else {
    isLoanTaken = true;
    payBalance = 0;
    // displayOutstandingLoan.hidden = false;
    displayOutstandingLoan.innerText = `Your outstanding loan is ${loan} Kr`;
    displayPay.innerText = payBalance;
  }
};

btnBuy.addEventListener("click", () => {
  if (LAPTOP_PRICE <= currentBalance) {
    alert("You got a new computer");
    //isLoanTaken = false;
    isLaptopBuy = false;
    currentBalance -= LAPTOP_PRICE;
    displayBalance.innerText = currentBalance;
  } else {
    alert("Insufficient Amount");
  }
});

btnWork.addEventListener("click", handlePay);
btnBank.addEventListener("click", handleBank);

btnLoan.addEventListener("click", handleLoan);

btnRepay.addEventListener("click", handleRepay);
