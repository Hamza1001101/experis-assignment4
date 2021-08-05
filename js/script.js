/**
 * Laptop info
 */

 const selectLaptops = document.getElementById("laptops");
 const imageRandom = document.getElementById("imageRandom");
 const laptopPrice = document.querySelector(".laptop-price");
 const laptopName = document.querySelector(".text-header");
 const laptopDescription = document.querySelector(".text-content");
 
 let DATA = [];
 let payBalance = 0;
 let isLoanTaken = false;
 let LAPTOP_PRICE = 0;
 let currentBalance = 0;
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
     LAPTOP_PRICE = selectedLaptop.price;
     imageRandom.src = `https://noroff-komputer-store-api.herokuapp.com/${selectedLaptop.image}`;
 };
 
 getItemNames();
 
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
 
     if (userInput === "" || userInput === null) {
         return alert("Sorry You Need to enter a valid value");
     }
 
     loan = +userInput;
     let allowedLoan = currentBalance * 2;
 
     if (loan > allowedLoan || isNaN(userInput)) {
         loan = 0;
         currentBalance = 0;
 
         return alert("Sorry You cannot take that much loan!");
     }
 
     if (isLoanTaken) {
         alert("You have to buy a computer first ");
         return;
     }
     isLoanTaken = true;
     currentBalance += loan;
     displayOutstandingLoan.innerText = `Your outstanding loan is ${loan} Kr`;
     displayBalance.innerText = currentBalance;
 
     btnRepay.hidden = false;
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
         displayOutstandingLoan.innerText =  `Your outstanding loan is ${loan} Kr`; //loan;
         isLoanTaken = false;
         //displayOutstandingLoan.hidden = true;
         btnRepay.hidden = true
     } else {
         isLoanTaken = true;
         payBalance = 0;
        // displayOutstandingLoan.hidden = false;
         displayOutstandingLoan.innerText = `Your outstanding loan is ${loan} Kr`;
         displayPay.innerText = payBalance;
     }
 };
 
 btnWork.addEventListener("click", handlePay);
 btnBank.addEventListener("click", handleBank);
 
 btnLoan.addEventListener("click", handleLoan);
 
 btnRepay.addEventListener("click", handleRepay);
 
 btnBuy.addEventListener("click", () => {
     if (LAPTOP_PRICE <= currentBalance) {
         alert("You got a new computer");
         isLoanTaken = true;
         currentBalance -= LAPTOP_PRICE;
         displayBalance.innerText = currentBalance;
     } else {
         alert("Insuffient amount");
     }
 });
 