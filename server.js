const express = require('express');
const db = require('./db/connection');
const PORT = process.env.PORT || 3001; 
const app = express(); 
const inputCheck = require('./utils/inputCheck');
const apiRoutes = require('./routes/apiRoutes');

// Express Middleware
// express.urlencoded function is a built-in middleware function Express. It parses incoming requests with urlencoded payloads. 
//Syntax: express.urlendcoded([options]);
// Parameters: extended, inflate, limit, verify etc. 
// return value: It returns an object 
//URL encoding is the practice of translating unprintable characters with special meaning within URL's to a representation that is unambivuous and unversally accepted by web browsers and servers. 
app.use(express.urlencoded({ extended: false})); // False means you cannot POST nested objects. True means you can
app.use(express.json());
app.use('/api', apiRoutes);

// Create catchall route to handle user requests and aren't supported by the app. 
//SUPER IMPORTANT TO PLACE THIS BELOW THE app.get or it will override them and you will get the error for correct routes as well!

/* const sql = `INSERT INTO candidates (id, first_name, last_name, industry_connected) 
              VALUES (?,?,?,?)`; // Placeholders
const params = [1, 'Ronald', 'Firbank', 1]; // declared a variable for parameters for legibility for the call function to the database. ORDER HERE MUST MATCH WHAT'S IN PARENTHESIS ABOVE. ALSO MUST MATCH THE NUMBER OF ? PLACEHOLDERS
*/
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});