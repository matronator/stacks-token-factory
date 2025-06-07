![stx-token-factory](https://github.com/user-attachments/assets/c4b913f7-5b7f-4095-996a-27908c47aebe)

# Stacks Token Factory

[Visit demo here (still work in progress)](https://factory.matronator.cz)

Launch your tokens with ease! Stacks Token Factory let's you easily create your own decentralized tokens on the Stacks network using a simple form.

## Features

- [x] Generate Clarity code for smart contracts based on entered parameters
  - [x] Create fungible tokens
    - [x] With or without fixed total supply
    - [x] Implement minting and burning functions
      - [x] Allow only the creator of the contract to mint/burn tokens
  - [ ] Create non-fungible tokens (NFTs)
- [ ] Deploy generated smart contracts on the Stacks network

## How to use

1. Connect your wallet (you might need to refresh the website after)
2. Fill out the form with your desired token properties and features
3. Click "Preview code and deploy" to review the generated Clarity code for the smart contract
4. Deploy the contract to the network (make sure you have enough STX in your wallet to pay the cost and accompanying fees)

## Development

You will need a backend server with API for generating the smart contracts from templates. I use the [mtrgen-registry](https://github.com/matronator/mtrgen-registry) API with MTRGen and Pars'Em running on localhost:8000. Then you need to update `.env` file with the URL to your API.
