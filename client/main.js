import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';

import './main.html';

Template.upload.events({
  'click button'(event, instance) {
    alert('submit');
  },
});
