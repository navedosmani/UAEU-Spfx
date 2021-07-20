import * as React from 'react';
import * as ReactDom from 'react-dom';
import { Version } from '@microsoft/sp-core-library';
import {
  IPropertyPaneConfiguration,
  PropertyPaneDropdown,
  PropertyPaneTextField
} from '@microsoft/sp-property-pane';
import { BaseClientSideWebPart } from '@microsoft/sp-webpart-base';

import * as strings from 'CalendarWebPartStrings';
import Calendar from './components/Calendar';
import { ICalendarProps } from './components/ICalendarProps';

export interface ICalendarWebPartProps {
  description: string;
  language:string;
  numberOfRows:number;
}

export default class CalendarWebPart extends BaseClientSideWebPart<ICalendarWebPartProps> {

  public render(): void {
    const element: React.ReactElement<ICalendarProps> = React.createElement(
      Calendar,
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
