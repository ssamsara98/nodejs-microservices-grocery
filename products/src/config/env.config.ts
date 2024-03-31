export const env = {
  NODE_ENV: process.env.NODE_ENV,
  PORT: process.env.PORT,
  JWT_SECRET: process.env.JWT_SECRET,
  MONGODB_URI: process.env.MONGODB_URI,
  MESSAGE_QUEUE_URL: process.env.MESSAGE_QUEUE_URL,
  EXCHANGE_NAME: process.env.EXCHANGE_NAME,
  CUSTOMER_SERVICE: 'customer_service',
  SHOPPING_SERVICE: 'shopping_service',
};
