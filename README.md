# Fashion Store E-commerce Website

A full-stack fashion e-commerce website with JavaScript (React) frontend and Java (Spring Boot) backend, featuring payment integration via Stripe and automation APIs.

## Features

- **Product Catalog**: Browse clothes, shoes, and accessories
- **Shopping Cart**: Add items to cart and manage quantities
- **Payment Integration**: Secure payment processing via Stripe
- **Order Management**: Track orders and order status
- **Automation API**: Webhook endpoints for automated order processing
- **Responsive Design**: Modern UI built with TailwindCSS

## Tech Stack

### Frontend
- React 18
- React Router
- TailwindCSS
- Stripe React SDK
- Axios
- Lucide React (icons)

### Backend
- Java 17
- Spring Boot 3.2.0
- Spring Data JPA
- H2 Database (in-memory)
- Stripe Java SDK
- Maven

## Project Structure

```
2048/
├── backend/
│   ├── src/
│   │   └── main/
│   │       ├── java/com/fashionstore/
│   │       │   ├── config/
│   │       │   ├── controller/
│   │       │   ├── model/
│   │       │   ├── repository/
│   │       │   ├── service/
│   │       │   └── FashionStoreApplication.java
│   │       └── resources/
│   │           └── application.properties
│   └── pom.xml
└── frontend/
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── api/
    │   ├── components/
    │   ├── context/
    │   ├── pages/
    │   ├── utils/
    │   ├── App.jsx
    │   ├── index.css
    │   └── index.js
    ├── package.json
    ├── tailwind.config.js
    └── postcss.config.js
```

## Setup Instructions

### Backend Setup

1. **Navigate to backend directory**:
   ```bash
   cd backend
   ```

2. **Build the project**:
   ```bash
   mvn clean install
   ```

3. **Configure Stripe keys**:
   Update `src/main/resources/application.properties` with your Stripe API keys:
   ```properties
   stripe.secret.key=sk_test_your_stripe_secret_key
   stripe.publishable.key=pk_test_your_stripe_publishable_key
   ```

4. **Run the backend**:
   ```bash
   mvn spring-boot:run
   ```
   The backend will start on `http://localhost:8080`

### Frontend Setup

1. **Navigate to frontend directory**:
   ```bash
   cd frontend
   ```

2. **Install dependencies**:
   ```bash
   npm install
   ```

3. **Configure Stripe publishable key**:
   Update `src/pages/CheckoutPage.jsx` with your Stripe publishable key:
   ```javascript
   const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');
   ```

4. **Run the frontend**:
   ```bash
   npm start
   ```
   The frontend will start on `http://localhost:3000`

## API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/available` - Get available products
- `GET /api/products/category/{category}` - Get products by category
- `GET /api/products/{id}` - Get product by ID
- `POST /api/products` - Create new product
- `PUT /api/products/{id}` - Update product
- `DELETE /api/products/{id}` - Delete product

### Orders
- `GET /api/orders` - Get all orders
- `GET /api/orders/email/{email}` - Get orders by email
- `GET /api/orders/{id}` - Get order by ID
- `POST /api/orders` - Create new order
- `PUT /api/orders/{id}/status` - Update order status
- `POST /api/orders/payment/create-intent` - Create Stripe payment intent
- `POST /api/orders/{orderId}/payment/confirm` - Confirm payment
- `POST /api/orders/{orderId}/automation/process` - Process order automation

## Payment Integration

The application uses Stripe for payment processing:

1. **Payment Intent Creation**: When user proceeds to checkout, a payment intent is created
2. **Card Payment**: User enters card details via Stripe Elements
3. **Payment Confirmation**: After successful payment, order is created and confirmed
4. **Order Processing**: Automation API can be triggered for order fulfillment

## Automation Features

The backend includes automation endpoints for:
- Order status updates
- Stock management
- Payment processing
- Webhook-ready architecture for external integrations

## Database

The application uses H2 in-memory database for development. Sample products are automatically initialized on startup.

## Getting Stripe API Keys

1. Sign up at [stripe.com](https://stripe.com)
2. Go to Dashboard → Developers → API keys
3. Copy your test keys:
   - Publishable key (pk_test_...)
   - Secret key (sk_test_...)

## Development Notes

- The backend runs on port 8080
- The frontend runs on port 3000
- CORS is configured to allow requests from localhost:3000
- H2 Console is available at `http://localhost:8080/h2-console`

## Future Enhancements

- User authentication and authorization
- Product reviews and ratings
- Advanced search and filtering
- Order tracking with shipping integration
- Email notifications
- Admin dashboard for product management
- Production database (PostgreSQL/MySQL)
