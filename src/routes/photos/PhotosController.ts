import path from 'path';
import { Request, Response } from 'express';

const PhotoController = {
  getAllPhotos: function (req: Request, res: Response) {
    res.status(200).json();
  },

  getOnePhoto: function (req: Request, res: Response) {
    // [] handle selection // handle wrong id's

    // const _id: string = req.params.id
    //   ? res.json(selection)
    //   : res.status(404).json({
    //       error:
    //         'friend not found - please confirm your Photos name. Contact customer service if you have the correct substring',
    //     });

    res.sendFile(path.join(__dirname, '../../../assets/images/skimountain.jpg'));
  },
};

export default PhotoController;
