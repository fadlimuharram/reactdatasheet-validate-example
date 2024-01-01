export default function handler(req, res) {
    res.status(200).json({
      lists: [
        { value: "PL-7", label: "PL-7" },
        { value: "PL-8", label: "PL-8" },
        { value: "PL-9", label: "PL-9" },
      ],
    });
  }
  