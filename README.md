### ⚠️ Work-in-progress ⚠️

# Reeve verifier

This repository is currently just a Proof-of-concept. In the future it's possible to become more, but for now it's just a PoC .

The idea of this repository is to provide a simple way and an example how to verify Reeve onChain data.
Reeve is an application introduced from the Cardano Foundation to provide trust and transparency about financial data of organisations.

This repository uses [Yaci Store](https://github.com/bloxbean/yaci-store) as a modular indexer. 
Since we are only interested in the metadata it is a perfect fit and we don't need to index everything from the blockchain.
We are using the metadata store and overwrite the Event processing to parse our own data.

An example of a Reeve transaction can be found here: [Cardano Explorer](https://explorer.cardano.org/transaction/99a20f54f25bf9168719cb2ce00e25ab01c4a458e0500cf3a699a7c8ce3c0cdf)


### What it is doing
Reeve uses the metadata label `1447` for its transactions. That's why we are filtering the metadata events for this particaluar metadata label.
Additionally, we are filtering for an `organisationID`, since we only want to verify the data of one specific organisation.
The process can be found in the [CustomMetadataStorage.java](src/main/java/org/cardanofoundation/reeve/indexer/yaci/CustomMetadataStorage.java) class.

Within the repository we are also providing a simple frontend to display the data.

### How to run it

#### Starting the backend 
The easiest way is to run it with docker.
```bash
docker compose up
```
This command will start a postgres database + the backend including the indexer. 

#### Starting the frontend
The frontend is a simple React application. You can start it with the following command:
```bash
cd frontend
npm install
npm run dev
```

### Things to do:
- [X] Implement basic frontend
- [ ] Implement identity verification - Currently we are interpreting the metadata without identity verification