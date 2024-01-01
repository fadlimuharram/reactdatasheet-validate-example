export default function handler(req, res) {
    res.status(200).json({
      lists: [
        { value: "PL-4", label: "PL-4" },
        { value: "PL-5", label: "PL-5" },
        { value: "PL-6", label: "PL-6" },
      ],
    });
  }
  