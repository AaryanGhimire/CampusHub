const express = require("express");
const pool = require("./db");

const app = express();

const PORT = 5000;

app.use(express.json());
// Home route
app.get("/", (req, res) => {
    res.send("CampusHub server is running!");
});

// GET
app.get("/announcements", async (req, res) => {
    try {
        const result = await pool.query("SELECT * FROM announcements");

        res.json(result.rows);
    } catch (error) {
        console.error(error);
        res.status(500).json({
            error: "Database error"
        });
    }
});
// POST
app.post("/announcements", async (req, res) => {
    try {
        const { title, description, date } = req.body;

        const result = await pool.query(
            "INSERT INTO announcements (title, description, date) VALUES ($1, $2, $3) RETURNING *",
            [title, description, date]
        );

        res.status(201).json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
});

// 👇 PASTE PUT HERE
app.put("/announcements/:id", async (req, res) => {
    try {
        const { id } = req.params;
        const { title, description, date } = req.body;

        const result = await pool.query(
            "UPDATE announcements SET title = $1, description = $2, date = $3 WHERE id = $4 RETURNING *",
            [title, description, date, id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Announcement not found"
            });
        }

        res.json(result.rows[0]);
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
});

// 👇 PASTE DELETE HERE
app.delete("/announcements/:id", async (req, res) => {
    try {
        const { id } = req.params;

        const result = await pool.query(
            "DELETE FROM announcements WHERE id = $1 RETURNING *",
            [id]
        );

        if (result.rows.length === 0) {
            return res.status(404).json({
                error: "Announcement not found"
            });
        }

        res.json({
            message: "Announcement deleted successfully!",
            announcement: result.rows[0]
        });
    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
});
// KEEP THIS AT THE BOTTOM
app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});