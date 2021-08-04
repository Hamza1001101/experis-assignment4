/**
 * Laptop info
 */

const selectLaptops = document.getElementById("laptops");
const imageRandom = document.getElementById("imageRandom");
const laptopPrice = document.querySelector(".laptop-price");
const laptopName = document.querySelector(".text-header");
const laptopDescription = document.querySelector(".text-content");

/**
 * Bank info
 */

const displayBalance = document.querySelector(".balance-price");
const outstandingLoan = document.querySelector(".standing-loan");

/**
 * Work info
 */

const displayPay = document.querySelector(".pay-amount");
const btnWork = document.querySelector(".btn-work");
const btnBank = document.querySelector(".btn-bank");
const btnLoan = document.querySelector(".btn-loan");
const btnBuy = document.querySelector('.btn-buy-now')

let DATA = [];
let payBalance = 0;

let LAPTOP_PRICE = 0
//let currentBalanceTracker = 0; 
let currentBalance = 0 
let totalBalance = 0; 
/**
 * * Work & Pay
 */

const handlePay = () => {
  payBalance += 100;
  displayPay.innerText = payBalance;
};

const handleBank = () => {

  if(payBalance === 0) {
    alert('work more')
    return 
  }
  currentBalance += payBalance
  displayBalance.innerText = currentBalance
  //currentBalanceTracker = payBalance

  payBalance = 0;
  displayPay.innerText = 0;

};



const handleLoan = () => {
  
  let userInput = prompt('How much loan do you need?')
  
  if(userInput === '' || userInput === null) {
    return alert('Sorry You Need to enter a valid value')
  }
  let loan = +userInput
  let allowedLoan = currentBalance * 2
  let loansTaken = 0; 


  if(loansTaken > 0) {
    alert('Buy something first')
    return
  }
   if(loan > allowedLoan || (isNaN(userInput)) ) {
    alert('Sorry You cannot take that much loan!')
  }
  else {
    loansTaken++
    outstandingLoan.innerText = `Your outstanding loan is ${userInput} Kr`
    //currentBalanceTracker = +userInput + currentBalanceTracker
    totalBalance = +userInput + currentBalance
  }
  
}


btnWork.addEventListener("click", handlePay);
btnBank.addEventListener("click", handleBank);

btnLoan.addEventListener('click', handleLoan)

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
  }

  selectLaptops.addEventListener("change", handleLaptopContentChange);
};

const handleLaptopContentChange = (e) => {
  const selectedLaptop = DATA[e.target.selectedIndex];
  laptopPrice.innerText = selectedLaptop.price;
  laptopName.innerText = selectedLaptop.title;
  laptopDescription.innerText = selectedLaptop.description;
  LAPTOP_PRICE = selectedLaptop.price
  //this is where I'm struggling ??
  imageRandom.src = `https://noroff-komputer-store-api.herokuapp.com/${selectedLaptop.image}`;
};

getItemNames();


btnBuy.addEventListener('click', () => {
  if(LAPTOP_PRICE > totalBalance) {
    alert('Insufficient amount')
    return 
  } 
  else  {
    totalBalance -= LAPTOP_PRICE
    currentBalance = currentBalance - totalBalance
   // currentBalanceTracker= currentBalanceTracker - LAPTOP_PRICE

    alert('You got a new computer')
    displayBalance.innerText = totalBalance
    console.log(totalBalance)
  }
})