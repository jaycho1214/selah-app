import {
  Environment,
  Network,
  RecordSource,
  Store,
} from 'relay-runtime';
import { fetchGraphQL } from './network';

const network = Network.create(fetchGraphQL);
const store = new Store(new RecordSource());

export const environment = new Environment({
  network,
  store,
});
