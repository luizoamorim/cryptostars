/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-dupe-else-if */
/* eslint-disable @typescript-eslint/no-non-null-assertion */
import {
  Header,
  Wrapper,
  Stars,
  DivButton,
  Row,
  FormStar,
  StarModal,
  WrapperModal,
  InputClass
} from 'components/MyStars/styles'
import SiteHead from 'components/SiteHead'
import React, { useEffect, useState } from 'react'
import Web3 from 'web3'
import StarNotary from '../../abis/StarNotary.json'
import { FaStar } from 'react-icons/fa'
import { Keccak } from 'sha3'
import hash from 'object-hash'
import { toast } from 'react-toastify'
import { useStarAddressContext } from 'hooks/StarAddressContext'
import { useHistory } from 'react-router-dom'

const MyStars = () => {
  const [account, setAccount] = useState()
  const [starContract, setStarContract] = useState()
  const [stars, setStars] = useState()
  const [star, setStar] = useState()
  const [starName, setStarName] = useState('')
  const [starIndex, setStarIndex] = useState()
  const [myWeb3, setMyWeb3] = useState()
  const [open, setOpen] = useState(false)
  const [addressToTransfer, setAddressToTransfer] = useState('')

  const { setStarAddress } = useStarAddressContext()

  useEffect(() => {
    loadWeb3()
    loadBlockchainData()
    setStarAddress(null)
  }, [])

  let history = useHistory()

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
      setMyWeb3(window.web3)
      // Load account
      const accounts = await web3.eth.getAccounts()
      setAccount(accounts[0])
      console.log('ACCOUNT: ', accounts[0])

      // Network ID
      const networkId = await web3.eth.net.getId()
      const networkData = StarNotary.networks[networkId]
      if (networkData) {
        const starNotary = new web3.eth.Contract(
          StarNotary.abi,
          networkData.address
        )
        const stars = await starNotary.methods
          .getStarsByOwner()
          .call({ from: accounts[0] })
        setStars(stars)
        setStarContract(starNotary)
      } else {
        window.alert('StarNotary contract not deployed to detected network.')
      }
    }
  }

  const setBg = () => {
    return Math.floor(Math.random() * 16777215).toString(16)
  }

  const generateStar = async () => {
    if (!starName) {
      toast.error('Star should hava a name!', { style: '20px' })
      return
    }
    const randomColor = setBg()
    const hash256 = new Keccak(256)

    let tokenId = hash256
      .update(
        await hash(
          { name: starName, color: `#${randomColor}` },
          { algorithm: 'sha1' }
        )
      )
      .digest()

    await starContract.methods
      .createStar(starName, `#${randomColor}`, tokenId)
      .send({ from: account })

    setStarName('')
    loadBlockchainData()
  }

  const showStar = (star, index) => {
    setOpen(true)
    setStar(star)
    setStarIndex(index)
  }

  const putStarSell = async () => {
    const hash256 = new Keccak(256)
    let tokenId = hash256
      .update(
        await hash(
          { name: star.name, color: star.color },
          { algorithm: 'sha1' }
        )
      )
      .digest()

    let starPrice = myWeb3.utils.toWei('.01', 'ether')
    console.log(tokenId)
    await starContract.methods
      .putStarUpForSale(tokenId, starPrice, starIndex)
      .send({ from: account })
    setOpen(false)
    setStars(await starContract.methods.getStarsByOwner().call())
  }

  const transfer = async () => {
    console.log(star)
    if (!addressToTransfer) {
      toast.error('You need insert an address to make the transfer!')
      return
    }

    const hash256 = new Keccak(256)
    let tokenId = hash256
      .update(
        await hash(
          { name: star.name, color: star.color },
          { algorithm: 'sha1' }
        )
      )
      .digest()

    await starContract.methods
      .transferStar(addressToTransfer, tokenId, starIndex)
      .send({ from: account })
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
    setStarAddress(tokenId)
    history.push('/starsforsale')
  }

  return (
    <Wrapper>
      <Header active={open}>
        <div className="siteHeadStyles">
          <SiteHead></SiteHead>
        </div>
        {starContract && (
          <>
            {stars.length > 0 && (
              <>
                <Row>
                  <Stars>
                    {stars.map((star, index) => (
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
            {stars.length === 0 && (
              <>
                <h1>You do not have any star yet!</h1>
              </>
            )}
            <FormStar>
              <InputClass
                placeholder="Insert the new star's name"
                onChange={(e) => setStarName(e.target.value)}
                value={starName}
                type="text"
              />
              <DivButton onClick={async () => generateStar()}>
                Generate Star
              </DivButton>
            </FormStar>
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
                <div className="modalBtn" onClick={async () => exchangeStar()}>
                  Exchange
                </div>
                <div className="modalBtn" onClick={async () => putStarSell()}>
                  Put to sell
                </div>
                <div className="modalBtn" onClick={async () => transfer()}>
                  Transfer
                </div>
                <InputClass
                  placeholder="Insert the address for transfer"
                  onChange={(e) => setAddressToTransfer(e.target.value)}
                  value={addressToTransfer}
                  type="text"
                />
              </div>
            </StarModal>
          </WrapperModal>
        )}
      </Header>
    </Wrapper>
  )
}

export default MyStars
