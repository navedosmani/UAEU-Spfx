import * as React from "react";
import styles from "./Apps.module.scss";
import { IAppsProps } from "./IAppsProps";
import { Web, sp } from "sp-pnp-js";
import { uniqBy } from "@microsoft/sp-lodash-subset";
import Button from "react-bootstrap/Button";
import Col from "react-bootstrap/Col";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Row from "react-bootstrap/Row";
import $ from "jquery";

import { FontIcon } from "office-ui-fabric-react";
import { Scrollbars } from "react-custom-scrollbars";
import * as _ from "lodash";

interface IAppsState {
  Category: any;
  categoryMost: any;
  AppName: any;

  filterCategoryKey: any;
  filterCategoryKeyMost: string;

  search: any;
  primaryColor: string;
  primaryDarkShade: string;
  selectedLng: string;
  ShowLoadMore: boolean;
  role: string;
 
  CategorytData: any;
  curTarget: any;
  mostused: any;
  clicked: any;
  settingVal: string;
  roleData: any;
  AppCategory: any;
}
const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 6,
    backgroundColor: "grey",
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

export default class Apps extends React.Component<IAppsProps, IAppsState> {
  constructor(props: IAppsProps, state: IAppsState) {
    super(props);
    this.state = {
      Category: [],
      categoryMost: [],
      AppName: [],
      filterCategoryKey: "",
      filterCategoryKeyMost: "",
      search: null,
      selectedLng: this.props.language.toUpperCase(),
      primaryColor: "#052942",
      primaryDarkShade: "#021D30",
      ShowLoadMore: false,
      role: "student",
      CategorytData: [],
      curTarget: "",
      mostused: "",
      clicked: 0,
      settingVal: "",
      roleData: [],
      AppCategory: [],
    };
  }
 
  async componentDidMount() {
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
    this.GetThemeAndUserConfiguration();
  }
  private getCategoryItems = () => {
   
    let webObject = new Web(this.props.context.pageContext.site.absoluteUrl);
    webObject.lists
      .getByTitle("Category")
      .items.filter(`Role eq '` + this.state.role + `'`)
      .orderBy("DisplayOrder")
      .get()

      .then((result) => {
        this.setState(
          {
            CategorytData: result,
          },
          () => {
            this.GetListData();
            this.getAppSettings();
            
          }
        );

      });
  };

  private getAppSettings = () => {
 
    let webObject = new Web(this.props.context.pageContext.site.absoluteUrl);
    webObject.lists
      .getByTitle("AppSettings")
      .items.get()
      .then((result) => {
        this.setState({
          settingVal: result[0].settingVal,
        });
      });
  };

  public render(): React.ReactElement<IAppsProps> {
   
    this.FixScrollBarMargin();
    if (this.state.selectedLng != "ENGLISH") this.AlignTextOnLng();
    let combinedStyle = [styles.AppDiv, styles.appDivBlue];

    $("#AppsLeftNavScrollDiv ul li").click(function () {
      $(this).closest("ul").not($(this)).removeClass(styles.active);
      $(this).siblings().removeClass(styles.active);
      $(this).addClass(styles.active);
    });

    return (
      <div id="AppsRootDiv" className={combinedStyle.join(" ")}>
        <Row>
          <Col md={9}>
            <p className={styles.Title}>
              {this.state.selectedLng == "ENGLISH" ? "APPS" : "تطبيقات"}
            </p>
          </Col>
        </Row>
        {/* <div style={{ display: "flex", flexDirection: 'column' }}> */}
        <Row>
          <Col lg={3}>{this.ConstructLeftNav()}</Col>

          <Col lg={9}>
            <div className={styles.GridLayoutDiv}>
              <div className={styles.TopTabNav}>
                <Row className={styles.alignRight}>
                  <Col sm={6}>
                    <div id="AppSearchInput" className={styles.AppSearchInput}>
                      <input
                        type="text"
                        value={this.state.search}
                        placeholder={
                          this.state.selectedLng == "ENGLISH"
                            ? "Search APP"
                            : "تطبيق البحث"
                        }
                        onChange={(e) => this.searchSpace(e)}
                        className={styles.searchBox}
                      />
                      <i
                        className={styles.searchIcon + " fa fa-search"}
                        aria-hidden="true"
                      ></i>
                    </div>
                  </Col>
                </Row>
              </div>

              {this.ConstructAppLinks()}
            </div>
          </Col>
        </Row>
      </div>
    );
  }
  //#region  function call
  searchSpace = (event) => {
  
    let keyword = event.target.value;
    this.setState({ search: keyword });
  };

  ConstructLeftNav() {
    const columnNameExtension =
      this.state.selectedLng == "ENGLISH" ? "" : "Arabic";
    let parentDiv = [];
    let childDiv = [];

    childDiv.push(
      <li
        className={styles.leftNavigation + " " + styles.active}
        onClick={(e) => this.LeftNavClickEventMost(e, "Most Used Apps")}
      >
        {this.state.selectedLng == "ENGLISH"
          ? "Most Used Apps"
          : "التطبيقات الأكثر استخدامًا"}
      </li>
    );

    this.state.Category.map((CategoryItem) => {
      let roleType =
        this.state.role.toLowerCase() == "student"
          ? "Student"
          : this.state.role.toLowerCase() == "faculty"
          ? "Faculty"
          : "Employee";
     
      if (
        CategoryItem["Role"] == null ||
        CategoryItem["Role"].includes(roleType)
      ) {
        childDiv.push(
          <li
            className={styles.leftNavigation}
            onClick={(e) =>
              this.LeftNavClickEvent(e, CategoryItem["categoryTitle"])
            }
          >
            {CategoryItem["categoryTitle" + columnNameExtension]}
          </li>
        );
      }
    });
    childDiv.push(
      <li
        className={styles.leftNavigation}
        onClick={(e) => this.LeftNavClickEvent(e, "All Apps")}
      >
        {this.state.selectedLng == "ENGLISH" ? "All Apps" : "كل التطبيقات"}
      </li>
    );
    parentDiv.push(
      <div className={styles.leftNavigationDiv}>
        <Scrollbars
          className="arabic-scrollbar"
          id="AppsLeftNavScrollDiv"
          universal={true}
          autoHide
          autoHideTimeout={1000}
          autoHideDuration={200}
          renderThumbVertical={renderThumb}
        >
          <ul style={{ margin: "0px", padding: "0px" }}>{childDiv}</ul>
        </Scrollbars>
      </div>
    );
    return parentDiv;
  }

  ConstructAppLinks() {
 
    const columnNameExtension =
      this.state.selectedLng == "ENGLISH" ? "" : "Arabic";
    let parentDiv = [];
    let childDiv = [];
    let categoryMap = false;
    let categoryFilter = [];
    this.state.AppName.filter((appElement) => {
      if (this.state.search == null && this.state.filterCategoryKey == "")
        return appElement;
      else if (
        this.state.filterCategoryKey != "" &&
        this.state.selectedLng == "ENGLISH"
      ) {
        categoryMap = appElement.categoryTitle
          .toLowerCase()
          .includes(this.state.filterCategoryKey.toLowerCase());
        if (categoryMap) {
          if (this.state.search == null) {
            return appElement.categoryTitle
              .toLowerCase()
              .includes(this.state.filterCategoryKey.toLowerCase());
          }
          return appElement.Title.toLowerCase().includes(this.state.search);
        }
      } else if (
        this.state.filterCategoryKey != "" &&
        this.state.selectedLng !== "ENGLISH"
      ) {
        categoryMap = appElement.categoryTitle
          .toLowerCase()
          .includes(this.state.filterCategoryKey.toLowerCase());
        if (categoryMap) {
          if (this.state.search == null) {
            return appElement.categoryTitle
              .toLowerCase()
              .includes(this.state.filterCategoryKey.toLowerCase());
          }
          return appElement.TitleArabic.toLowerCase().includes(
            this.state.search
          );
        }
      } else if (
        this.state.filterCategoryKey == "" &&
        this.state.selectedLng == "ENGLISH"
      )
        return appElement.Title.toLowerCase().includes(
          this.state.search.toLowerCase()
        );
      else if (
        this.state.filterCategoryKey == "" &&
        this.state.selectedLng !== "ENGLISH"
      )
        return appElement.TitleArabic.toLowerCase().includes(
          this.state.search.toLowerCase()
        );
      else if (this.state.filterCategoryKey == "")
        return appElement.ArabicTitle.toLowerCase().includes(this.state.search);
      
    }).map((appElement) => {
      let Link = appElement.OnClickLink;
      let targetLink = this.state.settingVal;
      let Url = targetLink.replace("itemLink", Link);
      let roleType =
        this.state.role.toLowerCase() == "student"
          ? "Student"
          : this.state.role.toLowerCase() == "faculty"
          ? "Faculty"
          : "Employee";

      if (
        appElement["Role"] == null ||
        (appElement["Role"].includes(roleType) &&
          appElement.SelectIcon == "OfficeUIFabric")
      ) {
        childDiv.push(
          <a
            onClick={(e) =>
              this.AppNameClickEvent(
                e,
                appElement.OnClickLink,
                appElement.ClickCount,
                appElement.ID
              )
            }
            className={styles.appSelectionDiv}
          >
            {appElement.IsSsbURL == "Yes" ? (
              <a className={styles.linkButton} href={Url} target="_blank">
                {this.state.curTarget !== "All Apps" ? (
                  <FontIcon
                    iconName={appElement.IconName}
                    style={{ fontSize: "45px" }}
                  />
                ) : (
                  ""
                )}

                {this.state.selectedLng == "ENGLISH" ? (
                  <p>
                    {appElement["Title" + columnNameExtension].toLowerCase()}
                  </p>
                ) : (
                  <p>{appElement["Title" + columnNameExtension]}</p>
                )}
              </a>
            ) : (
              <a
                className={styles.linkButton}
                href={appElement.OnClickLink}
                target="_blank"
              >
                {this.state.curTarget !== "All Apps" ? (
                  <FontIcon
                    iconName={appElement.IconName}
                    style={{ fontSize: " 45px" }}
                  />
                ) : (
                  ""
                )}

                {this.state.selectedLng == "ENGLISH" ? (
                  <p>
                    {appElement["Title" + columnNameExtension].toLowerCase()}
                  </p>
                ) : (
                  <p>{appElement["Title" + columnNameExtension]}</p>
                )}
              </a>
            )}
          </a>
        );
      } else if (
        appElement["Role"] == null ||
        (appElement["Role"].includes(roleType) &&
          appElement.SelectIcon == "CustomIcon")
      ) {
        childDiv.push(
          <a
            onClick={(e) =>
              this.AppNameClickEvent(
                e,
                appElement.OnClickLink,
                appElement.ClickCount,
                appElement.ID
              )
            }
            className={styles.appSelectionDiv}
          >
            {appElement.IsSsbURL == "Yes" ? (
              <a className={styles.linkButton} href={Url} target="_blank">
                {this.state.curTarget !== "All Apps" ? (
                  <i className={"icon" + " " + appElement.CustomIconName} />
                ) : (
                  ""
                )}

                {this.state.selectedLng == "ENGLISH" ? (
                  <p>
                    {appElement["Title" + columnNameExtension].toLowerCase()}
                  </p>
                ) : (
                  <p>{appElement["Title" + columnNameExtension]}</p>
                )}
              </a>
            ) : (
              <a
                className={styles.linkButton}
                href={appElement.OnClickLink}
                target="_blank"
              >
                {this.state.curTarget !== "All Apps" ? (
                  <i className={"icon" + " " + appElement.CustomIconName} />
                ) : (
                  ""
                )}

                {this.state.selectedLng == "ENGLISH" ? (
                  <p>
                    {appElement["Title" + columnNameExtension].toLowerCase()}
                  </p>
                ) : (
                  <p>{appElement["Title" + columnNameExtension]}</p>
                )}
              </a>
            )}
          </a>
        );
      }
    });

    parentDiv.push(<div className={styles.appDivision}>{childDiv}</div>);

    return (
      <Scrollbars
        className={`${styles.appScroll} arabic-scrollbar`}
        
        id="SelectAppsScrollDiv"
        style={{ height: 430 }}
        universal={true}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        renderThumbVertical={renderThumb}
      >
        {parentDiv}
      </Scrollbars>
    );
  }

  public LeftNavClickEvent(event: any, categoryName: string) {
    let currentTarget = categoryName;

    this.setState({
      filterCategoryKey: currentTarget == "All Apps" ? "" : currentTarget,
      curTarget: currentTarget,
    });

    this.GetListData();
  }
  public LeftNavClickEventMost(event: any, categoryName: string) {
    let currentTarget = categoryName;

    this.setState({
      filterCategoryKey: currentTarget == "Most Used Apps" ? "" : currentTarget,
      curTarget: currentTarget,
    });

    this.GetListData(true);
  }

  public AppNameClickEvent(
    event: any,
    link: string,
    count: number,
    itemId: number
  ) {
  

    let web = new Web(this.props.context.pageContext.site.absoluteUrl);
    web.lists
      .getByTitle("AppWebpartConfig")
      .items.getById(itemId)

      .update({
        ClickCount: ++count,
      })
      .then(() => {});
  }



  private async GetListData(mostUsed = false) {
  
    if (this.state.clicked == 0 || this.state.clicked == "") {
      $("document").ready(function () {
        setTimeout(function () {
          $("#AppsLeftNavScrollDiv ul li:first-child").trigger("click");
        }, 30);
      });

    
      
      this.setState({
        clicked: 1,
      });
    }
    let catagoryArray = [];
    let appConfigData = [];
    let appConfigDataCategory = [];
    let web = new Web(this.props.context.pageContext.site.absoluteUrl);
    if (mostUsed) {
      web.lists
        .getByTitle("AppWebpartConfig")

        .items.filter(`Role eq '` + this.state.role + `'` && `ClickCount gt 5 `)

        .select(
          "ID",
          "Title",
          "Role",
          "IsSsbURL",
          "AppCategory/Title",
          "AppCategory/ID",
          "OnClickLink",
          "ClickCount",
          "TitleArabic",
          "ItemOrder",
          "IconName",
          "CustomIconName",
          "SelectIcon",

          "AppCategory/ArabicTitle"
        )
        .orderBy("Title")
        .expand("AppCategory")

        .get()
        .then((listItemData: any[]) => {
          listItemData.map((item) => {
            this.state.CategorytData.map((categoryItem) => {
              if (
                item.AppCategory != null &&
                item.AppCategory.ID == categoryItem["Id"]
              ) {
                item["categoryTitle"] = item.AppCategory.Title;
                item["categoryTitleArabic"] = item.AppCategory.ArabicTitle;
               

                appConfigData.push(item);
              }
            });
          });

          this.setState({
            AppName: appConfigData,
            
          });
        });
    } else {
     
      if (this.state.clicked == 0 || this.state.clicked == "") {
        $("document").ready(function () {
          setTimeout(function () {
            $("#AppsLeftNavScrollDiv ul li:first-child").trigger("click");
          }, 30);
        });
       
        this.setState({
          clicked: 1,
        });
      }
      web.lists
        .getByTitle("AppWebpartConfig")
        .items.filter(`Role eq '` + this.state.role + `'`)

        .select(
          "ID",
          "Title",
          "Role",
          "IsSsbURL",
          "AppCategory/Title",
          "AppCategory/ID",
          "OnClickLink",
          "ClickCount",
          "TitleArabic",
          "ItemOrder",
          "IconName",
          "CustomIconName",
          "SelectIcon",

          "AppCategory/ArabicTitle"
        )
        .orderBy("Title")
        .expand("AppCategory")
        .get()
        .then((listItemData: any[]) => {
          listItemData.map((item, index) => {
            

            this.state.CategorytData.map((categoryItem) => {
              if (
                item.AppCategory != null &&
                item.AppCategory.ID == categoryItem["Id"]
              ) {
                item["categoryTitle"] = item.AppCategory.Title;
                item["categoryTitleArabic"] = item.AppCategory.ArabicTitle;
                if (categoryItem.DisplayOrder != null)
                  item["DisplayOrder"] = categoryItem.DisplayOrder;
                else item["DisplayOrder"] = 0;
                
                appConfigData.push(item);
                appConfigDataCategory.push(item);

                appConfigDataCategory = appConfigDataCategory.sort(
                  (a, b) => a.DisplayOrder - b.DisplayOrder
                );
                
              }
            });
          });

          this.setState({
            AppName: appConfigData,
            Category: uniqBy(appConfigDataCategory, "categoryTitle"),
          });
        });
    }
  }

  ClearSearchState() {
    this.setState({
      search: "",
    });
  }

  RedirectToPage(pageName) {
    window.location.href =
      this.props.context.pageContext.site.absoluteUrl +
      "/SitePages/" +
      pageName;
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
                role:
                  result[0].DefaultRole == null
                    ? "Student"
                    : result[0].DefaultRole,
              },
              () => {
                clearInterval(intervalCall);
                this.getCategoryItems();
              }
            );
          }
        });
    }, 2000);
  }

  AlignTextOnLng() {
    if (document.getElementsByClassName(styles.AppDiv)[0])
      document
        .getElementsByClassName(styles.AppDiv)[0]
        .classList.add(styles.elementTextAlign);
    if (document.getElementsByClassName(styles.searchBox)[0]) {
      let searchBoxElement = document.getElementsByClassName(
        styles.searchBox
      )[0] as HTMLElement;
      searchBoxElement.style.textIndent = "30px";
    }
  }

  FixScrollBarMargin() {
    let arrayOfScrollElemtId = ["AppsLeftNavScrollDiv", "SelectAppsScrollDiv"];
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
  //#endregion function calls
}
