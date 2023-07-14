const toggleBtn = document.querySelector('.navtooglebutton')
const menu=document.querySelector('.navmenu');
const icons=document.querySelector('.menuicons')


toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
    icons.classList.toggle('active');
  });

const signUpBox = document.querySelector(".sign-up-box");

signUpBox.addEventListener("click", handleClick, false);
function handleClick(event) {
  if (signUpBox.classList.contains("active")) return;
  let str = `
        <span onclick="event.stopPropagation(); removedActive();">X</span>
        <input type="text" name="name" placeholder="Name"/>
        <input type="email" name="email" placeholder="Email"/>
        <input type="password" name="password" placeholder="Password"/>
        <button onclick="event.stopPropagation(); handleSignUp();" >Sign up</button>
    `;
  this.classList.toggle("active");
  this.innerHTML = "";
  setTimeout(() => (this.innerHTML = str), 500);
}

function removedActive() {
  signUpBox.classList.remove("active");
  signUpBox.innerHTML = `<i class="material-icons">create</i>`;
}
function handleSignUp() {
  let signUpBoxActive = document.querySelector(".active");
  let inputs = signUpBoxActive.querySelectorAll("input");
  let nameField = inputs[0];
  let emailField = inputs[1];
  let passwordField = inputs[2];
  if (
    nameField.value === "" ||
    emailField.value === "" ||
    passwordField.value === ""
  ) {
    return;
  }
  removedActive();
}
