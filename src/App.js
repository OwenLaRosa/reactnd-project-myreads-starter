import React from 'react'
import Bookshelf from './Bookshelf'
import SearchBooks from './SearchBooks'
import { Link, Route } from 'react-router-dom'
import * as BooksAPI from './BooksAPI'

import './App.css'

class BooksApp extends React.Component {
  state = {
    /**
     * TODO: Instead of using this state variable to keep track of which page
     * we're on, use the URL in the browser's address bar. This will ensure that
     * users can use the browser's back and forward buttons to navigate between
     * pages, as well as provide a good URL they can bookmark and share.
     */
    showSearchPage: false,
    currentlyReading: {},
    wantToRead: {},
    read: {},
    allBooks: []
  }

  componentDidMount() {
    BooksAPI.getAll().then((results) => {
      results.forEach((book) => (
        this.setShelf(book, book.shelf)
      ))
    })
  }

  // get the shelf ID (or 0 if not on any) for this book
  getShelf = (id) => {
    if (this.state.currentlyReading[id]) {
      return "currentlyReading"
    } else if (this.state.wantToRead[id]) {
      return "wantToRead"
    } else if (this.state.read[id]) {
      return "read"
    }
    return "none"
  }

  // place a book on a shelf or remove it based on the selected option
  setShelf = (book, option) => {
    var currentShelf = this.getShelf(book.id)
    if (option === currentShelf) return
    // book is removed from its shelf
    this.removeBook(book)
    // if a shelf is provided (0 means none) then add it to the end of the list
    if (option === "currentlyReading") {
      this.setState({currentlyReading: Object.assign(this.state.currentlyReading, {[book.id]: true})})
    } else if (option === "wantToRead") {
      this.setState({wantToRead: Object.assign(this.state.wantToRead, {[book.id]: true})})
    } else if (option === "read") {
      this.setState({read: Object.assign(this.state.read, {[book.id]: true})})
    }
    BooksAPI.update(book, option)
    // book is added back at the end of the array, unless it was removed
    if (option !== "none") {
      this.setState((oldState) => ({allBooks: oldState.allBooks.concat([book])}))
    }
  }

  // removes book from all shelves as well as the array of books
  removeBook = (book) => {
    this.setState({currentlyReading: Object.assign(this.state.currentlyReading, {[book.id]: undefined})})
    this.setState({wantToRead: Object.assign(this.state.wantToRead, {[book.id]: undefined})})
    this.setState({read: Object.assign(this.state.read, {[book.id]: undefined})})
    this.setState((oldState) => ({allBooks: oldState.allBooks.filter((shelfBook) => (shelfBook.id !== book.id))}))
  }

  render() {
    const { currentlyReading, wantToRead, read, allBooks } = this.state

    return (
      <div className="app">
        <Route path="/" exact render={() => (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <Bookshelf title="Currently Reading"
                books={allBooks.filter((book) => (this.state.currentlyReading[book.id]))}
                setShelf={this.setShelf}
                defaultSelection="currentlyReading"/>
              <Bookshelf title="Want to Read"
                books={allBooks.filter((book) => (this.state.wantToRead[book.id]))}
                setShelf={this.setShelf}
                defaultSelection="wantToRead"/>
              <Bookshelf title="Read"
                books={allBooks.filter((book) => (this.state.read[book.id]))}
                setShelf={this.setShelf}
                defaultSelection="read"/>
            </div>
            <div className="open-search">
              <Link to="/search">Add a book</Link>
            </div>
          </div>
        )}/>
        <Route path="/search" render={() => (
          <SearchBooks getShelf={this.getShelf} setShelf={this.setShelf}/>
        )}/>
      </div>
    )
  }
}

export default BooksApp
