router.post('/submit-score', async (req, res) => {
  try {
    const { userId, score } = req.body;

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Count user's past attempts
    const attempts = await Score.countDocuments({ userId });
    const newScore = new Score({
      userId,
      score,
      attempt: attempts + 1
    });

    await newScore.save();
    res.json({ success: true, score: newScore });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, message: 'Score submission failed' });
  }
});
