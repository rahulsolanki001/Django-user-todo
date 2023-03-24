
//dom elements
const p1=document.querySelector("input[name='password']");
const p2=document.querySelector("input[name='cpassword']");
const fname=document.querySelector("input[name='fname']");
const lname=document.querySelector("input[name='lname']");
const username=document.querySelector("input[name='username']");
const email=document.querySelector("input[name='email']");

const errorDiv=document.querySelector("#error-container")



const pspan=document.querySelector("#password-span");
const cpspan=document.querySelector("#cpassword-span");


//submit button
const sbutton=document.querySelector("#submit-button");



//first name check


p1.addEventListener("change",()=>{
    if (p1.value.length<8){
        p1.classList.add("error");
        pspan.innerText="password cannot be less than 8 characters"
    }else if(isNaN(p1.value)===false){
        p1.classList.add("error");
        pspan.innerText="password cannot be entirely numeric"
    }else{
        p1.classList.remove("error");
        pspan.innerText=""
    }
});

p2.addEventListener("change",()=>{
    if(p1.value!==p2.value){
       p2.classList.add("error");
       cpspan.innerText="confirm password must be equal to password"
    }else{
        
        p2.classList.remove("error");
        cpspan.innerText="";
    }
})

email.addEventListener("change",()=>{
    //check if email field has '@' & if there's a string after that
    if(!email.value.includes("@") || email.value.substring(email.value.indexOf("@"),email.value.length-1)===""){
        email.classList.add("error");
    }else{
        email.classList.remove("error");
    }
})


//check if any field is blank
const isFormFieldBlank=()=>{
    if(fname.value==="" || username.value==="" || p1.value==="" || p2.value==="" || email.value=="")
    return true
    else return false
}


//user register


//validating form
const validateForm=()=>{
    if (p1.classList.contains("error") || p2.classList.contains("error") || isFormFieldBlank()){
        console.log("fix errors")
        return false;
    }else{
        return true;
    }
}


//submit & register user
sbutton.addEventListener("click",async(e)=>{
    if(validateForm()){
        const data={
            "first_name":fname.value,
            "last_name":lname.value,
            "email":email.value,
            "username":username.value,
            "password":p1.value
        }
        const res=await fetch("http://localhost:8000/api/register",{
            method:"POST",
            headers:{
                "Content-Type":"application/json"
            },
            body:JSON.stringify(data)
        });
        const response=await res.json();
        if(response.status!==201){
            errorDiv.textContent=response.message
            errorDiv.classList.add("error-container")
        }else{
            window.location.href="./login.html"
        }
    }
    
})