import {PureComponent} from 'react'
import PropTypes from 'prop-types'

import { AccountKitLoginType } from './AccountKitLoginType'

export default class AccountKit extends PureComponent {
  static propTypes = {
    csrf: PropTypes.string.isRequired,
    appId: PropTypes.string.isRequired,
    version: PropTypes.string.isRequired,
    loginType: PropTypes.oneOf([
      AccountKitLoginType.PHONE,
      AccountKitLoginType.EMAIL
    ]),
    language: PropTypes.string,
    countryCode: PropTypes.string,
    phoneNumber: PropTypes.string,
    emailAddress: PropTypes.string,
    children: PropTypes.func.isRequired,
    onResponse: PropTypes.func.isRequired
  };

  static defaultProps = {
    language: 'en_US',
    loginType: AccountKitLoginType.PHONE
  };

  state = {
    err: null,
    initialized: false
  }

  constructor(props) {
    super(props)

    this.handleSignIn = this.signIn.bind(this)
  }

  componentDidMount() {
    this.loadSDK()
  }

  loadSDK() {
    // Verify loaded script
    if (document.querySelector('script[src*="https://sdk.accountkit.com"]')) {
      this.setState({initialized: true})
      return
    }

    const {language} = this.props

    const tag = document.createElement('script')
    tag.setAttribute(
      'src',
      `https://sdk.accountkit.com/${language}/sdk.js`
    )
    tag.setAttribute('id', 'account-kit')
    tag.setAttribute('type', 'text/javascript')
    tag.onload = () => this.initSDK()

    document.head.appendChild(tag)
  }

  initSDK() {
    const {appId, csrf, version} = this.props
    let timer = null

    const initialization = () => {
      clearTimeout(timer)
      timer = setTimeout(() => {
        if (window.AccountKit && !window.AccountKit.doNotLinkToSDKDirectly) {
          try {
            window.AccountKit.init({
              appId,
              state: csrf,
              version,
              fbAppEventsEnabled: false
            })
            this.setState({initialized: true})
          } catch (err) {
            this.setState({err, initialized: false})
          }
        } else {
          initialization()
        }
      }, 300)
    }

    initialization()
  }

  signIn() {
    const {err, initialized} = this.state

    if (err || !initialized) {
      console.warn('Authorization is temporarily unavailable')
      return
    }

    const {loginType, onResponse, countryCode, phoneNumber, emailAddress} = this.props
    const options = {}

    if (countryCode) {
      options.countryCode = countryCode
    }

    if (loginType === AccountKitLoginType.PHONE && phoneNumber) {
      options.phoneNumber = phoneNumber
    } else if (loginType === AccountKitLoginType.EMAIL && emailAddress) {
      options.emailAddress = emailAddress
    }

    window.AccountKit.login(loginType, options, resp => onResponse(resp));
  }

  render() {
    const {err, initialized} = this.state

    return this.props.children({
      onClick: this.handleSignIn,
      err,
      initialized
    })
  }
}
