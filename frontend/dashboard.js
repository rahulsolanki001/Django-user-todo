

const logoutButton=document.getElementById("logout");
const elements=document.getElementsByTagName("p");
const todoContainer=document.querySelector(".todo-container");
const todoInput=document.querySelector("input");
const todoButton=document.querySelector("#todo-button");



//to get csrf_token

//csrf_token
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



//getting user details
const fetchDetails=async()=>{

    //fetching user details
    const res=await fetch("http://localhost:8000/api/dashboard",{
        method:"GET",
        credentials: 'include',
    });

    const data=await res.json()
    if(data.status===200){
        elements[0].textContent=data.data.first_name+" "+data.data.last_name
        elements[1].textContent=data.data.username
        elements[2].textContent=data.data.email
    }else {
        window.location.href="./login.html"
    }
    
}
fetchDetails();



//fetching todo

const fetchTodo=async()=>{


     //fetching todos
     const res2=await fetch("http://localhost:8000/api/todo",{
        method:"GET",
        credentials:"include",
    });


    const todos=await res2.json();
    console.log("todos belowww");
    console.log(todos)


    //displaying todos
    if(todos.data.length>0){
        for(let i=0;i<todos.data.length;i++){
            const todo=todos.data[i];
            const todoDiv=document.createElement("div")
            todoDiv.setAttribute("id",`${todo.id}-todo`)
            if(todo.completed){
                todoDiv.classList.add("success");
                todoDiv.classList.remove("fail");
            }
            else{
                todoDiv.classList.remove("success");
                todoDiv.classList.add("fail");
            }
            todoContainer.appendChild(todoDiv);

            //--------------

            //elements in a single todo-div
            const todoText=document.createElement("h3");
            todoDiv.appendChild(todoText);
            todoText.textContent=todo.task


            const footerDiv=document.createElement("div");
            footerDiv.id="footer-div"
            todoDiv.appendChild(footerDiv)


            //delete button
            const todoDeleteButton=document.createElement("button")
            todoDeleteButton.setAttribute("id",`delete${todo.id}`)
            todoDeleteButton.className="delete"
            todoDeleteButton.textContent="Delete"
            footerDiv.appendChild(todoDeleteButton);

            //deleting todo
            todoDeleteButton.addEventListener("click",async()=>{
                const res= await fetch(`http://localhost:8000/api/todo/${todo.id}/`,{
                    method:"DELETE",
                    credentials:"include",
                    headers:{
                        "X-CSRFToken": csrftoken
                    }
                })

                const data=await res.json()
                console.log(data)
                if (data.status===204){
                    todoContainer.replaceChildren();
                    fetchTodo()
                }
            })


            //update button
            const updateTodoButton=document.createElement("button")
            updateTodoButton.setAttribute("id",`update${todo.id}`)
            updateTodoButton.textContent="Update"
            updateTodoButton.className="update"
            footerDiv.appendChild(updateTodoButton);

            //showing input field with todo text
            updateTodoButton.addEventListener("click",async()=>{

                //disable update
                updateTodoButton.disabled=true;

                //hiding todo Text & todo completed
                todoText.style.display="none";
                

                //new todo update div
                const todoUpdateDiv=document.createElement("div")
                todoUpdateDiv.id="todo-update-div"
                todoDiv.appendChild(todoUpdateDiv)

                //new todo input
                const todoInput=document.createElement("input")
                todoInput.id="todo-update-input"
                todoInput.type="text"
                todoInput.value=todo.task
                todoUpdateDiv.appendChild(todoInput);

                //new todo complete checkbox
                const todoCheck=document.createElement("input")
                todoCheck.id="todo-update-check"
                todoCheck.type="checkbox"
                todoCheck.checked=todo.completed
                todoUpdateDiv.appendChild(todoCheck)

                //submit updated todo
                const todoInputButton=document.createElement("button")
                todoInputButton.textContent="Submit"
                todoInputButton.id="update-submit-button"
                todoDiv.appendChild(todoInputButton)

                //updating todo 
                todoInputButton.addEventListener("click",async()=>{
                    const res=await fetch(`http://localhost:8000/api/todo/update/${todo.id}/`,{
                        method:"PUT",
                        credentials:"include",

                        headers:{
                            "Content-Type":"application/json",
                            "X-CSRFToken": csrftoken
                        },
                        body:JSON.stringify({
                            "task":todoInput.value,
                            "completed":todoCheck.checked
                        })
                    });

                    const data=await res.json()
                    console.log(data)
                    if(data.status===200){

                        //default styles
                        todoInput.style.display="none";
                        todoCheck.style.display="none";
                        todoText.style.display="block";

                        //fetching todos again
                        todoContainer.replaceChildren();
                        fetchTodo();

                    }

                })


               
            })
          
            
            
        }
    }
}

fetchTodo();






//submit todo
todoButton.addEventListener("click",async()=>{
    if(todoInput.value !==""){
        const task=todoInput.value;

        try{
            const postTodo=await fetch("http://localhost:8000/api/todo/new",{
                method:"POST",
                credentials:"include",
                headers:{
                    "Content-Type":"application/json",
                    "X-CSRFToken": csrftoken
                },
                body:JSON.stringify({
                    "task":task,
                    "completed":false
                })
            });
    
            const postTodoData=await postTodo.json();
            todoContainer.replaceChildren(); //deleting all children of parent element
            todoInput.value=""; //setting input to empty
            fetchTodo(); //fetching & displaying todos
            
        }catch(err){
            console.log(err);
        }

       
    }
})



logoutButton.addEventListener("click",async()=>{
    const res=await fetch("http://localhost:8000/api/logout",{
        method:"POST",
        credentials:"include",
        headers:{
            "X-CSRFToken": csrftoken
        },
    });
    const data=await res.json()
    console.log(data);

    if(data.status===200){
        window.location.href="./login.html"
    }else{
        console.log("error")
    }

})