import * as React from "react";
import styles from "./News.module.scss";
import { INewsProps } from "./INewsProps";
import { escape } from "@microsoft/sp-lodash-subset";
import { Scrollbars } from "react-custom-scrollbars";
import axios from "axios";
import { sp, Web } from "sp-pnp-js";
import XMLParser from "react-xml-parser";
import * as _ from "lodash";
import $ from "jquery";
const renderThumb = ({ style, ...props }) => {
  const thumbStyle = {
    borderRadius: 6,
    backgroundColor: "grey",
  };
  return <div style={{ ...style, ...thumbStyle }} {...props} />;
};

export interface StateAttributes {
  Month: any;
  Days: any;
  newslist: any;
  newsListAr: any;
  selectedLng: string;
  role: string;
  primaryColor: string;
  ViewAll: boolean;
  isActive: boolean;
  // FilterBtnId: number;
}
export default class News extends React.Component<INewsProps, StateAttributes> {
  constructor(props) {
    super(props);
    this.state = {
      isActive: false,
      newslist: [],
      newsListAr: [],
      Month: [
        "-",
        "JAN",
        "FEB",
        "MAR",
        "APR",
        "MAY",
        "JUN",
        "JUL",
        "AUG",
        "SEP",
        "OCT",
        "NOV",
        "DEC",
      ],
      Days: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"],
      selectedLng: this.props.language.toUpperCase(),
      role: "student",
      primaryColor: "#052942",
      ViewAll: false,
    
    };
  }

  componentDidMount() {
   
    let Url = this.props.context.pageContext.web.absoluteUrl;
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
    let newsData = [],
      newsDataAr = [];
    if (arbaicSite.length == 0) {
      axios.get("https://www.uaeu.ac.ae/rss/en_news.xml").then((res) => {
        var xml = new XMLParser().parseFromString(res.data);
        newsData = xml.children[0].children;
        this.setState({
          newslist: newsData,
        });
      });
    } else {
      axios.get("https://www.uaeu.ac.ae/rss/ar_news.xml").then((res) => {
        var xml = new XMLParser().parseFromString(res.data);
        newsDataAr = xml.children[0].children;
        this.setState({
          newsListAr: newsDataAr,
        });
      });
    }
  }

  public render(): React.ReactElement<INewsProps> {
    this.FixScrollBarMargin();
    const isLngEnglish = this.state.selectedLng == "ENGLISH" ? true : false;
    //document.documentElement.style.setProperty('--primaryColor', this.state.primaryColor);
    let combinedStyle = [styles.newsEvents, styles.newsEventsBlue];

    $("#NewsRootDiv button").click(function () {
      $(this).siblings().removeClass(styles.eventsFltBtnActive);
      $(this).addClass(styles.eventsFltBtnActive);
    });
    return (
      <div id="NewsRootDiv" className={combinedStyle.join(" ")}>
        <div className={styles.event}>
          <div className={styles["event-header"]}>
            <h5>{isLngEnglish ? "News" : "أخبار"}</h5>
            <div className={styles["event-btn"]}>
              <button
                type="button"
                onClick={this.SetViewAllStateHome.bind(this)}
                className={styles.eventsFltBtnActive}
              >
                {isLngEnglish ? "Top 5" : "أفضل 5"}
              </button>
              <button type="button" onClick={this.SetViewAllState.bind(this)}>
                {isLngEnglish ? "VIEW ALL" : "عرض الكل"}
              </button>
            </div>
          </div>
          <div style={{ height: "540px" }}>
            {/* style={{ overflow: 'auto', height: '540px' }} */}
            {this.ConstructNewsItems()}
          </div>
        </div>
      </div>
    );
  }

  FixScrollBarMargin() {
    let arrayOfScrollElemtId = [
      "NewsScrollDiv",
      "EventsScrollDiv",
      "AcademicScrollDiv",
    ];
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

  ConstructNewsItems(viewAll = false) {
   
    let parentDiv = [];
    let newsArray =
      this.state.selectedLng == "ENGLISH"
        ? this.state.newslist
        : this.state.newsListAr;

    let filteredNewsList = newsArray.filter((filterKey) => {
      return filterKey.name == "item";
    });
    let categorgyBasedfilterArray = [];
    filteredNewsList.map((item) => {
      let filterData = _.filter(item.children, {
        name: "category",
        value: "uaeu",
      });
      if (filterData.length > 0) categorgyBasedfilterArray.push(item);
    });
    if (!this.state.ViewAll)
      categorgyBasedfilterArray = categorgyBasedfilterArray.slice(0, 5);
    categorgyBasedfilterArray.map(function (newsItem) {
      let newsTitle = "",
        newsDesc = "",
        eventDate = "",
        link = "#";
      let img = "";
     
      newsItem.children.map((item) => {
        switch (item.name) {
          case "title":
            newsTitle = item.value;
            break;
          case "description":
            newsDesc = item.value;
            break;
          case "pubDate":
            eventDate = item.value;
            break;
          case "media:content":
            img = item.attributes.url;
            // img = item.children.filter((key) => {
            //   return key.name == "media:thumbnail";
            // });
            break;
          case "link":
            link = item.value;
            break;
          default:
            break;
        }
      });

      let imgURLData = img.length > 0 ? img : "";
      parentDiv.push(
        <a className={styles["each-event"]} href={link} target="_blank">
          <div className={styles["event-img"]}>
            <img src={imgURLData} alt="event 1" />
          </div>
          <div className={styles["event-details"]}>
            <h5 className={styles["event-title"]}>{newsTitle}</h5>
            <p className={styles["event-subtitle"]}>{eventDate.slice(0, 16)}</p>
          </div>
        </a>
      );
    });
    return (
      <Scrollbars
        className="arabic-scrollbar"
        id="NewsScrollDiv"
        universal={true}
        autoHide
        autoHideTimeout={1000}
        autoHideDuration={200}
        renderThumbVertical={renderThumb}
      >
        <div className={styles["event-body"]}>{parentDiv}</div>
      </Scrollbars>
    );
    return parentDiv;
  }

  SetViewAllState() {
    this.setState({
      ViewAll: true,
    });
  }
  SetViewAllStateHome() {
    this.setState({
      ViewAll: false,
    });
  }
}
