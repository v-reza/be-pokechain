const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

const {
  user: User,
  profile: Profile,
  myPokemon: MyPokemon,
  myDetailPokemon: MyDetailPokemon,
  myItems: MyItems,
  pokemon: Pokemon,
  pokemonEvolution: PokemonEvolution,
  arena: Arena,
  marketPlace: MarketPlace,
  marketPokemon: MarketPokemon,
  marketItems: MarketItems,
  marketBundles: MarketBundles,
  marketBundlesItems: MarketBundlesItems,
  marketToken: MarketToken,
  transaction: Transaction,
  transactionDetailPokemon: TransactionDetailPokemon,
  items: Items,
  listItems: ListItems
} = prisma;

module.exports = {
  User,
  Profile,
  MyPokemon,
  MyDetailPokemon,
  MyItems,
  Pokemon,
  PokemonEvolution,
  Arena,
  MarketPlace,
  MarketPokemon,
  MarketItems,
  MarketBundles,
  MarketBundlesItems,
  MarketToken,
  Transaction,
  TransactionDetailPokemon,
  Items,
  ListItems
};
