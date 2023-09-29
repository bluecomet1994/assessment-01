import { NextApiRequest, NextApiResponse } from 'next';
import axios from 'axios';

const huggingFaceToken: string = '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';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  const { url } = req.body;

  async function query(imageData: Buffer) {
    const response = await fetch(
      'https://api-inference.huggingface.co/models/Salesforce/blip-image-captioning-large',
      {
        headers: { Authorization: `Bearer ${huggingFaceToken}` },
        method: 'POST',
        body: imageData,
      }
    );
    const result = await response.json();
    return result;
  }

  // Fetch the image file separately
  axios.get(url, { responseType: 'arraybuffer' })
    .then((response) => Buffer.from(response.data)) // Convert response to Buffer
    .then((imageData) => query(imageData)) // Pass the image data to query function
    .then((response) => {
      res.json(response);
    });
}