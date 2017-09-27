import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Book extends Component {

  static propTypes = {
    book: PropTypes.object.isRequired,
    setShelf: PropTypes.func.isRequired
  }

  constructor(props) {
    super(props)

    this.state = {
      selected: "none"
    }
  }

  onSelectionChanged = (event) => {
    console.log(event.target.value)
    this.setState({selected: event.target.value})
    this.props.setShelf(this.props.book, event.target.value)
  }

  render() {
    const { book } = this.props
    const { selected } = this.state

    return (
      <li>
        <div className="book">
          <div className="book-top">
            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${book.imageLinks.smallThumbnail})` }}></div>
            <div className="book-shelf-changer">
              <select value={selected} onChange={this.onSelectionChanged}>
                <option value="none" disabled>Move to...</option>
                <option value="currentlyReading">Currently Reading</option>
                <option value="wantToRead">Want to Read</option>
                <option value="read">Read</option>
                <option value="none">None</option>
              </select>
            </div>
          </div>
          <div className="book-title">{book.title}</div>
          <div className="book-authors">{book.authors}</div>
        </div>
      </li>
    )
  }
}

export default Book
