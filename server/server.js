const express = require("express");
const cors = require("cors");
const pool = require("./db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");

const authenticateToken = require("./middleware/authMiddleware");
const requireAdmin = require("./middleware/adminMiddleware");

const app = express();
const PORT = 5000;

app.use(cors());
app.use(express.json());


// ========================================
// HOME
// ========================================

app.get("/", (req, res) => {
    res.send("CampusHub server is running!");
});


// ========================================
// REGISTER
// ========================================

app.post("/register", async (req, res) => {
    try {
        const { name, email, password } = req.body;

        // Check required fields
        if (!name || !email || !password) {
            return res.status(400).json({
                error: "Name, email and password are required"
            });
        }

        // Check if email already exists
        const existingUser = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (existingUser.rows.length > 0) {
            return res.status(409).json({
                error: "Email already registered"
            });
        }

        // Hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Save user
        const result = await pool.query(
            `INSERT INTO users (name, email, password)
             VALUES ($1, $2, $3)
             RETURNING id, name, email, role, created_at`,
            [name, email, hashedPassword]
        );

        res.status(201).json({
            message: "User registered successfully",
            user: result.rows[0]
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Server error"
        });
    }
});


// ========================================
// LOGIN
// ========================================

app.post("/login", async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check required fields
        if (!email || !password) {
            return res.status(400).json({
                error: "Email and password are required"
            });
        }

        // Find user by email
        const result = await pool.query(
            "SELECT * FROM users WHERE email = $1",
            [email]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        const user = result.rows[0];

        // Compare password
        const passwordMatch = await bcrypt.compare(
            password,
            user.password
        );

        if (!passwordMatch) {
            return res.status(401).json({
                error: "Invalid email or password"
            });
        }

        // Create JWT
        const token = jwt.sign(
            {
                id: user.id,
                email: user.email,
                role: user.role
            },
            process.env.JWT_SECRET,
            {
                expiresIn: "1h"
            }
        );

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                role: user.role
            }
        });

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Server error"
        });
    }
});


// ========================================
// ANNOUNCEMENTS - GET
// Everyone can view announcements
// ========================================

app.get("/announcements", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM announcements"
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
});


// ========================================
// ANNOUNCEMENTS - CREATE
// Admin only
// ========================================

app.post(
    "/announcements",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { title, description, date } = req.body;

            const result = await pool.query(
                `INSERT INTO announcements
                (title, description, date)
                VALUES ($1, $2, $3)
                RETURNING *`,
                [title, description, date]
            );

            res.status(201).json(result.rows[0]);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Database error"
            });
        }
    }
);


// ========================================
// ANNOUNCEMENTS - UPDATE
// Admin only
// ========================================

app.put(
    "/announcements/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, date } = req.body;

            const result = await pool.query(
                `UPDATE announcements
                 SET title = $1,
                     description = $2,
                     date = $3
                 WHERE id = $4
                 RETURNING *`,
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
    }
);


// ========================================
// ANNOUNCEMENTS - DELETE
// Admin only
// ========================================

app.delete(
    "/announcements/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
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
    }
);


// ========================================
// EVENTS - GET
// Everyone can view events
// ========================================

app.get("/events", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM events ORDER BY date ASC"
        );

        res.json(result.rows);

    } catch (error) {
        console.error(error);

        res.status(500).json({
            error: "Database error"
        });
    }
});


// ========================================
// EVENTS - CREATE
// Admin only
// ========================================

app.post(
    "/events",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { title, description, date, location } = req.body;

            if (!title || !description || !date || !location) {
                return res.status(400).json({
                    error: "All fields are required"
                });
            }

            const result = await pool.query(
                `INSERT INTO events
                (title, description, date, location)
                VALUES ($1, $2, $3, $4)
                RETURNING *`,
                [title, description, date, location]
            );

            res.status(201).json(result.rows[0]);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Database error"
            });
        }
    }
);


// ========================================
// EVENTS - UPDATE
// Admin only
// ========================================

app.put(
    "/events/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;
            const { title, description, date, location } = req.body;

            if (!title || !description || !date || !location) {
                return res.status(400).json({
                    error: "All fields are required"
                });
            }

            const result = await pool.query(
                `UPDATE events
                 SET title = $1,
                     description = $2,
                     date = $3,
                     location = $4
                 WHERE id = $5
                 RETURNING *`,
                [title, description, date, location, id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: "Event not found"
                });
            }

            res.json(result.rows[0]);

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Database error"
            });
        }
    }
);


// ========================================
// EVENTS - DELETE
// Admin only
// ========================================

app.delete(
    "/events/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params;

            const result = await pool.query(
                "DELETE FROM events WHERE id = $1 RETURNING *",
                [id]
            );

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: "Event not found"
                });
            }

            res.json({
                message: "Event deleted successfully!",
                event: result.rows[0]
            });

        } catch (error) {
            console.error(error);

            res.status(500).json({
                error: "Database error"
            });
        }
    }
);


// ========================================
// PROFILE
// Logged-in users only
// ========================================

app.get(
    "/profile",
    authenticateToken,
    (req, res) => {
        res.json({
            message: "You are authenticated!",
            user: req.user
        });
    }
);


// ========================================
// ADMIN TEST
// Admin only
// ========================================

app.get(
    "/admin-test",
    authenticateToken,
    requireAdmin,
    (req, res) => {
        res.json({
            message: "Welcome, admin!",
            user: req.user
        });
    }
);

// ==============================
// RESOURCES
// ==============================

// GET all resources
app.get("/resources", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM resources ORDER BY id DESC"
        )

        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: "Failed to fetch resources"
        })
    }
})

// CREATE resource - ADMIN ONLY
app.post(
    "/resources",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { title, description, category, link } = req.body

            const result = await pool.query(
                `INSERT INTO resources
                (title, description, category, link)
                VALUES ($1, $2, $3, $4)
                RETURNING *`,
                [title, description, category, link]
            )

            res.status(201).json(result.rows[0])
        } catch (error) {
            console.error(error)
            res.status(500).json({
                error: "Failed to create resource"
            })
        }
    }
)

// UPDATE resource - ADMIN ONLY
app.put(
    "/resources/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params
            const { title, description, category, link } = req.body

            const result = await pool.query(
                `UPDATE resources
                SET title = $1,
                    description = $2,
                    category = $3,
                    link = $4
                WHERE id = $5
                RETURNING *`,
                [title, description, category, link, id]
            )

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: "Resource not found"
                })
            }

            res.json(result.rows[0])
        } catch (error) {
            console.error(error)
            res.status(500).json({
                error: "Failed to update resource"
            })
        }
    }
)

// DELETE resource - ADMIN ONLY
app.delete(
    "/resources/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params

            const result = await pool.query(
                "DELETE FROM resources WHERE id = $1 RETURNING *",
                [id]
            )

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: "Resource not found"
                })
            }

            res.json({
                message: "Resource deleted successfully"
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                error: "Failed to delete resource"
            })
        }
    }
)


// ==============================
// CLUBS
// ==============================

// GET all clubs
app.get("/clubs", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM clubs ORDER BY id DESC"
        )

        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: "Failed to fetch clubs"
        })
    }
})

// CREATE club - ADMIN ONLY
app.post(
    "/clubs",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { name, description, members } = req.body

            const result = await pool.query(
                `INSERT INTO clubs
                (name, description, members)
                VALUES ($1, $2, $3)
                RETURNING *`,
                [name, description, members]
            )

            res.status(201).json(result.rows[0])
        } catch (error) {
            console.error(error)
            res.status(500).json({
                error: "Failed to create club"
            })
        }
    }
)

// UPDATE club - ADMIN ONLY
app.put(
    "/clubs/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params
            const { name, description, members } = req.body

            const result = await pool.query(
                `UPDATE clubs
                SET name = $1,
                    description = $2,
                    members = $3
                WHERE id = $4
                RETURNING *`,
                [name, description, members, id]
            )

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: "Club not found"
                })
            }

            res.json(result.rows[0])
        } catch (error) {
            console.error(error)
            res.status(500).json({
                error: "Failed to update club"
            })
        }
    }
)

// DELETE club - ADMIN ONLY
app.delete(
    "/clubs/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params

            const result = await pool.query(
                "DELETE FROM clubs WHERE id = $1 RETURNING *",
                [id]
            )

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: "Club not found"
                })
            }

            res.json({
                message: "Club deleted successfully"
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                error: "Failed to delete club"
            })
        }
    }
)


// ==============================
// LOST & FOUND
// ==============================

// GET all lost & found items
app.get("/lost-found", async (req, res) => {
    try {
        const result = await pool.query(
            "SELECT * FROM lost_found ORDER BY id DESC"
        )

        res.json(result.rows)
    } catch (error) {
        console.error(error)
        res.status(500).json({
            error: "Failed to fetch lost & found items"
        })
    }
})

// CREATE lost & found item - ADMIN ONLY
app.post(
    "/lost-found",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const {
                item,
                type,
                description,
                location,
                date,
                contact
            } = req.body

            const result = await pool.query(
                `INSERT INTO lost_found
                (item, type, description, location, date, contact)
                VALUES ($1, $2, $3, $4, $5, $6)
                RETURNING *`,
                [
                    item,
                    type,
                    description,
                    location,
                    date,
                    contact
                ]
            )

            res.status(201).json(result.rows[0])
        } catch (error) {
            console.error(error)
            res.status(500).json({
                error: "Failed to create lost & found item"
            })
        }
    }
)

// UPDATE lost & found item - ADMIN ONLY
app.put(
    "/lost-found/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params

            const {
                item,
                type,
                description,
                location,
                date,
                contact
            } = req.body

            const result = await pool.query(
                `UPDATE lost_found
                SET item = $1,
                    type = $2,
                    description = $3,
                    location = $4,
                    date = $5,
                    contact = $6
                WHERE id = $7
                RETURNING *`,
                [
                    item,
                    type,
                    description,
                    location,
                    date,
                    contact,
                    id
                ]
            )

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: "Lost & found item not found"
                })
            }

            res.json(result.rows[0])
        } catch (error) {
            console.error(error)
            res.status(500).json({
                error: "Failed to update lost & found item"
            })
        }
    }
)

// DELETE lost & found item - ADMIN ONLY
app.delete(
    "/lost-found/:id",
    authenticateToken,
    requireAdmin,
    async (req, res) => {
        try {
            const { id } = req.params

            const result = await pool.query(
                "DELETE FROM lost_found WHERE id = $1 RETURNING *",
                [id]
            )

            if (result.rows.length === 0) {
                return res.status(404).json({
                    error: "Lost & found item not found"
                })
            }

            res.json({
                message: "Lost & found item deleted successfully"
            })
        } catch (error) {
            console.error(error)
            res.status(500).json({
                error: "Failed to delete lost & found item"
            })
        }
    }
)
// ========================================
// START SERVER
// ========================================

app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});