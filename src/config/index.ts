export default {
  api: `http${process.env.NODE_ENV === 'production' ? 's' : ''}://ergast.com/api/`,
  publicUrl: process.env.PUBLIC_URL,
};
