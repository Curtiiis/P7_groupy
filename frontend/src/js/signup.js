const pwdRepeat = document.querySelector('#pwd-repeat')
const togglePassword2 = document.querySelector('#togglePassword2')
const cguButton = document.querySelector('#cgu-button');
const cguModal = document.querySelector('#cgu-modal');

// Display/Hide CGU
cguButton.onclick = () => {
   cguModal.style.display = 'block';
   document.querySelector('.login_box').style.background = 'none';
}

window.onclick = (e) => {
   if (e.target == cguModal) {
      cguModal.style.display = "none";
      document.querySelector('.login_box').style.background = '#fafafa';
   }
}

document.querySelector('#close-btn').onclick = () => {
   cguModal.style.display='none';
   document.querySelector('.login_box').style.background = '#fafafa';
}

//Show or Hide the password
togglePassword2.onclick = () => {
   togglePassword2.classList.toggle("blue")
   pwdRepeat.type === "password"
      ? pwdRepeat.type = "text"
      : pwdRepeat.type = "password";
}

// Form validation
form.onsubmit = (e) => {
   e.preventDefault();
   checkInputsValidity()
   confirmPassword()
   displaySignupValidity()
}

//FUNCTIONS
function checkInputsValidity() {
   let checkInputsValidity =
      regexTextNumbers(pseudo.value.trim()) &&
      regexEmail(email.value.trim()) &&
      regexPassword(password.value.trim());

   if (checkInputsValidity) {
      let data = {
         pseudo: pseudo.value.trim(),
         email: email.value.trim(),
         password: password.value.trim()
      };
      console.log(data)
      validBox()
      redirection()
      return true
   }
   else {
      return false
   }
}

function displaySignupValidity() {
   displayValidity(pseudo, regexTextNumbers, "pseudo")
   displayValidity(email, regexEmail, "email")
   displayPasswordValidity(password, regexPassword)
}

function confirmPassword() {
   if (password.value != pwdRepeat.value) {
      setError(pwdRepeat, "Les mots de passe ne correspondent pas")
      return false
   } else {
      setSuccess(pwdRepeat);
      return true
   }
}