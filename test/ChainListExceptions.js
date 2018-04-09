var ChainList = artifacts.require('./ChainList.sol');

// test suite
contract('ChainList', function(accounts) {
  var chainListInstance;
  var seller = accounts[1];
  var buyer = accounts[2];
  var articleName = 'article 1';
  var articleDescription = 'description for article 1';
  var articlePrice = 10;

  //no article for sale yet
  it('should throw en exception if you buy an article which is not for sale yet', function() {
    return ChainList.deployed().then(function(instance) {
      chainListInstance = instance;
      return chainListInstance
        .buyArticle(1, {
          from: buyer,
          value: web3.toWei(articlePrice, 'ether')
        })
        .then(assert.fail)
        .catch(function(error) {
          assert(true);
        })
        .then(function() {
          return chainListInstance.getNumberOfArticles();
        })
        .then(function(data) {
          assert.equal(data.toNumber(), 0, 'no article for sale must be 0');
        });
    });
  });

  // buy an article that doesn't exists
  it('should throw an exception if you try to buy an article that doesnt exists ', () => {
    return ChainList.deployed()
      .then(instance => {
        chainListInstance = instance;
        return chainListInstance.sellArticle(
          articleName,
          articleDescription,
          web3.toWei(articlePrice, 'ether'),
          { from: seller }
        );
      })
      .then(receipt => {
        return chainListInstance.buyArticle(2, {
          from: seller,
          value: web3.toWei(articlePrice, 'ether')
        });
      })
      .then(assert.fail)
      .catch(error => {
        assert(true);
      })
      .then(() => {
        return chainListInstance.articles(1);
      })
      .then(data => {
        assert.equal(data[0].toNumber(), 1, 'article id must be 1');
        assert.equal(data[1], seller, `event seller must be ${seller}`);
        assert.equal(data[2], 0x0, 'buyer must be empty');
        assert.equal(data[3], articleName, `event article name must be ${articleName}`);
        assert.equal(
          data[4],
          articleDescription,
          `event article name must be ${articleDescription}`
        );
        assert.equal(
          data[5].toNumber(),
          web3.toWei(articlePrice, 'ether'),
          `event article price must be ${web3.toWei(articlePrice, 'ether')}`
        );
      });
  });

  it('should throw exception if you try to buy your own article', () => {
    return ChainList.deployed()
      .then(instance => {
        chainListInstance = instance;
        return chainListInstance.buyArticle(1, {
          from: seller,
          value: web3.toWei(articlePrice, 'ether')
        });
      })
      .then(assert.fail)
      .catch(error => {
        assert(true);
      })
      .then(() => {
        return chainListInstance.articles(1);
      })
      .then(data => {
        assert.equal(data[0].toNumber(), 1, 'article id must be 1');
        assert.equal(data[1], seller, `event seller must be ${seller}`);
        assert.equal(data[2], 0x0, 'buyer must be empty');
        assert.equal(data[3], articleName, `event article name must be ${articleName}`);
        assert.equal(
          data[4],
          articleDescription,
          `event article name must be ${articleDescription}`
        );
        assert.equal(
          data[5].toNumber(),
          web3.toWei(articlePrice, 'ether'),
          `event article price must be ${web3.toWei(articlePrice, 'ether')}`
        );
      });
  });

  it('should throw exception if you try to buy your article with different price value', () => {
    return ChainList.deployed()
      .then(instance => {
        chainListInstance = instance;
        return chainListInstance.buyArticle(1, {
          from: seller,
          value: web3.toWei(articlePrice + 1, 'ether')
        });
      })
      .then(assert.fail)
      .catch(error => {
        assert(true);
      })
      .then(() => {
        return chainListInstance.articles(1);
      })
      .then(data => {
        assert.equal(data[0].toNumber(), 1, 'article id must be 1');
        assert.equal(data[1], seller, `event seller must be ${seller}`);
        assert.equal(data[2], 0x0, 'buyer must be empty');
        assert.equal(data[3], articleName, `event article name must be ${articleName}`);
        assert.equal(
          data[4],
          articleDescription,
          `event article name must be ${articleDescription}`
        );
        assert.equal(
          data[5].toNumber(),
          web3.toWei(articlePrice, 'ether'),
          `event article price must be ${web3.toWei(articlePrice, 'ether')}`
        );
      });
  });

  it('should throw exception if you try to buy article twice', () => {
    return ChainList.deployed()
      .then(instance => {
        chainListInstance = instance;
        return chainListInstance.buyArticle(1, {
          from: buyer,
          value: web3.toWei(articlePrice, 'ether')
        });
      })
      .then(receipt => {
        return chainListInstance.buyArticle(1, {
          from: web3.eth.accounts[0],
          value: web3.toWei(articlePrice, 'ether')
        });
      })
      .then(assert.fail)
      .catch(error => {
        assert(true);
      })
      .then(function() {
        return chainListInstance.articles(1);
      })
      .then(data => {
        assert.equal(data[0].toNumber(), 1, 'article id must be 1');
        assert.equal(data[1], seller, `event seller must be ${seller}`);
        assert.equal(data[2], buyer, `buyer must be ${buyer}`);
        assert.equal(data[3], articleName, `event article name must be ${articleName}`);
        assert.equal(
          data[4],
          articleDescription,
          `event article name must be ${articleDescription}`
        );
        assert.equal(
          data[5].toNumber(),
          web3.toWei(articlePrice, 'ether'),
          `event article price must be ${web3.toWei(articlePrice, 'ether')}`
        );
      });
  });
});
