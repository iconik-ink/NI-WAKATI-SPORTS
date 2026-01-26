export const deleteSubscriber = async (req, res) => {
  try {
    const { id } = req.params;

    const deleted = await Subscriber.findByIdAndDelete(id);

    if (!deleted) {
      return res.status(404).json({ message: "Subscriber not found" });
    }

    res.json({ message: "Subscriber deleted successfully" });
  } catch (err) {
    res.status(500).json({ message: "Failed to delete subscriber" });
  }
};
