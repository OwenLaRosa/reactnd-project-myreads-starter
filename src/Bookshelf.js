import React, { Component } from 'react'
import PropTypes from 'prop-types'
import Book from './Book'

class Bookshelf extends Component {

  static PropTypes = {
    title: PropTypes.string.isRequired,
    books: PropTypes.array.isRequired,
    setShelf: PropTypes.func.isRequired
  }

  render() {
    return (
      <div className="bookshelf">
        <h2 className="bookshelf-title">{this.props.title}</h2>
        <div className="bookshelf-books">
          <ol className="books-grid">
            {this.props.books.map((book) => (
              <Book book={book} setShelf={this.props.setShelf} />
            ))}
          </ol>
        </div>
      </div>
    )
  }
}

export default Bookshelf
