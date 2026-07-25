const worker = {
  async fetch(request, env) {
    const response = await env.ASSETS.fetch(request);

    if (response.status !== 404) {
      return response;
    }

    const url = new URL(request.url);
    const finalSegment = url.pathname.split("/").filter(Boolean).at(-1) ?? "";

    if (finalSegment.includes(".")) {
      return response;
    }

    url.pathname = `${url.pathname.replace(/\/$/, "")}/`;
    return env.ASSETS.fetch(new Request(url, request));
  },
};

export default worker;
