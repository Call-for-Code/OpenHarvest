import * as express from "express"

declare global {
  namespace Express {
    interface Request {
      user?: any;
      session: any
    }
  }
}