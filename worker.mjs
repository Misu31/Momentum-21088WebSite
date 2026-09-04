export default {
  async fetch(request, env) {
    const url = new URL(request.url);

    if (url.pathname === "/news" || url.pathname === "/news/") {
      url.pathname = "/news.html";
      return env.ASSETS.fetch(new Request(url, request));
    }

    return env.ASSETS.fetch(request);
  }
};
