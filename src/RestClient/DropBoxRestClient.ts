import { ICloudStorageRestClient } from "./../RestClient/ICloudStorageRestClient"
import { FolderContent } from "./../ActionCreators/ActionsHub"
import * as Q from 'q';

export class DropBoxRestClient implements ICloudStorageRestClient {
   private _accessToken: string = "";

   // https://dropbox.github.io/dropbox-api-v2-explorer/#files_upload
   public uploadFile(path: string): void
   {
      let xhr = new XMLHttpRequest();
      let content = "Hello world!!!";
      let url = "https://content.dropboxapi.com/2/files/upload";
      xhr.open("POST", url, true);

      let fileData = {
        path: path,
      };
      let fileDataString = JSON.stringify(fileData);

      xhr.setRequestHeader("Authorization", "Bearer " + this._accessToken);
      xhr.setRequestHeader("Content-Type", "application/octet-stream");
      xhr.setRequestHeader("Dropbox-API-Arg", fileDataString);

      xhr.send(content);
   }

   // https://dropbox.github.io/dropbox-api-v2-explorer/#files_list_folder
   public getFolderContents(folder: FolderContent): Q.Promise<FolderContent>
   {
      let deferred = Q.defer<FolderContent>();

      let xhr = new XMLHttpRequest();
      let url = "https://api.dropboxapi.com/2/files/list_folder";
      xhr.open("POST", url, true);

      let fileData = {
        path: folder.path_lower,
        recursive: false,
        include_media_info: true,
        include_deleted: false,
        include_has_explicit_shared_members: false,
      };
      let content = JSON.stringify(fileData);

      xhr.setRequestHeader("Authorization", "Bearer " + this._accessToken);
      xhr.setRequestHeader("Content-Type", "application/json");

      xhr.onreadystatechange = function() {
        if (xhr.readyState == 4 && xhr.status == 200) {
          console.log(xhr.responseText);
          // Convert xhr.responseText to array of FolderContent object
          let contents = JSON.parse(xhr.responseText);

          folder.shouldFetchChildren = false;
          folder.children = contents.entries;

          deferred.resolve(folder);
        }
        else if (xhr.readyState == 4) {
          deferred.reject(new Error(xhr.responseText));
        }
      }

      xhr.send(content);
      return deferred.promise;
   }
}