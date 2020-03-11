// import { getProvider } from '@decentraland/web3-provider'
// import { getUserAccount } from '@decentraland/EthereumController'
import { OverlayUI } from './OverlayUI'
import { WSConnection } from './WebSocket'

let provider
let userAccount
let environment

export async function init(array) {
  try {
    provider = 'provider' // await getProvider()
    userAccount = 'userAccount' // await getUserAccount()

    environment = array

    log('provider/user account: ' + provider + ' / ' + userAccount)
  } catch (error) {
    log('provider/user account error: ' + error.toString())
  }
}

export function myProvider() {
  return provider
}

export function myUserAccount() {
  return userAccount
}

export function overalyUI(array) {
  engine.addSystem(new OverlayUI(array))
}

export function websocket(array) {
  new WSConnection(array)
}

export function environmentData() {
  return environment
}
