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



function fetchData() {
    return fetch('https://noroff-komputer-store-api.herokuapp.com/computers')
    .then(response => {return response.json();}) 
}

const selectLaptops = document.getElementById('laptops')
async function getItemNames() {
    const result = [];
    const data = await fetchData();

    for(let i=0; i < data.length; i++) {
        let item = data[i]
        let element = document.createElement('option')
        element.innerHTML= data[i].title
        selectLaptops.append(element)
    }
    //console.log(data[0].title)

}

getItemNames()


