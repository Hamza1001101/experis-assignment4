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



const fetchData = async ()  => {
    try {
    const response = await fetch('https://noroff-komputer-store-api.herokuapp.com/computers')
    return await response.json();
  } catch (error) {
    console.log('Something went wrong', error);
  } 
}



const selectLaptops = document.getElementById('laptops')

const getItemNames = async () => {

    const data = await fetchData();

    for(let i=0; i < data.length; i++) {

        let element = document.createElement('option')
        element.innerText= data[i].title
        selectLaptops.append(element)
    }
    //console.log(data[0].title)

}

getItemNames()


