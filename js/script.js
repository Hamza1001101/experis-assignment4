const balance = 250;

document.querySelector(".balance-price").innerHTML = balance;

let loanBtn = document.querySelector(".btn-loan");

loanBtn.addEventListener("click", () => {
  let userInput = prompt("How much loan do you want to take? ");
  let loan = +userInput;
  let maxLoan = balance * 2;
  if (loan > maxLoan) {
    alert(`Ooobs! You cannot get a loan greater than ${maxLoan}`);
  } else alert(`Congratis You got a new loan!`);
});

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

const selectLaptops = document.getElementById("laptops");
const imageRandom = document.getElementById("imageRandom");
const laptopPrice = document.querySelector(".laptop-price");
const laptopName = document.querySelector(".text-header");
const laptopDescription = document.querySelector(".text-content");

let DATA = [];
const getItemNames = async () => {
  DATA = await fetchData();

  //console.log(Array.isArray(DATA))
  for (let i = 0; i < DATA.length; i++) {
    let element = document.createElement("option");
    element.innerText = DATA[i].title;

    selectLaptops.append(element);
  }

  console.log(DATA[0].image);
  //laptopName.innerText = selectLaptops.options[selectLaptops.selectedIndex].value;


  selectLaptops.addEventListener("change", handleLaptopContentChange);
};

const handleLaptopContentChange = (e) => {
  const selectedLaptop = DATA[e.target.selectedIndex];
  laptopPrice.innerText = selectedLaptop.price;
  laptopName.innerText = selectedLaptop.title;
  laptopDescription.innerText = selectedLaptop.description

  //this is where I'm struggling ??
  imageRandom.srcset= selectedLaptop.image
};

getItemNames();
