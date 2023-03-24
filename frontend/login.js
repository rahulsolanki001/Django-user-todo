const email=document.querySelector("input[name='email']")
const password=document.querySelector("input[name='password']");

const loginButton=document.querySelector("#login");

const errorDiv=document.querySelector("#error");



//check if any field is blank
const isFormFieldBlank=()=>{
    if(email.value==="" || password.value===""){
        return true
    }
    return false
    
}


//getting cookie
function readCookie(name) {
    var nameEQ = name + "=";
    var ca = document.cookie.split(';');
    for(var i=0;i < ca.length;i++) {
        var c = ca[i];
        while (c.charAt(0)==' ') c = c.substring(1,c.length);
        if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length,c.length);
    }
    return null;
}

const csrftoken = readCookie('csrftoken');


loginButton.addEventListener("click",async(e)=>{
    if(!isFormFieldBlank()){
        console.log("starting login!!...")
        const data={
            "email":email.value,
            "password":password.value
        }
        const res=await fetch("http://localhost:8000/api/login",{
            credentials: 'include',
            method:"POST",
            headers:{
                "Content-Type":"application/json",
                "X-CSRFToken": csrftoken
            },
            body:JSON.stringify(data)
        });
        const response=await res.json();
        console.log(response)
        if(response.token){
           window.location.href="./dashboard.html"
           console.log("you have been logged in")
        }else{
            errorDiv.textContent=response.detail
            errorDiv.classList.add("error-container");
        }
    }else{
        errorDiv.textContent="Please provide email & password"
        errorDiv.classList.add("error-container")
    }

    
})
