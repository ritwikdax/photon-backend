import { NextFunction, Request, Response } from "express";
import { db } from "../../database.js";
import { ROOT_COLLECTIONS } from "../../const.js";
import { redisClient } from "../../redis.js";

const MERCHANT_DETAILS_EXPIRY = 55 * 60; //55 Minutes;

export async function injectMerchantDetailsMiddleware(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const email = res.locals["email"];
    const token = res.locals["token"];

    if (!email || !token) {
      res.status(401).json({
        error: true,
        message: "Not a valid user",
      });
    }

    const merchantId = await redisClient.get(token);
    const isActiveMerchant = await redisClient.get(`isActive_${token}`);
    if (merchantId && isActiveMerchant) {
      //Cache Hit
      console.log("Cache Hit");
      res.locals["merchantId"] = merchantId;
      res.locals["isActiveMerchant"] = isActiveMerchant;

      console.log({ merchantId, isActiveMerchant });
      return next();
    } else {
      //Cache Miss
      console.log("Cache Miss!");
      const user = await db
        .collection(ROOT_COLLECTIONS.MERCHANT_USERS)
        .findOne({ email: email });

      if (!user || !user.isActive) {
        return res.status(403).json({
          error: true,
          message: `user with ${email} is not registered or disabled. Please reachout to us!`,
        });
      }

      const merchantDetails = await db
        .collection(ROOT_COLLECTIONS.MERCHANTS)
        .findOne({ id: user.merchantId });

      console.log(merchantDetails);
      //Found valid user id associated with a merchant
      res.locals["merchantId"] = user?.merchantId;
      res.locals["isActiveMerchant"] = !!merchantDetails?.isActive;
      //Set the cache
      await redisClient.set(token, user?.merchantId, {
        EX: MERCHANT_DETAILS_EXPIRY,
      });
      await redisClient.set(
        `isActive_${token}`,
        String(!!merchantDetails?.isActive),
        { EX: MERCHANT_DETAILS_EXPIRY }
      );

      console.log(res.locals["merchantId"]);
      console.log(res.locals["isActiveMerchant"]);
      next();
    }
  } catch (err) {
    return res
      .status(401)
      .json({ error: true, message: "User not logged in or invalid token" });
  }
}
