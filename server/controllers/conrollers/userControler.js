const mysql = require('mysql');

const pool = mysql.createPool({
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "", // Change as needed
    database: process.env.DB_DATABASE || "management" // Change as needed
});



exports.view =  (req, res) => {
     // Render the "home.hbs" view

    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) throw err; 
            console.log("Error getting connection from pool:", err);
        console.log('Connected as ID ' + connection.threadId);

connection.query('SELECT * FROM user WHERE status = "active"', (err, rows) => {


    connection.release()
    if(!err){
        res.render('home', {rows})

    }else{
        console.log(err)
    }
    
    console.log('the data from user table: \n', rows)
})


    });


};


exports.find =  (req, res) => {
    
        // Render the "home.hbs" view
   
       // Get a connection from the pool
       pool.getConnection((err, connection) => {
           if (err) throw err; 
               console.log("Error getting connection from pool:", err);
           console.log('Connected as ID ' + connection.threadId);
   let searchterm = req.body.search;
   connection.query('SELECT * FROM user WHERE first_name LIKE ? OR last_name LIKE ?', ['%'+ searchterm + '%', '%'+ searchterm + '%'], (err, rows) => {
   
   
       connection.release()
       if(!err){
           res.render('home', {rows})
   
       }else{
           console.log(err)
       }
       
       console.log('the data from user table: \n', rows)
   })
   
   
       });
   
   
   };  

   exports.form=  (req, res) => {
    res.render('adduser')
   }
   exports.create = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;

    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting connection from pool:", err);
            return res.status(500).send('Database connection error');
        }
        
        console.log('Connected as ID ' + connection.threadId);

        // SQL query to insert data
        connection.query(
            'INSERT INTO user (first_name, last_name, email, phone, comments) VALUES (?, ?, ?, ?, ?)',
            [first_name, last_name, email, phone, comments],
            (err, results) => {
                // Release the connection back to the pool
                connection.release();

                if (err) {
                    console.error('Error executing query: ', err);
                    return res.status(500).send('Error inserting data');
                }

                console.log('Data inserted successfully:', results);
                res.render('adduser', { message: 'User added successfully!' });
            }
        );
    });
};

exports.edit = (req, res) => {
    // Get the user ID from the request parameters
    const userId = req.params.id;

    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting connection from pool:", err);
            return res.status(500).send("Internal Server Error");
        }

        console.log('Connected as ID ' + connection.threadId);

        // Query to select the user by ID
        connection.query('SELECT * FROM user WHERE id = ?', [userId], (err, rows) => {
            // Release the connection back to the pool
            connection.release();

            if (err) {
                console.error("Error querying the database:", err);
                return res.status(500).send("Internal Server Error");
            }

            // Render the edit user page with the retrieved data
            console.log('The data from user table: \n', rows);
            res.render('edituser', { rows });
        });
    });
};



exports.update = (req, res) => {
    const { first_name, last_name, email, phone, comments } = req.body;
    const userId = req.params.id; // Correctly reference params

    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting connection from pool:", err);
            return res.status(500).send("Internal Server Error");
        }
        
        console.log('Connected as ID ' + connection.threadId);

        // Update query
        connection.query(
            'UPDATE user SET first_name = ?, last_name = ?, email = ?, phone = ?, comments = ? WHERE id = ?',
            [first_name, last_name, email, phone, comments, userId], // Use userId
            (err, result) => {
                connection.release(); // Always release the connection

                if (err) {
                    console.error("Error executing update query:", err);
                    return res.status(500).send("Internal Server Error");
                }

                // Fetch the updated user data
                pool.getConnection((err, connection) => {
                    if (err) {
                        console.error("Error getting connection from pool:", err);
                        return res.status(500).send("Internal Server Error");
                    }
                    
                    console.log('Connected as ID ' + connection.threadId);

                    connection.query('SELECT * FROM user WHERE id = ?', [userId], (err, rows) => {
                        connection.release(); // Always release the connection

                        if (err) {
                            console.error("Error querying the database:", err);
                            return res.status(500).send("Internal Server Error");
                        }

                        console.log('The data from user table: \n', rows);
                        res.render('edituser', { rows });
                    });
                });
            }
        );
    });
};



exports.delete = (req, res) => {
    // Get the user ID from the request parameters
    const userId = req.params.id;

    // Get a connection from the pool
    pool.getConnection((err, connection) => {
        if (err) {
            console.error("Error getting connection from pool:", err);
            return res.status(500).send("Internal Server Error");
        }

        console.log('Connected as ID ' + connection.threadId);

        // Query to delete the user by ID
        connection.query('DELETE FROM user WHERE id = ?', [userId], (err, result) => {
            // Always release the connection back to the pool
            connection.release();

            if (err) {
                console.error("Error executing delete query:", err);
                return res.status(500).send("Error deleting user");
            }

            // Check if any rows were affected
            if (result.affectedRows === 0) {
                return res.status(404).send("User not found");
            }

            console.log('User deleted successfully:', userId);
            res.redirect('/'); // Redirect to the home page after deletion
        });
    });
};




// exports.viewall =  (req, res) => {
//     // Render the "home.hbs" view

//    // Get a connection from the pool
//    pool.getConnection((err, connection) => {
//        if (err) throw err; 
//            console.log("Error getting connection from pool:", err);
//        console.log('Connected as ID ' + connection.threadId);

// connection.query('SELECT * FROM user WHERE id = ?',[req.params.id], (err, rows) => {


//    connection.release()
//    if(!err){
//        res.render('viewuser', {rows})

//    }else{
//        console.log(err)
//    }
   
//    console.log('the data from user table: \n', rows)
// })
//    });
// };

