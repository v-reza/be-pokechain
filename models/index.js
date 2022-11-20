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
  sales: Sales,
  marketPokemon: MarketPokemon,
  marketItems: MarketItems,
  marketBundles: MarketBundles,
  marketBundlesItems: MarketBundlesItems,
  marketToken: MarketToken,
  transaction: Transaction,
  transactionDetailItem: TransactionDetailItem,
  transactionDetailPokemon: TransactionDetailPokemon,
  items: Items,
  listItems: ListItems,
  activityToken: ActivityToken,
  saleHistoryItems: SaleHistoryItems
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
  Sales,
  MarketPokemon,
  MarketItems,
  MarketBundles,
  MarketBundlesItems,
  MarketToken,
  Transaction,
  TransactionDetailItem,
  TransactionDetailPokemon,
  Items,
  ListItems,
  ActivityToken,
  SaleHistoryItems,
  prisma
};
