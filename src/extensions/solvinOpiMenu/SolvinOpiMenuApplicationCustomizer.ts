import { override } from '@microsoft/decorators';
import { Log } from '@microsoft/sp-core-library';
import {
  BaseApplicationCustomizer,
  PlaceholderContent,
  PlaceholderName
} from '@microsoft/sp-application-base';
import { Dialog } from '@microsoft/sp-dialog';

import * as strings from 'SolvinOpiMenuApplicationCustomizerStrings';

const LOG_SOURCE: string = 'SolvinOpiMenuApplicationCustomizer';

/**
 * If your command set uses the ClientSideComponentProperties JSON input,
 * it will be deserialized into the BaseExtension.properties object.
 * You can define an interface to describe it.
 */
export interface ISolvinOpiMenuApplicationCustomizerProperties {

}

/** A Custom Action which can be run during execution of a Client Side Application */
export default class SolvinOpiMenuApplicationCustomizer
  extends BaseApplicationCustomizer<ISolvinOpiMenuApplicationCustomizerProperties> {

  private _topPlaceholder: PlaceholderContent | undefined;

  @override
  public onInit(): Promise<void> {
    this.context.placeholderProvider.changedEvent.add(this, this._renderPlaceHolders);

    return Promise.resolve();
  }
  private _renderPlaceHolders(): void {

    // Handling the top placeholder
    if (!this._topPlaceholder) {
      this._topPlaceholder =
        this.context.placeholderProvider.tryCreateContent(
          PlaceholderName.Top,
          { onDispose: this._onDispose });

      if (this._topPlaceholder.domElement) {
        this._topPlaceholder.domElement.innerHTML = `<div style='height:50px;background-color:red;'>test</div>`;
      }

    }
  }
  private _onDispose(): void {
    console.log('[ApplicationCustomizer._onDispose] Disposed custom top and bottom placeholders.');
  }

}
