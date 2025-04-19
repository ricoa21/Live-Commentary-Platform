// routes/auth.routes.js
router.post("/register", async (req, res) => {
  try {
    const { username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await User.create({ username, password: hashedPassword });
    res.status(201).json({ id: user.id, username: user.username });
  } catch (error) {
    console.error("Registration error:", error);
    const errors = error.errors?.map((e) => ({
      field: e.path,
      message: e.message,
    }));
    res
      .status(400)
      .json({ error: "Validation failed", details: errors || error.message });
  }
});
