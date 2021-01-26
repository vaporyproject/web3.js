var Accounts = require("./../packages/web3-vap-accounts");
var chai = require('chai');
var assert = chai.assert;
var Web3 = require('../packages/web3');
var web3 = new Web3();

var tests = [
    {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        data: 'Some data',
        // signature done with personal_sign
        signature: '0x9946419a3436ec333db03d0e3827c614ff698badb84777f9731a3a1cd42191c26f57016b3e276b6ae778e26f67c1aff46af2684c3d73ae02c9a27e788f34d62e1c'
    }, {
        address: '0xEB014f8c8B418Db6b45774c326A0E64C78914dC0',
        privateKey: '0xbe6383dad004f233317e46ddb46ad31b16064d14447a95cc1d8c8d4bc61c3728',
        data: 'Some data!%$$%&@*',
        // signature done with personal_sign
        signature: '0x5a235ce20eb66956fa139cb2e77b9ffcab491fa748b85d758437a1fc2edffdab4724d38a9fe9c342ee3cedff4b02ef4b94059de8e6ffea1b89957b646f840d381b'
    }
];


describe("vap", function () {
    describe("accounts.wallet", function () {

        tests.forEach(function (test, i) {
            it("creates the right number of wallets", function() {
                var vapAccounts = new Accounts();

                assert.equal(vapAccounts.wallet.length, 0);

                var wallet = vapAccounts.wallet.create(2, '542342f!@#$$');

                assert.equal(vapAccounts.wallet.length, 2);
                assert.equal(wallet.length, 2);

                wallet = vapAccounts.wallet.create(3);

                assert.equal(vapAccounts.wallet.length, 5);
                assert.equal(wallet.length, 5);

                assert.isTrue(web3.utils.isAddress(wallet[1].address));
                assert.isTrue(web3.utils.isAddress(vapAccounts.wallet[2].address));
            });

            it("add wallet using a privatekey", function() {
                var vapAccounts = new Accounts();
                assert.equal(vapAccounts.wallet.length, 0);

                var wallet = vapAccounts.wallet.add(test.privateKey);
                assert.equal(wallet.address, test.address);
                assert.equal(wallet.privateKey, test.privateKey);
                assert.isFunction(wallet.signTransaction);
                assert.isFunction(wallet.sign);
                assert.equal(wallet.index, 0);

                // test if its retrievabe via address and index
                assert.equal(vapAccounts.wallet[test.address].address, test.address);
                assert.equal(vapAccounts.wallet[test.address.toLowerCase()].address, test.address);
                assert.equal(vapAccounts.wallet[0].address, test.address);

                assert.equal(vapAccounts.wallet.length, 1);
            });

            it("add wallet using an account", function() {
                var vapAccounts = new Accounts();
                assert.equal(vapAccounts.wallet.length, 0);

                var wallet = vapAccounts.wallet.add({
                    address: test.address,
                    privateKey: test.privateKey
                });
                assert.equal(wallet.address, test.address);
                assert.equal(wallet.privateKey, test.privateKey);
                assert.isFunction(wallet.signTransaction);
                assert.isFunction(wallet.sign);
                assert.equal(wallet.index, 0);

                // test if its retrievabe via address and index
                assert.equal(vapAccounts.wallet[test.address].address, test.address);
                assert.equal(vapAccounts.wallet[test.address.toLowerCase()].address, test.address);
                assert.equal(vapAccounts.wallet[0].address, test.address);

                assert.equal(vapAccounts.wallet.length, 1);
            });

            it("add wallet double shouldn't work", function() {
                var vapAccounts = new Accounts();
                assert.equal(vapAccounts.wallet.length, 0);

                var wallet = vapAccounts.wallet.add({
                    address: test.address,
                    privateKey: test.privateKey
                });
                wallet = vapAccounts.wallet.add({
                    address: test.address,
                    privateKey: test.privateKey
                });
                wallet = vapAccounts.wallet.add(test.privateKey);

                assert.equal(wallet.address, test.address);
                assert.equal(wallet.privateKey, test.privateKey);
                assert.isFunction(wallet.signTransaction);
                assert.isFunction(wallet.sign);
                assert.equal(wallet.index, 0);

                // test if its retrievabe via address and index
                assert.equal(vapAccounts.wallet[test.address].address, test.address);
                assert.equal(vapAccounts.wallet[test.address.toLowerCase()].address, test.address);
                assert.equal(vapAccounts.wallet[0].address, test.address);

                assert.equal(vapAccounts.wallet.length, 1);
            });

            it("remove wallet using an index", function() {
                var vapAccounts = new Accounts();
                assert.equal(vapAccounts.wallet.length, 0);

                var wallet = vapAccounts.wallet.add(test.privateKey);
                assert.equal(vapAccounts.wallet.length, 1);

                vapAccounts.wallet.remove(0);

                assert.isUndefined(vapAccounts.wallet[0]);
                assert.isUndefined(vapAccounts.wallet[wallet.address]);
                assert.isUndefined(vapAccounts.wallet[wallet.address.toLowerCase()]);

                assert.equal(vapAccounts.wallet.length, 0);

            });

            it("remove wallet using an address", function() {
                var vapAccounts = new Accounts();
                assert.equal(vapAccounts.wallet.length, 0);

                var wallet = vapAccounts.wallet.add(test.privateKey);
                assert.equal(vapAccounts.wallet.length, 1);

                vapAccounts.wallet.remove(test.address);

                assert.isUndefined(vapAccounts.wallet[0]);
                assert.isUndefined(vapAccounts.wallet[wallet.address]);
                assert.isUndefined(vapAccounts.wallet[wallet.address.toLowerCase()]);

                assert.equal(vapAccounts.wallet.length, 0);

            });

            it("remove wallet using an lowercase address", function() {
                var vapAccounts = new Accounts();
                assert.equal(vapAccounts.wallet.length, 0);

                var wallet = vapAccounts.wallet.add(test.privateKey);
                assert.equal(vapAccounts.wallet.length, 1);

                vapAccounts.wallet.remove(test.address.toLowerCase());

                assert.isUndefined(vapAccounts.wallet[0]);
                assert.isUndefined(vapAccounts.wallet[wallet.address]);
                assert.isUndefined(vapAccounts.wallet[wallet.address.toLowerCase()]);

                assert.equal(vapAccounts.wallet.length, 0);

            });

            it("create 5 wallets, remove two, create two more and check for overwrites", function() {
                var count = 5;
                var vapAccounts = new Accounts();
                assert.equal(vapAccounts.wallet.length, 0);

                var wallet = vapAccounts.wallet.create(count);
                var initialAddresses = [0,1,2,3,4].map(function(n) { return wallet[n].address } );
                assert.equal(vapAccounts.wallet.length, count);

                var thirdAddress = vapAccounts.wallet[2].address;
                var lastAddress = vapAccounts.wallet[4].address;
                var remainingAddresses = [0,1,3];
                var beforeRemoval = remainingAddresses.map(function(n) { return wallet[n].address } );

                vapAccounts.wallet.remove(2);
                vapAccounts.wallet.remove(4);

                assert.isUndefined(vapAccounts.wallet[2]);
                assert.isUndefined(vapAccounts.wallet[thirdAddress]);
                assert.isUndefined(vapAccounts.wallet[thirdAddress.toLowerCase()]);
                assert.isUndefined(vapAccounts.wallet[4]);
                assert.isUndefined(vapAccounts.wallet[lastAddress]);
                assert.isUndefined(vapAccounts.wallet[lastAddress.toLowerCase()]);

                var afterRemoval = remainingAddresses.map(function(n) { return wallet[n].address } );

                assert.equal(vapAccounts.wallet._findSafeIndex(), 2);
                assert.equal(vapAccounts.wallet.length, 3);

                vapAccounts.wallet.create(2);
                assert.isTrue(web3.utils.isAddress(wallet[2].address));
                assert.isTrue(web3.utils.isAddress(wallet[4].address));
                assert.isUndefined(vapAccounts.wallet[5]);

                var afterMoreCreation = remainingAddresses.map(function(n) { return wallet[n].address } );
                var newAddresses = [0,1,2,3,4].map(function(n) { return wallet[n].address } );

                // Checks for account overwrites
                assert.sameOrderedMembers(beforeRemoval, afterMoreCreation, "same ordered members");
                assert.sameOrderedMembers(afterRemoval, afterMoreCreation, "same ordered members");
                assert.notSameMembers(initialAddresses, newAddresses, "not same members");

                assert.equal(vapAccounts.wallet.length, count);
            });

            it("clear wallet", function() {
                var count = 10;
                var vapAccounts = new Accounts();
                assert.equal(vapAccounts.wallet.length, 0);

                var wallet = vapAccounts.wallet.create(count);
                assert.equal(vapAccounts.wallet.length, count);

                var addresses = [];
                for (var i = 0; i < count; i++) {
                    addresses.push(wallet[i].address);
                }

                vapAccounts.wallet.clear();

                for (var i = 0; i < count; i++) {
                    assert.isUndefined(vapAccounts.wallet[i]);
                    assert.isUndefined(vapAccounts.wallet[addresses[i]]);
                    assert.isUndefined(vapAccounts.wallet[addresses[i].toLowerCase()]);
                }

                assert.equal(vapAccounts.wallet.length, 0);
            });

            it("remove accounts then clear wallet", function() {
                var count = 10;
                var vapAccounts = new Accounts();
                assert.equal(vapAccounts.wallet.length, 0);

                var wallet = vapAccounts.wallet.create(count);
                assert.equal(vapAccounts.wallet.length, count);

                var addresses = [];
                for (var i = 0; i < count; i++) {
                    addresses.push(wallet[i].address);
                }

                vapAccounts.wallet.remove(0);
                assert.isUndefined(vapAccounts.wallet[0])
                vapAccounts.wallet.remove(5);
                assert.isUndefined(vapAccounts.wallet[5])

                vapAccounts.wallet.clear();

                for (var i = 0; i < count; i++) {
                    assert.isUndefined(vapAccounts.wallet[i]);
                    assert.isUndefined(vapAccounts.wallet[addresses[i]]);
                    assert.isUndefined(vapAccounts.wallet[addresses[i].toLowerCase()]);
                }



                assert.equal(vapAccounts.wallet.length, 0);
            });

            it("encrypt then decrypt wallet", function() {
                var vapAccounts = new Accounts();
                var password = "qwerty";

                assert.equal(vapAccounts.wallet.length, 0);

                var wallet = vapAccounts.wallet.create(5);
                var addressFromWallet = vapAccounts.wallet[0].address;
                assert.equal(vapAccounts.wallet.length, 5);

                vapAccounts.wallet.remove(2);
                assert.equal(vapAccounts.wallet.length, 4);

                var keystore = vapAccounts.wallet.encrypt(password);
                assert.equal(keystore.length, 4);

                vapAccounts.wallet.clear();
                assert.equal(vapAccounts.wallet.length, 0);

                vapAccounts.wallet.decrypt(keystore, password);
                assert.equal(vapAccounts.wallet.length, 4);

                var addressFromKeystore = vapAccounts.wallet[0].address;
                assert.equal(addressFromKeystore, addressFromWallet);

            });
        });
    });
});
