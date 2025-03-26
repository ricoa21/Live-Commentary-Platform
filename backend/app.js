app.get("/api/fixtures/between", async (req, res) => {
  try {
    const startDate = req.query.startDate;
    const endDate = req.query.endDate;

    if (!startDate || !endDate) {
      return res
        .status(400)
        .json({ error: "Start and end dates are required" });
    }

    const response = await axios.get(
      `${SPORTMONKS_BASE_URL}/fixtures/between/${startDate}/${endDate}`,
      {
        params: {
          api_token: SPORTMONKS_API_KEY,
          include: "participants",
          league_id: 8, // Premier League ID
        },
        headers: {
          Accept: "application/json",
        },
      }
    );

    if (response.status !== 200) {
      return res.status(response.status).json({ error: response.statusText });
    }

    res.json(response.data);
  } catch (error) {
    console.error("Error fetching fixtures:", error);
    if (error.response) {
      res
        .status(error.response.status)
        .json({ error: error.response.statusText });
    } else if (error.code === "ECONNABORTED") {
      res.status(408).json({ error: "Request timed out" });
    } else {
      res.status(500).json({ error: "Internal Server Error" });
    }
  }
});
