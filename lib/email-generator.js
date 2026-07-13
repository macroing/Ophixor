// Copyright (C) 2026 Jörgen Lundgren <joergen.lundgren@macroing.org>
// SPDX-License-Identifier: AGPL-3.0-only

export default class EmailGenerator {
  constructor(title = "") {
    this.elements = [];
    this.title = title;
  }

  addA(href, text, isGradient = false, marginTop = "0px") {
    this.elements.push({ element: "a", href, isGradient, marginTop, text });

    return this;
  }

  addH1(text, isGradient = false) {
    this.elements.push({ element: "h1", isGradient, text });

    return this;
  }

  addH2(text, isGradient = false) {
    this.elements.push({ element: "h2", isGradient, text });

    return this;
  }

  addH3(text, isGradient = false) {
    this.elements.push({ element: "h3", isGradient, text });

    return this;
  }

  addH4(text, isGradient = false) {
    this.elements.push({ element: "h4", isGradient, text });

    return this;
  }

  addH5(text, isGradient = false) {
    this.elements.push({ element: "h5", isGradient, text });

    return this;
  }

  addH6(text, isGradient = false) {
    this.elements.push({ element: "h6", isGradient, text });

    return this;
  }

  addImg(src, alt = "", width = "100%", height = "auto") {
    this.elements.push({ alt, element: "img", height, src, width });

    return this;
  }

  addP(text, fontSize = "16px", fontWeight = "normal") {
    this.elements.push({ element: "p", fontSize, fontWeight, text });

    return this;
  }

  addRow(elements, hasBorderTop = false, hasBorderBottom = false, marginTop = "0px", marginBottom = "10px", paddingTop = "0px", paddingBottom = "0px") {
    this.elements.push({ element: "row", elements, hasBorderBottom, hasBorderTop, marginBottom, marginTop, paddingBottom, paddingTop });

    return this;
  }

  toHTML() {
    let html = "<!doctype html>";

    html += "<html>";
    html += "<head>";
    html += '<meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no"/>';
    html += `<title>${this.title}</title>`;
    html += "<style>";
    html += "body {background-color: #fcfcfc;border: 1px solid #dddddd;box-sizing: border-box;height: 100%;margin: 0;padding: 0;width: 100%;}";
    html += "body > .container {background-color: #f6f6f6;border: 1px solid #dddddd;border-radius: 5px;box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.12);box-sizing: border-box;margin: 20px auto 20px auto;max-width: 600px;padding: 20px;width: 100%;}";
    html += "body > .container .a {color: #333333;box-sizing: border-box;font-family: Verdana, Geneva, Tahoma, sans-serif;text-decoration: none;}";
    html += "body > .container .a:hover {color: #1877f2;text-decoration: underline;}";
    html += "body > .container .a-gradient > a {background: linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 50%, rgba(255, 255, 255, 0.1) 100%);background-color: #eeeeee;border: 1px solid #dddddd;border-radius: 5px;box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.12);box-sizing: border-box;color: #333333;display: inline-block;font-family: Verdana, Geneva, Tahoma, sans-serif;margin: 0px auto 0px auto;padding: 10px;text-align: center;text-decoration: none;}";
    html += "body > .container .a-gradient > a:hover {background-color: #ffffff;border-color: #dddddd;color: #1877f2;}";
    html += "body > .container .h1 {box-sizing: border-box;color: #333333;font-family: Verdana, Geneva, Tahoma, sans-serif;margin: 0px 0px 20px 0px;padding: 0px;text-align: center;width: 100%;}";
    html += "body > .container .h2 {box-sizing: border-box;color: #333333;font-family: Verdana, Geneva, Tahoma, sans-serif;margin: 0px 0px 20px 0px;padding: 0px;text-align: center;width: 100%;}";
    html += "body > .container .h3 {box-sizing: border-box;color: #333333;font-family: Verdana, Geneva, Tahoma, sans-serif;margin: 0px 0px 20px 0px;padding: 0px;text-align: center;width: 100%;}";
    html += "body > .container .h4 {box-sizing: border-box;color: #333333;font-family: Verdana, Geneva, Tahoma, sans-serif;margin: 0px 0px 20px 0px;padding: 0px;text-align: center;width: 100%;}";
    html += "body > .container .h5 {box-sizing: border-box;color: #333333;font-family: Verdana, Geneva, Tahoma, sans-serif;margin: 0px 0px 20px 0px;padding: 0px;text-align: center;width: 100%;}";
    html += "body > .container .h6 {box-sizing: border-box;color: #333333;font-family: Verdana, Geneva, Tahoma, sans-serif;margin: 0px 0px 20px 0px;padding: 0px;text-align: center;width: 100%;}";
    html += "body > .container .h1-gradient {background: linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 50%, rgba(255, 255, 255, 0.1) 100%);background-color: #1877f2;border: 1px solid #1877f2;border-radius: 5px;box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.12);box-sizing: border-box;color: #ffffff;font-family: Verdana, Geneva, Tahoma, sans-serif;margin: 0px 0px 20px 0px;padding: 10px;text-align: center;width: 100%;}";
    html += "body > .container .h2-gradient {background: linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 50%, rgba(255, 255, 255, 0.1) 100%);background-color: #1877f2;border: 1px solid #1877f2;border-radius: 5px;box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.12);box-sizing: border-box;color: #ffffff;font-family: Verdana, Geneva, Tahoma, sans-serif;margin: 0px 0px 20px 0px;padding: 10px;text-align: center;width: 100%;}";
    html += "body > .container .h3-gradient {background: linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 50%, rgba(255, 255, 255, 0.1) 100%);background-color: #1877f2;border: 1px solid #1877f2;border-radius: 5px;box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.12);box-sizing: border-box;color: #ffffff;font-family: Verdana, Geneva, Tahoma, sans-serif;margin: 0px 0px 20px 0px;padding: 10px;text-align: center;width: 100%;}";
    html += "body > .container .h4-gradient {background: linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 50%, rgba(255, 255, 255, 0.1) 100%);background-color: #1877f2;border: 1px solid #1877f2;border-radius: 5px;box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.12);box-sizing: border-box;color: #ffffff;font-family: Verdana, Geneva, Tahoma, sans-serif;margin: 0px 0px 20px 0px;padding: 10px;text-align: center;width: 100%;}";
    html += "body > .container .h5-gradient {background: linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 50%, rgba(255, 255, 255, 0.1) 100%);background-color: #1877f2;border: 1px solid #1877f2;border-radius: 5px;box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.12);box-sizing: border-box;color: #ffffff;font-family: Verdana, Geneva, Tahoma, sans-serif;margin: 0px 0px 20px 0px;padding: 10px;text-align: center;width: 100%;}";
    html += "body > .container .h6-gradient {background: linear-gradient(rgba(255, 255, 255, 0.2) 0%, rgba(255, 255, 255, 0.1) 50%, transparent 50%, rgba(255, 255, 255, 0.1) 100%);background-color: #1877f2;border: 1px solid #1877f2;border-radius: 5px;box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.12);box-sizing: border-box;color: #ffffff;font-family: Verdana, Geneva, Tahoma, sans-serif;margin: 0px 0px 20px 0px;padding: 10px;text-align: center;width: 100%;}";
    html += "body > .container .img {border: 5px solid #ffffff;border-radius: 5px;box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.12);box-sizing: border-box;height: auto;margin: 0px 0px 20px 0px;object-fit: cover;width: 100%;}";
    html += "body > .container .p {box-sizing: border-box;color: #333333;font-family: Verdana, Geneva, Tahoma, sans-serif;margin: 20px 0px 0px 0px;padding: 0px;text-align: center;width: 100%;}";
    html += "body > .container .p > img {border: 1px solid #ffffff;border-radius: 50%;box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.12);box-sizing: border-box;height: 32px;margin: 0px 0px 0px 0px;object-fit: cover;vertical-align: middle;width: 32px;}";
    html += "</style>";
    html += "</head>";
    html += "<body>";
    html += '<div class="container">';

    for (const element of this.elements) {
      switch (element.element) {
        case "a":
          html += element.isGradient ? `<div${element.isGradient ? ' class="a-gradient"' : ""} style="box-sizing: border-box;text-align: center;width: 100%;">` : "";
          html += `<a${element.isGradient ? "" : ' class="a"'} href="${element.href}" style="margin: ${element.marginTop} auto 0px auto;">${element.text}</a>`;
          html += element.isGradient ? "</div>" : "";

          break;
        case "h1":
          html += `<h1 class="h1${element.isGradient ? "-gradient" : ""}">${element.text}</h1>`;

          break;
        case "h2":
          html += `<h2 class="h2${element.isGradient ? "-gradient" : ""}">${element.text}</h2>`;

          break;
        case "h3":
          html += `<h3 class="h3${element.isGradient ? "-gradient" : ""}">${element.text}</h3>`;

          break;
        case "h4":
          html += `<h4 class="h4${element.isGradient ? "-gradient" : ""}">${element.text}</h4>`;

          break;
        case "h5":
          html += `<h5 class="h5${element.isGradient ? "-gradient" : ""}">${element.text}</h5>`;

          break;
        case "h6":
          html += `<h6 class="h6${element.isGradient ? "-gradient" : ""}">${element.text}</h6>`;

          break;
        case "img":
          html += `<img alt="${element.alt}" class="img" src="${element.src}" style="height: ${element.height}; width: ${element.width};" />`;

          break;
        case "p":
          html += `<p class="p" style="font-size: ${element.fontSize};font-weight: ${element.fontWeight};">${element.text}</p>`;

          break;
        case "row":
          html += `<div style="background-color: #f6f6f6;${element.hasBorderBottom ? "border-bottom: 1px solid #dddddd;" : ""}${element.hasBorderTop ? "border-top: 1px solid #dddddd;" : ""}box-sizing: border-box;margin: ${element.marginTop} 0px ${element.marginBottom} 0px;padding: ${element.paddingTop} 0px ${element.paddingBottom} 0px;width: 100%;">`;

          for (const childElement of element.elements) {
            switch (childElement.element) {
              case "img":
                html += `<div style="box-sizing: border-box;display: inline-block;text-align: left;width: ${childElement.widthPercent}%;">`;
                html += `<div style="border: 1px solid #ffffff;border-radius: 5px;box-shadow: 0 5px 8px 0 rgba(0, 0, 0, 0.12);box-sizing: border-box;display: inline-block;height: ${childElement.heightPixels}px;vertical-align: middle;width: ${childElement.widthPixels}px;">`;
                html += `<img alt="${childElement.alt}" src="${childElement.src}" style="background-color: #ffffff;box-sizing: border-box;height: ${childElement.heightPixels - 2}px;object-fit: contain;width: ${childElement.widthPixels - 2}px;" />`;
                html += "</div>";
                html += "</div>";

                break;
              default:
                html += `<div style="box-sizing: border-box;color: ${childElement.color || "#333333"};display: inline-block;font-family: Verdana, Geneva, Tahoma, sans-serif;font-size: ${childElement.fontSize || "12px"};font-weight: ${childElement.fontWeight || "normal"};text-align: ${childElement.textAlign || "center"};vertical-align: middle;width: ${childElement.widthPercent}%;">`;
                html += childElement.text;
                html += "</div>";

                break;
            }
          }

          html += "</div>";

          break;
        default:
          break;
      }
    }

    html += "</div>";
    html += "</body>";
    html += "</html>";

    return html;
  }
}
