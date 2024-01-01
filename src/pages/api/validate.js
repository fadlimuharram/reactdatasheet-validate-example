const IP1Plan = ["PL-1", "PL-4", "PL-7"];
const IP2Plan = ["PL-2", "PL-5", "PL-8"];
const IP3Plan = ["PL-3", "PL-6", "PL-9"];
const IPMapping = {
  "IP-1": IP1Plan,
  "IP-2": IP2Plan,
  "IP-3": IP3Plan,
};

export default function handler(req, res) {
  const body = req.body.body;
  const err = [];

  if (body.length > 0) {
    body.forEach((row) => {
      if ((row.plan1 || row.plan2 || row.plan3) && !row.insuranceProvider) {
        err.push({
          rowId: row.rowId,
          column: "insuranceProvider",
          message: "Insurance Provider Required",
        });
      }

      if (row.insuranceProvider) {
        const currentPlan = IPMapping[row.insuranceProvider];

        if (row.plan1 && !currentPlan.includes(row.plan1))
          err.push({
            rowId: row.rowId,
            column: "plan1",
            message: `Wrong Plan for insurance ${row.insuranceProvider}`,
          });

        if (row.plan2 && !currentPlan.includes(row.plan2))
          err.push({
            rowId: row.rowId,
            column: "plan2",
            message: `Wrong Plan for insurance ${row.insuranceProvider}`,
          });

        if (row.plan3 && !currentPlan.includes(row.plan3))
          err.push({
            rowId: row.rowId,
            column: "plan3",
            message: `Wrong Plan for insurance ${row.insuranceProvider}`,
          });
      }
    });

    res.status(200).json({
      errors: err,
    });
  } else {
    res.status(200).json({
      errors: [],
    });
  }
}
