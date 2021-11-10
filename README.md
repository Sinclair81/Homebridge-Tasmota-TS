# Homebridge-Tasmota-TS #

[![npm version](https://badge.fury.io/js/homebridge-tasmota-ts.svg)](https://badge.fury.io/js/homebridge-tasmota-ts)
[![donate](https://img.shields.io/badge/donate-PayPal-blue.svg)](https://www.paypal.me/Sinclair81)

<!-- markdownlint-disable MD033 -->
<img src="https://raw.githubusercontent.com/Sinclair81/Homebridge-Tasmota-TS/master/pic.png" align="right" alt="Gosund SP111 A V1.1" height="179" width="177">
<!-- markdownlint-enable MD033 -->

Control your WLan sockets that are flashed with the [Tasmota firmware](https://github.com/arendst/Tasmota).

__Type of Accessory:__

- Switch

## Installation ##

1. Install homebridge using: `sudo npm install -g --unsafe-perm homebridge`
2. Install homebridge-config-ui-x using: `sudo npm install -g --unsafe-perm homebridge-config-ui-x`
3. Update your configuration file with this guide: [smartapfel.de](https://smartapfel.de/homebridge/plugins-installieren/)
4. Install homebridge-tasmota-ts using: homebridge-config-ui-x's Webserver (Homebridge must be started with sudo for the installation.)
5. Update your configuration file with code like the sample below

## Homebridge-Tasmota-TS Main Configuration Parameters ##

Name                     | Value               | Required | Notes
------------------------ | ------------------- | -------- | ------------------------
`accessory`              | "Tasmota-TS"        | yes      | Must be set to "Tasmota-TS".
`name`                   | (custom)            | yes      | Name of accessory that will appear in homekit app.
`device`                 | "Generic"           | no       | A Device String e.g. "Gosund SP111 A V1.1" or "SMAHO WiFi Plug"
`ip`                     | "10.0.0.100"        | yes      | Must be set to the IP of your Tasmota Device.
`relais`                 | 1                   | no       | Relais Number - default is 1
`user`                   | "none"              | no       | Must be set to the WebUsername - default WebUsername = `admin`.
`password`               | "none"              | no       | Must be set to the WebPassword .
`updateInterval`         | 0                   | no       | Auto Update Interval in milliseconds, 0 = Off
`debugMsgLog`            | 0                   | no       | 1 - Displays messages of accessories in the log.
`type`                   | "switch"            | yes      | Type of Accessory: "switch"

```json
"accessories": [
    {
        "accessory": "Tasmota-TS",
        "name": "WLan socket 1",
        "device": "SMAHO WiFi Plug",
        "ip": "10.0.0.100",
        "updateInterval": 30000,
        "debugMsgLog": 1,
        "type": "switch"
    },
    {
        "accessory": "Tasmota-TS",
        "name": "WLan socket 2",
        "device": "Gosund SP111 A V1.1",
        "ip": "10.0.0.101",
        "relais": 1,
        "user": "admin",
        "password": "12345",
        "updateInterval": 30000,
        "debugMsgLog": 1,
        "type": "switch"
    }
    ]
```

The plugin that this one is based on: [Homebridge-Logo-TS](https://github.com/sinclair81/homebridge-logo-ts).  
You can also view the [full list of supported HomeKit Services and Characteristics in the HAP-NodeJS protocol repository](https://github.com/KhaosT/HAP-NodeJS/blob/master/src/lib/gen/HomeKit.ts).  

## Test Homebridge-Tasmota-TS ##

1. Download or clone Homebridge-Tasmota-TS.
2. Install: `$ npm install`
3. Build:   `$ npm run build`
4. Run:     `$ homebridge -D -P ~/Homebridge-Tasmota-TS`

## Flash Tasmota Firmware ##

- [Firmware Binary](https://github.com/arendst/Tasmota/releases)
- [NodeMCU-PyFlasher](https://github.com/marcelstoer/nodemcu-pyflasher)
- [Tasmota Firmware Wiki](https://tasmota.github.io/docs/#/installation/)
- [Power Monitoring](https://tasmota.github.io/docs/#/Commands?id=power-monitoring)
- Gosund SP111 A V1.1 - Tasmota Config:  
  `{"NAME":"Gosund SP111 A V1.1","GPIO":[57,255,56,255,132,134,0,0,131,17,0,21,0],"FLAG":0,"BASE":45}`
- SMAHO WiFi Plug - Tasmota Config:  
  `{"NAME":"SMAHO WiFi Plug","GPIO":[17,0,0,0,134,132,0,0,131,56,21,0,0],"FLAG":0,"BASE":18}`
- Set Voltage: `http://10.0.0.100/cm?cmnd=VoltageSet 230` [in Volt]
- Set CurrentSet: `http://10.0.0.100/cm?cmnd=CurrentSet 326` [in milli Amper]
- Set Power: `http://10.0.0.100/cm?cmnd=PowerSet 75` [in Watt]
- Disable status LED blinking during Wi-Fi and MQTT connection problems:  
  `http://10.0.0.100/cm?cmnd=SetOption31 1`
