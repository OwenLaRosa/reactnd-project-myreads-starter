import React, { Component } from 'react'
import Book from './Book.js'
import * as BooksAPI from './BooksAPI'
import PropTypes from 'prop-types'
import { Link } from 'react-router-dom'

class SearchBooks extends Component {

  static PropTypes = {
    getShelf: PropTypes.func.isRequired,
    setShelf: PropTypes.func.isRequired
  }

  state = {
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

  render() {
    const { getShelf, setShelf } = this.props
    const { searchResults } = this.state

    return (
      <div className="search-books">
        <div className="search-books-bar">
          <Link className="close-search" to="/">Close</Link>
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
            {searchResults.map((book) => (
              <Book book={book} setShelf={setShelf} selected={getShelf(book.id)}/>
            ))}
          </ol>
        </div>
      </div>
    )
  }
}

export default SearchBooks
