import * as React from "react";
import styles from "./DirectorySearch.module.scss";
import { IDirectorySearchProps } from "./IDirectorySearchProps";
import { sp, Web } from "sp-pnp-js";
import "bootstrap/dist/css/bootstrap.min.css";
import { FontIcon } from "office-ui-fabric-react";
import axios from "axios";
import { Scrollbars } from "react-custom-scrollbars";

import FadeLoader from "react-spinners/FadeLoader";
const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 6,
    backgroundColor: "grey",
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

export interface DirectorySearchState {
  search: string;
  searchContent: any;
  primaryColor: string;
  selectedLng: string;
  role: string;
  loading: boolean;
  message: string;
  messageAr: string;
}

export default class DirectorySearch extends React.Component<
  IDirectorySearchProps,
  DirectorySearchState
> {
  constructor(props) {
    super(props);

    this.state = {
      search: null,
      loading: false,
      searchContent: [],
      primaryColor: "",
      selectedLng: this.props.language.toUpperCase(),
      role: "student",
      message: "",
      messageAr: "",
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
  }

  public render(): React.ReactElement<IDirectorySearchProps> {
    this.FixScrollBarMargin();
    if (this.state.selectedLng != "ENGLISH") this.AlignTextOnLng();
    let combinedStyle = [
      styles["directory-search"],
      styles.directorySearchBlue,
    ];

    return (
      <div id="DirectorySearchRoot" className={combinedStyle.join(" ")}>
        <div>
          <h3 className={styles.p1search}>
            {this.state.selectedLng == "ENGLISH"
              ? "Directory Search"
              : "بحث الدليل"}
          </h3>
          <hr
            style={{
              borderColor: "#e8e8e8",
              paddingBottom: "10px",
              borderWidth: "2px",
            }}
          ></hr>
          <div className={styles.searchInputText}>
            <input
              type="text"
              placeholder={
                this.state.selectedLng == "ENGLISH"
                  ? "By Keyword"
                  : "باستخدام الكلمات الرئيسية"
              }
              onChange={this.setSearch.bind(this)}
              onKeyPress={this.GetEmployeeDirectoryData.bind(this)}
              className={styles.search}
              value={this.state.search}
            ></input>
            <i
              className={styles.searchIcon + " fa fa-search"}
              aria-hidden="true"
              onClick={this.GetEmployeeDirectoryData.bind(this)}
            ></i>
          </div>
        </div>
        <div style={{ height: "500px", position: "relative" }}>
          {this.state.loading == true ? (
            <div className={styles.spinner}>
              {" "}
              <FadeLoader
                height={15}
                width={5}
                radius={2}
                margin={2}
                color={"#808080"}
                speedMultiplier={1.5}
              />
            </div>
          ) : (
            ""
          )}
          {this.state.searchContent.length == 0 && (
            <div className={styles.noRecords}>
              {this.state.selectedLng == "ENGLISH"
                ? this.state.message
                : this.state.messageAr}
            </div>
          )}

          {this.state.searchContent.length > 0 &&
            this.ConstructDirectoryCards()}
        </div>
      </div>
    );
  }

  setSearch(event) {
 
    let keyword = event.target.value;
    if (keyword == "" || keyword == null)
      this.setState({
        searchContent: [],
        search: keyword,
      });
    else
      this.setState({
        search: keyword,
      });
  }

  FixScrollBarMargin() {
    let arrayOfScrollElemtId = ["DirectoryScrollDiv"];
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

  ConstructDirectoryCards() {
    let parentDiv = [];
    let phoneData = "";
    let columnNameExtension = this.state.selectedLng == "ENGLISH" ? "En" : "Ar";
    this.state.searchContent
      .filter((items) => {
        if (this.state.search == null || this.state.search == "") return items;
        else if (this.state.selectedLng == "ENGLISH")
          return items.searchFieldEn
            .toLowerCase()
            .includes(this.state.search.toLowerCase());
        else if (this.state.selectedLng !== "ENGLISH")
          return items.searchFieldAr
            .toLowerCase()
            .includes(this.state.search.toLowerCase());
      })
      .map((items) => {
        if (items.bu != null) phoneData = items.bu;
        phoneData = phoneData.substr(phoneData.length - 10);
        parentDiv.push(
          <div className="card mb-3">
            <div className={styles["card-body"]}>
              <h4 className={styles["card-title"]}>
                {items["name" + columnNameExtension]}
                <div className={styles.department}>
                  {items["dept" + columnNameExtension]}
                </div>
              </h4>

              <p className={styles["card-text"]}>{phoneData}</p>
              <p className={styles["card-text"]}>
                {items["username"] + "@uaeu.ac.ae"}
              </p>
            </div>
          </div>
        );
      });
    return (
      <Scrollbars
        className="arabic-scrollbar"
        id="DirectoryScrollDiv"
        universal={true}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        renderThumbVertical={renderThumb}
      >
        {parentDiv}
      </Scrollbars>
    );

    return parentDiv;
  }

  GetEmployeeDirectoryData(event) {
   
    if (
      event.key == "Enter" ||
      event.target.className.split(" ")[2] == "fa-search"
    ) {
      if (this.state.searchContent.length == 0)
        this.setState({
          loading: true,
        });
      if (this.state.search == "" || this.state.search == null)
        this.setState({
          searchContent: [],
          loading: true,
        });
      else {
        {
          this.state.selectedLng == "ENGLISH"
            ? axios
                .get(
                  "https://coreservices.uaeu.ac.ae/General/Employee/en/" +
                    this.state.search
                )
                .then((res) => {
              
                  if (res.data.length == 0)
                    this.setState({
                      message: "no matched results found!!",
                      messageAr: "لم يتم العثور على نتائج متطابقة !!",
                    });
                  this.setState({
                    searchContent: res.data,
                    loading: false,
                  });
                })
            : axios
                .get(
                  "https://coreservices.uaeu.ac.ae/General/Employee/ar/" +
                    this.state.search
                )
                .then((res) => {
                 
                  if (res.data.length == 0)
                    this.setState({
                      message: "no matched results found!!",
                      messageAr: "لم يتم العثور على نتائج متطابقة !!",
                    });
                  this.setState({
                    searchContent: res.data,
                    loading: false,
                  });
                });
        }
      }
    } else {
      this.setState({
        loading: true,
      });
    }
  }

  AlignTextOnLng() {
    if (document.getElementsByClassName(styles["directory-search"])[0])
      document
        .getElementsByClassName(styles["directory-search"])[0]
        .classList.add(styles.elementTextAlign);
    if (document.getElementsByClassName(styles.search)[0]) {
      let searchElement = document.getElementsByClassName(
        styles.search
      )[0] as HTMLElement;
      searchElement.classList.add(styles.elementTextAlign);
      searchElement.style.textIndent = "30px";
    }
  }
}
