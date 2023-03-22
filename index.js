
const inputSlider = document.querySelector("[data-lengthSlider]");
let password = "";
let checkCount = 1;
let passwordLength = inputSlider.value;
// set strength indicator to grey

inputSlider.style.background = `linear-gradient(to right,#3c6e71 50%, #d9d9d9 0%)`;

//set password length
const lengthDisplay = document.querySelector("[data-lengthNumber]");
function handleSlider(){
    lengthDisplay.textContent = passwordLength;
}

// set indicator strength
const indicator = document.querySelector("[strength-indicator]");
function setIndicator(color){
    indicator.style.backgroundColor = color;
    indicator.style.boxShadow = `0px 0px 8px 1px ${color}`;
}
setIndicator("#f0ebd8")

function getRndInteger(min,max){
    return Math.floor(Math.random()*(max-min))+min;
}

function generateRandomNumber(){
    return getRndInteger(0,9);
}

function generateLowerCase(){
    return String.fromCharCode(getRndInteger(97,123));
}

function generateUpperCase(){
    return String.fromCharCode(getRndInteger(65,91));
}

const symbols = '~`!@#$%^&*()_-+={[}]|:;"<,>.?/';
function generateSymbol(){
    return symbols[getRndInteger(0,symbols.length)];
}

const uppercaseCheck = document.querySelector("#uppercase");
const lowercaseCheck = document.querySelector("#lowercase");
const numbersCheck = document.querySelector("#numbers");
const symbolsCheck = document.querySelector("#symbols");
function calcStrength(){
    let hasUpper = uppercaseCheck.checked;
    let hasLower = lowercaseCheck.checked;
    let hasNum = numbersCheck.checked;
    let hasSym = symbolsCheck.checked;
    // Too Strong
    if(hasUpper && hasLower && hasNum && hasSym && passwordLength>=8)
    setIndicator("#0f0");
    // Strong
    else if((hasUpper || hasLower) && hasNum  && hasSym && passwordLength>=8)
    setIndicator("#070");
    // Moderate
    else if((hasUpper||hasLower) && (hasSym || hasNum) && passwordLength>=8)
    setIndicator("#770");
    // Weak
    else
    setIndicator("#f00");
}

const copyMsg = document.querySelector("[data-copyMsg]");
async function copyContent(){
    try{
        await navigator.clipboard.writeText(passwordDisplay.value);
        copyMsg.innerText = "copied";
    }
    catch(e){
        copyMsg.innerText = "Failed";
    }
    // To make visible the message
    copyMsg.classList.add("active");
    
    setTimeout(()=>{
        copyMsg.classList.remove("active");
    },2000);
}


const passwordDisplay = document.querySelector("[data-passwordDisplay]");
const copyBtn = document.querySelector("[data-copy]");
const generateBtn = document.querySelector(".generateButton");

inputSlider.addEventListener('input',(e)=>{
    passwordLength = e.target.value;
    handleSlider();
    e.target.style.background = `linear-gradient(to right,#3c6e71 ${inputSlider.value*5}%, #d9d9d9 0%)`;
})

copyBtn.addEventListener('click',()=>{
    if(passwordDisplay.value){
        copyContent();
    }
})

const allCheckBox = document.querySelectorAll("input[type=checkbox]");
function handleCheckBoxChange(){
    checkCount = 0;
    allCheckBox.forEach((checkbox)=>{
        if(checkbox.checked)
            checkCount++;
    });
    // selected cases is less than password length
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        // to update password length display
        handleSlider();
    }
}
allCheckBox.forEach((checkbox)=>{
    checkbox.addEventListener('change',handleCheckBoxChange);
})

function shufflePassword(toshuffle){
    // Fisher Yates Method
    for(let i=toshuffle.length-1;i>0;i--){
        const j = Math.floor(Math.random()*(i+1));
        const temp = toshuffle[i];
        toshuffle[i] = toshuffle[j];
        toshuffle[j] = temp;
    }
    let str="";
    toshuffle.forEach((el)=>{str+=el});
    return str;
}

generateBtn.addEventListener('click',()=>{
    // none of the checkbox selected
    if(checkCount<=0)return;
    if(passwordLength<checkCount){
        passwordLength = checkCount;
        handleSlider();
    }

    // setting password to empty or reset password
    password = '';

    let caseArr = [];
    if(uppercaseCheck.checked)
    caseArr.push(generateUpperCase);
    if(lowercaseCheck.checked)
    caseArr.push(generateLowerCase);
    if(numbersCheck.checked)
    caseArr.push(generateRandomNumber);
    if(symbolsCheck.checked)
    caseArr.push(generateSymbol);
    // first fullfill the requirements then generate the arbitrary element
    for(let i=0;i<caseArr.length;i++){
        password+=caseArr[i]();
    }
    //remaining addition
    for(let i=0;i<passwordLength-caseArr.length;i++){
        let randIndex = getRndInteger(0,caseArr.length);
        password += caseArr[randIndex]();
    }
    // shuffle all character of password
    // if not done this step if someone select all cases
    // then first char is uppercase and second is lowercase and so on
    password = shufflePassword(Array.from(password));

    // display password
    passwordDisplay.value = password;

    // display strength
    calcStrength();
})