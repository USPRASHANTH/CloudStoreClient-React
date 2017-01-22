///<reference path="./../../typings/index.d.ts"/>
///<reference path="./../../src/Stores/ExplorerStore.ts"/>

import { StoresHub } from "./../../src/Stores/StoresHub";
import { ExplorerState } from "./../../src/Stores/ExplorerStore";
import { ActionsHub, ChangeType, FolderContent } from "./../../src/ActionCreators/ActionsHub";

// To test Store functionality, invoke actions with appropriate payload and verify if the store's state and cache gets updated accordingly.

var getRootFolderContent = function(): FolderContent {
    let photosFolder = {
        children: undefined,
        path_display: "/Photos",
        path_lower: "/photos",
        name: "Photos",
        shouldFetchChildren: true,
    } as FolderContent;
    photosFolder[".tag"] = "folder";

    let spojFolder = {
        children: undefined,
        path_display: "/SPOJ",
        path_lower: "/spoj",
        name: "SPOJ",
        shouldFetchChildren: true,
    } as FolderContent;
    spojFolder[".tag"] = "folder";

    let readMeFile = {
        children: undefined,
        path_display: "/ReadMe.md",
        path_lower: "/readme.md",
        name: "ReadMe.md",
        shouldFetchChildren: false,
    } as FolderContent;
    readMeFile[".tag"] = "file";

    let rootFolder = {
        children: [ photosFolder, spojFolder, readMeFile ],
        path_display: "",
        path_lower: "",
        name: "",
        shouldFetchChildren: false,
    } as FolderContent;
    rootFolder[".tag"] = "folder";

    return rootFolder;
}

var getPhotosFolderContent = function(): FolderContent {
    let beachFolder = {
        children: undefined,
        path_display: "/Photos/Beach",
        path_lower: "/photos/beach",
        name: "Beach",
        shouldFetchChildren: true,
    } as FolderContent;
    beachFolder[".tag"] = "folder";

    let panaromaFile = {
        children: undefined,
        path_display: "/Photos/Panaroma.jpg",
        path_lower: "/photos/panaroma.jpg",
        name: "Panaroma.jpg",
        shouldFetchChildren: false,
        // ".tag": "file",
    } as FolderContent;
    panaromaFile[".tag"] = "file";

    let trekFolder = {
        children: undefined,
        path_display: "/Photos/Trek",
        path_lower: "/photos/trek",
        name: "Trek",
        shouldFetchChildren: true,
        // ".tag": "folder",
    } as FolderContent;
    trekFolder[".tag"] = "folder";

    let photosFolder = {
        children: [ beachFolder, trekFolder, panaromaFile ],
        path_display: "/Photos",
        path_lower: "/photos",
        name: "Photos",
        shouldFetchChildren: false,
        // ".tag": "folder",
    } as FolderContent;
    photosFolder[".tag"] = "folder";

    return photosFolder;
}

describe('Tests ExplorerStore', () => {
    it('Initial state returns root folder entry.', () => {
        // Arrange
        const explorerStore = StoresHub.getInstance().getExplorerStore();

        // Act
        const actualState = explorerStore.getState();

        // Assert
        expect(actualState.rootFolder.isFolder).toBe(true);
        expect(actualState.rootFolder.path_display).toBe("/");
        expect(actualState.rootFolder.children == null).toBe(true);
    });
    it('On handling FolderSelectionChangedAction the store state gets updated.', () => {
        // Arrange
        const explorerStore = StoresHub.getInstance().getExplorerStore();
        const actions = ActionsHub.getInstance().getActions();
        const rootFolder = getRootFolderContent();

        // Act
        actions.folderSelectionChangedAction(rootFolder);
        const actualState = explorerStore.getState();

        // Assert
        expect(actualState.rootFolder.isFolder).toBe(true);
        expect(actualState.rootFolder.path_display).toBe(rootFolder.path_display);
        expect(actualState.rootFolder.path_lower).toBe(rootFolder.path_lower);
        expect(actualState.rootFolder.name).toBe(rootFolder.name);
        expect(actualState.rootFolder.children.length).toBe(rootFolder.children.length);
        expect(actualState.rootFolder.children == rootFolder.children).toBe(true);

        expect(actualState.selectedFolder.isFolder).toBe(true);
        expect(actualState.selectedFolder.path_display).toBe(rootFolder.path_display);
        expect(actualState.selectedFolder.path_lower).toBe(rootFolder.path_lower);
        expect(actualState.selectedFolder.name).toBe(rootFolder.name);
        expect(actualState.selectedFolder.children.length === rootFolder.children.length).toBe(true);
        expect(actualState.selectedFolder.children == rootFolder.children).toBe(true);
    });
    it('On handling FolderSelectionChangedAction the store cache gets updated.', () => {
        // Arrange
        const explorerStore = StoresHub.getInstance().getExplorerStore();
        const actions = ActionsHub.getInstance().getActions();
        const rootFolder = getRootFolderContent();
        const expectedFolder = rootFolder.children[0];

        // Act
        actions.folderSelectionChangedAction(rootFolder);
        const cachedFolder = explorerStore.getFolderContentsFromCache(expectedFolder.path_lower);

        // Assert
        expect(cachedFolder.isFolder).toBe(expectedFolder[".tag"] === "folder");
        expect(cachedFolder.path_display).toBe(expectedFolder.path_display);
        expect(cachedFolder.path_lower).toBe(expectedFolder.path_lower);
        expect(cachedFolder.name).toBe(expectedFolder.name);
    });
    it('On handling FolderExpandedAction the store cache gets updated.', () => {
        // Arrange
        const explorerStore = StoresHub.getInstance().getExplorerStore();
        const actions = ActionsHub.getInstance().getActions();
        const rootFolder = getRootFolderContent();
        const photosFolder = getPhotosFolderContent();

        // Act
        actions.folderSelectionChangedAction(rootFolder);
        actions.folderSelectionChangedAction(photosFolder);
        let cachedFolder = explorerStore.getFolderContentsFromCache(photosFolder.path_lower);

        // Assert
        expect(cachedFolder.isExpanded).toBe(false);
        
        // Act
        photosFolder.isExpanded = true;
        actions.folderExpandedAction(photosFolder);
        cachedFolder = explorerStore.getFolderContentsFromCache(photosFolder.path_lower);

        // Assert
        expect(cachedFolder.isExpanded).toBe(true);
    });
});