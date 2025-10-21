import { NextFunction, Request, Response } from "express";
import { db } from "../database.js";


const CRUD = {
    POST: "CREATE",
    PUT: "UPDATE",
    DELETE: "DELETE",
}

export function addAuditLogs(req: Request, res: Response, next: NextFunction) {

  const projectId = req.params?.projectId || req.body?.projectId || null;

  //skip if get call
  if(req.method === "GET"){
    return next();
  }

  if(!projectId){
    return next();
  }

//   db.collection("auditLogs").insertOne({
//     id: req.params.id || "",
//     projectId: projectId,
//     action: CRUD[req.method as keyof typeof CRUD] || "READ",
//     timestamp: new Date().toISOString,
//     item: req.params.collection || "",
//   });

  next();
}

