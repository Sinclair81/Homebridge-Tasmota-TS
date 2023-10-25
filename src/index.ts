import { wait } from "./util/wait";
import { md5 } from "./util/md5";

import { SwitchAccessory }    from "./util/accessories/SwitchAccessory"
import { LightbulbAccessory } from "./util/accessories/LightbulbAccessory"
import { OutletAccessory }    from "./util/accessories/OutletAccessory"

const request = require('request');
const pjson   = require('../package.json');

let Service: any, Characteristic: any;

export default function(homebridge: any) {
  Service = homebridge.hap.Service;
  Characteristic = homebridge.hap.Characteristic;

  homebridge.registerAccessory("homebridge-tasmota-ts", "Tasmota-TS", TasmotaAccessory);
}

class TasmotaAccessory {
  // From config.
  log: Function;
  name: string;
  device: string;
  manufacturer: string;
  model: string;
  serialNumber: string
  firmwareRevision: string;
  ip: string;
  relais: number;
  user: string;
  password: string;
  updateInterval: number;
  debugMsgLog: number;
  type: string;
  typeName: string;

  // Runtime state.
  

  // Services exposed.
  serviceToExpose: any;
  infoService:     any;

  switchAccessory:    SwitchAccessory    | undefined;
  lightbulbAccessory: LightbulbAccessory | undefined;
  outletAccessory:    OutletAccessory    | undefined;

  constructor(log: any, config: any) {
    this.log            = log;
    this.name           = config["name"];
    this.device         = config["device"]         || "Generic";
    this.ip             = config["ip"];
    this.relais         = config["relais"]         || 1;
    this.user           = config["user"]           || "none";
    this.password       = config["password"]       || "none";
    this.updateInterval = config["updateInterval"] || 0;
    this.debugMsgLog    = config["debugMsgLog"]    || 0;
    this.type           = config["type"]           || SwitchAccessory.switchType;
    this.typeName       =                             SwitchAccessory.infoModel;

    /**************************
     * Tasmota Switch Service *
     **************************/

    if (this.type == SwitchAccessory.switchType) {
      this.typeName = SwitchAccessory.infoModel;

      this.switchAccessory = new SwitchAccessory(this.log, request, this.ip, this.relais, this.user, this.password, this.updateInterval, this.debugMsgLog, Characteristic);

      const switchService = new Service.Switch(
        null,
        SwitchAccessory.switchType,
      );

      switchService
        .getCharacteristic(Characteristic.On)
        .onGet(this.switchAccessory.getSwitchOn.bind(this))
        .onSet(this.switchAccessory.setSwitchOn.bind(this));

      this.serviceToExpose = switchService;

      this.switchAccessory.switchService = this.serviceToExpose;

    }

    /*****************************
     * Tasmota Lightbulb Service *
     *****************************/

    if (this.type == LightbulbAccessory.lightbulbType) {
      this.typeName = LightbulbAccessory.infoModel;

      this.lightbulbAccessory = new LightbulbAccessory(this.log, request, this.ip, this.relais, this.user, this.password, this.updateInterval, this.debugMsgLog, Characteristic);

      const lightbulbService = new Service.Lightbulb(
        null,
        LightbulbAccessory.lightbulbType,
      );

      lightbulbService
        .getCharacteristic(Characteristic.On)
        .onGet(this.lightbulbAccessory.getLightbulbOn.bind(this))
        .onSet(this.lightbulbAccessory.setLightbulbOn.bind(this));

      this.serviceToExpose = lightbulbService;

      this.lightbulbAccessory.lightbulbService = this.serviceToExpose;

    }

    /**************************
     * Tasmota Outlet Service *
     **************************/

    if (this.type == OutletAccessory.outletType) {
      this.typeName = OutletAccessory.infoModel;

      this.outletAccessory = new OutletAccessory(this.log, request, this.ip, this.relais, this.user, this.password, this.updateInterval, this.debugMsgLog, Characteristic);

      const outletService = new Service.Outlet(
        null,
        OutletAccessory.outletType,
      );

      outletService
        .getCharacteristic(Characteristic.On)
        .onGet(this.outletAccessory.getOutletOn.bind(this))
        .onSet(this.outletAccessory.setOutletOn.bind(this));

      this.serviceToExpose = outletService;

      this.outletAccessory.outletService = this.serviceToExpose;

    }

    /*****************************************
     * Tasmota Accessory Information Service *
     *****************************************/

    this.manufacturer     =  config["manufacturer"]     || pjson.author.name;
    this.model            =  config["model"]            || this.typeName + " @ " + this.device;
    this.serialNumber     =  config["serialNumber"]     || md5(this.name + this.typeName);
    this.firmwareRevision =  config["firmwareRevision"] || pjson.version;
    
  }

  getServices() {

    var informationService = new Service.AccessoryInformation();
    informationService
      .setCharacteristic(Characteristic.Manufacturer,     this.manufacturer)
      .setCharacteristic(Characteristic.Model,            this.model)
      .setCharacteristic(Characteristic.Name,             this.name)
      .setCharacteristic(Characteristic.SerialNumber,     this.serialNumber)
      .setCharacteristic(Characteristic.FirmwareRevision, this.firmwareRevision);

    return [ informationService, this.serviceToExpose ];
  }

  /********************
   * Helper Functions *
   ********************/

  debugLogNum(msg: string, num: number) {
    if (this.debugMsgLog == 1) {
      this.log(msg, num);
    }
  }
  debugLogBool(msg: string, bool: boolean) {
    if (this.debugMsgLog == 1) {
      this.log(msg, bool);
    }
  }

}