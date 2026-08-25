import infra from "@/data/infra.json";

/**
 * The droplet, typed. One JSON file describes the machine, the containers on
 * it, the deploy path and what it costs, and the /infra page renders that file
 * rather than a hand-written description that drifts away from reality.
 *
 * `state` is the honesty switch. While it reads "provisioning" the page says
 * the box is not paid for yet and presents the setup as intended rather than
 * measured. Flipping it to "live" is the only edit needed once the droplet is
 * up.
 */

export type InfraState = "provisioning" | "live";

export interface InfraHost {
  provider: string;
  plan: string;
  region: string;
  os: string;
  vcpu: number;
  memoryGb: number;
  diskGb: number;
  transferTb: number;
  monthlyUsd: number;
  note: string;
}

export interface InfraService {
  name: string;
  image: string;
  purpose: string;
  port: number;
  memoryMb: number;
}

export interface InfraStep {
  step: string;
  detail: string;
}

export interface InfraCost {
  item: string;
  monthlyUsd: number;
  note: string;
}

export interface InfraConfig {
  state: InfraState;
  stateNote: string;
  host: InfraHost;
  services: InfraService[];
  pipeline: InfraStep[];
  monitoring: {
    tool: string;
    selfHosted: boolean;
    publicStatusUrl: string | null;
    note: string;
  };
  costs: InfraCost[];
  fallback: {
    summary: string;
    targets: { name: string; how: string; cost: number }[];
  };
}

export const INFRA = infra as InfraConfig;

/** What the containers ask for, before the kernel and Coolify take their share. */
export const RESERVED_MB = INFRA.services.reduce((sum, s) => sum + s.memoryMb, 0);

export const MONTHLY_USD = INFRA.costs.reduce((sum, c) => sum + c.monthlyUsd, 0);
