import { Request, Response } from "express";
import { getDb } from "../database.js";

export async function getOccupiedIdsHandler(req: Request, res: Response) {
  try {
    const db = await getDb(res.locals["merchantId"]);
    const givenStartDateTime = new Date(req.body?.startDateTime);
    const givenEndDateTime = new Date(req.body?.endDateTime);

    const result = await db
      .collection("events")
      .aggregate([
        {
          $match: {
            $expr: {
              $and: [
                { $lt: ["$startDateTime", givenEndDateTime] },
                { $gt: ["$endDateTime", givenStartDateTime] },
              ],
            },
          },
        },
        { $unwind: "$team" },
        {
          $group: {
            _id: null,
            occupiedEmployeeIds: { $addToSet: "$team.employeeId" },
          },
        },
        {
          $project: {
            _id: 0,
            occupiedEmployeeIds: 1,
          },
        },
      ])
      .toArray();
    if (result.length) {
      return res.status(200).json(result[0]);
    }
    return res.status(200).json([]);
  } catch (err: any) {
    console.error("❌ Error in getOccupiedIdsHandler:", {
      error: err,
      message: err?.message,
      stack: err?.stack,
      startDateTime: req.body?.startDateTime,
      endDateTime: req.body?.endDateTime,
      merchantId: res.locals["merchantId"],
    });
    return res.status(500).json({ error: err.message });
  }
}
