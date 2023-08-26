export const logger = {
  error(message: string) {
    if (process.env['NODE_ENV'] !== 'test') {
      console.error(message);
    }
  },
  info(message: string) {
    if (process.env['NODE_ENV'] !== 'test') {
      console.info(message);
    }
  },
};
