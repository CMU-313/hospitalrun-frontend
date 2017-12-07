import AbstractIndexRoute from 'hospitalrun/routes/abstract-index-route';
import Ember from 'ember';

export default AbstractIndexRoute.extend({
  pageTitle: 'Daily Payment Reports',

  // No model for reports; data gets retrieved when report is run.
  model() {
    return Ember.RSVP.resolve(Ember.Object.create({}));
  }

});
