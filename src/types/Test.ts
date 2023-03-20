export interface logsData {
    _id: string,
    _createdAt: string,
    _updatedAt: string,
    ash: number,
    date: Date,
    id: string,
    owner:string,
    published:boolean,
    saved:boolean,
    storagePath:string,
    token:string,
    transactionID:string,
    voxelID:string,
    boosterID:string,
    tax:number,
    isLive:boolean,
    thumbnail:string,
    img:string,
    collection: string | undefined
  }

  export interface slotsData {
    mint: string,
    tax: number,
    size: number,
    _updatedAt: string,
    public: boolean,
    _id: string
  };

  export interface statesData {
    _id: string,
    holder: string,
    boosters:number,
    updatedAt: string
  };

  export interface usersData {
    id: string,
    total: number,
    ash:number,
    lastBurn: string
  };

  export interface globalData {
    total: number,
    ash:number
  };

  export interface ashData {
    price: number,
    total:number
  };