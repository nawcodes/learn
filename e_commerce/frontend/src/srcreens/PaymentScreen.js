import CheckoutSteps from "../component/CheckoutSteps";
import { getUserInfo, setPayment } from "../localStorage";

const PaymentScreen = {
    after_render: () => {
        document
        .getElementById('payment-form')
        .addEventListener('submit', async (e) => {
            e.preventDefault();
            const paymentMethod = document.querySelector('input[name="payment-method"]:checked').value;
            setPayment({
               paymentMethod
            });
            document.location.hash = '/placeorder';
        });     
    },
    render: () => {
        const {name} = getUserInfo();
        if(!name) {
            document.location.hash = '/';
        }

        return `
        ${CheckoutSteps.render({step1: true, step2: true, step3: true})}
        <div class="form-container">
            <form id="payment-form">
                <ul class="form-items">
                    <li>
                        <h1>Payment</h1>
                    </li>
                    <li>
                        <div>
                            <input type="radio" name="payment-method" id="paypal" value="paypal" checked />
                            <label for="Paypal">Paypal</label>
                        </div>
                    </li>
                    <li>
                        <div>
                            <input type="radio" name="payment-method" id="Stripe" value="Stripe"  />
                            <label for="Stripe">Stripe</label>
                        </div>
                    </li>
                   
                   
                    <li><button class="primary" type="submit">Continue</button></li>
                </ul>
            </form>

        </div>
        `;
    }
};

export default PaymentScreen;
