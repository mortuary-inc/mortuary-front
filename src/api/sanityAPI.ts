
export interface IListenSanity {
  type: string;
  fields?: string;
}

export enum ETransitionListenSanity {
  UPDATE = 'update',
  CREATE = 'appear',
}

export interface IReadSanity {
  type: string;
  fields: string;
  order?: string;
  more_filter?: string;
  limit?: string;
}

export interface IUpdateSanity {
  _id: string;
  fields: {};
}

export type SanityPlotsStates = {
  mint: string;
  holder: string;
  boosters: number;
};
