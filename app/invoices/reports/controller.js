import AbstractReportController from 'hospitalrun/controllers/abstract-report-controller';
import Ember from 'ember';
import NumberFormat from 'hospitalrun/mixins/number-format';
import UserSession from 'hospitalrun/mixins/user-session';
import moment from 'moment';
import DS from 'ember-data';
let App = window.App = Ember.Application.extend();

const { get, computed, isEmpty, RSVP } = Ember;

const REPORT_TIME_DAYS = 1;

export default AbstractReportController.extend(UserSession, NumberFormat, {
  canGenerateReport: computed(function() {
    return this.currentUserCan('generate_incident_report');
  }),

  _generateByDepartmentOrByIncidentCategoryReport(invoices) {
    this._addRowsByType(invoices, reportProperty, 'Total incidents: ', reportColumns);
    this._finishReport(reportColumns);
  },

  _findPaymentsLastDay() {
    console.log('starting findPaymentsByDate...');
    let filterEndDate = new Date();
    let filterStartDate = new Date();
    filterStartDate.setDate(filterStartDate.getDate() - REPORT_TIME_DAYS);

    console.log('start date');
    console.log(filterStartDate);

    let findParams = {
      options: {},
      mapReduce: 'invoices_by_date'
    };
    let maxValue = get(this, 'maxValue');
    console.log('maxvalue');
    console.log(typeof maxValue);
    console.log(maxValue);

    return new RSVP.Promise(function(resolve, reject) {
      if (isEmpty(filterStartDate)) {
        reject();
      }
      findParams.options.startkey = [filterStartDate.getTime(), null];

      if (!isEmpty(filterEndDate)) {
        filterEndDate = moment(filterEndDate).endOf('day').toDate();
        findParams.options.endkey = [filterEndDate.getTime(), maxValue];
      }
      return this.store.query('payment', findParams).then(resolve, reject);
    }.bind(this));
  },

  actions: {
    generateReport() {
      console.log('generating report...');
      let reportRows = get(this, 'reportRows');
      reportRows.clear();
      this.showProgressModal();
      this._findPaymentsLastDay().then((payments) => {
        console.log('logging payments...');
        console.log(typeof payments);
        console.log(payments);
        console.log('done logging payments...');
        this.closeProgressModal();
        // this._generateByDepartmentOrByIncidentCategoryReport(payments);
        // this.set('showReportResults', true);
      }).catch((ex) => {
        console.log('Error:', ex);
        this.closeProgressModal();
      });
    }
  }
});
