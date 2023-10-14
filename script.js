const prevBtn = document.querySelector('.back-btn');
const nextBtn = document.querySelector('.next-btn');
const btnContainer = document.querySelector('.btn-container');

const titleHeader = document.querySelector('.input-title-header');
const titleText = document.querySelector('.input-title-text');
const tabs = document.getElementsByClassName('input-fields');
const planContainers = document.getElementsByClassName('billing-plan-containers');
const addOnWrappers = Array.from(document.getElementsByClassName('add-on-wrapper'));
const switchBtn = document.querySelector('.switch-btn');
const yearlyPlanText = document.querySelector('.plan-text-yearly');
const monthlyPlanText = document.querySelector('.plan-text-monthly');
const twoMonthsFreeText = document.querySelectorAll('.billing-plan-details-annual-plan-2months-free-text');
const stepsBullets = document.getElementsByClassName('steps-bullet');
const firstStepInput = document.querySelectorAll('.step-1-input');
const errorText = document.querySelectorAll('.required-text');
const planPrice = document.querySelectorAll('.billing-plan-details-annual-plan-price');

const checkbox = [];
addOnWrappers.forEach(addOn => checkbox.push(addOn.firstElementChild.children[0]));
const selectedPlanText = document.querySelector('.selected-plan-text');
const selectedPlanPrice = document.querySelector('.selected-plan-price');
const changePlanBtn = document.querySelector('.change-selected-plan-link');
const summaryContainer = document.querySelector('.summary-container');

const totalPrice = document.querySelector('.total-price-number');
const totalPriceText = document.querySelector('.total-price-text');

const finalPage = document.querySelector('.thank-you-section');

const validationStatus = {
    overAll: false,
    nameValidationStatus: false,
    emailValidationStatus: false,
    phoneNumberValidationStatus: false
};

const selectedPlans = {
    plan: 'Advanced',
    planType: '(Yearly)',
    planPrice: 120
};

//Store selected plan in trueEls and unselected in falseEls
const trueEls = [];
const falseEls = [];

// const selectedAddOns = [];

let currentTab = 0;
let checkStatus = false;

finalPage.style.display = 'none';
document.addEventListener('DOMContentLoaded', showTab(currentTab));

addListenerToCheckbox();

function showTab(n) {
    tabs[n].style.display = 'block';
    //Info Tab
    if(currentTab == 0) {

        //change the title
        titleHeader.textContent = 'Personal Info';
        titleText.textContent = 'Please provide your name, email address and phone number.';

        prevBtn.style.opacity = '0';
        prevBtn.style.cursor = 'auto';
        
    }

    //Plan Selection Tab
    if(currentTab == 1) {
        //change the title
        titleHeader.textContent = 'Select your plan';
        titleText.textContent = 'You have the options of monthly or yearly billing.';
        
        
        switchBtn.addEventListener('click', switchPlan);
        //style like radio buttons to billing plans containers 
        for(let i = 0; i <= planContainers.length - 1; i++) {
            if(planContainers[i].lastElementChild.children[0].checked) {
                planContainers[i].classList.add('plan-selected');
            }
            if(planContainers[i].classList.contains('plan-selected')) {
                trueEls.push(planContainers[i]);
            }

            //To make sure this block of checking for initial selected addOns checked status executes only once
            //Check at the same time with switch plan stage to add the element to the summary page so that to be able to access those elements from here
            if(!checkStatus) {
                if(checkbox[i].checked) {
                    addOnWrappers[i].classList.add('plan-selected');
                    //add to summary page if selected already
                    createSelectedAddOnElement(i);
                };
            }
            
            planContainers[i].addEventListener('click', (e) => {
                e.target.lastElementChild.children[0].checked = true;
                for (let i = 0; i <= planContainers.length - 1; i++) {
                    if(planContainers[i].lastElementChild.children[0].checked == true){
                        trueEls.splice(0, 1, planContainers[i]);
                    } else if(planContainers[i].lastElementChild.children[0].checked == false){
                        if(falseEls.length > 1){
                            falseEls.length = 0;
                            falseEls.push(planContainers[i]);
                        } else {
                            falseEls.push(planContainers[i]);
                        };
                    };
                    trueEls.forEach(el => el.classList.add('plan-selected'));
                    falseEls.forEach(el => {
                        if(el.classList.contains('plan-selected')){
                            el.classList.remove('plan-selected');
                        } else {
                            return;
                        }
                    }
                    );
                }
                selectedPlans.plan = trueEls[0].lastElementChild.children[1].textContent;
                selectedPlans.planPrice = trueEls[0].lastElementChild.children[0].value;
            });
            
        }
        checkStatus = true;
    }

    //Add-Ons Selection Tab
    if(currentTab == 2) {
        
        //change the title
        titleHeader.textContent = 'Pick add-ons';
        titleText.textContent = 'Add-ons help enhance your gaming experience.';
        
        // for (let i = 0; i <= addOnWrappers.length -1; i++) {
                
        // }
        // checkStatus = true;
    }

    //Summary Tab
    if(currentTab == 3) {
        //change the title
        titleHeader.textContent = 'Finishing Up';
        titleText.textContent = 'Double-check everything looks OK before confirming.';

        selectedPlanText.childNodes[0].textContent = selectedPlans.plan;
        selectedPlanText.childNodes[1].textContent = selectedPlans.planType;
        selectedPlanPrice.textContent = selectedPlanPrice.textContent.replace(selectedPlanPrice.textContent.split('/')[0].slice(1), selectedPlans.planPrice);

        //change plan link
        changePlanBtn.addEventListener('click', redirectToPlanSelection);

        //add the summarized price
        const selectedPrices = [];
        selectedPrices.push(Number.parseInt(summaryContainer.firstElementChild.children[1].textContent.split('/')[0].split('$')[1]));

        if(summaryContainer.children.length > 2) {
            for(let i = 2; i < summaryContainer.children.length; i++){
                selectedPrices.push(Number.parseInt(summaryContainer.children[i].lastElementChild.textContent.split('/')[0].split('$')[1]))
            }
        };
        
        let total = 0;
        selectedPrices.forEach(price => total += price);
        totalPrice.textContent = totalPrice.textContent.replace(totalPrice.textContent.split('/')[0], `$${total}`);
    }
}

function prev() {
    const tabs = document.getElementsByClassName('input-fields');
    const stepsBullets = document.getElementsByClassName('steps-bullet');
    if(currentTab <= 0){
        return;
    } else if(currentTab > 0) {
        stepsBullets[currentTab].classList.remove('active-step');
        tabs[currentTab].style.display = 'none';
        currentTab--;
        stepsBullets[currentTab].classList.add('active-step');
        showTab(currentTab);
    }
}

function next() {
    if(currentTab == 0) {
        //form validation
        checkForInputValue();
        if(validationStatus.overAll) {
            prevBtn.style.opacity = '1';
            prevBtn.style.cursor = 'pointer';
            tabs[currentTab].style.display = 'none';
            stepsBullets[currentTab].classList.remove('active-step');
            currentTab++;
            stepsBullets[currentTab].classList.add('active-step');
            showTab(currentTab);
        } else {
            return;
        }
    } else if(currentTab > 0 && currentTab < tabs.length - 1) {
        tabs[currentTab].style.display = 'none';
        stepsBullets[currentTab].classList.remove('active-step');
        currentTab++;
        stepsBullets[currentTab].classList.add('active-step');
        showTab(currentTab);
    } else if(currentTab == tabs.length - 1){
        titleHeader.style.display = 'none';
        titleText.style.display = 'none';
        tabs[3].style.display = 'none';
        btnContainer.style.display = 'none';
        finalPage.style.display = 'flex';
    }
}

function switchPlan() {
    // console.log('switch')
    //monthly and yearly plan switch
    const yearlyPlanPrice = ['$90 /yr', '$120/yr', '$150/yr']; 
    const monthlyPlanPrice = ['$9 /mo', '$12/mo', '$15/mo'];
        //yearly plan
        if(switchBtn.checked == true){
            //yearly plan
            twoMonthsFreeText.forEach(text => text.style.display = 'block');
            for (let i = 0; i < planPrice.length; i++) {
                planPrice[i].textContent = yearlyPlanPrice[i];
                planContainers[i].lastElementChild.children[0].value = yearlyPlanPrice[i].substring(1, 4).trim();
                //add zero to addOn input value 
                checkbox[i].value += '0';
                //change per month text to per year
                addOnWrappers[i].lastElementChild.textContent = addOnWrappers[i].lastElementChild.textContent.replace('/mo', '0/yr');
                selectedPlanPrice.textContent = selectedPlanPrice.textContent.replace('/mo', '/yr');

                //change plan Type and assign to global object
                selectedPlans.planType = '(Yearly)';
            }
            yearlyPlanText.classList.add('plan-selected-yearly');
            monthlyPlanText.classList.remove('plan-selected-monthly');

            //change total price text
            totalPriceText.textContent = totalPriceText.textContent.replace('month', 'year');
            totalPrice.textContent = totalPrice.textContent.replace('mo', 'yr');
            
            if(summaryContainer.children.length > 2) {
                for(let i = 2; i < summaryContainer.children.length; i++){
                    summaryContainer.children[i].lastElementChild.textContent = summaryContainer.children[i].lastElementChild.textContent.replace('/mo', '0/yr');
                }
            }
        } else {
            //monthly plan
            twoMonthsFreeText.forEach(text => text.style.display = 'none');
            for (let i = 0; i < planPrice.length; i++) {
                planPrice[i].textContent = monthlyPlanPrice[i];
                planContainers[i].lastElementChild.children[0].value = monthlyPlanPrice[i].substring(1, 3).trim();
                //remove zero from addOn input value
                checkbox[i].value = checkbox[i].value.slice(0, 1);
                //change per year text to per month
                addOnWrappers[i].lastElementChild.textContent = addOnWrappers[i].lastElementChild.textContent.replace('0/yr', '/mo');
                selectedPlanPrice.textContent = selectedPlanPrice.textContent.replace('/yr', '/mo');
                //change plan type and assign to global object
                selectedPlans.planType = '(Monthly)';
            }
            monthlyPlanText.classList.add('plan-selected-monthly');
            yearlyPlanText.classList.remove('plan-selected-yearly');
            //change total price text
            totalPriceText.textContent = totalPriceText.textContent.replace('year', 'month');
            totalPrice.textContent = totalPrice.textContent.replace('yr', 'mo');

            if(summaryContainer.children.length > 2) {
                for(let i = 2; i < summaryContainer.children.length; i++){
                    summaryContainer.children[i].lastElementChild.textContent = summaryContainer.children[i].lastElementChild.textContent.replace('0/yr', '/mo');
                }
            }
        }
        selectedPlans.plan = trueEls[0].lastElementChild.children[1].textContent;
        selectedPlans.planPrice = trueEls[0].lastElementChild.children[0].value;
}
//form validation
function checkForInputValue() {
    // On the first input fields, 
    // name , email and phone numbers are need to be checked!
    
    function displayErrorText(field) {
        errorText[field].style.display = 'inline';
        firstStepInput[field].style.borderColor = 'var(--primary-strawberry-red)';
    }

    // email must include @ and '.com'
    function emailValidation() {
        let emailText = firstStepInput[1].value;
        let specialCharacters = emailText.includes('@') && emailText.includes('.com');
        if(specialCharacters) {
            let emailString = emailText.split('@');
            if(emailString[0] == '' || emailString[1].split('.')[0] == ''){
                console.log('email error');
                //error if no .com & mail text in front of .com
                return true;
            } else {
                //no error
                return false;
            }
        } else {
            //error if no special characters & .com & mail text in front of .com
            return true;
        }
    };

    // phone number must include min 10 digits
    function phoneNumberValidation() {
        let phoneNumber = parseInt(firstStepInput[2].value);
        if(phoneNumber == NaN) {
            return true;
        } else {
            phoneNumber = phoneNumber.toString();
            return !(phoneNumber.length >= 9);
        }
    }

    //name input validation
    if(firstStepInput[0].value == '') {
        displayErrorText(0);
        validationStatus.nameValidationStatus = false;
    } else {
        errorText[0].style.display = 'none';
        firstStepInput[0].style.borderColor = 'var(--neutral-light-gray)';
        validationStatus.nameValidationStatus = true;
    }

    //email input validation
    if(firstStepInput[1].value == '' || emailValidation()) {
        displayErrorText(1);
        validationStatus.emailValidationStatus = false;
    } else {
        errorText[1].style.display = 'none';
        firstStepInput[1].style.borderColor = 'var(--neutral-light-gray)';
        validationStatus.emailValidationStatus = true;
    }

    //phone number validation
    if(firstStepInput[2].value == '' || phoneNumberValidation()){
        displayErrorText(2);
        validationStatus.phoneNumberValidationStatus = false;
    } else {
        errorText[2].style.display = 'none';
        firstStepInput[2].style.borderColor = 'var(--neutral-light-gray)';
        validationStatus.phoneNumberValidationStatus = true;
    }

    if(validationStatus.nameValidationStatus && validationStatus.emailValidationStatus && validationStatus.phoneNumberValidationStatus) {
        validationStatus.overAll = true;
    } else {
        validationStatus.overAll = false;
    }
}

function createSelectedAddOnElement(i) {
    const selectedAddOnsWrapper = document.createElement('div');
    selectedAddOnsWrapper.classList.add('selected-add-on');
    
    const selectedAddOnName = document.createElement('span');
    selectedAddOnName.classList.add('selected-add-on-name');
    selectedAddOnName.textContent = checkbox[i].parentElement.children[1].firstElementChild.textContent;
    selectedAddOnsWrapper.appendChild(selectedAddOnName);

    const selectedAddOnPrice = document.createElement('span');
    selectedAddOnPrice.classList.add('selected-add-on-price');
    selectedAddOnPrice.textContent = checkbox[i].parentElement.parentElement.lastElementChild.textContent;
    selectedAddOnsWrapper.appendChild(selectedAddOnPrice);

    summaryContainer.appendChild(selectedAddOnsWrapper);
}

function addListenerToCheckbox() {
    for(let i=0; i <= addOnWrappers.length -1; i++){
        checkbox[i].addEventListener('change', (e) => {
            if (checkbox[i].checked == true) {
                addOnWrappers[i].classList.add('plan-selected');
                // console.log('true code');
                createSelectedAddOnElement(i);
            } else {
                addOnWrappers[i].classList.remove('plan-selected');
                if(summaryContainer.children.length > 2) {
                    for(let i = 2; i < summaryContainer.children.length; i++){
                        if(e.target.parentElement.lastElementChild.firstElementChild.textContent == summaryContainer.children[i].firstChild.textContent){
                            summaryContainer.removeChild(summaryContainer.children[i]);
                        };
                    }
                }
            };
        });
    }
}

function redirectToPlanSelection() {
    tabs[currentTab].style.display = 'none';
    stepsBullets[currentTab].classList.remove('active-step');
    currentTab = 1;
    stepsBullets[currentTab].classList.add('active-step');
    showTab(currentTab);
}

prevBtn.addEventListener('click', prev);
nextBtn.addEventListener('click', next);