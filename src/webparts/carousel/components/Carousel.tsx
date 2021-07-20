import * as React from "react";
import styles from "./Carousel.module.scss";
import { ICarouselProps, IImageIcons } from "./ICarouselProps";
import { escape } from "@microsoft/sp-lodash-subset";
import Carousel from "react-bootstrap/Carousel";
import Row from "react-bootstrap/Row";
import Col from "react-bootstrap/Col";
import "bootstrap/dist/css/bootstrap.css";
import { sp, Web } from "sp-pnp-js";
import { FontIcon } from "office-ui-fabric-react";
import axios from "axios";
import { initializeIcons } from "@uifabric/icons";
// import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";//limit these

initializeIcons();
export interface ISliderCarouselDemoState {
  CarouselListName: string;
  CarouselListData: any;
  ImageIconsArray: IImageIcons;
  IconsData: any;
  selectedLng: string;
  role: string;
  calendarData: any;
}

export default class CarouselWebpart extends React.Component<
  ICarouselProps,
  ISliderCarouselDemoState
> {
  constructor(props) {
    super(props);
    this.state = {
      CarouselListName: "UAEU-Carousel",
      CarouselListData: [],
      ImageIconsArray: {
        blackboardIcon: "blackboard.png",
        calendarIcon: "calendar-alt.png",
        emailIcon: "email.png",
        headphoneIcon: "headphone.png",
        nextIcon: "arrow-circle-right.png",
      },
      IconsData: [],
      selectedLng: this.props.language.toUpperCase(),
      role: "student",
      calendarData: [],
    };
  }

  private getCarouselListContent = () => {
    
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
      .getByTitle(this.state.CarouselListName)
      .items.get()
      .then((item) => {
        web.lists
          .getByTitle("WelcomeAppLinks")
          .items.orderBy("ItemOrder")
          .get()
          .then((icons) => {
            this.setState({
              CarouselListData: item,
              IconsData: icons,
            });
          });
      });
  };

  componentDidMount = () => {
    this.GetThemeAndUserConfiguration();
    this.getCarouselListContent();
  };

  public render(): React.ReactElement<ICarouselProps> {
    let collection = this.state.CarouselListData;
    const imageIconURL =
      this.props.context.pageContext.site.absoluteUrl + "/SiteAssets/Images/";
    const columnNameExtension =
      this.state.selectedLng == "ENGLISH" ? "" : "Arabic";
    if (this.state.selectedLng == "ENGLISH") {
      if (document.getElementsByClassName("prevIcon").length > 0) {
        (
          document.getElementsByClassName("prevIcon")[0] as HTMLImageElement
        ).style.transform = "rotate(180deg)";
        (
          document.getElementsByClassName("nextIcon")[0] as HTMLImageElement
        ).style.transform = "";
      }
    } else {
      if (document.getElementsByClassName("prevIcon").length > 0) {
        (
          document.getElementsByClassName("nextIcon")[0] as HTMLImageElement
        ).style.transform = "rotate(180deg)";
        (
          document.getElementsByClassName("prevIcon")[0] as HTMLImageElement
        ).style.transform = "";
      }
    }
    const directionButtons = (direction) => {
      return (
        <span
          aria-hidden="true"
          className={direction === "Next" ? "button-next" : "button-prev"}
        >
          {direction}
        </span>
      );
    };
    //let paddingStyleElm = this.state.selectedLng == "ENGLISH" ? { paddingRight: '0px',textAlign:'start' } : { paddingLeft: '0px',textAlign:'start' };
    return (
      //<div style={{ padding: '20px' }}>
      <div style={{ textAlign: "start" }}>
        <style>
          {`
          .carousel {
             position: relative;
              height: 500px;
              background-image:url('${imageIconURL}home_banner2.jpg');
              background-repeat:no-repeat;
              background-size:cover;
             }
          .carousel-control-prev{
    top: auto;
    right: 65px;
    left: auto;
    bottom: 15px;
  }
  .carousel-control-next{
    bottom: 15px;
    top: auto;
    right:15px;
  }
  .arabic-content .carousel-control-prev{
    right: auto;
    left: 55px;
}
.arabic-content .carousel-control-next{
    left: 0px;
    right: auto;
}
  
  `}
        </style>
        <Carousel
          indicators={false}
          nextLabel={"Next"}
          prevLabel={"Previous"}
          nextIcon={directionButtons(
            <img
              className="nextIcon"
              src={imageIconURL + this.state.ImageIconsArray.nextIcon}
            ></img>
          )}
          prevIcon={directionButtons(
            <img
              className="prevIcon"
              src={imageIconURL + this.state.ImageIconsArray.nextIcon}
            ></img>
          )}
        >
          {collection.length > 0 &&
            collection.map((data) => {
              // let roleType =
              //   this.state.role.toLowerCase() == "student"
              //     ? "Student"
              //     : "Faculty";
              let roleType =
                this.state.role.toLowerCase() == "student"
                  ? "Student"
                  : this.state.role.toLowerCase() == "faculty"
                  ? "Faculty"
                  : "Employee";

              if (data["Role"] == null || data["Role"].includes(roleType)) {
                return (
                  <Carousel.Item>
                    <img
                      className="d-block w-100"
                      src={data["ImageURL"]}
                      alt="First slide"
                      height="500"
                    />
                    <Carousel.Caption bsPrefix={styles.carouselCaption}>
                      {/* <h3 className={styles.title}>
                        <b>{data["Title" + columnNameExtension]}</b>
                      </h3> */}
                      <p className={styles.subTitle}>
                        {data["Subtitle" + columnNameExtension]}
                      </p>
                      <p className={styles.titleDescription}>
                        {data["Description" + columnNameExtension]}
                      </p>
                      <div>
                        <a
                          className={styles.linkButton}
                          href={data.OnClickLink}
                          target="_blank"
                        >
                          <button
                            type="button"
                            // onClick={(e) => (window.location.href = "#")}
                            className={styles.ReadMore}
                          >
                            {this.state.selectedLng == "ENGLISH"
                              ? "READ   "
                              : "   اقرأ"}
                            <FontIcon iconName="Forward" />
                          </button>
                        </a>
                      </div>
                    </Carousel.Caption>
                  </Carousel.Item>
                );
              }
            })}
        </Carousel>
      </div>
    );
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
}
