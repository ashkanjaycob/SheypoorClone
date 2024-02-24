/* eslint-disable no-unused-vars */
const setCookie = (tokens) => {
  document.cookie = `accessToken=${tokens.accessToken}; max-age=${
    1 * 24 * 60 * 60
  }`;
  //   24 hours age for Access Token
  document.cookie = `refreshToken=${tokens.refreshToken}; max-age=${
    30 * 24 * 60 * 60
  }`;
//   30 days max age for Refresh token 
};

export default setCookie ; 
