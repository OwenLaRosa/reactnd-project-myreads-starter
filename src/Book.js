import React, { Component } from 'react'
import PropTypes from 'prop-types'

class Book extends Component {

  static propTypes = {
    book: PropTypes.object.isRequired,
    setShelf: PropTypes.func.isRequired,
    selected: PropTypes.string
  }

  constructor(props) {
    super(props)

    // default value if no selected state is passed in
    var selected = "none"
    if (props.selected) {
      selected = props.selected
    }

    this.state = {
      selected: selected
    }
  }

  onSelectionChanged = (event) => {
    this.setState({selected: event.target.value})
    this.props.setShelf(this.props.book, event.target.value)
  }

  render() {
    const { book } = this.props
    const { selected } = this.state

    // some URLs don't have imageLinks, which can cause an error
    // these books should just be rendered with a placeholder
    var imageUrl = "";
    if (book.imageLinks) {
      imageUrl = book.imageLinks.smallThumbnail;
    }

    return (
      <li>
        <div className="book">
          <div className="book-top">
            <div className="book-cover" style={{ width: 128, height: 193, backgroundImage: `url(${imageUrl})` }}></div>
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
