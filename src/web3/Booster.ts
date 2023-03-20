import { SOLANA_NETWORK } from 'config';

export type BoosterRule = {
  account: string;
  creator: string;
  name: string;
  ashByBurn: number;
  ashIfBurn: number;

  // if NFT found
  match?: BoosterAccount;
};

// let creator = new web3.PublicKey();
// let name = "Minion"

export function getBoosterRules(): Array<BoosterRule> {
  if (SOLANA_NETWORK === 'devnet') {
    return [
      {
        account: 'CunfEH5RQdzznJ8d5cEu4WNGr6rRUVSKKkMpCUiwyBsp',
        creator: 'EM1EoqaEo2Z9dudCBcQ84jmcsBs15RwWQj7ZzrUAXYhw',
        name: 'Minion',
        ashByBurn: 2,
        ashIfBurn: 100,
      },
      {
        account: '5tUuKze2RpKmmttEYqqSVE9weBAiEDqd8pEC767LasUH',
        creator: 'AdjEKpWD99Qgi7QnqTrWshAuzjwxcCioPSG2gjFZxHUK',
        name: 'Plot x2',
        ashByBurn: 2,
        ashIfBurn: 20,
      },
      {
        account: '2YdMgGQQyH6fMZTe2NaCaoN7cQqErCePR1rVdT7qN58j',
        creator: 'AdjEKpWD99Qgi7QnqTrWshAuzjwxcCioPSG2gjFZxHUK',
        name: 'Plot x4',
        ashByBurn: 2,
        ashIfBurn: 40,
      },
    ];
  } else {

    return [
      {
        account: 'qN4uHs7smua2niyRimWfAp2yrsdjfZxNdgQWzjMPL2P',
        creator: '51iJycnBCAVqmrssYVXq2LrZTcEnEBkYaGHNpyG4hkJK',
        name: '',
        ashByBurn: 2,
        ashIfBurn: 100,
      },
      {
        account: '8UkeeqkHwUbW1sJ38dfH4mfXaX3hjB3uhXQ4DvdBMArS',
        creator: 'J4KqpehX1BB9SG3vC5BvGCZQ5zKszuSR5FLubqiJ4nct',
        name: 'Plot x2',
        ashByBurn: 2,
        ashIfBurn: 100,
      },
      {
        account: 'G7mqY8jdqz9VL32APRbCiGg8FMfGWuuA3KQxM5QBGaSX',
        creator: 'J4KqpehX1BB9SG3vC5BvGCZQ5zKszuSR5FLubqiJ4nct',
        name: 'Plot x4',
        ashByBurn: 2,
        ashIfBurn: 200,
      },
      {
        account: 'HebFB7g8QrJ36X5QvtSfJyiBJBDZWTpU3gDHiPQkC7M7',
        creator: 'J4KqpehX1BB9SG3vC5BvGCZQ5zKszuSR5FLubqiJ4nct',
        name: 'Plot x6',
        ashByBurn: 2,
        ashIfBurn: 500,
      },
      {
        account: '8MyMp6LKoaaTjAGamTagvdbBTjQzWsjVNBDpLswcdiSC',
        creator: 'J4KqpehX1BB9SG3vC5BvGCZQ5zKszuSR5FLubqiJ4nct',
        name: 'Plot x8',
        ashByBurn: 2,
        ashIfBurn: 1000,
      },
      {
        account: '39ivN6RYqJ5eFw719bNPbfGyFRFuYssKvHkDKyLjhqr9',
        creator: 'J4KqpehX1BB9SG3vC5BvGCZQ5zKszuSR5FLubqiJ4nct',
        name: 'Plot x10',
        ashByBurn: 2,
        ashIfBurn: 5000,
      },
    ];
  }
}

export type BoosterAccount = {
  boosterAccount: string;
  boosterNftMintAccount: string;
};
