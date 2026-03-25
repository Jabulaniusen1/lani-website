import { formatDate } from "@/Utils/formatDate";

const orderCreatedEmail = (order: Models.Document) => {
    const createdAt = formatDate(order.$createdAt);
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Order is Confirmed!</title>
        <style>
            body {
                font-family: Arial, sans-serif;
                background-color: #f4f4f4;
                margin: 0;
                padding: 20px;
            }
            .container {
                max-width: 600px;
                margin: auto;
                background: white;
                padding: 20px;
                border-radius: 8px;
                box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            }
            h1 {
                color: #333;
            }
            p {
                color: #555;
            }
            .order-details {
                margin-top: 20px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: #f9f9f9;
            }
            .footer {
                margin-top: 20px;
                font-size: 12px;
                color: #777;
            }
            .button {
                display: inline-block;
                margin-top: 20px;
                padding: 10px 20px;
                background-color: orange;
                color: white;
                text-decoration: none;
                border-radius: 5px;
                text-align: center;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Your Order is Confirmed!</h1>
            <p>Your order has been successfully placed! Below are the details.</p>
            
            <div class="order-details">
                <h2>Order Details</h2>
                <p><strong>Tracking ID:</strong> ${order?.trackingId}</p>
                <p><strong>Package Name:</strong> ${order?.packageName}</p>
                <p><strong>Package Texture:</strong> ${order?.packageTexture}</p>
                <p><strong>Total Price:</strong> ₦${Number(order?.price).toLocaleString()}</p>
                <p><strong>Order Date:</strong> ${createdAt}</p>
            </div>

            <div class="order-details">
                <h2>Receiver Details</h2>
                <p><strong>Name:</strong> ${order?.receiverName}</p>
                <p><strong>Phone:</strong> ${order?.receiverPhone}</p>
                <p><strong>Delivery Address:</strong> ${order?.deliveryAddress}</p>
            </div>

            <p>Need help? Our support team is ready to assist you.</p>
            <a href="https://lani.ng/orders" class="button">View Your Order</a>
            
            <div class="footer">
                <p>Thank you for choosing Lani Logistics!</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export default orderCreatedEmail;
