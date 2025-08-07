import { OmeggaPlugin, OL, PS, PC, OmeggaPlayer } from 'omegga';
import fs from 'fs';
import fetch from 'node-fetch';


// plugin config and storage
type Config = {
  announcements: string
};

interface AnnouncementSchedule {
  time: number;
  period: "mins" | "hours";
  message: string;
}

type Storage = {
  dogelixServerAnnouncements: AnnouncementSchedule[] | undefined;
};

// update checker constants
const PLUGIN_VERSION = '0.0.1';
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

    announcements?.map(async (announcement) => {
      this.announcementTimeouts.push(await this.setUpAnnouncement(announcement));
    })
  }

  async setUpAnnouncement(announcement: AnnouncementSchedule): Promise<NodeJS.Timeout> {
    const intervalMs = announcement.period === "mins" ? announcement.time * 60_000 : announcement.time * 60 * 60_000;
    console.log("intervalMs for message " + announcement.message, intervalMs);

    return setInterval(() => {
      const message = `[Announcement] ${announcement.message}`;
      console.log(message);
      this.omegga.broadcast(message);
    }, intervalMs);
  }


  async stop() {
    this.announcementTimeouts.map((timeout) => {
      clearTimeout(timeout);
    });
  }
}
