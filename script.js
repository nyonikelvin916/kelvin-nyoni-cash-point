import { auth, db } from "./firebase.js";

import {
  signInWithEmailAndPassword
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-auth.js";

import {
  collection,
  addDoc,
  getDocs,
  query,
  where
} from "https://www.gstatic.com/firebasejs/12.1.0/firebase-firestore.js";

/* ===========================
   LOADER
=========================== */

window.addEventListener("load", () => {

  setTimeout(() => {

    document.getElementById("loader").style.opacity = "0";

    setTimeout(() => {

      document.getElementById("loader").style.display = "none";

    }, 800);

  }, 1800);

});

/* ===========================
   NAVBAR
=========================== */

window.addEventListener("scroll", () => {

  const navbar = document.querySelector(".navbar");

  if (!navbar) return;

  if (window.scrollY > 50) {

    navbar.style.background = "rgba(0,0,0,.95)";
    navbar.style.boxShadow = "0 5px 20px rgba(212,175,55,.25)";

  } else {

    navbar.style.background = "rgba(0,0,0,.75)";
    navbar.style.boxShadow = "none";

  }

});

/* ===========================
   MOBILE MENU
=========================== */

const menuBtn = document.getElementById("menuBtn");
const menu = document.getElementById("menu");

if (menuBtn && menu) {

  menuBtn.addEventListener("click", () => {

    menu.classList.toggle("active");

  });

}

/* ===========================
   HERO LOGO
=========================== */

const heroLogo = document.querySelector(".hero-logo");

if (heroLogo) {

  heroLogo.addEventListener("mouseenter", () => {

    heroLogo.style.transform = "scale(1.08)";

  });

  heroLogo.addEventListener("mouseleave", () => {

    heroLogo.style.transform = "scale(1)";

  });

}

/* ===========================
   CARDS ANIMATION
=========================== */

const cards = document.querySelectorAll(".card");

const observer = new IntersectionObserver((entries) => {

  entries.forEach(entry => {

    if (entry.isIntersecting) {

      entry.target.style.opacity = "1";
      entry.target.style.transform = "translateY(0)";

    }

  });

});

cards.forEach(card => {

  card.style.opacity = "0";
  card.style.transform = "translateY(60px)";
  card.style.transition = "0.7s";

  observer.observe(card);

});
/* ===========================
   CALCULATOR
=========================== */

window.calculateTicket = function(){

  let amount = Number(document.getElementById("ticketAmount").value);

  let deduction = amount * 0.07;

  let customerGets = amount - deduction;

  document.getElementById("ticketResult").innerHTML =
  "Makato: TSh " + deduction.toLocaleString() +
  "<br>Mteja Atapokea: TSh " + customerGets.toLocaleString();

}

window.calculateLoan = function(){

  let amount = Number(document.getElementById("loanAmount").value);

  let total = amount * 1.10;

  document.getElementById("loanResult").innerHTML =
  "Jumla ya Kurudisha: TSh " + total.toLocaleString();

}

/* ===========================
   COUNTERS
=========================== */

const counters = document.querySelectorAll(".counter");

counters.forEach(counter=>{

  const updateCounter=()=>{

    const target=+counter.getAttribute("data-target");

    const count=+counter.innerText;

    const increment=target/100;

    if(count<target){

      counter.innerText=Math.ceil(count+increment);

      setTimeout(updateCounter,20);

    }else{

      counter.innerText=target+"+";

    }

  }

  updateCounter();

});

/* ===========================
   HERO SLIDER
=========================== */

const slides=document.querySelectorAll(".slide");

let currentSlide=0;

if(slides.length>0){

setInterval(()=>{

slides[currentSlide].classList.remove("active");

currentSlide++;

if(currentSlide>=slides.length){

currentSlide=0;

}

slides[currentSlide].classList.add("active");

},5000);

}

/* ===========================
   LOAN FORM (FIREBASE)
=========================== */

const loanForm=document.getElementById("loanForm");

if(loanForm){

loanForm.addEventListener("submit",async function(e){

e.preventDefault();

const loanData={

name:document.getElementById("fullName").value,

phone:document.getElementById("phone").value,

amount:document.getElementById("amount").value,

reason:document.getElementById("reason").value,

status:"Pending",

date:new Date()

};

try{

await addDoc(collection(db,"loans"),loanData);

document.getElementById("loanMessage").innerHTML=
"Asante <b>"+loanData.name+"</b>, ombi lako limetumwa kikamilifu.";

loanForm.reset();

}catch(error){

document.getElementById("loanMessage").innerHTML=
"❌ Tatizo limetokea, jaribu tena.";

console.log(error);

}

});

}
/* ===========================
   FIREBASE ADMIN LOGIN
=========================== */

window.adminLogin = async function(){

const email = document.getElementById("adminUser").value.trim();

const password = document.getElementById("adminPass").value;

try{

await signInWithEmailAndPassword(auth,email,password);

window.location.href = "dashboard.html";

}catch(error){

const status = document.getElementById("loginStatus");

status.innerHTML = "❌ Email au Password si sahihi";

status.style.color = "red";

console.log(error);

}

}

/* ===========================
   BACK TO TOP
=========================== */

const topBtn = document.getElementById("topBtn");

if(topBtn){

window.addEventListener("scroll",()=>{

if(window.scrollY>400){

topBtn.style.display="block";

}else{

topBtn.style.display="none";

}

});

topBtn.addEventListener("click",()=>{

window.scrollTo({

top:0,

behavior:"smooth"

});

});

}

/* ===========================
   LIVE CLOCK
=========================== */

function updateClock(){

const clock = document.getElementById("liveClock");
const greeting = document.getElementById("greeting");

if(!clock || !greeting) return;

const now = new Date();

clock.innerHTML = now.toLocaleTimeString("sw-TZ");

const hour = now.getHours();

if(hour < 12){

greeting.innerHTML = "🌅 Habari za Asubuhi";

}else if(hour < 18){

greeting.innerHTML = "☀️ Habari za Mchana";

}else{

greeting.innerHTML = "🌙 Habari za Jioni";

}

}

setInterval(updateClock,1000);

updateClock();
window.checkLoanStatus = async function () {

  const phone = document.getElementById("searchPhone").value.trim();
  const result = document.getElementById("statusResult");

  if (phone === "") {
    result.innerHTML = "⚠️ Weka namba ya simu kwanza.";
    return;
  }

  try {

    const q = query(
      collection(db, "loans"),
      where("phone", "==", phone)
    );

    const snapshot = await getDocs(q);

    if (snapshot.empty) {
      result.innerHTML = "❌ Hakuna ombi lililopatikana.";
      return;
    }

    snapshot.forEach((doc) => {

      const loan = doc.data();

      result.innerHTML = `
        <h3>Jina: ${loan.name}</h3>
        <p>Kiasi: TSh ${Number(loan.amount).toLocaleString()}</p>
        <p>Hali: <strong>${loan.status}</strong></p>
      `;
    });

  } catch (error) {
    console.log(error);
    result.innerHTML = "❌ Tatizo limetokea.";
  }

};