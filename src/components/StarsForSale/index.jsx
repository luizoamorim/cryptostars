/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-dupe-else-if */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import React, { useEffect, useState } from 'react'
import { FaStar } from 'react-icons/fa'
import Web3 from 'web3'
import StarNotary from '../../abis/StarNotary.json'
import { Header, Wrapper, Stars, Row, WrapperModal, StarModal } from './styles'
import { Keccak } from 'sha3'
import hash from 'object-hash'
import SiteHead from 'components/SiteHead'
import { useStarAddressContext } from 'hooks/StarAddressContext'
import { useHistory } from 'react-router-dom'
import { toast } from 'react-toastify'

const StarsForSale = () => {
  const [starContract, setStarContract] = useState()
  const [starsForSale, setStarsForSale] = useState()
  const [star, setStar] = useState()
  const [open, setOpen] = useState(false)
  const [starIndex, setStarIndex] = useState()
  const [account, setAccount] = useState()

  const { starAddress } = useStarAddressContext()

  const history = useHistory()

  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
  }, [])

  const loadWeb3 = async () => {
    if (window.web3) {
      window.web3 = new Web3(window.ethereum)
      // await window.ethereum.enable()
      await window.ethereum.request({ method: 'eth_requestAccounts' })
    } else if (window.web3) {
      window.web3 = new Web3(window.web3.currentProvider)
    } else {
      window.alert(
        'Non-Ethereum browser detected. You should consider trying MetaMask!'
      )
    }
  }

  const loadBlockchainData = async () => {
    if (window.web3) {
      const web3 = window.web3

      // Load account
      const accounts = await web3.eth.getAccounts()
      setAccount(accounts[0])

      // Network ID
      const networkId = await web3.eth.net.getId()
      const networkData = StarNotary.networks[networkId]
      if (networkData) {
        const starNotary = new web3.eth.Contract(
          StarNotary.abi,
          networkData.address
        )
        setStarContract(starNotary)
        setStarsForSale(await starNotary.methods.getStarsForSale().call())
      } else {
        window.alert('StarNotary contract not deployed to detected network.')
      }
    }
  }

  const showStar = (star, index) => {
    setOpen(true)
    setStar(star)
    setStarIndex(index)
  }

  const buyStar = async () => {
    try {
      const hash256 = new Keccak(256)
      let tokenId = hash256
        .update(
          await hash(
            { name: star.name, color: star.color },
            { algorithm: 'sha1' }
          )
        )
        .digest()

      let balance = window.web3.utils.toWei('.05', 'ether')

      let ownerAddress = await starContract.methods
        .ownerOf(tokenId)
        .call({ from: account })

      if (ownerAddress === account) {
        setOpen(false)
        toast.error('Do you cannot buy your own star!')
        return
      }

      await starContract.methods
        .buyStar(tokenId, starIndex)
        .send({ from: account, value: balance })

      history.push('/myStars')
    } catch (err) {
      console.log(err)
    }
  }

  const exchangeStar = async () => {
    const hash256 = new Keccak(256)
    let tokenId = hash256
      .update(
        await hash(
          { name: star.name, color: star.color },
          { algorithm: 'sha1' }
        )
      )
      .digest()

    let ownerAddress = await starContract.methods
      .ownerOf(tokenId)
      .call({ from: account })

    if (ownerAddress === account) {
      setOpen(false)
      toast.error('Do you cannot exchange with your own star!')
      return
    }

    await starContract.methods
      .exchangeStars(starAddress, tokenId, starIndex)
      .send({ from: account })

    setOpen(false)
    history.push('/myStars')
  }

  return (
    <Wrapper>
      <Header>
        <div className="siteHeadStyles">
          <SiteHead></SiteHead>
        </div>
        {starContract && (
          <>
            {starsForSale && starsForSale.length > 0 && (
              <>
                {!starAddress && <h1>Stars for sale</h1>}
                {starAddress && <h1>Stars for exchange</h1>}
                <Row>
                  <Stars>
                    {starsForSale.map((star, index) => (
                      <div
                        key={index}
                        className="row__inner"
                        onClick={() => showStar(star, index)}
                      >
                        <div className="tile">
                          <FaStar size={70} style={{ color: star[1] }} />
                        </div>
                      </div>
                    ))}
                  </Stars>
                </Row>
              </>
            )}
            {starsForSale && starsForSale.length === 0 && (
              <>
                <h1>Do not have any stars for sale!</h1>
              </>
            )}
          </>
        )}
        {open && (
          <WrapperModal>
            <StarModal>
              <div className="modalHead">
                <button onClick={() => setOpen(!open)}>X</button>
              </div>
              <div className="modalBody">
                <FaStar size={250} style={{ color: star.color }} />
                <p>{star.name}</p>
                <p>{star.toSell}</p>
              </div>
              <div className="modalFoot">
                {!starAddress && (
                  <div className="modalBtn" onClick={async () => buyStar()}>
                    Buy
                  </div>
                )}
                {starAddress && (
                  <div
                    className="modalBtn"
                    onClick={async () => exchangeStar()}
                  >
                    Exchange
                  </div>
                )}
              </div>
            </StarModal>
          </WrapperModal>
        )}
      </Header>
    </Wrapper>
  )
}

export default StarsForSale
