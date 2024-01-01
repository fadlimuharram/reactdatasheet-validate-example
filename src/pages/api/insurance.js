export default function handler(req, res) {
    res.status(200).json({
      lists: [
        { value: "IP-1", label: "Insurance Provider 1" },
        { value: "IP-2", label: "Insurance Provider 2" },
        { value: "IP-3", label: "Insurance Provider 3" },
      ],
    });
  }
  