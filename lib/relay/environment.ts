import { Environment, Network, RecordSource, Store } from "relay-runtime";
import { fetchGraphQL } from "./network";

const network = Network.create(fetchGraphQL);
const store = new Store(new RecordSource(), { gcReleaseBufferSize: 10 });

export const environment = new Environment({
  network,
  store,
});
