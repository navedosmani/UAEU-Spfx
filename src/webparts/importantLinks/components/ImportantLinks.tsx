import * as React from "react";
import styles from "./ImportantLinks.module.scss";
import { IImportantLinksProps } from "./IImportantLinksProps";
import { sp, Web } from "sp-pnp-js";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontIcon } from "office-ui-fabric-react";
import axios from "axios";
import { Scrollbars } from "react-custom-scrollbars";

const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 6,
    backgroundColor: "grey",
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

export interface ImpLinksState {
  ImpLinkListName: string;
  ImpLinkListData: any;
  search: string;
  searchContent: any;
  primaryColor: string;
  selectedLng: string;
  role: string;
}
export default class ImportantLinks extends React.Component<
  IImportantLinksProps,
  ImpLinksState
> {
  constructor(props) {
    super(props);
    this.state = {
      ImpLinkListName: "ImportantLinks",
      ImpLinkListData: [],
      search: null,
      searchContent: [],
      primaryColor: "#052942",
      selectedLng: this.props.language.toUpperCase(),
      role: "student",
    };
  }

  componentDidMount() {
  
    let webUrl = this.props.context.pageContext.web.absoluteUrl
      .toLowerCase()
      .split("/");
    let arbaicSite = webUrl.filter((search) => {
      return search == "ar";
    });
    if (arbaicSite.length > 0)
      this.setState({
        selectedLng: "ARABIC",
      });
    let user = this.props.context.pageContext.user;
    let webObject = new Web(this.props.context.pageContext.site.absoluteUrl);
    this.GetThemeAndUserConfiguration();

    webObject.lists
      .getByTitle(this.props.listName)
      .items.get()
      .then((result) => {
        this.setState({
          ImpLinkListData: result,
        });
      });
  }

  public render(): React.ReactElement<IImportantLinksProps> {
    // document.documentElement.style.setProperty('--primaryColor', this.state.primaryColor);
    this.FixScrollBarMargin();
    if (this.state.selectedLng != "ENGLISH") {
      if (document.getElementsByClassName(styles.ImportantLinks)[0]) {
        document
          .getElementsByClassName(styles.ImportantLinks)[0]
          .classList.add(styles.ImportantLinksTextAlign);
      }
    }
    let combinedStyle = [styles.ImportantLinks, styles.importantLinksBlue];

    return (
      <div id="ImpLinksRoot" className={combinedStyle.join(" ")}>
        <h5>
          {this.state.selectedLng == "ENGLISH"
            ? "Important Links"
            : "روابط مهمة"}
        </h5>
        <hr></hr>
        {this.state.ImpLinkListData.length > 0 && this.ConstructImpLinks()}
      </div>
    );
  }

  ConstructImpLinks() {
    let childElement = [],
      parentElement = [];

    let columnNameExtension =
      this.state.selectedLng == "ENGLISH" ? "" : "Arabic";
    this.state.ImpLinkListData.map((eachLink) => {
      // let roleType =
      //   this.state.role.toLowerCase() == "student" ? "Student" : "Faculty";
      let roleType =
        this.state.role.toLowerCase() == "student"
          ? "Student"
          : this.state.role.toLowerCase() == "faculty"
          ? "Faculty"
          : "Employee";
      if (eachLink["Role"] == null || eachLink["Role"].includes(roleType))
        childElement.push(
          <a href={eachLink.NavigationURL} target="_blank">
            <FontIcon iconName={"Forward"} className={styles.fontIconStyle} />{" "}
            {eachLink["Title" + columnNameExtension]}
          </a>
        );
    });
    parentElement.push(
      <div style={{ height: "553px" }} className={styles.ImpLinks}>
        <Scrollbars
          className="arabic-scrollbar"
          id="ImpLinksScrollDiv"
          universal={true}
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          renderThumbVertical={renderThumb}
        >
          {childElement}
        </Scrollbars>
      </div>
    );

    return parentElement;
  }

  GetThemeAndUserConfiguration() {
 
    let user = this.props.context.pageContext.user;

    let web = new Web(this.props.context.pageContext.site.absoluteUrl);
    let intervalCall = setInterval(() => {
      let userConfigListObject = web.lists.getByTitle("UserBasedConfiguration");
      userConfigListObject.items
        .filter("UserEmail eq '" + user.loginName + "'")
        .get()
        .then((result) => {
          if (result.length > 0) {
            this.setState(
              {
                role: result[0].DefaultRole, //result[0].DefaultRole==null?'Student':result[0].DefaultRole
              },
              () => {
                clearInterval(intervalCall);
              }
            );
          }
        });
    }, 2000);
  }
  FixScrollBarMargin() {
    let arrayOfScrollElemtId = ["ImpLinksScrollDiv"];
    arrayOfScrollElemtId.map((elem) => {
      if (document.getElementById(elem) != null) {
        let elementChildDiv = document.getElementById(elem)
          .children[0] as HTMLElement;
        if (this.state.selectedLng == "ENGLISH") {
          elementChildDiv.style.marginRight = "-17px";
          elementChildDiv.style.marginLeft = "0px";
        } else {
          elementChildDiv.style.marginLeft = "-17px";
          elementChildDiv.style.marginRight = "0px";
        }
      }
    });
  }
}
