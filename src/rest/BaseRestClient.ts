import { BASE_URL, API_PREFIX } from "../config/constants";
import BaseClient from "../BaseClient";
import KeyFileConfig from "../config/KeyFileConfig";

class BaseRestClient extends BaseClient {
  constructor(configOrFilePath?: KeyFileConfig | string) {
    super(configOrFilePath);
    this.baseURL = `${BASE_URL}${API_PREFIX}`;
  }
}

export default BaseRestClient;
