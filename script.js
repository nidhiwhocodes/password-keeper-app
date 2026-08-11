const API_URL =
  "https://crudcrud.com/api/9d26d594d8604acd8d9efaf55f66e4f2/passwords";

let passwords = [];
let editId = null;

// Load passwords when page starts
displayPasswords();

// Add button
document.getElementById("addBtn").addEventListener("click", addPassword);

// Search
document.getElementById("search").addEventListener("keyup", searchPassword);

// ===============================
// GET - Display Passwords
// ===============================

async function displayPasswords() {
  try {
    const response = await fetch(API_URL);

    passwords = await response.json();

    const tbody = document.getElementById("passwordList");

    tbody.innerHTML = "";

    passwords.forEach((item) => {
      tbody.innerHTML += `

                <tr>

                    <td class="px-5 py-4 font-medium text-slate-700 sm:px-7">${item.title}</td>

                    <td class="px-5 py-4 text-slate-600 sm:px-7">${item.password}</td>

                    <td class="px-5 py-4 text-right sm:px-7">

                        <div class="flex justify-end gap-2">

                            <button
                                type="button"
                                class="inline-flex items-center gap-1.5 rounded-lg border border-indigo-200 bg-indigo-50 px-3 py-2 text-sm font-semibold text-indigo-700 transition hover:-translate-y-0.5 hover:bg-indigo-100 hover:shadow-sm"
                                onclick="editPassword('${item._id}')"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.5-9.5a2.121 2.121 0 113 3L12 15l-4 1 1-4 6.5-6.5z" />
                                </svg>
                                Edit
                            </button>

                            <button
                                type="button"
                                class="inline-flex items-center gap-1.5 rounded-lg border border-rose-200 bg-rose-50 px-3 py-2 text-sm font-semibold text-rose-700 transition hover:-translate-y-0.5 hover:bg-rose-100 hover:shadow-sm"
                                onclick="deletePassword('${item._id}')"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" stroke-width="2">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                </svg>
                                Delete
                            </button>

                        </div>

                    </td>

                </tr>

            `;
    });

    document.getElementById("total").innerText = passwords.length;
  } catch (error) {
    console.log("Error:", error);

    alert("Unable to load passwords");
  }
}

// ===============================
// POST - Add Password
// ===============================

async function addPassword() {
  const title = document.getElementById("title").value.trim();

  const password = document.getElementById("password").value.trim();

  if (title === "" || password === "") {
    alert("Enter title and password");

    return;
  }

  // =========================
  // UPDATE
  // =========================

  if (editId !== null) {
    try {
      const response = await fetch(`${API_URL}/${editId}`, {
        method: "PUT",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: title,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Update failed");
      }

      alert("Password updated successfully");

      editId = null;

      document.getElementById("addBtn").innerText = "Add";
    } catch (error) {
      console.log(error);

      alert("Unable to update password");

      return;
    }
  }

  // =========================
  // CREATE
  // =========================
  else {
    try {
      const response = await fetch(API_URL, {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          title: title,
          password: password,
        }),
      });

      if (!response.ok) {
        throw new Error("Add failed");
      }

      alert("Password added successfully");
    } catch (error) {
      console.log(error);

      alert("Unable to add password");

      return;
    }
  }

  // Clear inputs

  document.getElementById("title").value = "";

  document.getElementById("password").value = "";

  // Refresh table

  displayPasswords();
}

// ===============================
// DELETE
// ===============================

async function deletePassword(id) {
  const confirmDelete = confirm(
    "Are you sure you want to delete this password?",
  );

  if (!confirmDelete) {
    return;
  }

  try {
    const response = await fetch(`${API_URL}/${id}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Delete failed");
    }

    alert("Password deleted successfully");

    displayPasswords();
  } catch (error) {
    console.log(error);

    alert("Unable to delete password");
  }
}

// ===============================
// EDIT
// ===============================

function editPassword(id) {
  const password = passwords.find((item) => item._id === id);

  if (!password) {
    return;
  }

  document.getElementById("title").value = password.title;

  document.getElementById("password").value = password.password;

  editId = id;

  document.getElementById("addBtn").innerText = "Update";
}

// ===============================
// SEARCH
// ===============================

function searchPassword() {
  const value = document.getElementById("search").value.toLowerCase();

  const rows = document.querySelectorAll("#passwordList tr");

  rows.forEach((row) => {
    const title = row.children[0].innerText.toLowerCase();

    if (title.includes(value)) {
      row.style.display = "";
    } else {
      row.style.display = "none";
    }
  });
}
