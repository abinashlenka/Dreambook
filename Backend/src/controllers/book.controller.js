const httpStatus = require('http-status');
const ApiError = require('../utils/ApiError');
const catchAsync = require('../utils/catchAsync');
const { bookService } = require('../services');
const { fileUploadService } = require('../microservices');

const searchQuery = (search, field) => {
    return [{ [field]: { $regex: search, $options: 'i' } }];
  };
  

const addBook = catchAsync(async (req, res) => {
    if (req.body.platforms) {
        req.body.platforms = JSON.parse(req.body.platforms);
    }
    if (req.file) {
        const [coverImage] = await fileUploadService.s3Upload([req.file], 'coverImages').catch(err => {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload profile picture');
        });
        // let book = await bookService.addBook({ ...req.body, coverImage })
        let book = await bookService.addBook({ ...req.body, coverImage, source: req.body.source || "manual" })

        return res.status(200).send({ status: true, message: "Book added successfully", data: book });
    } else {
        return res.status(400).json({ status: false, message: "Please pass cover image" })
    }
});

const getAllBooks = catchAsync(async (req, res) => {
    console.log("Final query object:", req.query); // Debug log the final query object

    console.log("req.user:", req.user); // Debug log
    const user = req.user || {};
    // const user = req.user;
    const populateConfig = [
        { path: "author", select: "_id name email" }
    ]
    if (req.query.search === '') {
        delete req.query.search;
    }
    if (req.query.search) {
        let search = req.query.search;
        console.log("Search term:", search); // Debug log the search term
        delete req.query.search;
        let qStringTitile = searchQuery(search, "title");
        let qStringSubTitle = searchQuery(search, "subtitle");
        let qStringIsbnNumber = searchQuery(search, "isbnNumber");
        req.query = { ...req.query, $or: qStringTitile.concat(qStringSubTitle).concat(qStringIsbnNumber) };
        console.log("Constructed query object:", req.query); // Log the constructed query
    }

    

    // FIX HERE NEW: Process the status filter if provided
    // if (req.query.status) {
    //     req.query.status = req.query.status.trim();
    //     if (req.query.status === "All") {  // If status is 'All', remove the filter
    //         delete req.query.status;
    //     }
    // }

     // ✅ FIX HERE: Handle status filter (All, approved, rejected, pending)
     if (req.query.status) {
        req.query.status = req.query.status.trim();
        if (req.query.status === "All") {  
            delete req.query.status; // Remove status filter if 'All' is selected
        }
    }

    console.log("Sorting parameter received:", req.query.sort); // Debug log (Message 45)

    // ✅ FIX HERE: Apply sorting by "oldToNew" or "newToOld"
    if (req.query.sort === "oldToNew") {
        req.query.sort = "createdAt"; // Sort by ascending order
    } else if (req.query.sort === "newToOld") {
        req.query.sort = "-createdAt"; // Sort by descending order
    }

    if (user.role === "author") {
        req.query.author = user._id
    }

    // FIX HERE NEW: Extract sort parameter (oldToNew / newToOld)
  const sortParam = req.query.sort || null; // e.g. "oldToNew" or "newToOld"
  
    const books = await bookService.getAllBooks(req.query, populateConfig)
    console.log("Books fetched from service:", books); // Debug log
    console.log("Type of books:", typeof books); // Debug type
    console.log("Is books an array?", Array.isArray(books)); // Check if books is an array

    // ✅ FIX: Ensure `books` is an array before calling `map()`
    if (!Array.isArray(books)) {
        return res.status(500).json({
            status: false,
            message: "Internal Server Error: books is not an array",
            data: books
        });
    }
    // res.status(200).json({
    //     status: true,
    //     message: 'All books',
    //     data: books
    // })

    res.status(200).json({
        status: true,
        message: 'All books',
        data: books.map(book => ({
            id: book._id,
            title: book.title,
            author: book.author,
            source: book.source,  // ✅ Ensure source is included in the response
            // coverImage: book.coverImage,
            // platforms: book.platforms,
            isbnNumber: book.isbnNumber,
            categories: book.categories,
            coverImage: book.coverImage,
            bindingSize: book.bindingSize,
            language: book.language,
            price: book.price,
            platforms: book.platforms,
            source: book.source,
            status: book.status,
            description: book.description
        }))
    })
    
})

const getBookById = catchAsync(async (req, res) => {
    const book = await bookService.getBookById(req.params.id);
    if (!book) {
        return res.status(400).json({
            status: false,
            message: "Book not foud"
        })
    }
    // return res.status(200).json({
    //     status: true,
    //     message: "Book details",
    //     data: book
    // })

    return res.status(200).json({
        status: true,
        message: "Book details",
        data: {
            // id: book._id,
            // title: book.title,
            // author: book.author,
            // source: book.source,  // ✅ Ensure source is returned
            // coverImage: book.coverImage,
            // platforms: book.platforms,
            id: book._id,
      title: book.title,
      author: book.author,
      subtitle: book.subtitle,
      isbnNumber: book.isbnNumber,
      categories: book.categories,
      coverImage: book.coverImage,
      bindingSize: book.bindingSize,
      language: book.language,
      price: book.price,
      platforms: book.platforms,
      source: book.source,
      status: book.status,
      description: book.description
        }
    })
    
})

const updateBookById = catchAsync(async (req, res) => {
    const book = await bookService.getBookById(req.params.id);
    if (!book) {
        return res.status(400).json({
            status: false,
            message: "Book not foud"
        })
    }
    if (req.file) {
        const [coverImage] = await fileUploadService.s3Upload([req.file], 'coverImages').catch(err => {
            throw new ApiError(httpStatus.INTERNAL_SERVER_ERROR, 'Failed to upload profile picture');
        });
        req.body = { ...req.body, coverImage }
    }
    if (req.body.platforms) {
        req.body.platforms = JSON.parse(req.body.platforms);
    }
    // const updatedBook = await bookService.updateBookById(req.params.id, req.body);
    // const updatedBook = await bookService.updateBookById(req.params.id, {
    //     ...bookData._doc,  // Preserve existing data
    //     ...req.body,  // Update only the new fields
    //     source: bookData.source  // ✅ Ensure source is not removed
    // });
    const updatedBook = await bookService.updateBookById(req.params.id, {
        ...book._doc,
        ...req.body,
        source: book.source
      });
    return res.status(200).json({
        status: true,
        message: "Book updated successfully",
        data: updatedBook
    })
})

const deleteBookById = catchAsync(async (req, res) => {
    const book = await bookService.getBookById(req.params.id);
    if (!book) {
        return res.status(400).json({
            status: false,
            message: "Book not foud"
        })
    }
    // const deletedBook = await bookService.getBookById(req.params.id);
    await bookService.deleteBookById(req.params.id); // actual deletion
    return res.status(200).json({
        status: true,
        message: "Book deleted successfully",
        data: deletedBook
    })
})

module.exports = {
    addBook,
    getAllBooks,
    getBookById,
    updateBookById,
    deleteBookById
}
