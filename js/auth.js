

var userName = document.forms["CovidSignUpForm"]["Name"].value;
var passWord = document.forms["CovidSignUpForm"]["Password"].value;
var submit = document.getElementById("submit");



function auth() {
    var userName = document.forms["CovidSignUpForm"]["Name"].value;
    var passWord = document.forms["CovidSignUpForm"]["Password"].value;
    if ((userName == "admin") && (passWord == "admin")) {
        location.replace("admin.html");
    }
    else {
        document.getElementById("error").innerHTML = "Username and Password doesn't match";
        setTimeout(()=>{
            document.getElementById("error").innerHTML = "";
        },2500)
    }
}
submit.addEventListener("click", auth);
