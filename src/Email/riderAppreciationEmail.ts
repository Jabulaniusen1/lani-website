
const riderAppreciationEmail = (order: Models.Document) => {
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Well Done!</title>
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
            .order-details {
                margin-top: 20px;
                padding: 10px;
                border: 1px solid #ddd;
                border-radius: 5px;
                background-color: #f9f9f9;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Well Done!</h1>
            <p>We truly value your dedication to delivering orders efficiently.</p>
            <p>Here are the details of your recent successful delivery:</p>
            <div class="order-details">
                <h2>Order Details</h2>
                <p><strong>Tracking ID:</strong> ${order.trackingId}</p>
                <p><strong>Package Name:</strong> ${order.packageName}</p>
                <p><strong>Package Texture:</strong> ${order.packageTexture}</p>
                <p><strong>Delivery Address:</strong> ${order.deliveryAddress}</p>
                <p><strong>Delivery Fee:</strong> ₦${order.price.toLocaleString()}</p>
            </div>
            <p>New delivery opportunities are available. Check them out below:</p>
            <a href="https://lani.ng/orders/available" class="button">View Available Orders</a>
            <div class="footer">
                <p>Thank you for being an essential part of our team!</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export default riderAppreciationEmail;
