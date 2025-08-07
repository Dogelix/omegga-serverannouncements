import { OmeggaPlugin, OL, PS, PC, OmeggaPlayer } from 'omegga';
import fs from 'fs';
import fetch from 'node-fetch';


// plugin config and storage
type Config = {
  announcements: string
};

interface AnnouncmentSchedule {
  time: number;
  period: "mins" | "hours";
  message: string;
}

type Storage = {};

// update checker constants
const PLUGIN_VERSION = '0.0.1';
const GITHUB_URL = 'https://api.github.com/repos/joksulainen/omegga-rolelogger/releases/latest';

export default class Plugin implements OmeggaPlugin<Config, Storage> {
  omegga: OL;
  config: PC<Config>;
  store: PS<Storage>;
  updateCheckerInterval: NodeJS.Timeout;

  constructor(omegga: OL, config: PC<Config>, store: PS<Storage>) {
    this.omegga = omegga;
    this.config = config;
    this.store = store;
  }

  async init() {
  }


  async stop() {
  }
}
