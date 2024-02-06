const express = require('express');
const app = express();
const port = 3000;
const bodyParser = require('body-parser');

// Define the posts array to store post data
let posts = [];

// Define a variable to keep track of the last assigned post ID
let lastPostId = 0;

// Set EJS as the view engine
app.set('view engine', 'ejs');

// Middleware for parsing application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: true }));

// Middleware for parsing application/json
app.use(bodyParser.json());
app.use(express.static('public'));

// Routes
app.get('/', (req, res) => {
    // Render home page with posts
    res.render('home', { posts: posts }); // Assuming posts array is passed as an empty array initially
  });
  app.post('/create', (req, res) => {
    // Handle post creation
    const { title, content } = req.body;
    
    // Assuming you have a data structure to store posts, e.g., an array
    const newPost = { 
    id: ++lastPostId,
      title,
      content
    };
  
    // Add the new post to the array (or database, if you're using one)
    posts.push(newPost);
  console.log(posts.length);
  console.log(posts);
    // Redirect to home page after post creation
    res.redirect('/');
  });

// delete route
app.post('/delete/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    // Find the index of the post with the given ID in the posts array
    const index = posts.findIndex(post => post.id === postId);
    if (index !== -1) {
        // Remove the post from the array
        posts.splice(index, 1);
    }
    // Redirect to the home page after deletion
    res.redirect('/');
    console.log("after deletion",posts);
});

// edit route
app.get('/edit/:id', (req, res) => {
    const postId = parseInt(req.params.id);
    // Find the post with the given ID
    const post = posts.find(post => post.id === postId);
    if (!post) {
        // If post is not found, return 404 error
        res.status(404).send('Post not found');
        return;
    }
    // Render the edit page with the post data
    res.render('edit', { post: post });
});

// Update route to handle edit form submission
app.post('/edit/:id', (req, res) => {
  const postId = parseInt(req.params.id);
  // Find the index of the post with the given ID in the posts array
  const index = posts.findIndex(post => post.id === postId);
  if (index !== -1) {
      // Update the post content
      posts[index].title = req.body.title;
      posts[index].content = req.body.content;
      // Redirect to the home page after editing
      res.redirect('/');
      console.log("Post updated:", posts[index]); // Logging the updated post
  } else {
      // If post not found, send 404 response
      res.status(404).send("Post not found");
  }
});


// Start server
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
  });