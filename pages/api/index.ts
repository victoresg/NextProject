import { NextApiRequest, NextApiResponse } from "next";

export default function haldler(
  request: NextApiRequest,
  reponse: NextApiResponse
) {
  reponse.status(200).json({ message: "olá mundo" });
}
