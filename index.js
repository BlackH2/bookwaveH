const express = require("express");
const path = require("path");
const hbs = require("hbs");
const app = express();
// const hbs = require("hbs")3
const LogInCollection = require("./mongodb");
const { Console } = require("console");
const port = process.env.PORT || 3000;
app.use(express.json());
const mongoose = require("mongoose");
const multer = require("multer");


app.use(express.urlencoded({ extended: true }));

const viewsPath = path.join(__dirname, "../");
app.set("view engine", "hbs");
app.set("views", viewsPath);  
hbs.registerPartials(viewsPath);

app.get("/signup", (req, res) => {
  res.sendFile(path.join(viewsPath, "index.html"));
});
app.get("/", (req, res) => {
  res.sendFile(path.join(viewsPath, "index.html"));
});



app.post("/login", async (req, res) => {
  
  
  try {
    const check = await LogInCollection.findOne({ name: req.body.name });

    if(req.body.name=="ADMIN" && (check.password === req.body.password) )
    {
        res
          .status(201)
          .render("admin", { naming: `${req.body.password}+${req.body.name}` });

      
    }
  

    else{
    if (check.password === req.body.password) {
      res
        .status(201)
        .render("bookwave", { naming: `${req.body.password}+${req.body.name}` });
    }
     else {
      res.send("incorrect password");
    }
  }

  } catch (e) {
    res.send("wrong details");
  }

});




app.post("/signup", async (req, res) => {
  try {
    const data = {
      name: req.body.name2,
      password: req.body.password2,
    };

    const checking = await LogInCollection.findOne({ name: req.body.name2 });

    if (checking && checking.password === req.body.password2) {
      console.log("User details already exist");
      res.send("User details already exist");
    } else {
      await LogInCollection.create(data);
      console.log("User registered successfully");
    }

    res.status(201).render("bookwave", {
      naming: req.body.name2,
    });
  } catch (error) {
    console.error("Error:", error);
    res.send("An error occurred. Please try again.");
  }
});



app.listen(port, () => {
  console.log("port connected");
});


const pdfSchema = new mongoose.Schema({
  name: String,
  data: Buffer,
});

const PDF = mongoose.model("PDF", pdfSchema);

app.use(express.static(path.join(__dirname, "public")));

const storage = multer.memoryStorage();
const upload = multer({ storage: storage });

app.post("/upload", upload.single("pdfFile"), async (req, res) => {
  try {
      const pdf = new PDF({
          name: req.body.filename,
          data: req.file.buffer,
      });
      await pdf.save();
      res.json({ message: "PDF uploaded successfully.", success: true, filename: pdf.name });
  } catch (error) {
      res.status(500).json({ message: "Error uploading PDF.", success: false });
  }
});

app.get("/download/:filename", async (req, res) => {
  try {
      const pdf = await PDF.findOne({ name: req.params.filename });
      if (!pdf) {
          return res.status(404).json({ message: "PDF not found." });
      }

      const targetFileName = path.parse(req.params.filename).name + ".pdf";

      res.setHeader("Content-Type", "application/pdf");
      res.setHeader("Content-Disposition", `attachment; filename="${targetFileName}"`);
      res.send(pdf.data);
  } catch (error) {
      res.status(500).json({ message: "Error downloading PDF." });
  }
});

// app.listen(port, () => {
//   console.log(`Server started on port ${port}`);
// });
