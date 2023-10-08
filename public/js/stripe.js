import axios from 'axios';
import { showALert } from './alert';

export const bookTour = async function (tourId, target) {
  try {
    const stripe = Stripe('pk_test_51NhMyTSEtyLZFqLyNnNGIkel1qQ8t8KlaQuoH5ixZ197UgdlEX86RnjuzFaBENWFgtPCAsVLIa6pC9RXsTdO9jZm00n4y4hLbN');

    // Get cehckout session from API
    const { data: { session } } = await axios({
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
