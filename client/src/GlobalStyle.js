import { createGlobalStyle } from 'styled-components';

export const GlobalStyle = createGlobalStyle`
  * {
    margin: 0;
    padding: 0;
  }
  html, body {
    font-family: Arial, Helvetica, sans-serif;
    font-size: 12px;
    color: #c6d4df;
    /* Below items might need to be removed later, depending on proxy implementation */
    height: 100%;
    background: #1B2838;
  }
  body {
    min-width: 320px;
  }
  .emphasis-font {
    font-family: 'Roboto', sans-serif;
  }
  #app {
    width: 940px;
    margin: 0 auto;
  }
  img {
    user-drag: none;
    user-select: none;
    -moz-user-select: none;
    -webkit-user-drag: none;
    -webkit-user-select: none;
    -ms-user-select: none;
  }

  @media screen and (max-width: 910px) {
    #app {
      max-width: 940px;
      width: auto;
      margin: 0 2%;
    }
  }
`;