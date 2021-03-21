// @ts-ignore
import sketch from 'sketch/dom';
// @ts-ignore
import ui from 'sketch/ui';
// @ts-ignore
import BrowserWindow from 'sketch-module-web-view';
// @ts-ignore
import { getWebview } from 'sketch-module-web-view/remote';
import getStore from '../resources/store';
import convert from '../resources/convert';
import { APP_NAME } from '../resources/convert/constants';
const loadingWindowIdentifier = 'srm.loadingWindow';
export default (context) => {
    // get sketch document
    const document = sketch.getSelectedDocument();
    // get sketch selected page
    const page = document.selectedPage;
    // get sketch selected layers
    const selectedLayers = document.selectedLayers;
    // get sketch selected artboard
    //@ts-ignore
    const selectedArtboards = selectedLayers.layers.filter((layer) => {
        return layer.type === 'Artboard' && layer.selected;
    });
    // if artboard selected, run command
    if (selectedArtboards.length > 0) {
        // set base store
        let store;
        // set theme
        const theme = ui.getTheme();
        // set loading modal window
        const loadingWindow = new BrowserWindow({
            identifier: loadingWindowIdentifier,
            parent: document,
            modal: true,
            show: false
        });
        // load loading.html in loading modal
        loadingWindow.loadURL(require(`../resources/ui/loading.html`));
        // set loading window contents
        const loadingWebContents = loadingWindow.webContents;
        // display loading modal when loaded
        loadingWebContents.on('did-finish-load', () => {
            // set loading text based on theme
            loadingWebContents.executeJavaScript(`setLoadingColor('${theme}')`)
                .then(() => {
                // show loading window after text is styled
                loadingWindow.show();
                // get store when index loads
                getStore({
                    page: page,
                    artboards: selectedArtboards,
                    sketch: sketch
                })
                    // set plugin store && update loading text
                    .then((appStore) => {
                    store = appStore;
                    return loadingWebContents.executeJavaScript(`setLoadingText('Copying', 'Copying to clipboard')`);
                })
                    // convert store to btwix layers
                    .then(() => {
                    return convert({ artboards: store.artboards, images: store.images, sketch: sketch });
                })
                    // return btwix layers
                    .then((btwixLayers) => {
                    return loadingWebContents.executeJavaScript(`copyLayersToClipboard(${JSON.stringify(btwixLayers)})`);
                })
                    //
                    .then(() => {
                    loadingWindow.close();
                    ui.message(`Copied! Ready to be pasted in ${APP_NAME}`);
                });
            });
        });
        // make loading window closable
        loadingWebContents.on('escape', () => {
            loadingWindow.close();
        });
    }
    else {
        // if artboard not selected, alert user
        ui.alert('Invalid Selection', 'Select one or more artboard to copy.');
    }
};
export const onShutdown = () => {
    const existingLoadingWindow = getWebview(loadingWindowIdentifier);
    if (existingLoadingWindow) {
        existingLoadingWindow.close();
    }
};
