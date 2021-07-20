import * as React from "react";
import styles from "./WelcomeUser.module.scss";
import { IWelcomeUserProps } from "./IWelcomeUserProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { sp, Web } from "sp-pnp-js";
import { FontIcon } from "office-ui-fabric-react";
import axios from "axios";
import { initializeIcons } from "@uifabric/icons";
import { MSGraphClient } from "@microsoft/sp-http";

import $ from "jquery";
import { Scrollbars } from "react-custom-scrollbars";

const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 6,
    backgroundColor: "grey",
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};
initializeIcons();
export interface IWelcomeState {
  IconsData: any;
  primaryColor: string;
  selectedLng: string;
  role: string;
  ExtensionProperty: string;
  greeting: any;
}

export default class WelcomeUser extends React.Component<
  IWelcomeUserProps,
  IWelcomeState
> {
  constructor(props) {
    super(props);
    this.state = {
      IconsData: [],
      primaryColor: "",
      selectedLng: this.props.language.toUpperCase(),
      role: "student",
      ExtensionProperty: "",
      greeting: "",
    };
  }

  componentDidMount = () => {
    this.props.context.msGraphClientFactory
      .getClient()
      .then((client: MSGraphClient): void => {
        // get information about the current user from the Microsoft Graph
        client
          .api("/me")
          .version("beta")
          .select("onPremisesExtensionAttributes")
          .get((error, response: any, rawResponse?: any) => {
            // handle the response
            if (response != null)
              this.setState(
                {
                  ExtensionProperty:
                    response.onPremisesExtensionAttributes[
                      "extensionAttribute7"
                    ] == null
                      ? ""
                      : response.onPremisesExtensionAttributes[
                          "extensionAttribute7"
                        ],
                },

                () => {
                  this.GetThemeAndUserConfiguration();
                }
              );
            else {
              this.GetThemeAndUserConfiguration();
            }
          });
      });

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

    let web = new Web(this.props.context.pageContext.site.absoluteUrl);
    web.lists
      .getByTitle("WelcomeAppLinks")
      .items.orderBy("ItemOrder")
      .get()
      .then((icons) => {
        this.setState({
          IconsData: icons,
        });
      });
  };
  public render(): React.ReactElement<IWelcomeUserProps> {
    this.FixScrollBarMargin();
    //document.documentElement.style.setProperty('--primaryColor', this.state.primaryColor);
    if (this.state.selectedLng != "ENGLISH") this.AlignTextOnLng();
    let combinedStyle = [styles.LoginDetails, styles.loginDetailsBlue];
    let greetingHr = "";
    let greetingHrAr = "";
    let myDate = new Date();
    let hrs = myDate.getHours();
    if (hrs <= 9) {
      (greetingHr = "Welcome"), (greetingHrAr = "مرحبا");
    } else if (hrs >= 10 && hrs <= 11) {
      (greetingHr = "Good Morning"), (greetingHrAr = "صباح الخير");
      $("#WelcomeUserRoot")
        .removeClass("evening afternoon")
        .addClass("morning");
    } else if (hrs >= 12 && hrs <= 16) {
      (greetingHr = "Good Afternoon"), (greetingHrAr = "مساء الخير");
      $("#WelcomeUserRoot")
        .removeClass("morning evening")
        .addClass("afternoon");
    } else if (hrs >= 17 && hrs <= 24) {
      (greetingHr = "Good Evening"), (greetingHrAr = " مساء الخير");
      $("#WelcomeUserRoot")
        .removeClass("morning afternoon")
        .addClass("evening");
    }
    return (
      <div id="WelcomeUserRoot" className={combinedStyle.join(" ")}>
        <h3 className={styles.welcomeUser}>
          {" "}
          {this.state.selectedLng == "ENGLISH" ? greetingHr : greetingHrAr}{" "}
          <br />
          <span className={styles.welcomeUsername}>
            {" "}
            {this.props.context.pageContext.user.displayName}
          </span>
        </h3>

        <div style={{ height: "170px" }}>
          <Scrollbars
            className="arabic-scrollbar"
            id="WelcomeScrollDiv"
            universal={true}
            autoHide
            autoHideTimeout={1000}
            autoHideDuration={200}
            renderThumbVertical={renderThumb}
          >
            <div className={styles["welcomeuser-links"]}>
              {this.state.IconsData.map((eachIcon, key) => {
                let roleType = "";
                if (this.state.role == undefined) {
                  roleType = "Student";
                } else {
                  roleType =
                    this.state.role.toLowerCase() == "student"
                      ? "Student"
                      : this.state.role.toLowerCase() == "faculty"
                      ? "Faculty"
                      : "Employee";
                }

                let styleElm =
                  this.state.selectedLng == "ENGLISH"
                    ? { marginLeft: "0px" }
                    : {};
                if (
                  eachIcon["Role"] == null ||
                  eachIcon["Role"].includes(roleType)
                ) {
                  if (key == 0) {
                    if (this.state.selectedLng == "ENGLISH")
                      return (
                        <a
                          href={eachIcon.OnClickUrl}
                          target="_blank"
                          className={styles["user-link"]}
                          title={eachIcon.Title}
                        >
                          <span className={styles["link"]}>
                            <FontIcon
                              iconName={eachIcon.IconName}
                              className={styles["welcomeuser-icon"]}
                            />
                          </span>
                          <span className={styles["link-title"]}>
                            {eachIcon.Title}
                          </span>
                        </a>
                      );
                    else
                      return (
                        <a
                          href={eachIcon.OnClickUrl}
                          target="_blank"
                          className={styles["user-link"]}
                          title={eachIcon.TitleAr}
                        >
                          <span className={styles["link"]}>
                            <FontIcon
                              iconName={eachIcon.IconName}
                              className={styles["welcomeuser-icon"]}
                            />
                          </span>
                          <span className={styles["link-title"]}>
                            {eachIcon.TitleAr}
                          </span>
                        </a>
                      );
                  } else {
                    if (this.state.selectedLng == "ENGLISH")
                      return (
                        <a
                          href={eachIcon.OnClickUrl}
                          target="_blank"
                          className={styles["user-link"]}
                          title={eachIcon.Title}
                        >
                          <span className={styles["link"]}>
                            <FontIcon
                              iconName={eachIcon.IconName}
                              className={styles["welcomeuser-icon"]}
                            />
                          </span>
                          <span className={styles["link-title"]}>
                            {eachIcon.Title}
                          </span>
                        </a>
                      );
                    else
                      return (
                        <a
                          href={eachIcon.OnClickUrl}
                          target="_blank"
                          className={styles["user-link"]}
                          title={eachIcon.TitleAr}
                        >
                          <span className={styles["link"]}>
                            <FontIcon
                              iconName={eachIcon.IconName}
                              className={styles["welcomeuser-icon"]}
                            />
                          </span>
                          <span className={styles["link-title"]}>
                            {eachIcon.TitleAr}
                          </span>
                        </a>
                      );
                  }
                }
              })}
            </div>
          </Scrollbars>
        </div>
      </div>
    );
  }
  FixScrollBarMargin() {
    let arrayOfScrollElemtId = ["WelcomeScrollDiv"];
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
  GetThemeAndUserConfiguration() {
    let varColorThemes = [],
      varColor = "",
      getEnArText = [],
      varSelectedConfig = [];
    let user = this.props.context.pageContext.user;

    let web = new Web(this.props.context.pageContext.site.absoluteUrl);
    web.lists
      .getByTitle("HomeThemeConfig")
      .items.get()
      .then((result) => {
        var selectedConfig = result.filter((setColor) => {
          return setColor.SetColor == true;
        });
        varColorThemes = result;
        varColor = selectedConfig[0].ColorCode;
        varSelectedConfig = selectedConfig;

        //UserThemConfigs
        let userConfigListObject = web.lists.getByTitle(
          "UserBasedConfiguration"
        );
        userConfigListObject.items
          .filter("UserEmail eq '" + user.loginName + "'")
          .get()
          .then((result) => {
            //Roles
            let roleTypes =
              this.state.ExtensionProperty == ""
                ? ["ST"]
                : this.state.ExtensionProperty.split(":");
            let varRoles = []; //roles:AL:EM:FA:ST
            let roles = [];
            roleTypes.map((item) => {
              switch (item) {
                case "FA":
                  varRoles.push("Faculty");
                  roles.push({ En: "FACULTY", Ar: "طالب علم" });
                  break;
                case "ST":
                  varRoles.push("Student");
                  roles.push({ En: "STUDENT", Ar: "الأساتذه" });
                  break;
                case "AL":
                  varRoles.push("Alumni");
                  roles.push({ En: "ALUMNI", Ar: "الخريجين" });
                  break;
                case "EM":
                  varRoles.push("Employee");
                  roles.push({ En: "EMPLOYEE", Ar: "الموظف" });
                  break;
              }
            });
            //Roles
            if (result.length > 0) {
              let defRole =
                varRoles.indexOf(result[0].DefaultRole) == -1
                  ? varRoles[0]
                  : result[0].DefaultRole;

              userConfigListObject.items.getById(result[0].Id).update({
                Role: { results: varRoles },
                DefaultRole: defRole,
              });
              var selectedConfig = varColorThemes.filter((item) => {
                return item.Id == result[0].ColorNameId;
              });
              varColor = selectedConfig[0].ColorCode;
              varSelectedConfig = selectedConfig;
              this.setState({
                primaryColor: varColor,
                //selectedLng: 'ENGLISH',
                role: defRole,
              });
            } else {
              userConfigListObject.items.add({
                UserEmail: user.loginName,
                ColorNameId: varSelectedConfig[0].Id,
                DefaultRole: varRoles[0],
                Role: { results: varRoles },
              });
              this.setState({
                primaryColor: varColor,

                role: varRoles[0],
              });
            }
          });
      });
  }

  AlignTextOnLng() {
    if (document.getElementsByClassName(styles.LoginDetails)[0])
      document
        .getElementsByClassName(styles.LoginDetails)[0]
        .classList.add(styles.elementTextAlign);
  }
}
