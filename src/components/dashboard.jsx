import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "./navbar";
import Footer from "./footer";

function Dashboard() {
  const [bookData, setBookData] = useState([]);
  const [newBook, setNewBook] = useState({
    book: "",
    pages: "",
    publisher: "",
  });
  const [updateBookId, setUpdateBookId] = useState(null);

  // Fetch data (GET)
  const fetchBooks = async () => {
    try {
      const response = await axios.get(
        "https://ca9d7413bac36aaebe59.free.beeceptor.com/api/book/"
      );
      setBookData(response.data); // Assuming response is an array of books
    } catch (error) {
      console.error("There was an error fetching the data!", error);
    }
  };

  // Create new book (POST)
  const createBook = async () => {
    try {
      const response = await axios.post(
        "https://ca9d7413bac36aaebe59.free.beeceptor.com/api/book/",
        newBook
      );
      console.log("Book Created:", response.data);
      fetchBooks(); // Refresh the list after adding
      setNewBook({ book: "", pages: "", publisher: "" }); // Reset form after submitting
    } catch (error) {
      console.error("There was an error creating the book!", error);
    }
  };

  // Update existing book (PUT)
  const updateBook = async () => {
    if (updateBookId) {
      try {
        const response = await axios.put(
          `https://ca9d7413bac36aaebe59.free.beeceptor.com/api/book/${updateBookId}`,
          newBook
        );
        console.log("Book Updated:", response.data);
        fetchBooks(); // Refresh the list after updating
        setUpdateBookId(null); // Reset update mode
        setNewBook({ book: "", pages: "", publisher: "" }); // Reset form after submitting
      } catch (error) {
        console.error("There was an error updating the book!", error);
      }
    }
  };

  // Delete a book (DELETE)
  const deleteBook = async (id) => {
    try {
      const response = await axios.delete(
        `https://ca9d7413bac36aaebe59.free.beeceptor.com/api/book/${id}`
      );
      console.log("Book Deleted:", response.data);
      fetchBooks(); // Refresh the list after deleting
    } catch (error) {
      console.error("There was an error deleting the book!", error);
    }
  };

  // Handle input change for new book (to update state)
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setNewBook((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  // Handle update book
  const handleUpdateClick = (book) => {
    setUpdateBookId(book.id); // Set the book ID for update
    setNewBook({
      book: book.book,
      pages: book.pages,
      publisher: book.publisher,
    });
  };

  useEffect(() => {
    fetchBooks(); // Fetch books when the component mounts
  }, []);

  if (bookData.length === 0) {
    return <div>Loading...</div>; // Show loading state while data is fetching
  }

  return (
    <div>
      <Navbar />
      <main>
        {bookData.map((book, index) => (
          <div key={index}>
            <section
              id="home"
              className="vh-100 d-flex align-items-center bg-light text-dark"
              data-aos="fade-up"
            >
              <div className="container-fluid text-center">
                <h1 className="display-4 fw-bold">
                  Welcome to Dashboard - {book.book}
                </h1>
                <p className="lead">
                  This book has {book.pages} pages and is published by{" "}
                  {book.publisher}.
                </p>
                <a href="#about" className="btn btn-primary btn-lg">
                  Explore More
                </a>
              </div>
            </section>

            <section
              id="about"
              className="vh-100 d-flex align-items-center bg-light text-dark"
              data-aos="fade-up"
            >
              <div className="container-fluid text-center">
                <h1 className="display-4 fw-bold">Manage Books</h1>
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    if (updateBookId) {
                      updateBook(); // Update the book if an ID is set
                    } else {
                      createBook(); // Create a new book
                    }
                  }}
                >
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="book"
                      placeholder="Book Title"
                      value={newBook.book}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="number"
                      className="form-control"
                      name="pages"
                      placeholder="Pages"
                      value={newBook.pages}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="mb-3">
                    <input
                      type="text"
                      className="form-control"
                      name="publisher"
                      placeholder="Publisher"
                      value={newBook.publisher}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <button type="submit" className="btn btn-primary">
                    {updateBookId ? "Update Book" : "Add Book"}
                  </button>
                </form>
              </div>
            </section>
            <section
              id="services"
              className="vh-100 d-flex align-items-center bg-light text-dark"
              data-aos="fade-right"
            >
              <div className="container-fluid">
                <h2 className="fw-bold text-center mb-5">Our Books</h2>
                <div className="row g-4">
                  {bookData.map((book, index) => (
                    <div className="col-md-4" key={index} data-aos="flip-left">
                      <div className="card h-100 shadow">
                        <div className="card-body text-center">
                          <h5 className="card-title">{book.book}</h5>
                          <p className="card-text">
                            Pages: {book.pages} <br />
                            Publisher: {book.publisher}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </div>
        ))}
      </main>
      <Footer />
    </div>
  );
}

export default Dashboard;
