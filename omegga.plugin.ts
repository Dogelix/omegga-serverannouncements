import { OmeggaPlugin, OL, PS, PC } from 'omegga';


// plugin config and storage
type Config = {
  announcements: string
};

interface AnnouncementSchedule {
  time: number;
  period: "mins" | "hours";
  message: string;
  offset?: number;
}

type Storage = {
  dogelixServerAnnouncements: AnnouncementSchedule[] | undefined;
};

// update checker constants
const PLUGIN_VERSION = '0.0.2';
const GITHUB_URL = 'https://github.com/Dogelix/omegga-serverannouncements';

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
    let announcements = await this.store.get('dogelixServerAnnouncements');

    if (announcements !== undefined) {
      await this.store.wipe();
    }

    const configAnnouncements = this.config.announcements;
    const configAnnouncementsJson: AnnouncementSchedule[] = JSON.parse(configAnnouncements);
    announcements = configAnnouncementsJson;

    this.store.set("dogelixServerAnnouncements", announcements);

    announcements?.map((announcement) => {
      this.setUpAnnouncement(announcement)
    })
  }

  setUpAnnouncement(announcement: AnnouncementSchedule): NodeJS.Timeout {
    const intervalMs = announcement.period === "mins" ? announcement.time * 60_000 : announcement.time * 60 * 60_000;
    return setTimeout(() => {
      setInterval(() => {
        const message = `[Announcement] ${announcement.message}`;
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
