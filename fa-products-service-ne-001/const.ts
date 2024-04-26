import { Context } from "@azure/functions";
import { Product } from "./types";
import { AppConfigurationClient } from '@azure/app-configuration';

export const products: Product[] = [{
  id: '001',
  title: 'Learn JS',
  description: 'This book will help you master JS',
  price: 200,
  count: 35,
}, {
  id: '003',
  title: 'Learn Azure',
  description: 'This book will help you become Azure expert',
  price: 150,
  count: 50,
}, {
  id: '002',
  title: 'Learn TS',
  description: 'Sharpen your TS skills with this book',
  price: 100,
  count: 75,
}];

export const getConfigFromConfigService = async (ctx: Context) => {

    // Create an App Config Client to interact with the service
    const connection_string = process.env.AZURE_APP_CONFIG_CONNECTION_STRING;
    const client = new AppConfigurationClient(connection_string);

    // Retrieve a configuration key
    const configs = await client.getConfigurationSetting({ key: 'MY_TEST_CONFIG_KEY' });
    ctx.log('configs::', configs);
}

export const pick = (obj, ...props) => {
  return props.reduce(function(result, prop) {
    if (typeof prop === "object") {
      console.log('prop::', prop);
      const key = Object.keys(prop)[0];
      result[prop[key]] = obj[key];
    } else {
      result[prop] = obj[prop];
    }
    return result;
  }, {});
};

export const omit = (obj, ...props) => {
  const result = { ...obj };
  props.forEach(function(prop) {
    delete result[prop];
  });
  return result;
};
