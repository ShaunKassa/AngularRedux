// Feel free to extend this interface
// depending on your app specific config.
export interface IConfig {
  API: string;
  AWS_ACCESS_KEY_ID: string;
  AWS_SECRET_ACCESS_KEY: string;
}

export const Config: IConfig = JSON.parse('<%= ENV_CONFIG %>');
