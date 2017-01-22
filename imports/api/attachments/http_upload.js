import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import * as fs from 'fs';
import multer from 'multer';

import Attachments from './attachments';

if (Meteor.isServer) {
  const _multerInstanceConfig = { dest: '/tmp' }; //  Temp dir for multer
  const _multerInstance = multer(_multerInstanceConfig);
  WebApp.connectHandlers.use(_multerInstance.fields([{ name: 'attachment', maxCount: 1 }])).use('/api/v1/attachments/upload', Meteor.bindEnvironment(function (req, res, next) {
    res.setHeader('Content-Type', 'application/json');
    console.log(req.files);

    var attachment;
    // validations
    if (req.files && req.files.attachment && req.files.attachment[0]) {
      attachment = req.files.attachment[0];

      // filesize verification
      // if (attachment.size > 1024 * 1024 * 10) {
      //   res.writeHead(422);
      //   res.end(JSON.stringify({error: 'error-filesize-limit', reason: 'file size exceeds limit', details: {method: 'attachments/upload'}}));
      //   return;
      // }

    } else {
      res.writeHead(422);
      res.end(JSON.stringify({error: 'error-no-file', reason: 'no file attached', details: {method: 'attachments/upload'}}));
      return res;
    }

    if (attachment !== undefined) {
      fs.stat(attachment.path, function (_statError, _statData) {
        const _addFileMeta = {
          fileName: attachment.originalname,
          type: attachment.mimetype,
          size: attachment.size,
          meta: {}
        };

        fs.readFile(attachment.path, function (_readError, _readData) {
          if (_readError) {
            console.log(_readError);
            res.end();
          } else {
            Attachments.write(_readData, _addFileMeta, function (_uploadError, _uploadData) {
              if (_uploadError) {
                console.log(_uploadError);
                res.end();
              } else {
                fs.unlink(attachment.path); // remove temp upload
                res.writeHead(200);
                res.end(JSON.stringify({success: true}));
              }
            },true);
          }
        });
      });
    }
  }));
}
