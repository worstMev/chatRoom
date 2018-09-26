

//setting the double validation of password in sign up form
let $pass = document.querySelectorAll('.pass');
let $indi = document.querySelector('.indi');
let $submit =document.querySelector('input[type="submit"]');
let $emailInput = document.querySelector('#emailInput');
let $loginInput = document.querySelector('#login');



$pass.forEach((passInput)=>{
	passInput.addEventListener("input",function (){


		console.log(this.value);
		if($pass[0].value !== $pass[1].value 
			&& $pass[1].value){
			console.log("not the same");
			// $indi.style.display ='block';

			toggleInput($pass,'invalid','valid');
			$submit.setAttribute('disabled', 'disabled');
		}else if($pass[0].value === $pass[1].value){
			console.log("same");
			// $indi.style.display ='none';
			toggleInput($pass,'valid','invalid');
			$submit.removeAttribute('disabled');

			
		} 
		if( !($pass[0].value || $pass[1].value) ){//pass1 and pass2 empty
			removeAllInputState($pass);
		}
	});
});

function toggleInput(input ,classON,classOFF){
	input.forEach((passInput)=>{
		passInput.classList.add(classON);
		passInput.classList.remove(classOFF);
	});
}

function removeAllInputState(input){
	input.forEach((passInput)=>{
		passInput.classList.remove('valid');
		passInput.classList.remove('invalid');
	});
}


//ajax

let xhttp;
//initialize the xhttp object
if(window.XMLHttpRequest){
	xhttp = new XMLHttpRequest();
}else if(window.ActiveXObject('msxml12.XMLHTTP')){
	xhttp = new window.activeXobject('msxml12.XMLHTTP');
}else{
	xhttp = new window.ActiveXObject('Microsoft.XMLHTTP');
}
//xmlhttp object is set

//method to make a request
function makeAjaxRequest (method , url , action){

	xhttp.open(method , url , true);
	xhttp.onreadystatechange = function (){
		if(this.readyState === 4 && this.status === 200){
			console.log('responseText: '+this.responseText);
			action(this.responseText);
		}else{
			console.log('readyState '+this.readyState );
			console.log('status '+this.status );
		}
	}
	xhttp.send();

}

//email double search
$emailInput.addEventListener('input', function (){
	//url : /searchDouble/table/column/value
	let url = '/searchDouble/member/email/'+this.value;
	if(this.value){
		// console.log('input email change url :'+url);
		makeAjaxRequest('GET' , url , (responseText)=>{
			// console.log(responseText);
			if(responseText){//double
				// console.log("invalid double exist");
				toggleInput([$emailInput],'invalid','valid');
				$submit.setAttribute('disabled', 'disabled');
			}else{
				toggleInput([$emailInput],'valid','invalid');
				$submit.removeAttribute('disabled');
			}

		});
		
	}else{
		removeAllInputState([$emailInput]);
	}
});

//login double search
$loginInput.addEventListener('input' , function(){

	//url : /searchDouble/table/column/value
	let url = '/searchDouble/member/login/'+this.value;
	if(this.value){
		// console.log('input email change url :'+url);
		makeAjaxRequest('GET' , url , (responseText)=>{
			console.log(responseText);
			if(responseText){//double
				// console.log("invalid double exist");
				toggleInput([$loginInput],'invalid','valid');
				$submit.setAttribute('disabled', 'disabled');
			}else{
				toggleInput([$loginInput],'valid','invalid');
				$submit.removeAttribute('disabled');
			}

		});
		
	}else{
		removeAllInputState([$loginInput]);
	}
});
