/* eslint-disable @typescript-eslint/no-var-requires */
/* eslint-disable no-undef */
const StarNotary = artifacts.require('StarNotary')
const { Keccak } = require('sha3')
const { v4 } = require('uuid')
const hash = require('object-hash')

let accounts

const setBg = () => {
  return Math.floor(Math.random() * 16777215).toString(16)
}

contract('StarNotary', (accs) => {
  accounts = accs
})

it('can Create a Star', async () => {
  const randomColor = setBg()
  const hash256 = new Keccak(256)

  let tokenId = hash256
    .update(
      await hash(
        { name: 'Awesome Star!', color: `#${randomColor}` },
        { algorithm: 'sha1' }
      )
    )
    .digest()

  let instance = await StarNotary.deployed()
  await instance.createStar('Awesome Star!', `#${randomColor}`, tokenId, {
    from: accounts[0]
  })
  let star = await instance.tokenIdToStarInfo.call(tokenId)
  assert.equal(star[0], 'Awesome Star!')
  assert.equal(star[1], `#${randomColor}`)
})

it('lets user1 put up their star for sale', async () => {
  let instance = await StarNotary.deployed()
  let user1 = accounts[1]

  const randomColor = setBg()
  const hash256 = new Keccak(256)

  let tokenId = hash256
    .update(
      await hash(
        { name: 'awesome star', color: `#${randomColor}` },
        { algorithm: 'sha1' }
      )
    )
    .digest()

  let starPrice = web3.utils.toWei('.01', 'ether')
  await instance.createStar('awesome star', `#${randomColor}`, tokenId, {
    from: user1
  })
  let stars = await instance.getStarsByOwner({ from: user1 })
  assert.equal(stars.length, 1)
  await instance.putStarUpForSale(tokenId, starPrice, 0, {
    from: user1
  })
  stars = await instance.getStarsByOwner({ from: user1 })
  assert.equal(stars.length, 0)
  assert.equal(await instance.starsForSalePrice.call(tokenId), starPrice)

  let starsForSale = await instance.getStarsForSale({ from: user1 })
  assert.equal(starsForSale.length, 1)
  assert.equal(starsForSale[0][0], 'awesome star')
  assert.equal(starsForSale[0][1], `#${randomColor}`)
  assert.equal(starsForSale[0][2], 0)
})

it('lets user1 get the funds after the sale', async () => {
  let instance = await StarNotary.deployed()
  let user1 = accounts[1]
  let user2 = accounts[2]

  const randomColor = setBg()
  const hash256 = new Keccak(256)

  let tokenId = hash256
    .update(
      await hash(
        { name: 'awesome star', color: `#${randomColor}` },
        { algorithm: 'sha1' }
      )
    )
    .digest()

  let starPrice = web3.utils.toWei('.01', 'ether')
  let balance = web3.utils.toWei('.05', 'ether')
  await instance.createStar('awesome star', `#${randomColor}`, tokenId, {
    from: user1
  })
  //let stars = await instance.getStarsByOwner({ from: user1 })
  await instance.putStarUpForSale(tokenId, starPrice, 0, {
    from: user1
  })
  let balanceOfUser1BeforeTransaction = await web3.eth.getBalance(user1)
  await instance.buyStar(tokenId, { from: user2, value: balance })
  let balanceOfUser1AfterTransaction = await web3.eth.getBalance(user1)
  let value1 = Number(balanceOfUser1BeforeTransaction) + Number(starPrice)
  let value2 = Number(balanceOfUser1AfterTransaction)
  assert.equal(value1, value2)
})

it('lets user2 buy a star, if it is put up for sale', async () => {
  let instance = await StarNotary.deployed()
  let user1 = accounts[1]
  let user2 = accounts[2]

  const randomColor = setBg()
  const hash256 = new Keccak(256)

  let tokenId = hash256
    .update(
      await hash(
        { name: 'awesome star', color: `#${randomColor}` },
        { algorithm: 'sha1' }
      )
    )
    .digest()

  let starPrice = web3.utils.toWei('.01', 'ether')
  let balance = web3.utils.toWei('.05', 'ether')
  await instance.createStar('awesome star', `#${randomColor}`, tokenId, {
    from: user1
  })
  let stars = await instance.getStarsByOwner({ from: user1 })
  await instance.putStarUpForSale(tokenId, starPrice, stars.length - 1, {
    from: user1
  })
  await instance.buyStar(tokenId, { from: user2, value: balance })
  assert.equal(await instance.ownerOf.call(tokenId), user2)
})

it('lets user2 buy a star and decreases its balance in ether', async () => {
  let instance = await StarNotary.deployed()
  let user1 = accounts[1]
  let user2 = accounts[2]

  const randomColor = setBg()
  const hash256 = new Keccak(256)

  let tokenId = hash256
    .update(
      await hash(
        { name: 'awesome star', color: `#${randomColor}` },
        { algorithm: 'sha1' }
      )
    )
    .digest()

  let starPrice = web3.utils.toWei('.01', 'ether')
  let balance = web3.utils.toWei('.05', 'ether')
  await instance.createStar('awesome star', `#${randomColor}`, tokenId, {
    from: user1
  })
  let stars = await instance.getStarsByOwner({ from: user1 })
  await instance.putStarUpForSale(tokenId, starPrice, stars.length - 1, {
    from: user1
  })
  const balanceOfUser2BeforeTransaction = await web3.eth.getBalance(user2)
  await instance.buyStar(tokenId, { from: user2, value: balance, gasPrice: 0 })
  const balanceAfterUser2BuysStar = await web3.eth.getBalance(user2)
  let value =
    Number(balanceOfUser2BeforeTransaction) - Number(balanceAfterUser2BuysStar)
  assert.equal(value, starPrice)
})

// Implement Task 2 Add supporting unit tests

it('lookUptokenIdToStarInfo test', async () => {
  // 1. create a Star with different tokenId
  let instance = await StarNotary.deployed()

  const randomColor = setBg()
  const hash256 = new Keccak(256)

  let tokenId = hash256
    .update(
      await hash(
        { name: 'Star to be looked up!', color: `#${randomColor}` },
        { algorithm: 'sha1' }
      )
    )
    .digest()

  await instance.createStar(
    'Star to be looked up!',
    `#${randomColor}`,
    tokenId,
    {
      from: accounts[0]
    }
  )
  // 2. Call your method lookUptokenIdToStarInfo
  let star = await instance.lookUptokenIdToStarInfo(tokenId)
  // 3. Verify if you Star name is the same
  assert.equal(star[0], 'Star to be looked up!')
  assert.equal(star[1], `#${randomColor}`)
})

it('can add the star name and star symbol properly', async () => {
  // 1. create a Star with different tokenId
  let instance = await StarNotary.deployed()

  const randomColor = setBg()
  const hash256 = new Keccak(256)

  let tokenId = hash256
    .update(
      await hash(
        { name: 'Star to be looked up!', color: `#${randomColor}` },
        { algorithm: 'sha1' }
      )
    )
    .digest()

  await instance.createStar(
    'Star to be looked up!',
    `#${randomColor}`,
    tokenId,
    {
      from: accounts[0]
    }
  )
  //2. Call the name and symbol properties in your Smart Contract and compare with the name and symbol provided
  assert.equal(await instance.name(), 'StarToken')
  assert.equal(await instance.symbol(), 'STR')
})

it('lets 2 users exchange stars', async () => {
  let instance = await StarNotary.deployed()
  // 1. create 2 Stars with different tokenId

  const randomColor = setBg()
  const hash256 = new Keccak(256)

  let tokenId1 = hash256
    .update(
      await hash(
        { name: 'Star to be looked up!', color: `#${randomColor}` },
        { algorithm: 'sha1' }
      )
    )
    .digest()
  await instance.createStar(
    'Star to be looked up!',
    `#${randomColor}`,
    tokenId1,
    {
      from: accounts[1]
    }
  )

  const randomColor2 = setBg()
  let tokenId2 = hash256
    .update(
      await hash(
        { name: 'Star to be looked up 22!', color: `#${randomColor2}` },
        { algorithm: 'sha1' }
      )
    )
    .digest()
  await instance.createStar(
    'Star to be looked up 22!',
    `#${randomColor2}`,
    tokenId2,
    {
      from: accounts[2]
    }
  )

  assert.equal(await instance.ownerOf(tokenId1), accounts[1])
  assert.equal(await instance.ownerOf(tokenId2), accounts[2])
  // 2. Call the exchangeStars functions implemented in the Smart Contract
  await instance.exchangeStars(tokenId1, tokenId2, { from: accounts[1] })

  // 3. Verify that the owners changed
  assert.equal(await instance.ownerOf(tokenId1), accounts[2])
  assert.equal(await instance.ownerOf(tokenId2), accounts[1])
})

it('lets a user transfer a star', async () => {
  // 1. create a Star with different tokenId
  let instance = await StarNotary.deployed()

  const randomColor = setBg()
  const hash256 = new Keccak(256)

  let tokenId = hash256
    .update(
      await hash(
        { name: 'Star to be transferred!', color: `#${randomColor}` },
        { algorithm: 'sha1' }
      )
    )
    .digest()

  await instance.createStar(
    'Star to be transferred!',
    `#${randomColor}`,
    tokenId,
    {
      from: accounts[1]
    }
  )
  assert.equal(await instance.ownerOf(tokenId), accounts[1])
  // 2. use the transferStar function implemented in the Smart Contract
  await instance.transferStar(accounts[2], tokenId, { from: accounts[1] })
  // 3. Verify the star owner changed.
  assert.equal(await instance.ownerOf(tokenId), accounts[2])
})

// project increment
it('can get all stars of some owner', async () => {
  let instance = await StarNotary.deployed()

  const randomColor = setBg()
  const hash256 = new Keccak(256)

  let tokenId = hash256
    .update(
      await hash(
        { name: 'Awesome Star 1!', color: `#${randomColor}` },
        { algorithm: 'sha1' }
      )
    )
    .digest()

  await instance.createStar('Awesome Star 1!', `#${randomColor}`, tokenId, {
    from: accounts[3]
  })

  const randomColor1 = setBg()
  tokenId = hash256
    .update(
      await hash(
        { name: 'Awesome Star 2!', color: `#${randomColor1}` },
        { algorithm: 'sha1' }
      )
    )
    .digest()

  await instance.createStar('Awesome Star 2!', `#${randomColor1}`, tokenId, {
    from: accounts[3]
  })
  let stars = await instance.getStarsByOwner({ from: accounts[3] })
  assert.equal(stars.length, 2)

  assert.equal(stars[0][0], 'Awesome Star 1!')
  assert.equal(stars[0][1], `#${randomColor}`)

  assert.equal(stars[1][0], 'Awesome Star 2!')
  assert.equal(stars[1][1], `#${randomColor1}`)
  assert.equal(stars.length, 2)

  let starsEmpty = await instance.getStarsByOwner({ from: accounts[5] })
  assert.equal(starsEmpty.length, 0)

  const randomColor2 = setBg()
  tokenId = hash256
    .update(
      await hash(
        { name: 'Nova Star 01!', color: `#${randomColor2}` },
        { algorithm: 'sha1' }
      )
    )
    .digest()
  await instance.createStar('Nova Star 01!', `#${randomColor2}`, tokenId, {
    from: accounts[5]
  })

  let starsNotEmpty = await instance.getStarsByOwner({ from: accounts[5] })
  assert.equal(starsNotEmpty.length, 1)

  let stars32 = await instance.getStarsByOwner({ from: accounts[3] })
  assert.equal(stars32.length, 2)
})
