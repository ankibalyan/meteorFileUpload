import { Meteor } from 'meteor/meteor';
import { check } from 'meteor/check';
import Attachments from './attachments';

if (Meteor.isServer) {
  Meteor.methods({
    removeFile: function (fid) {
      let st = process.hrtime();
      let del;
      check(fid, String);

      if (!this.userId) {
        throw new Meteor.Error('error-not-authorized', 'User need to login', {method: 'removeFile'});
      }

      if (fid) {
        del = Attachments.remove({_id: fid});
      }

      let et = process.hrtime(st);
      console.log('call to removeFile:' + et[0] + 's and ' + et[1] / 1000000 + ' ms,');
      return del >= 1;
    }
  });
}
