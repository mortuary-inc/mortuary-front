import { doc, getDocs, getDoc, setDoc, updateDoc, query, where, limit, orderBy, increment, writeBatch } from '@firebase/firestore'
import { logsCollection, plotsCollection, statesCollection, globalCollection, usersCollection, storage, firestore, ashCollection } from 'apiFire'
import { INFTData } from 'features/NFT/api/NFTModel'
import { INecrologyData, computeNecrologyStat } from 'features/Necrology/api/NecrologyModel2';

export async function getNecroWithOwner(wallet) {
  const q = query(logsCollection, where("owner", "==", wallet), limit(25))
  // Hover over books and see it's typed!
  const querySnapshot = await getDocs(q);
  const newUserDataArray = querySnapshot.docs
    .map((doc, i) => ({ ...doc.data() }));
  console.log(newUserDataArray);
}

/* getNecro is use for the Necrology page only */
export const getPlotStats = async (plot: string) => {
  //export async function getNecro() {
  try {
    const q = query(logsCollection, where("voxelID", "==", plot))
    const querySnapshot = await getDocs(q);
    const snapshot = querySnapshot.docs
      .map((doc, i) => ({ ...doc.data() }));
    let stats = computeNecrologyStat(snapshot);
    return stats;

  } catch (e) {
    console.error(e);
    throw e;
  }
}


/* getNecro is use for the Necrology page only */
export const getNecro = async (limitN: number): Promise<INecrologyData[]> => {
  //export async function getNecro() {
  try {
    const q = query(logsCollection, limit(limitN), orderBy("date", "desc"))
    const querySnapshot = await getDocs(q);
    const snapshot = querySnapshot.docs
      .map((doc, i) => ({ ...doc.data() }));
    //console.log(snapshot);
    return snapshot;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const getNecroPaginate = async (itemPerTable: number): Promise<INecrologyData[]> => {
  try {
    const q = query(logsCollection, orderBy("date", "desc"), limit(itemPerTable))
    const querySnapshot = await getDocs(q);
    const snapshot = querySnapshot.docs
      .map((doc, i) => ({ ...doc.data() }));
    return snapshot;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const getNecroData = async (onCurrentUser: boolean, viewWallet: string): Promise<INecrologyData[]> => {
  if (onCurrentUser && !viewWallet) return [];
  try {
    const q = query(logsCollection, where("owner", "==", viewWallet), orderBy("date", "desc"), limit(15))
    const querySnapshot = await getDocs(q);
    const snapshot = querySnapshot.docs
      .map((doc, i) => ({ ...doc.data() }));
    return snapshot;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const getNecroStats = async (mint) => {
  //export async function getNecro() {
  try {
    //const q = query(logsCollection, limit(200))
    const q = query(logsCollection, where("owner", "==", mint))
    // Hover over books and see it's typed!
    const querySnapshot = await getDocs(q);
    const snapshot = querySnapshot.docs
      .map((doc, i) => ({ ...doc.data() }));
    return snapshot;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export const createBurnLog = async (
  nft: INFTData,
  imageID: string | undefined,
  ownerAddress: string,
  published: boolean,
  saved: boolean,
  txSignature: string,
  voxel: string,
  ash: number,
  tax: number,
  taxCollector: string,
  boosterMintID: string
) => {
  const logRef = doc(logsCollection, nft.metadata.mint.toBase58())
  //console.log("Creating" + nft.metadata.mint.toBase58() + " Owner: " + ownerAddress + " / Content: " +nft);
  return (await setDoc(logRef, {
    _id: nft.metadata.mint.toBase58(),
    _createdAt: new Date().toISOString(),
    _updatedAt: new Date().toISOString(),
    ash: ash,
    date: new Date(),
    id: nft.name || "",
    owner: ownerAddress,
    saved: true,
    published: false,
    storagePath: "",
    token: nft.metadata.mint.toBase58(),
    transactionID: txSignature,
    voxelID: voxel,
    boosterID: boosterMintID,
    tax: tax,
    isLive: false,
    thumbnail: "",
    collection: nft.collectionMetadata?.data.name || "",
    img: nft.image || ""
  }).then(async () => {
    console.log("Document successfully written! Owner: " + ownerAddress + " / " + taxCollector);

    // Get a new write batch
    const batch = writeBatch(firestore);
    const globalRef = doc(globalCollection, "/logs")
    const userRef = doc(usersCollection, ownerAddress)
    // Set the value of 'NYC'
    let total = 0
    if (tax > 0 && !null) {
      total = tax + ash
    } else {
      total = ash
    }
    batch.set(globalRef, {
      total: increment(1),
      ash: increment(total)
    }, { merge: true });
    console.log("Update global: +" + total + "$ASH");

    batch.set(userRef, {
      id: ownerAddress,
      total: increment(1),
      ash: increment(ash),
      lastBurn: String(new Date())
    }, { merge: true });
    console.log("Update " + ownerAddress + ": +" + ash + "$ASH");

    if (tax > 0 && !null) {
      if (taxCollector != "") {
        const collectorRef = doc(usersCollection, taxCollector)
        batch.set(collectorRef, {
          ash: increment(tax)
        }, { merge: true });
        console.log("Update " + taxCollector + ": +" + tax + "$ASH");
      }
    }
    // Commit the batch
    await batch.commit();

  })
    .catch(function (error) {
      console.error("Error writing document: ", error);
    }));
};


export async function savePlotsStates(mint, tax, isPublic, size) {
  const plotsRef = doc(plotsCollection, mint)
  try {
    let res = await setDoc(plotsRef, {
      _id: mint,
      mint: mint,
      tax: tax,
      size: size,
      _updatedAt: new Date().toISOString(),
      public: isPublic,
    })
    return res;
  } catch (e) {
    console.error('Failed to save plot state ' + mint, e);
  }
}

export async function updatePlotsStates(mint, isPublic) {
  const plotsRef = doc(plotsCollection, mint)
  try {
    let res = await updateDoc(plotsRef, {
      _updatedAt: new Date().toISOString(),
      public: isPublic
    })
    return res;
  } catch (e) {
    console.error('Failed to save plot state ' + mint, e);
  }
}

export type firestorePlotsStates = {
  mint: string;
  holder: string;
  boosters: number;
};

export async function getPlotsStates() {
  try {
    const q = query(statesCollection, limit(2500))
    // Hover over books and see it's typed!
    const querySnapshot = await getDocs(q);
    const snapshot = querySnapshot.docs
      .map((doc, i) => ({ ...doc.data() }));
    let data = snapshot.map((doc) => {
      let mint = doc._id;
      let vi: firestorePlotsStates = {
        mint: mint,
        boosters: doc.boosters,
        holder: doc.holder,
      };
      return vi
    });
    return data;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function createPlotsState(mint, holder, boosters) {
  const statesRef = doc(statesCollection, mint)
  try {
    let res = await setDoc(statesRef, {
      _id: mint,
      holder: holder,
      boosters: boosters,
      updatedAt: new Date().toISOString()
    })
    return res;
  } catch (e) {
    console.error('Failed to create plot state ' + mint, e);
  }
}

export async function getBigBurner() {
  try {
    const q = query(usersCollection, limit(1), orderBy("total", "desc"))
    // Hover over books and see it's typed!
    const querySnapshot = await getDocs(q);
    const snapshot = querySnapshot.docs[0]
    return snapshot.data().id;
  } catch (e) {
    console.error(e);
    throw e;
  }
}

export async function getAshData() {
  try {
    const q = doc(ashCollection, "/ash")
    // Hover over books and see it's typed!
    const x = await getDoc(q);
    let z = {
      price: x.data()?.price || 0,
      total: x.data()?.total || 0
    }
    return z
  } catch (e) {
    console.error(e);
    throw e;
  }
}