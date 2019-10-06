import React, { Component } from 'react'

import AccountKit, {AccountKitLoginType} from 'account-kit-react'

export default class App extends Component {
  render () {
    return (
      <div>
        <p>Valid initialization id sequence but app is not registered in FB</p>
        <AccountKit
          appId='123'
          version='v1.1'
          onResponse={res => {
            console.log(res)
          }}
          csrf={'fdhuy7721-46d7-1937-2556-da8c134e45eb'}
          countryCode={'+7'}
          phoneNumber={''}
          loginType={AccountKitLoginType.PHONE}
          language='ru_RU'
        >
          {({onClick, err, initialized}) => (<button onClick={onClick} disabled={!initialized || err}>Phone auth</button>)}
        </AccountKit>
      </div>
    )
  }
}
