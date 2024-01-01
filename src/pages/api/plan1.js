export default function handler(req, res) {
    res.status(200).json({
      lists: [
        { value: "PL-1", label: "PL-1" },
        { value: "PL-2", label: "PL-2" },
        { value: "PL-3", label: "PL-3" },
      ],
    });
  }
  