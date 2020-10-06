import getArtboard from './artboard';
import getAssets from './assets';

interface GetStoreOptions {
  page: srm.Page;
  artboards: srm.Artboard[];
  sketch: srm.Sketch;
}

const getStore = ({ page, artboards, sketch }: GetStoreOptions): Promise<srm.AppStore> => {
  return new Promise((resolve, reject) => {
    // create new page for clean asset generation
    const srmPage = new sketch.Page({
      name: `srm.page`,
      parent: page.parent
    });
    const promises: Promise<srm.ProcessedArtboard>[] = [];
    artboards.forEach((artboard) => {
      promises.push(new Promise((resolve, reject) => {
        // duplicate selected artboard and set on new page
        const srmArtboard: srm.Artboard = artboard.duplicate();
        srmArtboard.parent = srmPage;
        srmArtboard.background.includedInExport = true;
        getArtboard({
          artboard: srmArtboard,
          sketch: sketch,
          page: page
        })
        .then(() => {
          return getAssets({
            page: srmPage,
            artboard: srmArtboard,
            sketch: sketch
          });
        })
        .then(images => {
          resolve({
            artboard: srmArtboard,
            images: images
          });
        });
      }));
    });
    Promise.all(promises).then((data) => {
      srmPage.remove();
      page.selected = true;
      const finalStore = data.reduce((result: srm.AppStore, current) => {
        return {
          artboards: [...result.artboards, current.artboard],
          images: { ...result.images, ...current.images }
        }
      }, { artboards: [], images: {} });
      resolve(finalStore);
    });
  });
};

export default getStore;