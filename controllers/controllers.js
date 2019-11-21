const bodyParser = require('body-parser');
const { Pool,Client } = require('pg');
const date = (new Date()).toGMTString();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const upload = require('../filehandler/multer-config');
const cloudinary = require('../filehandler/cloudinary');
const fs = require('fs');
//const dotenv = require('dotenv');

//dotenv.config();


const pool = new Pool({
	user:'postgres',
	host:'localhost',
	database:'Teamwork employees',
	password:'PostgreSQL',
	port:5432,
});

const client = new Client({
	user:'postgres',
	host:'localhost',
	database:'Teamwork employees',
	password:'PostgreSQL',
	port:5432,
});
client.connect()
   .then(() => {
	   console.log('Successfully connected to postgres database');
   })
   .catch((error) => {
	   console.log('Unable to connect');
   });


exports.createUser = (req,res,next) => {
	bcrypt.hash(req.body.password, 10).then(
	(hash) => {
//	const password = bcrypt.hash(req.body.password, 10);
	const text = 'INSERT into Employee(firstName,lastName,email,password,gender,jobRole,department,address,created_on) VALUES($1,$2,$3,$4,$5,$6,$7,$8,$9) RETURNING *'
	const values = [req.body.firstName,req.body.lastName,req.body.email,hash,req.body.gender,req.body.jobRole,req.body.department,req.body.address,date]
	client.query(text,values, (err,res) => {
		if (err) {
			console.log(err.stack)
		}else{
			console.log(res.rows[0])
		}
	})
	res.status(201).json(
	           {
                 "status" : "success",
                 "data" : {
                 "message": "User account successfully created",
                 "token" : "String",
                 "userId": "Integer"
                           }
                }

	
	         );
	});
	
};

exports.userSignin = (req,res,next) => {
	client.query("SELECT * from Employee where email = '"+ req.body.email + "'", (err, result)=>{
	  if(err){
		  console.log(err);
	  }
      bcrypt.compare(req.body.password,result.rows[0].password).then(
	  (valid) => {
		  if (!valid){
			  return res.status(401).json({
				  "error": "Incorrect password!"
			  });
		  }
		  const token = jwt.sign(
		  result.rows[0],
		  'RANDOM_TOKEN_SECRET',
		  {expiresIn: '1h'});
		  res.status(201).json({
			  "status" : "success",
              "data" : {
              token : token,
              "userId": "userId"
		       }
	        });
	  }).catch(
	            (error) => {
		            res.status(500).json({
			            "error": "Signin failed"
		            });
	            }
	  );
	
  });
};
//	res.status(201).json(
//	    {
//         "status" : "success",
//         "data" : {
//         "token" : "String",
//         "userId": "Integer"
//                }
//        }	
//	    );
//};

exports.postGif = (req,res,next) => {
//	upload.array('image'),async (req,result) => {
//	const uploader = async (path) => await cloudinary.uploads(path, 'Images');

//  if (req.method === 'POST') {
//    const urls = []
//    const files = req.files;
//    for (const file of files) {
//      const { path } = file;
//      const newPath = await uploader(path)
//      urls.push(newPath)
//      fs.unlinkSync(path)
//    }
//	console.log(result.rows);
//  }
//	}

	const text = 'INSERT into Gifs(title,imageURL,email,created_on) VALUES($1,$2,$3,$4) RETURNING *'
	const values = [req.body.title,req.body.imageURL,req.body.email,date]
	client.query(text,values, (err,result) => {
		if (err) {
			console.log(err.stack)
		}else{
			const data = result.rows[0];
			console.log(data);
			res.status(201).json(
	          {
               "status" : "success",
               "data" : {
               "gifId" : data.gifId,
               "message" : "GIF image successfully posted",
               "createdOn" : date,
               "title" : data.title,
               "imageUrl" : data.imageURL
                }
              }
            );
		}
	});
//	const data = rows[0]
};

exports.postArticles = (req,res,next) => {
	const text = 'INSERT into Articles(title,articleBody,email,created_on) VALUES($1,$2,$3,$4) RETURNING *'
	const values = [req.body.title,req.body.articleBody,req.body.email,date]
	client.query(text,values, (err,result) => {
		if (err) {
			console.log(err.stack)
		}else{
			const data = result.rows[0];
			console.log(data);
			res.status(201).json(
	          {
               "status" : "success",
               "data" : {
               "message" : "Article successfully posted",
               "articleId" : data.articleId,
               "createdOn" : date,
               "title" : data.title
                }
              }
            );
		}
	});
};

exports.getOneArticle = (req,res,next) => {
  client.query('SELECT articleID,created_on,title,articleBody FROM Articles WHERE articleID = '+ req.params.articleID, (err, result)=>{
	  if(err){
		  console.log(err);
	  }
//	  res.status(200).send(result.rows);
	  const article = result.rows;
	  client.query('SELECT commentID,articleComment,email FROM articleComments WHERE articleID = '+ req.params.articleID, (err, result)=>{
	  if(err){
		  console.log(err);
	  }
	  const comments = result.rows;
	  console.log(comments);
	  console.log(article);
	  res.status(200).json({
	  "status" : "success",
      "data" : {
              article: article,
              comments : comments
	  }
  });
  })
  })
};

exports.getOneGif = (req,res,next) => {
  client.query('SELECT gifID,created_on,title,imageUrl FROM Gifs WHERE gifID = '+ req.params.gifID, (err, result)=>{
	  if(err){
		  console.log(err);
	  }
//	  res.status(200).send(result.rows);
	  const gif = result.rows;
	  client.query('SELECT commentID,gifComment,email FROM gifComments WHERE gifID = '+ req.params.gifID, (err, result)=>{
	  if(err){
		  console.log(err);
	  }
	  const comments = result.rows;
	  console.log(comments);
	  console.log(gif);
	  res.status(200).json({
	  "status" : "success",
      "data" : {
              gif: gif,
              comments : comments
	          }
  });
  })
  })
};

exports.commentOnArticle = (req,res,next) => {
	const text = 'INSERT into articleComments(articleComment,email,created_on,articleID) VALUES($1,$2,$3,$4) RETURNING *'
	const values = [req.body.articleComment,req.body.email,date,req.params.articleID]
	client.query(text,values, (err,result) => {
		if (err) {
			console.log(err.stack)
		}else{
			const data = result.rows[0];
			console.log(data);
			res.status(201).json(
	         {
              "status" : "success",
              "data" : {
              "message" : "Comment successfully created",
              "createdOn" : date,
              "articleTitle" : data.articleTitle,
              "articleId" : req.params.articleID,
              "comment" : data.articleComment
               }
             }
            );
		}
	});
};

exports.commentOnGif = (req,res,next) => {
	const text = 'INSERT into gifComments(gifComment,email,created_on,gifID) VALUES($1,$2,$3,$4) RETURNING *'
	const values = [req.body.gifComment,req.body.email,date,req.params.gifID]
	client.query(text,values, (err,result) => {
		if (err) {
			console.log(err.stack)
		}else{
			const data = result.rows[0];
			console.log(data);
			res.status(201).json(
	           {
                "status" : "success",
                "data" : {
                "message" : "Comment successfully created",
                "createdOn" : date,
                "gifTitle" : data.gifTitle,
                "comment" : data.gifComment
                }
               }
            );
		}
	});
};

exports.updateArticle = (req,res,next) => {
	const text = "Update Articles set title = $1, articleBody = $2, created_on = $3 where articleID = "+ req.params.articleID + " RETURNING *"
	const values = [req.body.title,req.body.articleBody,date]
	client.query(text,values, (err,result) => {
		if (err) {
			console.log(err.stack)
		}else{
			const data = result.rows[0];
			console.log(data);
			res.status(201).json(
	          {
               "status" : "success",
               "data" : {
               "message" : "Article successfully updated",
               "title" : data.title,
               "articleId" : req.params.articleID
               }
              }
            );
		}
	});
};

exports.deleteArticle = (req,res,next) => {
	const text = "DELETE from Articles where articleID = "+ req.params.articleID + " RETURNING *"
	client.query(text, (err,result) => {
		if (err) {
			console.log(err.stack)
		}else{
			const data = result.rows[0];
			console.log(data);
			res.status(201).json(
	          {
               "status" : "success",
               "data" : {
               "message" : "Article successfully deleted"
                }
              }
            );
		}
	});
};

exports.deleteGif = (req,res,next) => {
	const text = "DELETE from Gifs where gifID = "+ req.params.gifID + " RETURNING *"
	client.query(text, (err,result) => {
		if (err) {
			console.log(err.stack)
		}else{
			const data = result.rows[0];
			console.log(data);
			res.status(201).json(
         	  {
               "status" : "success",
               "data" : {
               "message" : "gif post successfully deleted"
               }
              }
            );
		}
	});
};

exports.getFeed = (req, res, next) => {
  client.query('SELECT articleID as ID,created_on,title,articleBody as contents,email from Articles union select gifID,created_on,title,imageURL,email from Gifs order by created_on desc', (err, result)=>{
	  //done();
	  if(err){
		  console.log(err);
	  }
	  res.status(200).send(result.rows);
	  //res.status(200).json(gifs);
  })
 // res.status(200).json(feed);
};

exports.getArticles = (req,res,next) => {
  client.query('SELECT articleID,created_on,title,articleBody FROM Articles', (err, result)=>{
	  //done();
	  if(err){
		  console.log(err);
	  }
	  res.status(200).send(result.rows);
  })
};

exports.getGifs = (req,res,next) => {
  client.query('SELECT gifID,created_on,title,imageURL FROM Gifs', (err, result)=>{
	  //done();
	  if(err){
		  console.log(err);
	  }
	  res.status(200).send(result.rows);
  })
};
