import { Request, Response } from "express";
import axios, { AxiosResponse } from 'axios';

import { Album, OneApi, Photo, User } from "./interface";

export default class PhotoController {
  static async getById(req: Request, res: Response) {
    const requestId: string = req.params.id;

    try {
      const photoResponse: AxiosResponse = await axios.get(`${process.env.PHOTO_API}/${requestId}`);
      const { albumId, ...photo } = photoResponse.data;

      const albumResponse: AxiosResponse = await axios.get(`${process.env.ALBUM_API}/${albumId}`);
      const { userId, ...album } = albumResponse.data;

      const userResponse: AxiosResponse = await axios.get(`${process.env.USER_API}/${userId}`);
      const userData = userResponse.data;

      res.status(200).json({
        ...photo,
        album: {
          ...album,
          user: userData
        }
      });
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    };
  };

  static async filter(req: Request, res: Response) {
    const title: string = req.query['title'] as string;
    const albumTitle: string = req.query['album.title'] as string;
    const userEmail: string = req.query['album.user.email'] as string;

    const limit: number = parseInt(req.query['limit'] as string, 10);
    const offset: number = parseInt(req.query['offset'] as string, 10);
    const defaultOffset: number = 0;
    const defaultLimit: number = 25;

    let oneApiData: OneApi[] = [];

    try {
      const photoResponse = await axios.get(`${process.env.PHOTO_API}`);
      const albumResponse = await axios.get(`${process.env.ALBUM_API}`);
      const userResponse = await axios.get(`${process.env.USER_API}`);

      photoResponse.data.map(async (item: Photo) => {
        const { albumId, ...photo } = item;
        const { userId, ...album } = albumResponse.data.find((album: Album) => album.id === albumId);
        const user = userResponse.data.find((user: User) => user.id === userId);

        oneApiData.push({
          ...photo,
          album: {
            ...album,
            user
          }
        });
      });

      if (title) {
        oneApiData = oneApiData.filter((data: OneApi) => data.title.includes(title));
      }

      if (albumTitle) {
        oneApiData = oneApiData.filter((data: OneApi) => data.album.title.includes(albumTitle));
      }

      if (userEmail) {
        oneApiData = oneApiData.filter((data: OneApi) => data.album.user.email === userEmail);
      }

      if (offset) {
        oneApiData = oneApiData.slice(offset, limit ? offset + limit : offset + defaultLimit);
      } else {
        oneApiData = oneApiData.slice(defaultOffset, limit ? limit : defaultLimit);
      }

      res.status(200).json(oneApiData);
    } catch (error: any) {
      res.status(500).json({ message: error.message });
    };
  };
};