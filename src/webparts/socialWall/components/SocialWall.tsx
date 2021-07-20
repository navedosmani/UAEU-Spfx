import * as React from "react";
import styles from "./SocialWall.module.scss";
import { ISocialWallProps } from "./ISocialWallProps";
import { escape } from "@microsoft/sp-lodash-subset";

export interface ComponentState {
  selectedLng: string;
}
export default class SocialWall extends React.Component<
  ISocialWallProps,
  ComponentState
> {
  constructor(props) {
    super(props);
    this.state = {
      selectedLng: this.props.language.toUpperCase(),
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

    var i,
      e,
      d = document,
      s = "script";
    i = d.createElement("script");
    i.async = 1;
    i.src =
      "https://cdn.curator.io/published/44cee6eb-ad23-47d2-b4b8-d40dd5a680c1.js";
    e = d.getElementsByTagName(s)[0];
    e.parentNode.insertBefore(i, e);
  }

  public render(): React.ReactElement<ISocialWallProps> {
    let combinedStyle = [styles.SocialWall, styles.socialWallBlue];

    return (
      <div className={styles.socialWallSection}>
        <p id="SocialWallTitle" className={combinedStyle.join(" ")}>
          {this.state.selectedLng == "ENGLISH"
            ? "SOCIAL WALL"
            : "الجدار الاجتماعي"}
        </p>
        <div id="curator-feed-default-feed-layout">
          {/* <a href="https://curator.io" target="_blank" className="crt-logo crt-tag">Powered by Curator.io</a> */}
        </div>
      </div>
    );
  }
}
