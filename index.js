const toggleBtn = document.querySelector('.navtooglebutton')
const menu=document.querySelector('.navmenu');
const icons=document.querySelector('.menuicons')


toggleBtn.addEventListener('click', () => {
    menu.classList.toggle('active');
    icons.classList.toggle('active');
  });