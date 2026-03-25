import { formatDate } from "@/Utils/formatDate";
const riderAssignedEmail = (order: Models.Document) => {
    const createdAt = formatDate(order.$createdAt);
    return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Rider Assigned</title>
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
            <h1>Hello ${order?.senderName}!</h1>
            <p>Your order with Tracking ID: <strong>${order.trackingId}</strong> has been accepted by a rider.</p>
            <p><strong>Rider Name:</strong> ${order?.riderName}</p>
            <p><strong>Rider Phone:</strong> ${order?.riderPhone}</p>
            <p><strong>Order Date:</strong> ${createdAt}</p>
            <p>If you have any questions, feel free to contact us.</p>
            <a href="https://lani.ng/orders" class="button">View Your Order</a>
            <div class="footer">
                <p>Thank you for choosing our service!</p>
            </div>
        </div>
    </body>
    </html>
    `;
};

export default riderAssignedEmail; 