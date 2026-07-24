let passwords = JSON.parse(localStorage.getItem("passwords")) || [];

let editIndex = -1;

displayPasswords();

document.getElementById("addBtn").addEventListener("click", addPassword);

document.getElementById("search").addEventListener("keyup", searchPassword);

function addPassword(){

    const title = document.getElementById("title").value.trim();

    const password = document.getElementById("password").value.trim();

    if(title=="" || password==""){
        alert("Enter title and password");
        return;
    }

    if(editIndex===-1){

        passwords.push({
            title,
            password
        });

    }else{

        passwords[editIndex]={
            title,
            password
        };

        editIndex=-1;

        document.getElementById("addBtn").innerText="Add";
    }

    saveData();

    document.getElementById("title").value="";
    document.getElementById("password").value="";

    displayPasswords();

}

function displayPasswords(){

    const tbody=document.getElementById("passwordList");

    tbody.innerHTML="";

    passwords.forEach((item,index)=>{

        tbody.innerHTML+=`

        <tr>

        <td>${item.title}</td>

        <td>${item.password}</td>

        <td>

        <button class="edit" onclick="editPassword(${index})">Edit</button>

        <button class="delete" onclick="deletePassword(${index})">Delete</button>

        </td>

        </tr>

        `;

    });

    document.getElementById("total").innerText=passwords.length;

}

function deletePassword(index){

    passwords.splice(index,1);

    saveData();

    displayPasswords();

}

function editPassword(index){

    document.getElementById("title").value=passwords[index].title;

    document.getElementById("password").value=passwords[index].password;

    editIndex=index;

    document.getElementById("addBtn").innerText="Update";

}

function searchPassword(){

    const value=document
    .getElementById("search")
    .value
    .toLowerCase();

    const rows=document.querySelectorAll("#passwordList tr");

    rows.forEach(row=>{

        const title=row.children[0].innerText.toLowerCase();

        if(title.includes(value)){
            row.style.display="";
        }else{
            row.style.display="none";
        }

    });

}

function saveData(){

    localStorage.setItem(
        "passwords",
        JSON.stringify(passwords)
    );

}