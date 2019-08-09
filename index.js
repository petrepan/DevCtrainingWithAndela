 const supportedCards = {
        visa, mastercard
      };

      const countries = [
        {
          code: "US",
          currency: "USD",
          currencyName: '',
          country: 'United States'
        },
        {
          code: "NG",
          currency: "NGN",
          currencyName: '',
          country: 'Nigeria'
        },
        {
          code: 'KE',
          currency: 'KES',
          currencyName: '',
          country: 'Kenya'
        },
        {
          code: 'UG',
          currency: 'UGX',
          currencyName: '',
          country: 'Uganda'
        },
        {
          code: 'RW',
          currency: 'RWF',
          currencyName: '',
          country: 'Rwanda'
        },
        {
          code: 'TZ',
          currency: 'TZS',
          currencyName: '',
          country: 'Tanzania'
        },
        {
          code: 'ZA',
          currency: 'ZAR',
          currencyName: '',
          country: 'South Africa'
        },
        {
          code: 'CM',
          currency: 'XAF',
          currencyName: '',
          country: 'Cameroon'
        },
        {
          code: 'GH',
          currency: 'GHS',
          currencyName: '',
          country: 'Ghana'
        }
      ];

      const billHype = () => {
        const billDisplay = document.querySelector('.mdc-typography--headline4');
        if (!billDisplay) return;

        billDisplay.addEventListener('click', () => {
          const billSpan = document.querySelector("[data-bill]");
          if (billSpan &&
            appState.bill &&
            appState.billFormatted &&
            appState.billFormatted === billSpan.textContent) {
            window.speechSynthesis.speak(
              new SpeechSynthesisUtterance(appState.billFormatted)
            );
          }
        });
      };
	  const appState= {};
      
	  const fetchBill = () => {
        const apiHost = 'https://randomapi.com/api';
		const apiKey = '006b08a801d82d0c9824dcfdfdfa3b3c';
		const apiEndpoint = `${apiHost}/${apiKey}`;
		fetch(apiEndpoint)
		.then(response => response.json())
		.then (displayCartTotal)
        .catch(error => console.warn (error));
      };
      
      const startApp = () => {
		  fetchBill();
      };
	  const formatAsMoney = (amount,buyerCountry)=>{
		let getCountry = countries.find(country =>{
			return country.country === buyerCountry;
		});
		if(!getCountry){
			return amount.toLocaleString(countries[0].code,
			{style:"currency",currency:countries[0].currency});
		}else{
			return amount.toLocaleString(`en-${getCountry.code}`,
			{style:"currency",currency:getCountry.currency});
		}
	  };
	  const flagIfInvalid = (field,isValid) =>{
       if(isValid == true){
		   field.classList.remove("is-invalid");
	   }else{
		   field.classList.add("is-invalid")
	   }
	  };
	  const expiryDateFormatIsValid =(field)=>{
         return /^((0?[1-9])|(1[0-2]))\/\d{2}$/.test(field.value);
		 if(field.value, true){
			 return true;
		 }else if(field.value, false){
			 return false;
		  }
		 };
	  const detectCardType = (first4Digits) => {
    if (first4Digits[0]===5){
		document.querySelector('[data-credit-card]').classList.add('is-mastercard');
		document.querySelector('[data-credit-card]').classList.remove('is-visa');
		document.querySelector('[data-card-type]').src = supportedCards.mastercard;
		return 'is-mastercard'
	}
	else if(first4Digits[0]===4){
		document.querySelector('[data-credit-card]').classList.add('is-visa');
		document.querySelector('[data-credit-card]').classList.remove('is-mastercard');
		document.querySelector('[data-card-type]').src= supportedCards.visa;
		return 'is-visa';
	}
	else{
		return 'card not supported'
	}
	  };
	  const isFuturisticDate=(dateField)=>{
		  console.log("Inside isFuturistic function");
		  const currDate = new Date();
		  const inputMonth = parseInt(dateField.value.split('/')[0], 10);
		  const inputYear = parseInt(dateField.value.split('/')[1], 10);
		  const twoDigitFullYear = parseInt(currDate.getFullYear().toString().substr(-2), 10);
		  const twoDigitMonth = currDate.getMonth()+1;
		  console.log('inputYear: ', inputYear, 'twoDigitFullYear: ', twoDigitFullYear, 'inputMonth: ', inputMonth, 'twoDigitMonth: ', twoDigitMonth);
		  return (inputYear > twoDigitFullYear) || ((inputYear === twoDigitFullYear)&& inputMonth > twoDigitMonth);
	  };
	  const validateCardExpiryDate = () =>{
        const dateField=document.querySelector('[data-cc-info] input:last-child');
		console.log(dateField);
		expiryDateFormatIsValid(dateField);
		isFuturisticDate(dateField);
	const isValid = expiryDateFormatIsValid(dateField) && isFuturisticDate(dateField);
	console.log("isValid: "+isValid);
	console.log("After 1st validation");
	flagIfInvalid(dateField, isValid);
	if(isValid){
		return true;
	}	else{
		return false;
	}
		 };
	
		 
	  const validateCardHolderName = () => {
		const cardHolderName = document.querySelector('[data-cc-info] input:nth-child(1)').value;
		//console.log(cardHolderName); just to check inside
		const cardHolderNameInput = document.querySelector('[data-cc-info] input:nth-child(1)');
		const namePattern = /^[a-zA-Z]{3,}([ ]{1}[a-zA-Z]{3,})$/g;
		console.log(cardHolderNameInput);
		const isValid = namePattern.test(cardHolderName);
		flagIfInvalid(cardHolderNameInput, isValid);
		return isValid;
	  };
	  const smartCursor = (event, fieldIndex, fields)=>{
		  if (fieldIndex < fields.length - 1) {
			  if (fields[fieldIndex].value.length === Number(fields[fieldIndex].size)) {
				  fields[fieldIndex + 1].focus()
			  }
		  }
      
	  };
	  const enableSmartTyping = () =>{
      appState.cardDigits= [
         [0, 0, 0, 0],
		 [0, 0, 0, 0],
		 [0, 0, 0, 0],
		 [0, 0, 0, 0],
	  ];
	  document.querySelectorAll('input')
	  .forEach((field, index, fields) =>{
		  field.addEventListener('keydown', (event)=>{
			  smartInput(event, index, fields);
		  })
	  });
	  };
	  const validateCardNumber = () =>{
		  const selectAll = (s) =>{
			  return document.querySelectorAll(s);
		  };
		  const fields = [...selectAll('[data-cc-digits]>input')];
		  const cardNumber = fields.reduce((acc, field) =>{
			  return acc + field.value;
		  }, '').split('').map((digit) =>{
			  return +digit;
		  });
		  const isValid= validateWithLuhn(cardNumber);
		  const divs = document.querySelector('[data-cc-digits]');
		  if(isValid){
			  div.classList.remove('is-invalid');
		  }
		  else{
			  divs.classList.add('is-invalid');
		  }
		  return isValid;
	  };
	  const validateWithLuhn = (digits)=>{
	const value = digits.join('');
	const regx = /^(4|5)([0-9]{15})$/;
	let nDigit = 0, dSum = 0, even = false;
	for (let i = value.length -1; i >=0; i--){ 
		let sDigit = value.charAt(i);
		nDigit = parseInt(sDigit, 10);
		if(even){
			if ((nDigit *= 2) > 9) nDigit -=9;
		}
		dSum += nDigit;
		even = !even;
	}	  return (dSum % 10)==0
	  }
	  const validatePayment = () =>{
       validateCardNumber();
	   validateCardHolderName();
	   validateCardExpiryDate();
	  };
	  const smartInput = (event,fieldIndex) =>{
    const controlKeys = [
		'Tab',
		'Delete',
		'Backspace',
		'ArrowLeft',
		'ArrowRight',
		'ArrowUp',
		'ArrowDown',
		'Shift',
	];
	const isControlKey = controlKeys.includes(event.key);
	if (!isControlKey) {
		if (fieldIndex <= 3) {
			if (/^\d$/.test(event.key)) {
				if (appState.cardDigits[fieldIndex] === undefined) {
					appState.cardDigits[fieldIndex] = [];
				}
			 
				event.preventDefault();
				const target = event.target;
				let {
                     selectionStart,
					 value
				} = target;
				appState.cardDigits[fieldIndex][selectionStart] = +event.key;
				target.value = value.substr(0, selectionStart) + event.key + value.substr(selectionStart + 1);
			setTimeout(() => {
			console.log(appState.cardDigits)
			appState.cardDigits[fieldIndex] = target.value.split('').map((car, i) => (car >= '0' && car <= '9') ? Number(car): Number(appState.cardDigits[fieldIndex][i]))
			if(fieldIndex < 3){
				target.value = target.value.replace(/\d/g, '$');		
			}
			smartCursor(event, fieldIndex, fields);
			if(fieldIndex == 0 && target.value.length >= 4) {
				let first4Digits = appState.cardDigits[0];
				detectCardType(first4Digits);
			}
			}, 500)	
			}
			else{
				event.preventDefault();
			}
		}else if(fieldIndex == 4){
			if(/[a-z]|\s/i.test(event.key)){
				setTimeout(()=> {
					smartCursor(event, fieldIndex, fields);
				}, 500)
			}else{
				event.preventDefault();
			}
		}	
		else{
		if(/\d|\//.test(event.key)){
			setTimeout(() => {
				smartCursor(event, fieldIndex, fields);
			}, 500);
		}	
		else{
			event.preventDefault();
		}
		}
	} else {
		if(event.key === 'Backspace'){
			if(appState.cardDigits[fieldIndex].length > 0){
				appState.cardDigits[fieldIndex].splice(-1, 1);
			}
			else {}
			smartBackSpace(event, fieldIndex, fields);
		}
		else if(event.key == "Delete"){
			if (appState.cardDigits[fieldIndex].length >0){
				appState.cardDigits[fieldIndex].splice(1, 1);
			}
		}
	}
	  };
	  const acceptCardNumbers= (event, fieldIndex) =>{

	  };
	  const uiCanInteract = ()=>{
       const btn = document.querySelector('[data-pay-btn]');
	   btn.addEventListener('click', validatePayment);
	   btn.focus()
	   billHype();
	   enableSmartTyping();
	  };
	  const displayCartTotal = ({results}) =>{
		  let [data] = results;
		  let {itemsInCart,buyerCountry} = data;
		  appState.items = itemsInCart;
		  appState.country = buyerCountry;
		  appState.bill = itemsInCart.reduce ((total,cost) =>total + (cost.qty *
		  cost.price),0);
		 appState.billFormatted = formatAsMoney (appState.bill, appState.country); 
		 document.querySelector('[data-bill]').textContent = appState.billFormatted;
		 appState.cardDigits = [];
		 uiCanInteract();
	  };
	  

      startApp();
