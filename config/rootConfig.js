const allowedOrigins = [
  "http://localhost:3000", // landing pages
  "http://localhost:3001", // marketplace
  "http://localhost:3002", // app pages
  "http://localhost:3003", // admin pages
  "https://pokechain.games/", // production landing pages
  "https://marketplace.pokechain.games/", // production marketplace
  "https://app.pokechain.games/", // production app pages
  "https://admin.pokechain.games/", // production admin pages
  "https://forum.pokechain.games/", // production forum pages
];

module.exports = {
  allowedOrigins,
};
