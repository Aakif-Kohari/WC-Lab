import React from 'react';
import books from '../books';

function Home() {
  return (
    <div className="container">
      {books.map((book, idx) => (
        <div className="book-card" key={idx}>
          <img className="book-cover" src={book.image} alt={book.title} />
          <div className="book-title">{book.title}</div>
          <div className="book-author">by {book.author}</div>
          <div className="book-price">₹{book.price}</div>
          <button className="buy-btn">Buy</button>
        </div>
      ))}
    </div>
  );
}

export default Home;
