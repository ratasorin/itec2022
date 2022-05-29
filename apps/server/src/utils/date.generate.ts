import { add } from 'date-fns';

const from = new Date();
const to = add(new Date(), { hours: 2 });

console.log({ from, to });
