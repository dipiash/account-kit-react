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

  componentDidMount() {
    this.loadSDK()
  }

  loadSDK() {
    // Verify loaded script
    if (!document.querySelector('script[src*="https://sdk.accountkit.com"]')) {
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
    document.head.appendChild(tag)
  }

  initSDK() {
    try {
      const {appId, csrf, version} = this.props

      window.AccountKit.init({
        appId,
        state: csrf,
        version,
        fbAppEventsEnabled: false
      })
    } catch (e) {
      // FB Account SDK was initialized
    }
  }

  signIn() {
    this.initSDK()

    const {loginType, onResponse, countryCode, phoneNumber, emailAddress} = this.props;
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
    return this.props.children({
      onClick: this.signIn.bind(this)
    })
  }
}
