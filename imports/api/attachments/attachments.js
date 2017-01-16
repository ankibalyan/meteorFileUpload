/**
 * [Attachments collection to save all file shared in between rooms]
 * @import as {Attachments}
 * @type {Meteor}
 * @author Ankit Balyan <ankit@ipapagari.com>
 */
const Attachments = new FilesCollection({
  collectionName: 'uploads',
  allowClientCode: false,
  downloadRoute: 'cdn/storage/uploads',
  storagePath: 'uploads',
  public: true
});

Attachments.on('onBeforeUpload', function (file) {
  console.log(file);
  // Allow upload files under 10MB
  if (file.size <= 10485760) {
    return true;
  } else {
    return 'Please upload image, with size equal or less than 10MB';
  }
});

Attachments.on('afterUpload', function (fileRef) {
  console.log('on After upload \n', fileRef);
  // login for thumbnail generation goes down

});

export default Attachments;
