//Book class: Represents a Book

class Book {
    constructor(title,author,isbn){
        this.title = title
        this.author = author
        this.isbn = isbn
    }
}


//UI class: Handle UI task

class UI{
    static displayBooks(){
        const StoredBooks = Store.getBooks()
        const books = StoredBooks;
        books.forEach(book => UI.addBookToList(book));
    }
   static addBookToList(book) {
       const list = document.querySelector('#book-list')
       const row = document.createElement('tr')
       row.innerHTML = `
       <td>${book.title}</td>
       <td>${book.author}</td>
       <td>${book.isbn}</td>
       <td><a href="#" class="btn btn-danger btn-sm delete">X</a></td>
       `
       list.appendChild(row)
   }
   static showAlert(message, className){
       const div = document.createElement('div')
       div.className = `alert alert-${className}`
       div.appendChild(document.createTextNode(message));
       const container = document.querySelector('.container')
       const form =  document.querySelector('#book-form')
       container.insertBefore(div, form)
       //vanish in 3 seconds
       setTimeout(()=> document.querySelector('.alert').remove(),3000)
   }
   static clearFields() {
       document.querySelector('#title').value = ''
       document.querySelector('#author').value = ''
       document.querySelector('#isbn').value = ''
   }
   static deleteBook(element){
       if(element.classList.contains('delete')){
           element.parentElement.parentElement.remove()
       }
   }
}

//Store Class: Handles Storage

class Store{
  static  getBooks() {
        let books;
        if(localStorage.getItem('books')=== null){
            books = []
        }
        else{
            books = JSON.parse(localStorage.getItem('books'))
        }
        return books
    }
  static  addBook(book) {
        const books = Store.getBooks();
        books.push(book)
        localStorage.setItem('books',JSON.stringify(books))
    }
  static  removeBook(isbn) {
        const books = Store.getBooks()
        books.forEach((book,index)=>{
            if(book.isbn === isbn){
                books.splice(index,1)
            }
        })
        localStorage.setItem('books',JSON.stringify(books))
    }
}


//Event: Display Books

document.addEventListener('DOMContentLoaded',UI.displayBooks)

//Event:Add a Book
document.querySelector('#book-form').addEventListener('submit',(e)=>{
    
    //prevent default action(refresh)
    e.preventDefault()


    //Get form values
    const title = document.querySelector("#title").value;
    const author = document.querySelector("#author").value;
    const isbn = document.querySelector("#isbn").value;

    if(title === '' || author ===''|| isbn === ''){

        //ALert Error
        UI.showAlert('Please Fill out all fields','danger')
    }
    else{

        //instantiate book
        const book = new Book(title,author,isbn)
        //Add Book to List
        console.log(book.isbn)
        let BookArray = []
        BookArray.push(Store.getBooks())
        console.log(BookArray[0][1])
        BookArray[0].forEach((books)=>{
            if(books.isbn === book.isbn){
                console.log(`The book titled ${book.title} has the same ISBN (${book.isbn}) number as ${books.title}`)
            }
        })
        UI.addBookToList(book)

        //Add Book to Local Storage
        Store.addBook(book)
        
        //Alert Success
        UI.showAlert('Book added succefully','success')
    
        //clear fields
        UI.clearFields()

    }

})


//Event: Remove a Book

document.querySelector('#book-list').addEventListener('click',(e)=>{
    UI.deleteBook(e.target)
    
    //remove book from store
    Store.removeBook(e.target.parentElement.previousElementSibling.textContent)

    //Alert Book removed

    UI.showAlert('Book removed succefully','warning')
})