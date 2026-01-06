import { OmeggaPlugin, OL, PS, PC } from 'omegga';


// plugin config and storage
type Config = {
  announcements: string;
  serverColor: string;
  customColor: string;
};

interface AnnouncementSchedule {
  time: number;
  period: "mins" | "hours";
  message: string;
  offset?: number;
}

type Storage = {
  dogelixServerAnnouncements: AnnouncementSchedule[] | undefined;
  serverColor: string
};

// update checker constants
const PLUGIN_VERSION = '0.0.2';
const GITHUB_URL = 'https://github.com/Dogelix/omegga-serverannouncements';

/*
"#000000" black,
"#ffffff" white,
"#ffe600" yellow, 
"#ff8800ff" orange, 
"#1100ffff" blue,
custom
*/

export default class Plugin implements OmeggaPlugin<Config, Storage> {
  omegga: OL;
  config: PC<Config>;
  store: PS<Storage>;
  updateCheckerInterval: NodeJS.Timeout;
  announcementTimeouts: NodeJS.Timeout[];

  constructor(omegga: OL, config: PC<Config>, store: PS<Storage>) {
    this.omegga = omegga;
    this.config = config;
    this.store = store;
  }

  async init() {
    console.log("init started");
    let announcements = await this.store.get('dogelixServerAnnouncements');

    if (announcements !== undefined) {
      await this.store.wipe();
    }

    switch(this.config.serverColor){
       case "black": {
        this.store.set("serverColor", "#000000");
        break;
      }
      case "white": {
        this.store.set("serverColor", "#ffffff");
        break;
      }
      case "yellow": {
        this.store.set("serverColor", "#ffe600");
        break;
      }
      case "orange": {
        this.store.set("serverColor", "#ff8800ff");
        break;
      }
      case "blue": {
        this.store.set("serverColor", "#1100ffff");
        break;
      }
      case "custom": {
        this.store.set("serverColor", this.config.customColor);
        break;
      }
    }

    
    console.log("announcements colour: " + await this.store.get("serverColor"));

    const configAnnouncements = this.config.announcements;
    const configAnnouncementsJson: AnnouncementSchedule[] = JSON.parse(configAnnouncements);
    console.log("configAnnouncementsJson",configAnnouncementsJson);
    announcements = configAnnouncementsJson;

    this.store.set("dogelixServerAnnouncements", announcements);

    announcements?.map((announcement) => {
      this.setUpAnnouncement(announcement)
    })
  }

  setUpAnnouncement(announcement: AnnouncementSchedule): NodeJS.Timeout {
    const intervalMs = announcement.period === "mins" ? announcement.time * 60_000 : announcement.time * 60 * 60_000;
    return setTimeout(() => {
      setInterval(async () => {
        const message = `[<b><color="${await this.store.get("serverColor")}">Announcement</></>] ${announcement.message}`;
        console.log(message);
        this.omegga.broadcast(message);
      }, intervalMs);
    }, announcement.offset ? announcement.offset * 60_000 : 0);
  }


  async stop() {
    // this.announcementTimeouts.map((timeout) => {
    //   clearTimeout(timeout);
    // });
  }
}
