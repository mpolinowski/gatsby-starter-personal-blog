import { createMuiTheme } from "material-ui/styles";
import Color from "color";

const colors = require("./colors");

const theme = createMuiTheme({
  base: {
    colors: {
      background: colors.bg,
      text: colors.superLightGray,
      link: colors.bright,
      linkHover: Color(colors.white)
        .lighten(0.1)
        .string(),
      accent: colors.accent,
      lines: colors.superLightGray
    },
    sizes: {
      linesMargin: "20px"
    },
    fonts: {
      unstyledFamily: `Roboto`,
      styledFamily: "Open Sans",
      styledFonts: "300,400,600"
    }
  },
  info: {
    colors: {
      text: colors.white,
      background: colors.dark,
      socialIcons: colors.superLightGray,
      socialIconsHover: colors.accent,
      menuLink: colors.superLightGray,
      menuLinkHover: colors.bright
    },
    sizes: {
      width: 320,
      headerHeight: 170
    },
    fonts: {
      boxTitleSize: 1.3,
      boxTitleSizeM: 1.5,
      boxTitleSizeL: 1.7
    }
  },
  navigator: {
    colors: {
      background: colors.darker,
      postsListItemLink: colors.superLightGray,
      postsListItemLinkHover: colors.bright,
      postsHeader: colors.white
    },
    sizes: {
      closedHeight: 80,
      postsListItemH1Font: 1.3,
      postsListItemH2Font: 1.1,
      fontIncraseForM: 1.15,
      fontIncraseForL: 1.3
    }
  },
  main: {
    colors: {
      background: colors.bg,
      title: colors.accent,
      subTitle: colors.lightGray,
      meta: colors.lightGray,
      content: colors.white,
      footer: colors.lightGray,
      contentHeading: colors.lightGray,
      blockquoteFrame: colors.superLightGray,
      link: colors.bright,
      linkHover: colors.white
    },
    sizes: {
      articleMaxWidth: "50em"
    },
    fonts: {
      title: {
        size: 1.8,
        sizeM: 2.2,
        sizeL: 2.5,
        weight: 600,
        lineHeight: 1.1
      },
      subTitle: {
        size: 1.4,
        sizeM: 1.6,
        sizeL: 1.8,
        weight: 300,
        lineHeight: 1.1
      },
      meta: {
        size: 0.9,
        weight: 600
      },
      content: {
        size: 1.2,
        sizeM: 1.15,
        sizeL: 1.1,
        lineHeight: 1.6
      },
      contentHeading: {
        h2Size: 1.5,
        h3Size: 1.3,
        weight: 600,
        lineHeight: 1.3
      },
      footer: {
        size: 1,
        lineHeight: 1.4
      }
    }
  },
  footer: {
    colors: {
      text: Color(colors.lightGray)
        .lighten(0.5)
        .string(),
      link: colors.bright,
      linkHover: Color(colors.white)
        .lighten(0.2)
        .string()
    },
    fonts: {
      footnote: {
        size: 0.8,
        lineHeight: 1.4
      }
    }
  },
  bars: {
    colors: {
      background: colors.dark
    },
    sizes: {
      actionsBar: 60,
      infoBar: 60
    }
  },
  mediaQueryTresholds: {
    M: 600,
    L: 1024
  },
  palette: {
    primary: {
      main: "#709425"
    }
  },
  typography: {
    fontFamily: `Arial, sans-serif`,
    fontSize: 16
  },
  pallete: {
    action: {
      hover: "rgba(0, 0, 0, 0.01)"
    }
  }
});

export default theme;
