import moment from 'moment';

const days = [ 'Today', 'Tomorrow', moment().add(2, 'days').format('ddd, MMM D') ];
const times = [ '9:00 AM', '11:10 AM', '12:00 PM', '1:50 PM', '4:30 PM', '6:00 PM', '7:10 PM', '9:45 PM' ];

export const tickets = [
    {
        To: 'Cardiff Queen Street',
        From: 'Caerphilly',
        qr: 'https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjyvqGipbfgAhWLnxQKHXU1CBoQjRx6BAgBEAU&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FQR_code&psig=AOvVaw2Ma5ZeoeSGPl4NuOeIPRPz&ust=1550098558820640',
        days,
        times,
      },{
        To: 'Cardiff Central',
        From: 'The valleys',
        qr: 'https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjyvqGipbfgAhWLnxQKHXU1CBoQjRx6BAgBEAU&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FQR_code&psig=AOvVaw2Ma5ZeoeSGPl4NuOeIPRPz&ust=1550098558820640',
        days,
        times,
      },{
        To: 'Cathays',
        From: 'Monmouthshire',
        qr: 'https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjyvqGipbfgAhWLnxQKHXU1CBoQjRx6BAgBEAU&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FQR_code&psig=AOvVaw2Ma5ZeoeSGPl4NuOeIPRPz&ust=1550098558820640',
        days,
        times,
      },{
        To: 'Roath',
        From: 'Llanrhumney',
        qr: 'https://www.google.com/url?sa=i&rct=j&q=&esrc=s&source=images&cd=&cad=rja&uact=8&ved=2ahUKEwjyvqGipbfgAhWLnxQKHXU1CBoQjRx6BAgBEAU&url=https%3A%2F%2Fen.wikipedia.org%2Fwiki%2FQR_code&psig=AOvVaw2Ma5ZeoeSGPl4NuOeIPRPz&ust=1550098558820640',
        days,
        times,
      },
];