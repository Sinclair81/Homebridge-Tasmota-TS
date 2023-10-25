import { wait } from "../wait";

let Characteristic: any;

export class OutletAccessory {

  static outletType: string = "outlet";
  static infoModel: string  = "Outlet";

  public outletService: any;

  log: Function;
  request: any;
  ip: string;
  relais: number;
  user: string;
  password: string;
  updateInterval: number;
  debugMsgLog: number;
  updateTimer: any;

  constructor(log: Function,
              request: any,
              ip: string,
              relais: number,
              user: string,
              password: string,
              updateInterval: number,
              debugMsgLog: number,
              characteristic: any
              ) {

    this.log            = log;
    this.request        = request;
    this.ip             = ip;
    this.relais         = relais;
    this.user           = user;
    this.password       = password;
    this.updateInterval = updateInterval;
    this.debugMsgLog    = debugMsgLog;
    Characteristic      = characteristic;

    if (this.updateInterval > 0) {
      this.outletAutoUpdate();
    }

  }

  //
  // Tasmota Outlet Service
  //

  getOutletOn = async () => {
  
    // Cancel timer if the call came from the Home-App and not from the update interval.
    // To avoid duplicate queries at the same time.
    if (this.updateInterval > 0) {
      clearTimeout(this.updateTimer);
      this.updateTimer = 0;
    }

    let userPasswordString = ((this.user != "none") && (this.password != "none")) ? "user=" + this.user + "&password=" + this.password + "&" : "";

    let requestString = "http://" + this.ip + "/cm?" + userPasswordString + "cmnd=Power" + String(this.relais) + " Status";

    this.request(requestString, async (error: any, res: { statusCode: number; }, body: string) => {
        if (error) {
          let errorString = error.toString();
          let hosteUnreach = errorString.includes("EHOSTUNREACH");
          if (!hosteUnreach) {
            this.log(`error: : ${error}`);
          }
        } else {

          if (res.statusCode == 200) {
            let obj = JSON.parse(body.toLowerCase());
            
            const on = this.checkReturnJSON(obj);
            this.debugLogBool("Outlet ?", on);

            await wait(1);

            this.outletService.updateCharacteristic(
              Characteristic.On,
              on as boolean
            );

            if (obj.warning) {
              this.log("Warning: " + obj.warning);
            }

          }

          if (this.updateInterval > 0) {
            this.outletAutoUpdate();
          }

        }

      }
    );

    return false;

  };

  setOutletOn = async (on: boolean) => {
    this.debugLogBool("Set outlet to", on);

    let onString = on == true ? "On" : "Off";

    let userPasswordString = ((this.user != "none") && (this.password != "none")) ? "user=" + this.user + "&password=" + this.password + "&" : "";

    let requestString = "http://" + this.ip + "/cm?" + userPasswordString + "cmnd=Power" + String(this.relais) + " " + onString;

    this.request(requestString, async (error: any, res: { statusCode: number; }, body: string) => {
        if (error) {
          this.log(`error: : ${error}`);
        } else {

          if (res.statusCode == 200) {
            let obj = JSON.parse(body.toLowerCase());
            
            const on = this.checkReturnJSON(obj);
            this.debugLogBool("Outlet ?", on);

            await wait(1);

            this.outletService.updateCharacteristic(
              Characteristic.On,
              on as boolean
            );

            if (obj.warning) {
              this.log("Warning: " + obj.warning);
            }

          }

          if (this.updateInterval > 0) {
            this.outletAutoUpdate();
          }

        }

      }
    );

  };

  //
  // Helper Functions
  //

  checkReturnJSON(obj: any): boolean { 
    let on = false;
    if (obj.hasOwnProperty('power')){
      on = obj.power == "on" ? true : false;
    }
    if (obj.hasOwnProperty('power1')){
      on = obj.power1 == "on" ? true : false;
    }
    if (obj.hasOwnProperty('power2')){
      on = obj.power2 == "on" ? true : false;
    }
    if (obj.hasOwnProperty('power3')){
      on = obj.power3 == "on" ? true : false;
    }
    if (obj.hasOwnProperty('power4')){
      on = obj.power4 == "on" ? true : false;
    }
    if (obj.hasOwnProperty('power5')){
      on = obj.power5 == "on" ? true : false;
    }
    if (obj.hasOwnProperty('power6')){
      on = obj.power6 == "on" ? true : false;
    }
    if (obj.hasOwnProperty('power7')){
      on = obj.power7 == "on" ? true : false;
    }
    if (obj.hasOwnProperty('power8')){
      on = obj.power8 == "on" ? true : false;
    }
    if (obj.hasOwnProperty('power9')){
      on = obj.power9 == "on" ? true : false;
    }
    return on;
  }

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

  outletAutoUpdate() {

    this.updateTimer = setTimeout(() => {

      this.getOutletOn();

    }, this.updateInterval + Math.floor(Math.random() * 10000));

  }

}