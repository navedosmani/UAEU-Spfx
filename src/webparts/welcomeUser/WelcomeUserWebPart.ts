import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'WelcomeUserWebPartStrings';
import WelcomeUser from './components/WelcomeUser';
import { IWelcomeUserProps } from './components/IWelcomeUserProps';

export interface IWelcomeUserWebPartProps {
  description: string;
  language:string;
}

export default class WelcomeUserWebPart extends BaseClientSideWebPart<IWelcomeUserWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IWelcomeUserProps> = React.createElement(
      WelcomeUser,
      {
        description: this.properties.description,
        language:this.properties.language,
        context:this.context
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
