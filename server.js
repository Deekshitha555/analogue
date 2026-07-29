require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const methodOverride = require("method-override");
const path = require("path");

const Student = require("./models/Student");

const app = express();

// ----------------------------
// VIEW ENGINE
// ----------------------------

app.set("view engine", "ejs");

app.set("views", path.join(__dirname, "views"));

// ----------------------------
// BUILT-IN MIDDLEWARE
// ----------------------------

// Reads normal HTML form data
app.use(express.urlencoded({ extended: true }));

// Reads JSON data
app.use(express.json());

// Allows ?_method=PATCH and ?_method=DELETE
app.use(methodOverride("_method"));

// Serves CSS, browser JS, images, etc.
app.use(express.static(path.join(__dirname, "public")));

// ----------------------------
// HOME ROUTE
// ----------------------------

app.get("/", (req, res) => {
    res.redirect("/students");
});

// ----------------------------
// READ ALL STUDENTS
// GET /students
// ----------------------------

app.get("/students", async (req, res) => {
    try {
        const students = await Student.find().sort({ createdAt: -1 });

        res.render("students/index", {
            students
        });
    } catch (error) {
        console.error(error);

        res.status(500).send("Failed to fetch students");
    }
});

// ----------------------------
// SHOW CREATE FORM
// GET /students/new
// ----------------------------

app.get("/students/new", (req, res) => {
    res.render("students/new");
});

// ----------------------------
// CREATE STUDENT
// POST /students
// ----------------------------

app.post("/students", async (req, res) => {
    try {
        const { name, email, age, course } = req.body;

        await Student.create({
            name,
            email,
            age,
            course
        });

        res.redirect("/students");
    } catch (error) {
        console.error(error);

        res.status(400).send(error.message);
    }
});

// ----------------------------
// READ ONE STUDENT
// GET /students/:id
// ----------------------------

app.get("/students/:id", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).send("Student not found");
        }

        res.render("students/show", {
            student
        });
    } catch (error) {
        console.error(error);

        res.status(400).send("Invalid student ID");
    }
});

// ----------------------------
// SHOW EDIT FORM
// GET /students/:id/edit
// ----------------------------

app.get("/students/:id/edit", async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);

        if (!student) {
            return res.status(404).send("Student not found");
        }

        res.render("students/edit", {
            student
        });
    } catch (error) {
        console.error(error);

        res.status(400).send("Invalid student ID");
    }
});

// ----------------------------
// UPDATE STUDENT
// PATCH /students/:id
// ----------------------------

app.patch("/students/:id", async (req, res) => {
    try {
        const { name, email, age, course } = req.body;

        const student = await Student.findByIdAndUpdate(
            req.params.id,
            {
                name,
                email,
                age,
                course
            },
            {
                new: true,
                runValidators: true
            }
        );

        if (!student) {
            return res.status(404).send("Student not found");
        }

        res.redirect(`/students/${student._id}`);
    } catch (error) {
        console.error(error);

        res.status(400).send(error.message);
    }
});

// ----------------------------
// DELETE STUDENT
// DELETE /students/:id
// ----------------------------

app.delete("/students/:id", async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);

        if (!student) {
            return res.status(404).send("Student not found");
        }

        res.redirect("/students");
    } catch (error) {
        console.error(error);

        res.status(400).send("Unable to delete student");
    }
});

// ----------------------------
// 404 HANDLER
// ----------------------------

app.use((req, res) => {
    res.status(404).send("Route not found");
});

// ----------------------------
// DATABASE AND SERVER
// ----------------------------

const startServer = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI);

        console.log("MongoDB connected");

        const port = process.env.PORT || 3000;

        app.listen(port, () => {
            console.log(`Server running at http://localhost:${port}`);
        });
    } catch (error) {
        console.error("Database connection failed:", error.message);
        process.exit(1);
    }
};

startServer();