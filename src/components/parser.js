const { parse } = require('dotenv');
const fs = require('fs');
const path = require('path');

module.exports = class Parser {
  constructor(configPath) {
    this.configPath = configPath;
    this.config = {};
  }

  async loadConfig() {
    if (!fs.existsSync(this.configPath)) {
      throw new Error('Config file not found');
    }

    const contents = await fs.promises.readFile(this.configPath, 'utf8');
    const result = parse(contents);

    if (result.error) {
      throw new Error(result.error);
    }

    this.config = result.parsed;
  }

  get(key) {
    return this.config[key];
  }

  set(key, value) {
    this.config[key] = value;
    this.saveConfig();
  }

  saveConfig() {
    const filePath = path.join(this.configPath);
    const configPath = path.dirname(filePath);

    if (!fs.existsSync(configPath)) {
      fs.mkdirSync(configPath, { recursive: true });
    }

    fs.writeFileSync(filePath, Object.keys(this.config).map(key => `${key}=${this.config[key]}`).join('\n'));
  }
};