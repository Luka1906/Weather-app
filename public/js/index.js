document.querySelector(".far").addEventListener("click", () => {
  document.querySelector(".toCelsius").classList.add("hideCelsius")
  document.querySelector(".toFarrenheit").classList.remove("hideFarrenheit");
  document.querySelector(".far").classList.add("far-active");
  document.querySelector(".cel").classList.remove("cel-active")
     
})

document.querySelector(".cel").addEventListener("click", () => {
     document.querySelector(".toCelsius").classList.remove("hideCelsius");
     document.querySelector(".toFarrenheit").classList.add("hideFarrenheit");
     document.querySelector(".far").classList.remove("far-active");
     document.querySelector(".cel").classList.add("cel-active")
        
    

})

const days = document.querySelectorAll(".day");
console.log(days[0])