import axios from 'axios';
import { showALert } from './alert';

export const bookTour = async function(tourId, target) {
  try {
    const stripe = Stripe('pk_test_QhZ3nPfp4ihFHGNBfUDJteGN0049TzeF2c');

    // Get cehckout session from API
    const {data: {session}} = await axios({
      method: 'GET',
      url: `http://localhost:7000/api/v1/bookings/checkout-session/${tourId}`
    });
    console.log('In stripe.js bookTour: ', session);
    console.log('In stripe.js stripe: ', stripe);
    target.textContent = 'Done';

    // Create checkout form + charge credit card
    await stripe.redirectToCheckout({
        sessionId: session.id
    });
  } catch (err) {
    console.log('error', err);
    showALert('error', err);
  }
};
