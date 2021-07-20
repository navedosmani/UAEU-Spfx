import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'EventsWebPartStrings';
import Events from './components/Events';
import { IEventsProps } from './components/IEventsProps';

export interface IEventsWebPartProps {
  description: string;
  language:string;
  numberOfRows:number;
}

export default class EventsWebPart extends BaseClientSideWebPart<IEventsWebPartProps> {

  public render(): void {
    const element: React.ReactElement<IEventsProps> = React.createElement(
      Events,
      {
        description: this.properties.description,
        language:this.properties.language,
        context:this.context,
        numberOfRows:this.properties.numberOfRows
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
                }),
                PropertyPaneTextField('numberOfRows', {
                  label: 'Number of Rows'
                })
              ]
            }
          ]
        }
      ]
    };
  }
}
