import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'NewsWebPartStrings';
import News from './components/News';
import { INewsProps } from './components/INewsProps';

export interface INewsWebPartProps {
  description: string;
  numberOfRows:number;
  language:string;
}

export default class NewsWebPart extends BaseClientSideWebPart<INewsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<INewsProps> = React.createElement(
      News,
      {
        description: this.properties.description,
        context:this.context,
        numberOfRows:this.properties.numberOfRows,
        language:this.properties.language
      }
    );

    ReactDom.render(element, this.domElement);
  }

  protected onDispose(): void {
    ReactDom.unmountComponentAtNode(this.domElement);
  }

  protected get dataVersion(): Version {
    return Version.parse('1.0');
  }

  protected getPropertyPaneConfiguration(): IPropertyPaneConfiguration {
    return {
      pages: [
        {
          header: {
            description: strings.PropertyPaneDescription
          },
          groups: [
            {
              groupName: strings.BasicGroupName,
              groupFields: [
                PropertyPaneTextField('description', {
                  label: strings.DescriptionFieldLabel
                }),
                PropertyPaneTextField('numberOfRows', {
                  label: 'Number of Rows'
                }),
                PropertyPaneDropdown('language', {
                  label: 'Language',
                  options: [{
                    key: 'English',
                    text: 'English'
                  },
                  {
                    key: 'Arabic',
                    text: 'Arabic'
                  }]
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
