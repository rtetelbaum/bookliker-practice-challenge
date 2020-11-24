document.addEventListener("DOMContentLoaded", function() {

let usersArray = []

// DOM ELEMENTS
const bookList = document.querySelector("#list")
const showPanel = document.querySelector("#show-panel")
const likeBtn = document.createElement("button")
likeBtn.id = "likeBtn"
likeBtn.textContent = "Like"

// LISTERNERS
bookList.addEventListener("click", fetchGetBook)
likeBtn.addEventListener("click", event => {
	if (usersArray[usersArray.length - 1].username === "pouros") {
		usersArray.splice(-1)
		fetchPatchDeleteLike(event)
	} else {
		usersArray.push({"id":1, "username":"pouros"})
		fetchPatchLike(event)
	}
})

// HANDLERS
function fetchGetBooks() {
	fetch('http://localhost:3000/books')
		.then(response => response.json())
		.then(booksObjs => {
			console.log(booksObjs)
			renderBookList(booksObjs)
		})
}

function fetchGetBook(event) {
	fetch(`http://localhost:3000/books/${event.target.dataset.id}`)
		.then(response => response.json())
		.then(booksObj => {
			console.log(booksObj)
			renderBook(booksObj)
		})
}

function fetchPatchLike(event) {
	fetch(`http://localhost:3000/books/${event.target.dataset.id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({"users": usersArray}),
	})
		.then(response => response.json())
		.then(newBookData => {
			console.log('Success:', newBookData)
			renderNewUser(newBookData)
		})
}

function fetchPatchDeleteLike(event) {
	fetch(`http://localhost:3000/books/${event.target.dataset.id}`, {
		method: 'PATCH',
		headers: {
			'Content-Type': 'application/json',
		},
		body: JSON.stringify({"users": usersArray}),
	})
		.then(response => response.json())
		.then(newBookData => {
			console.log('Success:', newBookData)
			renderDeleteUser()
		})
}

// RENDERERS
function renderBookList(bookObjs) {
	bookObjs.forEach( book => {
		const bookLi = document.createElement("li")
		bookLi.dataset.id = book.id
		bookLi.textContent = book.title
		bookList.append(bookLi)
	})
}

function renderBook(bookObj) {
	showPanel.dataset.id = bookObj.id
	showPanel.innerHTML = `
		<img src=${bookObj.img_url} alt=${bookObj.title}>
		<h3>${bookObj.title}</h3>
		<h3>${bookObj.subtitle}</h3>
		<h3>${bookObj.author}</h3>
		<p>${bookObj.description}</p>
		<ul id="userUl"></ul>
	`
	bookObj.users.forEach( user => {
		const userLi = document.createElement("li")
		userLi.textContent = user.username
		document.querySelector("#userUl").append(userLi)
		usersArray.push({
			"id": user.id,
			"username": user.username
		})
	})
	console.log(usersArray)
	likeBtn.dataset.id = bookObj.id
	showPanel.append(likeBtn)
}

function renderNewUser(newBookData) {
	const userLi = document.createElement("li")
	// debugger
	userLi.textContent = `${newBookData.users[newBookData.users.length - 1].username}`
	document.querySelector("#userUl").append(userLi)
}

function renderDeleteUser() {
	document.querySelector("#userUl").lastChild.remove()
}

// INITIALIZER
fetchGetBooks()

});