import { formatDate } from "@/Utils/formatDate";

const orderCompletedEmail = (order: Models.Document) => {
    const createdAt = formatDate(order.$createdAt);
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Your Order Has Arrived!</title>
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
        </style>
    </head>
    <body>
        <div class="container">
            <h1>Your Order Has Arrived!</h1>
            <p>Your package with Tracking ID: <strong>${order?.trackingId}</strong> has been successfully delivered.</p>
            <p><strong>Receiver Name:</strong> ${order?.receiverName}</p>
            <p><strong>Delivery Address:</strong> ${order?.deliveryAddress}</p>
            <p><strong>Order Date:</strong> ${createdAt}</p>
            <p>We appreciate your trust in us and look forward to serving you again!</p>
            <a href="https://lani.ng/orders" class="button">View Your Order</a>
            <div class="footer">
                <p>Need help? Our support team is here for you.</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export default orderCompletedEmail;
