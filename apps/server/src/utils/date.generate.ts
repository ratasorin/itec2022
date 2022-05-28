import moment from 'moment';

const from = moment().toDate();
const to = moment().add(2, 'hours').toDate();

console.log({ from, to });
