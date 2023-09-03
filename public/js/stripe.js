import axios from 'axios';
import { showALert } from './alert';

export const bookTour = async function(tourId, target) {
  try {
    const stripe = Stripe('pk_test_QhZ3nPfp4ihFHGNBfUDJteGN0049TzeF2c');

    // Get cehckout session from API
    const {data: {session}} = await axios({
      method: 'GET',
      url: `/api/v1/bookings/checkout-session/${tourId}` // relative url
    });
   
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
