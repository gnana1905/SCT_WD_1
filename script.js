const nav=document.getElementById('navbar');
window.addEventListener('scroll',()=>{nav.classList.toggle('scrolled',scrollY>50);
topBtn.style.display=scrollY>300?'block':'none';
document.querySelectorAll('section').forEach(s=>{const r=s.getBoundingClientRect();if(r.top<window.innerHeight-100)s.classList.add('reveal','show');});
});
const txt='Build Amazing Websites with SkillCraft';
let i=0;function type(){if(i<txt.length){typing.textContent+=txt[i++];setTimeout(type,70);}}type();
hamburger.onclick=()=>menu.classList.toggle('open');
toggle.onclick=()=>{document.body.classList.toggle('light');localStorage.theme=document.body.classList.contains('light')?'light':'dark';}
if(localStorage.theme==='light')document.body.classList.add('light');
topBtn.onclick=()=>scrollTo({top:0,behavior:'smooth'});
form.onsubmit=e=>{e.preventDefault();alert('Message sent successfully!');form.reset();}
