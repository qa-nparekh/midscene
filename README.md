<p align="center">
  <img alt="SQAI"  width="260" src="https://github.com/user-attachments/assets/f60de3c1-dd6f-4213-97a1-85bf7c6e79e4">
</p>

<h1 align="center">SQAI</h1>
<div align="center">

English | [简体中文](./README.zh.md)

<a href="https://trendshift.io/repositories/12524" target="_blank"><img src="https://trendshift.io/api/badge/repositories/12524" alt="web-infra-dev%2FSQAI | Trendshift" style="width: 250px; height: 55px;" width="250" height="55"/></a>

</div>

<p align="center">
  Visual-driven AI Operator for Web, Android, iOS, Automation & Testing. Open-source and MIT licensed.
</p>

<p align="center">
  <a href="https://www.npmjs.com/package/@sqai/web"><img src="https://img.shields.io/npm/v/@sqai/web?style=flat-square&color=00a8f0" alt="npm version" /></a>
  <a href="https://huggingface.co/ByteDance-Seed/UI-TARS-1.5-7B"><img src="https://img.shields.io/badge/%F0%9F%A4%97-UI%20TARS%20Models-yellow" alt="hugging face model" /></a>
  <a href="https://npm-compare.com/@sqai/web/#timeRange=THREE_YEARS"><img src="https://img.shields.io/npm/dm/@sqai/web.svg?style=flat-square&color=00a8f0" alt="downloads" /></a>
  <a href="https://github.com/qa-nparekh/SQAI/blob/main/LICENSE"><img src="https://img.shields.io/badge/License-MIT-blue.svg?style=flat-square&color=00a8f0" alt="License" />
  <a href="https://discord.gg/2JyBHxszE4"><img src="https://img.shields.io/discord/1328277792730779648?style=flat-square&color=7289DA&label=Discord&logo=discord&logoColor=white" alt="discord" /></a>
  <a href="https://x.com/sqai_tech"><img src="https://img.shields.io/twitter/follow/sqai_tech?style=flat-square" alt="twitter" /></a>
  <a href="https://deepwiki.com/qa-nparekh/SQAI">
    <img alt="Ask DeepWiki.com" src="https://devin.ai/assets/deepwiki-badge.png" style="height: 18px; vertical-align: middle;" />
  </a>
</p>

## Showcases

| Instruction  | Video |
| :---:  | :---: |
| Use JS code to drive task orchestration, collect information about Jay Chou's concert, and write it into Google Docs (By UI-TARS model)   | <video src="https://github.com/user-attachments/assets/75474138-f51f-4c54-b3cf-46d61d059999" height="300" />        |
| Control Maps App on Android (By Qwen-2.5-VL model)   | <video src="https://github.com/user-attachments/assets/1f5bab0e-4c28-44e1-b378-a38809b05a00" height="300" />        |
| Using SQAI mcp to browse the page (https://www.saucedemo.com/), perform login, add products, place orders, and finally generate test cases based on mcp execution steps and playwright example | <video src="https://github.com/user-attachments/assets/a95ca353-e50c-4091-85ba-e542f576b6be" height="300" />   |

## 💡 Features

### Write Automation with Natural Language
- Describe your goals and steps, and SQAI will plan and operate the user interface for you.
- Use Javascript SDK or YAML to write your automation script.

### Web & Mobile App & Any Interface
- **Web Automation 🖥️**: Either integrate with [Puppeteer](https://sqai.tech/integrate-with-puppeteer.html), [Playwright](https://sqai.tech/integrate-with-playwright.html) or use [Bridge Mode](https://sqai.tech/bridge-mode-by-chrome-extension.html) to control your desktop browser.
- **Android Automation 📱**: Use [Javascript SDK](https://sqai.tech/integrate-with-android.html) with adb to control your local Android device.
- **iOS Automation 🍎**: Use [Javascript SDK](https://sqai.tech/integrate-with-ios.html) with iOS Simulator to control your local iOS devices and simulators.
- **Any Interface Automation 🌐**: Use [Javascript SDK](https://sqai.tech/integrate-with-any-interface.html) to control your own interface.

### Tools
- **Visual Reports for Debugging 🎞️**: Through our test reports and Playground, you can easily understand, replay and debug the entire process.
- [**Caching for Efficiency 🔄**](https://sqai.tech/caching.html): Replay your script with cache and get the result faster.
- **MCP**: Allows other MCP Clients to directly use SQAI's capabilities. [**Web MCP**](https://sqai.tech/web-mcp.html) [**Android MCP**](https://sqai.tech/mcp-android.html)

### Three kinds of APIs
- [Interaction API 🔗](https://sqai.tech/api.html#interaction-methods): interact with the user interface.
- [Data Extraction API 🔗](https://sqai.tech/api.html#data-extraction): extract data from the user interface and dom.
- [Utility API 🔗](https://sqai.tech/api.html#more-apis): utility functions like `aiAssert()`, `aiLocate()`, `aiWaitFor()`.

## 👉 Zero-code Quick Experience

- **[Chrome Extension](https://sqai.tech/quick-experience.html)**: Start in-browser experience immediately through [the Chrome Extension](https://sqai.tech/quick-experience.html), without writing any code.
- **[Android Playground](https://sqai.tech/quick-experience-with-android.html)**: There is also a built-in Android playground to control your local Android device.
- **[iOS Playground](https://sqai.tech/quick-experience-with-ios.html)**: There is also a built-in iOS playground to control your local iOS device.

## ✨ Driven by Visual Language Model

SQAI supports visual-language models like `Qwen3-VL`, `Doubao-1.6-vision`, `gemini-2.5-pro` and `UI-TARS`. 

* Capable of finding and understanding the target element on the page by just providing the screenshot.
* No dom or semantic markups are required.
* Less tokens and money cost compared to generalLLM models.
* Support open-source models.

Read more about [Choose a model](https://sqai.tech/choose-a-model)

## 💡 Two Styles of Automation

### Auto Planning

SQAI will automatically plan the steps and execute them. It may be slower and heavily rely on the quality of the AI model.

```javascript
await aiAction('click all the records one by one. If one record contains the text "completed", skip it');
```

### Workflow Style

Split complex logic into multiple steps to improve the stability of the automation code.

```javascript
const recordList = await agent.aiQuery('string[], the record list')
for (const record of recordList) {
  const hasCompleted = await agent.aiBoolean(`check if the record ${record}" contains the text "completed"`)
  if (!hasCompleted) {
    await agent.aiTap(record)
  }
}
```

> For more details about the workflow style, please refer to [Blog - Use JavaScript to Optimize the AI Automation Code](https://sqai.tech/blog-programming-practice-using-structured-api.html)

## 👀 Comparing to other projects

There are so many UI automation tools out there, and each one seems to be all-powerful. What's special about SQAI?

* **Visual-driven brings reliability and efficiency**: By using visual-language models, SQAI is suitable for both web and mobile app automation, no matter the technology stack the interface is built with.

* **Debugging Experience**: You will soon realize that debugging and maintaining automation scripts is the real challenge. SQAI offers a visualized report file, a built-in playground, and a Chrome Extension to simplify the debugging process. These are the tools most developers truly need.

* **Open Source, Free, Deploy as you want**: SQAI is an open-source project, and it supports self-hosted models.

* **Integrate with Javascript**: You can always bet on Javascript 😎

## 📄 Resources 

* Home Page and Documentation: [https://sqai.tech](https://sqai.tech/)
* Sample Projects: [https://github.com/qa-nparekh/sqai-examples](https://github.com/qa-nparekh/sqai-examples)
* API Reference: [https://sqai.tech/api.html](https://sqai.tech/api.html)
* GitHub: [https://github.com/qa-nparekh/SQAI](https://github.com/qa-nparekh/SQAI)

## 🤝 Community

* [Discord](https://discord.gg/2JyBHxszE4)
* [Follow us on X](https://x.com/SQAI_ai)
* [Lark Group(飞书交流群)](https://applink.larkoffice.com/client/chat/chatter/add_by_link?link_token=291q2b25-e913-411a-8c51-191e59aab14d)

## 🌟 Awesome SQAI

Community projects that extend SQAI capabilities:

* [SQAI-ios](https://github.com/lhuanyu/SQAI-ios) - iOS automation support for SQAI
* [SQAI-pc](https://github.com/Mofangbao/SQAI-pc) - PC operation device for Windows, macOS, and Linux
* [SQAI-pc-docker](https://github.com/Mofangbao/SQAI-pc-docker) - Docker container image with SQAI-PC server pre-installed
* [SQAI-Python](https://github.com/Python51888/SQAI-Python) - Python SDK for SQAI automation
* [SQAI-java](https://github.com/Master-Frank/SQAI-java) - Java SDK that brings SQAI automation features to JVM projects


## 📝 Credits

We would like to thank the following projects:

- [Rsbuild](https://github.com/web-infra-dev/rsbuild) and [Rslib](https://github.com/web-infra-dev/rslib) for the build tool.
- [UI-TARS](https://github.com/bytedance/ui-tars) for the open-source agent model UI-TARS.
- [Qwen-VL](https://github.com/QwenLM/Qwen-VL) for the open-source VL model Qwen-VL.
- [scrcpy](https://github.com/Genymobile/scrcpy) and [yume-chan](https://github.com/yume-chan) allow us to control Android devices with browser.
- [appium-adb](https://github.com/appium/appium-adb) for the javascript bridge of adb.
- [appium-webdriveragent](https://github.com/appium/WebDriverAgent) for the javascript operate XCTest。
- [YADB](https://github.com/ysbing/YADB) for the yadb tool which improves the performance of text input.
- [Puppeteer](https://github.com/puppeteer/puppeteer) for browser automation and control.
- [Playwright](https://github.com/microsoft/playwright) for browser automation and control and testing.

## 📖 Citation

If you use SQAI in your research or project, please cite:

```bibtex
@software{SQAI,
  author = {Xiao Zhou, Tao Yu, YiBing Lin},
  title = {SQAI: Your AI Operator for Web, Android, iOS, Automation & Testing.},
  year = {2025},
  publisher = {GitHub},
  url = {https://github.com/qa-nparekh/SQAI}
}
```

## ⭐️ Star History

[![Star History Chart](https://api.star-history.com/svg?repos=qa-nparekh/SQAI&type=Date)](https://www.star-history.com/#qa-nparekh/SQAI&Date)


## 📜 License

SQAI is [MIT licensed](https://github.com/qa-nparekh/SQAI/blob/main/LICENSE).

---

<div align="center">
  If this project helps you or inspires you, please give us a ⭐️
</div>
