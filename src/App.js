import React from 'react'
import Book from './Book'
import Bookshelf from './Bookshelf'
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
    allBooks: [],
    searchQuery: '',
    searchResults: []
  }

  performSearch = (query) => {
    this.setState({searchQuery: query.trim()});
    if (query !== "") {
      BooksAPI.search(query, 20).then((results) => {
        this.setState({searchResults: results});
      });
    } else {
      this.setState({searchResults: []});
    }
  }

  // get the shelf ID (or 0 if not on any) for this book
  getShelf = (book) => {
    if (this.state.currentlyReading[book.id]) {
      return "currentlyReading"
    } else if (this.state.wantToRead[book.id]) {
      return "wantToRead"
    } else if (this.state.read[book.id]) {
      return "read"
    }
    return "none"
  }

  // place a book on a shelf or remove it based on the selected option
  setShelf = (book, option) => {
    console.log(book)
    console.log(option)
    var currentShelf = this.getShelf(book.id)
    if (option === currentShelf) return
    // book is removed from its shelf
    this.removeBook(book)
    // if a shelf is provided (0 means none) then add it to the end of the list
    if (option === "currentlyReading") {
      console.log("first option")
      this.setState({currentlyReading: {[book.id]: true}})
    } else if (option === "wantToRead") {
      this.setState({wantToRead: {[book.id]: true}})
    } else if (option === "read") {
      this.setState({read: {[book.id]: true}})
    }
    // book is added back at the end of the array, unless it was removed
    if (option !== "none") {
      this.setState((oldState) => ({allBooks: oldState.allBooks.concat([book])}))
      console.log(this.state)
    }
  }

  // removes book from all shelves as well as the array of books
  removeBook = (book) => {
    this.setState({currentlyReading: {[book.id]: undefined}})
    this.setState({wantToRead: {[book.id]: undefined}})
    this.setState({read: {[book.id]: undefined}})
    this.setState((oldState) => ({allBooks: oldState.allBooks.filter((shelfBook) => (shelfBook.id !== book.id))}))
    console.log(this.state.allBooks.map((book) => (book.id)))
  }

  render() {
    const { currentlyReading, wantToRead, read, allBooks } = this.state

    return (
      <div className="app">
        {this.state.showSearchPage ? (
          <div className="search-books">
            <div className="search-books-bar">
              <a className="close-search" onClick={() => this.setState({ showSearchPage: false })}>Close</a>
              <div className="search-books-input-wrapper">
                {/*
                  NOTES: The search from BooksAPI is limited to a particular set of search terms.
                  You can find these search terms here:
                  https://github.com/udacity/reactnd-project-myreads-starter/blob/master/SEARCH_TERMS.md

                  However, remember that the BooksAPI.search method DOES search by title or author. So, don't worry if
                  you don't find a specific author or title. Every search is limited by search terms.
                */}
                <input type="text"
                  placeholder="Search by title or author"
                  value={this.state.searchQuery}
                  onChange={event => this.performSearch(event.target.value)}/>
              </div>
            </div>
            <div className="search-books-results">
              <ol className="books-grid">
                {this.state.searchResults.map((book) => (
                  <Book book={book} setShelf={this.setShelf} />
                ))}
              </ol>
            </div>
          </div>
        ) : (
          <div className="list-books">
            <div className="list-books-title">
              <h1>MyReads</h1>
            </div>
            <div className="list-books-content">
              <div className="bookshelf">
                <h2 className="bookshelf-title">Currently Reading</h2>
                <div className="bookshelf-books">
                  <ol className="books-grid">
                    {allBooks.filter((book) => (
                      this.state.currentlyReading[book.id]
                    )).map((book) => (
                      <Book book={book} setShelf={this.setShelf} />
                    ))}
                  </ol>
                </div>
              </div>
              <div className="bookshelf">
                <h2 className="bookshelf-title">Want to Read</h2>
                <div className="bookshelf-books">
                  <ol className="books-grid">
                    {allBooks.filter((book) => (
                      this.state.wantToRead[book.id]
                    )).map((book) => (
                      <Book book={book} setShelf={this.setShelf} />
                    ))}
                  </ol>
                </div>
              </div>
              <div className="bookshelf">
                <h2 className="bookshelf-title">Read</h2>
                <div className="bookshelf-books">
                  <ol className="books-grid">
                    {allBooks.filter((book) => (
                      this.state.read[book.id]
                    )).map((book) => (
                      <Book book={book} setShelf={this.setShelf} />
                    ))}
                  </ol>
                </div>
              </div>
            </div>
            <div className="open-search">
              <a onClick={() => this.setState({ showSearchPage: true })}>Add a book</a>
            </div>
          </div>
        )}
      </div>
    )
  }
}

export default BooksApp
