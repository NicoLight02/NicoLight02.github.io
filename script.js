//  Data
let users = {
    admin: { password: "admin", role: "admin" },
    user: { password: "user", role: "user" }
};

let books = JSON.parse(localStorage.getItem("books") || "[]");
let currentUser = JSON.parse(localStorage.getItem("currentUser") || "null");

let sortColumn = null;
let sortDirection = 1;

// Add books to the system
books = [
        { title: "To Kill a Mockingbird", author: "Harper Lee", borrowed: false, dueDate: "", popularity: 23 },
        {title: "1984", author: "George Orwell", borrowed: false, dueDate: "", popularity: 43},
        {title: "The Great Gatsby", author: "F. Scott Fitzgerald", borrowed: false, dueDate: "", popularity: 32},
        {title: "The Catcher in the Rye", author: "J. D. Salinger", borrowed: false, dueDate: "", popularity: 13},
        {title: "Moby-Dick", author: "Herman Melville", borrowed: false, dueDate: "", popularity: 8},
        {title: "Anna Karenina ", author: "Leo Tolstoy", borrowed: false, dueDate: "", popularity: 6},
        {title: "Crime and Punishment", author: "Fyodor Dostoevsky", borrowed: false, dueDate: "", popularity: 12},
        {title: "Pride and Prejudice", author: "Jane Austen", borrowed: false, dueDate: "", popularity: 15},
        {title: "War and Peace", author: "Leo Tolstoy", borrowed: false, dueDate: "", popularity: 5},
        {title: "The Fellowship of the Ring", author: "J. R. R. Tolkien", borrowed: false, dueDate: "", popularity: 54},
        {title: "The Two Towers", author: "J. R. R. Tolkien", borrowed: false, dueDate: "", popularity: 42},
        {title: "The Return of the King", author: "J. R. R. Tolkien", borrowed: false, dueDate: "", popularity: 39},
        {title: "The Odyssey", author: "Homer", borrowed: false, dueDate: "", popularity: 18},
        {title: "The Hunger Games", author: "Suzanne Collins", borrowed: false, dueDate: "", popularity: 36},
        {title: "Catching Fire", author: "Suzanne Collins", borrowed: false, dueDate: "", popularity: 30},
        {title: "Mockingjay", author: "Suzanne Collins", borrowed: false, dueDate: "", popularity: 24},
        {title: "Harry Potter and the Sorcerer's Stone", author: "J.K. Rowling", borrowed: false, dueDate: "", popularity: 98},
        {title: "Harry Potter and the Chamber of Secrets", author: "J.K. Rowling", borrowed: false, dueDate: "", popularity: 90},
        {title: "Harry Potter and the Prisoner of Azkaban", author: "J.K. Rowling", borrowed: false, dueDate: "", popularity: 84},
        {title: "Harry Potter and the Goblet of Fire", author: "J.K. Rowling", borrowed: false, dueDate: "", popularity: 78},
        {title: "Harry Potter and the Order of the Phoenix", author: "J.K. Rowling", borrowed: false, dueDate: "", popularity: 72},
        {title: "Harry Potter and the Half-Blood Prince", author: "J.K. Rowling", borrowed: false, dueDate: "", popularity: 66},
        {title: "Harry Potter and the Deathly Hallows", author: "J.K. Rowling", borrowed: false, dueDate: "", popularity: 60},
        {title: "The Giver", author: "The Giver", borrowed: false, dueDate: "", popularity: 55},
        {title: "The Fault in Our Stars", author: "John Green", borrowed: false, dueDate: "", popularity: 94},
        {title: "The Book Thief", author: "Markus Zusak", borrowed: false, dueDate: "", popularity: 46}
];
localStorage.setItem("books", JSON.stringify(books));

// Login
function login() {
    let u = document.getElementById("loginUser").value;
    let p = document.getElementById("loginPass").value;

    if (users[u] && users[u].password === p) {
        currentUser = { username: u, role: users[u].role };
        localStorage.setItem("currentUser", JSON.stringify(currentUser));
        loadApp();
    } else {
        alert("Invalid username or password");
    }
}

// Logout
function logout() {
    localStorage.removeItem("currentUser");
    location.reload();
}

// Load the application
function loadApp() {
    if (!currentUser) return;

    document.getElementById("loginContainer").classList.add("hidden");
    document.getElementById("mainApp").classList.remove("hidden");

    document.getElementById("usernameDisplay").textContent = currentUser.username;
    document.getElementById("roleDisplay").textContent = currentUser.role;

    renderBooks();
}

loadApp();

// Add / Edit book
function saveBook() {
    let title = document.getElementById("title").value;
    let author = document.getElementById("author").value;
    let index = document.getElementById("editIndex").value;

    if (!title || !author) {
        alert("Fill all fields");
        return;
    }

    if (index) {
        books[index].title = title;
        books[index].author = author;
    } else {
        books.push({
            title,
            author,
            borrowed: false,
            dueDate: "",
            popularity: 0
        });
    }

    localStorage.setItem("books", JSON.stringify(books));
    clearForm();
    renderBooks();
}

function clearForm() {
    document.getElementById("title").value = "";
    document.getElementById("author").value = "";
    document.getElementById("editIndex").value = "";
}



// Create book list
function renderBooks() {
    let filter = document.getElementById("search").value.toLowerCase();
    let tbody = document.querySelector("#bookTable tbody");
    tbody.innerHTML = "";

    books
        .filter(b =>
            b.title.toLowerCase().includes(filter) ||
            b.author.toLowerCase().includes(filter)
        )
        .forEach((book, i) => {

        let tr = document.createElement("tr");

        tr.innerHTML = `
            <td>${book.title}</td>
            <td>${book.author}</td>
            <td>${book.borrowed ? "Borrowed" : "Available"}</td>
            <td>${book.dueDate || "-"}</td>
            <td>${book.popularity}</td>
            <td>
                <button onclick="editBook(${i})">Edit</button>
                ${currentUser.role === "admin" ?
                    `<button class="danger" onclick="deleteBook(${i})">Delete</button>`
                    : ""}
                ${!book.borrowed ?
                    `<button onclick="borrowBook(${i})">Borrow</button>`
                    :
                    `<button onclick="returnBook(${i})">Return</button>`
                }
            </td>
        `;

        tbody.appendChild(tr);
    });
}

// Edit / Delete book
function editBook(i) {
    let b = books[i];
    document.getElementById("title").value = b.title;
    document.getElementById("author").value = b.author;
    document.getElementById("editIndex").value = i;
}

function deleteBook(i) {
    if (!confirm("Delete this book?")) return;

    books.splice(i, 1);
    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
}

// Borrow / Return book
function borrowBook(i) {
    // Get today's date
    let today = new Date();

    // Add 14 days
    let due = new Date(today);
    due.setDate(today.getDate() + 14);

    // Format to YYYY-MM-DD
    let formattedDue =
        due.getFullYear() + "-" +
        String(due.getMonth() + 1).padStart(2, '0') + "-" +
        String(due.getDate()).padStart(2, '0');

    // Update book
    books[i].borrowed = true;
    books[i].dueDate = formattedDue;
    books[i].popularity++;

    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
}

// Return book
function returnBook(i) {
    books[i].borrowed = false;
    books[i].dueDate = "";

    localStorage.setItem("books", JSON.stringify(books));
    renderBooks();
}

// Sort books
function sortBooks(column){
    if (sortColumn === column) {
        sortDirection =-1; // Reverse the order
    }
    else {
        sortColumn = column;
        sortDirection = 1;
    }

    books.sort((a, b) => {
        let valueA = a[column];
        let valueB = b[column];
        
        if (typeof valueA === "boolean") valueA = valueA ? 1 : 0;
        if (typeof valueB === "boolean") valueB = valueB ? 1 : 0;

        if (column === "dueDate") {
            valueA = valueA || "";
            valueB = valueB || "";
        }

        return valueA > valueB ? sortDirection : valueA < valueB ? -sortDirection : 0;
    });

    renderBooks();
}
