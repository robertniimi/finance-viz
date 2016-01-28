import moment from 'moment';

let dateRanges = [
  {
    label: 'Last 7 days',
    value: 'L7D',
    start: moment().subtract(7, 'days').startOf('day'),
    end: moment().endOf('day'),
  }, {
    label: 'Last 14 days',
    value: 'L14D',
    start: moment().subtract(14, 'days').startOf('day'),
    end: moment().endOf('day'),
  }, {
    label: 'This month',
    value: 'TM',
    start: moment().startOf('month'),
    end: moment().endOf('day'),
  }, {
    label: 'Last month',
    value: 'LM',
    start: moment().subtract(1, 'month').startOf('month'),
    end: moment().subtract(1, 'month').endOf('month'),
  }, {
    label: 'Last 3 months',
    value: 'L3M',
    start: moment().subtract(2, 'months').startOf('month'),
    end: moment().endOf('day'),
  }, {
    label: 'Last 6 months',
    value: 'L6M',
    start: moment().subtract(5, 'months').startOf('month'),
    end: moment().endOf('day'),
  }, {
    label: 'Last 12 months',
    value: 'L12M',
    start: moment().subtract(11, 'months').startOf('month'),
    end: moment().endOf('day'),
  }, {
    label: 'This year',
    value: 'TY',
    start: moment().startOf('year'),
    end: moment().endOf('day'),
  }, {
    label: 'Last year',
    value: 'LY',
    start: moment().subtract(1, 'year').startOf('year'),
    end: moment().subtract(1, 'year').endOf('year'),
  }, {
    label: 'All time',
    value: 'AT',
    start: moment().year(2000).startOf('year'),
    end: moment().endOf('day'),
  }
];

module.exports = _.forEach(dateRanges, (range) => {
  range.start = range.start.toISOString();
  range.end = range.end.toISOString();,
});
