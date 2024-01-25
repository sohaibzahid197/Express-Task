const express = require('express');
const bodyParser = require('body-parser');
const path = require('path');
const fs = require('fs');
const app = express();

// Array to store student data 
let students = [];
const dataFilePath = path.join(__dirname, 'submittedData.json');

// Parse URL-encoded bodies
app.use(bodyParser.urlencoded({ extended: true }));

// Set the static folder
app.use(express.static(path.join(__dirname, 'public')));

// Set EJS as the view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Set up a route to serve the form.html file
app.get('/', (req, res) => {
  const cities = ['New York', 'London', 'Paris', 'Tokyo'];
  const languages = ['C', 'Ruby', 'C#', 'Java'];

  res.render('form', { cities, languages }); 
});

// Set up a route to handle the form submission
app.post('/form-handler', (req, res) => {
  const { name, password, Algorithms, OOP, DataStructures, credit_card, city, languages } = req.body;

  // Create an object to store the submitted data
  const formData = {
    name,
    password, 
    Algorithms: !!Algorithms,
    OOP: !!OOP,
    DataStructures: !!DataStructures, 
    credit_card,
    city,
    languages: Array.isArray(languages) ? languages : [languages],
  };

  // Read the existing data from the file
  if (fs.existsSync(dataFilePath)) {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    students = JSON.parse(data);
  }

  // Push the new student data to the array
  students.push(formData);
  const jsonData = JSON.stringify(students);

  // Write the updated array back to the file
  fs.writeFile(dataFilePath, jsonData, (err) => {
    if (err) {
      console.error('Error saving submitted data:', err);
      return res.redirect('/error'); 
    }

    res.redirect('/show-data');  
  });
});

// Set up a route to handle the show-data page
app.get('/show-data', (req, res) => {
  // Read the submitted data from the file
  if (fs.existsSync(dataFilePath)) {
    const data = fs.readFileSync(dataFilePath, 'utf8');
    students = JSON.parse(data);
  }

  console.log(students);

  res.render('next-page', { students });
});

// Start the server
app.listen(3000, () => {
  console.log('Server is running on http://localhost:3000');
});