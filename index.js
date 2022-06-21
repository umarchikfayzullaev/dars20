const express = require("express")
const fileUpload = require("express-fileupload")
const ejs = require("ejs")
const uuid = require("uuid")

const path = require("path")
const fs = require("fs")

const uploadsDir = path.join(__dirname, "static", "files")

const app = express()

app.use(express.json())
app.use(fileUpload({useTempFiles: true,}));
app.use(express.urlencoded({ extended: true }));
app.use(express.static("static"))

app.set("view engine", "ejs")


const PORT = process.env.PORT || 4001


// home page 
app.get("/", (req, res) => {
  res.render("index", {name: "Abbos"})
})

// get all users

app.get("/user", (req, res) => {

  const content = fs.readFileSync(path.join(__dirname, "data.txt"))

  const users = JSON.parse(content)

  res.render("users", {users})
})

// create new user
app.post("/user", (req, res) => {
  const {name} = req.body

  const image = req.files.photo

  const nameImg = uuid.v4() + "." + image.mimetype.split("/")[1]

  const addresImg = "./files/" + nameImg

  image.mv(path.join(uploadsDir, nameImg), err=>{
    console.log(err);
  })

  const content = fs.readFileSync(path.join(__dirname, "data.txt"))

  const users = JSON.parse(content)

  const newUser = {
    id: uuid.v4(),
    name,
    image: addresImg,
  }

  users.push(newUser)

  fs.writeFileSync(path.join(__dirname, "data.txt"), JSON.stringify(users))

  res.render("users", {users})
})

// app.put()

// delete
app.get("/user/:id", (req, res) => {
  const {id} = req.params

  const content = fs.readFileSync(path.join(__dirname, "data.txt"))

  const users = JSON.parse(content)

  const user = users.find(user => user.id === id)

  const index = users.indexOf(user)
  
  users.splice(index, 1)

  fs.writeFileSync(path.join(__dirname, "data.txt"), JSON.stringify(users))

  fs.unlinkSync(path.join(__dirname, "static", user.image))

  res.render("users", {users})
  
})


app.listen(PORT, ()=> {
  console.log(`Server running on port: ${PORT}`);
})
