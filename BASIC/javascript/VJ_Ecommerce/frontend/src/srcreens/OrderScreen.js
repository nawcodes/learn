import { getOrder, getPaypalClientId, payOrder } from "../api";
import {hideLoading, parseRequestUrl, rerender, showLoading, showMessage} from "../utils";


const addPaypalSdk = async (totalPrice) => {
    const clientId = await getPaypalClientId();
    showLoading();
    if(!window.paypal) {
        const script = document.createElement('script');
        script.type = 'text/javascript';
        script.src = 'https://www.paypalobjects.com/api/checkout.js';
        script.async = true;
        script.onload = () => handlePayment(clientId, totalPrice);
        document.body.appendChild(script);
    } else {
        handlePayment(clientId, totalPrice);
    }
};

const handlePayment =  (clientId, totalPrice) => {
    window.paypal.Button.render({
        env: 'sandbox',
        client: {
            sandbox: clientId,
            production: '',
        },
        locale: 'en_US',
        style: {
            size: 'responsive',
            color: 'gold',
            shape: 'pill',
        },
        commit: true,
        payment(data, actions) {
            return actions.payment.create({
                transactions: [ 
                    {
                        amount: {
                            total: totalPrice,
                            currency: 'USD',
                        }
                    }
                ],
            })
        },
        onAuthorize(data, actions) {
            return actions.payment.execute().then( async () => {
                showLoading();
                // call pay order
                await payOrder(parseRequestUrl().id, {
                    orderID: data.orderID,
                    payerID: data.payerID,
                    paymentID: data.paymentID,
                })
                hideLoading();
                showMessage('Payment was successfully', () => {
                    rerender(OrderScreen);
                })
            });
        }
    }, '#paypal-button').then(() => {
        hideLoading();
    })
}

const placeOrderScreen = {

    after_render:  async () => {
    
    },
    render: async () => {
        const request = parseRequestUrl();
        const {
            _id,
            shipping,
            payment,
            orderItems,
            itemsPrice,
            shippingPrice,
            taxPrice,
            totalPrice,
            deliveredAt,
            isDelivered,
            isPaid,
            paidAt
        } = await getOrder(request.id);
        if(!isPaid) {
            addPaypalSdk(totalPrice);
        }
        return `
            <div>
            <h1> Order ${_id}</h1>
                <div class="order">
                    <div class="order-info">
                        <div>
                            <h2>Shipping</h2>
                            <div>
                                ${shipping.address}, ${shipping.city}, ${shipping.postalCode},
                                ${shipping.country}
                            </div>
                            ${isDelivered ? `<div class="success">Delivered ${deliveredAt}</div>`
                                          : `<div class="success">Not Delivered</div>`}
                        </div>
                        <div>
                            <h2>Payment</h2>
                            <div>
                                Payment Method: ${payment.paymentMethod}
                            </div>
                             ${isPaid ? `<div class="success">Paid At ${paidAt}</div>`
                                          : `<div class="success">Not Paided</div>`}
                        </div>
                        <div>
                            <ul class="cart-list-container">
                                <h2>Shopping Cart</h2>
                                <div>Price</div>
                            ${
                                orderItems.map(item => `
                                    <li>
                                        <div class="cart-image">
                                            <img src="${item.image}"  alt="${item.name}"/>
                                        </div>
                                        <div class="cart-item">
                                            <div>
                                                <a href="/#/product/${item.product}">${item.name}</a>
                                            </div>
                                            <div>
                                                Qty: ${item.qty}
                                            </div>
                                        </div>
                                        <div class="cart-price">
                                            $${item.price}
                                        </div>
                                    </li>
                                `)
                            }
                            </ul>
                        </div>
                    </div>
                    <div class="order-action">
                        <ul>
                            <li>
                                <h2>Order Summary</h2>
                            </li>
                            <li>
                                <div>
                                    Items
                                </div>
                                <div>
                                    $${itemsPrice}
                                </div>
                            </li>
                            <li>
                                <div>
                                    Shipping
                                </div>
                                <div>
                                    $${shippingPrice}
                                </div>
                            </li>
                            <li>
                                <div>
                                    Tax
                                </div>
                                <div>
                                    $${taxPrice}
                                </div>
                            </li>
                            <li class="total">
                                <div>
                                    Order Total
                                </div>
                                <div>
                                    $${totalPrice}
                                </div>
                            </li>
                            <li class="total">
                                <div class="fw" id="paypal-button">
                                    
                                </div>
                            </li>
                            
                        </ul>
                    </div>
                </div>
            </div>
        `
    } 
}

export default placeOrderScreen;