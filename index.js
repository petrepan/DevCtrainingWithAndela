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
	  const appState = {};

	  const formatAsMoney = (amount, buyerCountry) =>{
		  let getCountry = countries.find(country => {
			  return country.country === buyerCountry;
		  });
		  if(!getCountry){
			  return amount.toLocaleString(countries[0].code,{
				  style:"currency",currency:countries[0].currency
			  });
		  }else{
			  return amount.toLocaleString(`en-${getCountry.code}`,{
				  style:"currency",currency:getCountry.currency
			  });
		  }
	  };
	  const flagIfInvalid = (field, isValid) =>{
		  if(isValid){
			  field.classList.remove('is-invalid');
		  }else{
			  field.classList.add('is-invalid')
		  }
	  }
	  const expiryDateFormatIsValid = (field)=> {
		  if(field.value.match(/^(\d|(0|1)[1-9])\/\d{2}$/)){
			  return true;
		  }
		  else{
			  return false;
		  }
	  }
	  const detectCardType = (first4Digits) =>{
      const firstDigit = first4Digits.toString().split('')[0];
	  const isVisa = parseInt(firstDigit) === 4;
	  const isMastercard = parseInt(firstDigit) === 5;

	  if(isVisa){
		  document.querySelector('[data-credit-card]').classList.add('is-visa');
		  document.querySelector('[data-credit-card]').classList.remove('is-master-card');
		  document.querySelector('[data-card-type]').src=supportedCards.visa;
		  return 'is-visa';
	  }
	  if(isMastercard){
		  document.querySelector('[data-credit-card]').classList.remove('is-visa');
		  document.querySelector('[data-credit-card').classList.add('is-mastercard');
		  document.querySelector('[data-card-type]').src=supportedCards.mastercard;
		  return 'is-mastercard';
	  }
	  }
      const validateCardExpiryDate = () =>{
            let inputVal = document.querySelector('[data-cc-info] input:last-child');
			const currentDate = new Date();
			if(expiryDateFormatIsValid(inputVal)){
				const inputMonth = inputVal.value.split('/')[0];
				const inputYear = inputVal.value.split('/')[1];
				const inputDate = `01-${inputMonth}-${inputYear}`;
				const fullDate = new Date(inputDate);
				const checkMonth = (Number(inputMonth) -1) > currentDate.getMonth();
				const checkYear = fullDate.getYear() > currentDate.getYear();
				if(fullDate.getYear()=== currentDate.getYear()){
					if(checkMonth){
						flagIfInvalid(inputVal, true);
						return true;
					}
					else{
						flagIfInvalid(inputVal, false);
						return false;
					}
				}
				else if(checkYear){
					flagIfInvalid(inputVal, true);
					return true;
				}
			}
				else{
					flagIfInvalid(inputVal, false);
					return false;
				}
		
	  }
	 const validateCardHolderName = ()=> {
      const fullName = document.querySelector('[data-cc-info] input:nth-child(1)');
	  const name = fullName.value.split(' ');
	  if(name.length == 2){
		  if(name[0].length>=3 && name[1].length>=3){
			  flagIfInvalid(fullName, true);
			  return true;
		  }
		  flagIfInvalid(fullName, false);
		  return false;
	  } 
	  else{
		  flagIfInvalid(fullName, false);
		  return false;
	  }
	 } 
	 const validateWithLuhn = (digits)=>{
		 if(digits.length !=16){
			 return false;
		 }
		 const double = digits.reverse().map((num, index)=>(index%2==1)? num*2: num);
		 const checkHighValue = double.map(num=> (num>9)? num-9: num);
		 const getSum = checkHighValue.reduce((sum, num)=> sum+num, 0);

		 return (getSum%10==0);
	 }
	 const validateCardNumber = () =>{
         const digits = appState.cardDigits.flat();
		 const isValid = validateWithLuhn(digits);
		 if(isvalid){
			 document.querySelector('[data-cc-digits]').classList.remove('is-invalid');
			 return true;
		 }
		 else{
			 document.querySelector('[data-cc-digits]').classList.add('is-invalid');
			 return false;
		 }
	 }
	 const validatePayment = () => {
		 validateCardNumber();
		 validateCardHolderName();
		 validateCardExpiryDate();
	 }
	 const smartInput = (event, fieldIndex, fields) =>{
       const controlKeys = [
		   'Tab',
		   'Delete',
		   'BackSpace',
		   'ArrowLeft',
		   'ArrowRight',
		   'ArrowUp',
		   'ArrowDown',
		   'Shift',
	   ];
	   const isControlKey = controlKeys.includes(event.key);
	   if (!isControlKey) {
		   if (fieldIndex <= 3) {
			   if (/^\d$/.test(event.key)){
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
		   }else if(fieldIndex == 4) {
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
	   }else{
		   if(event.key === 'BackSpace'){
			   if(appState.cardDigits[fieldIndex].length > 0){
				   appState.cardDigits[fieldIndex].splice(-1, 1);
			   }
			   else{}
			   smartBackSpace(event, fieldIndex, fields);
		   }
		   else if(event.key == "Delete"){
			   if(appState.cardDigits[fieldIndex].length > 0){
				   appState.cardDigits[fieldIndex].splice(1, 1);
			   }
		   }
	   }
	 
	 }
	 const smartCursor = (event,fieldIndex,fields) => {

	 }
	 const enableSmartTyping =() =>{
		 const firstInput = document.querySelector('[data-cc-digits] input:nth-child(1)');
		 const secondInput = document.querySelector('[data-cc-digits] input:nth-child(2)');
		 const thirdInput = document.querySelector('[data-cc-digits] input:nth-child(3)');
		 const fourthInput = document.querySelector('[data-cc-digits] input:nth-child(4)');

		 const nameField = document.querySelector('[data-cc-info] input:nth-child(1)');
		 const dateField = document.querySelector('[data-cc-info] input:nth-child(2)');

		 const inputFields = [firstInput, secondInput, thirdInput, fourthInput, nameField, dateField];

		 inputFields.forEach((field, index, fields)=>{

			 field.addEventListener('keydown', (event)=>{
				 smartInput(event, index, fields)
			 })
		 })
	 }
	  const uiCanInteract = () =>{
        document.querySelector('[data-cc-digits] input:nth-child(1)').focus();
		document.querySelector('[data-pay-btn]').addEventListener('click',validatePayment);
		billHype();
		enableSmartTyping();
	  }
	  const displayCartTotal = ({results})=>{
        let [data] = results;
		let {itemsInCart, buyerCountry} = data;
		appState.items = itemsInCart;
		appState.country = buyerCountry;
		appState.bill = itemsInCart.reduce ((total,cost) =>total + (cost.qty * cost.price), 0);
		appState.billFormatted = formatAsMoney (appState.bill,appState.country);
		document.querySelector('[data-bill]').textContent = appState.billFormatted;
		appState.cardDigits = [];
		uiCanInteract();
		
	  }
	  const fetchBill = () => {
        const apiHost = 'https://randomapi.com/api';
		const apiKey = '006b08a801d82d0c9824dcfdfdfa3b3c';
		const apiEndpoint = `${apiHost}/${apiKey}`;
		fetch (apiEndpoint)
		.then(response=>response.json())
		.then(data => displayCartTotal(data))
		.catch(error => console.warn(error)); 
        
      };
      
      const startApp = () => {
		  fetchBill();
      };

      startApp();
    
